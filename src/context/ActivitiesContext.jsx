import { useState, useCallback, useEffect, useRef } from 'react';
import sampleActivities from '../data/sampleData';
import { ActivitiesContext } from './activities-context';

const STORAGE_KEY = 'portfolio_activities';
const GALLERY_KEY = 'portfolio_gallery';
const CERTS_KEY = 'portfolio_certificates';
const DRAFT_KEY = 'portfolio_draft';
const RECENT_KEY = 'portfolio_recent_uploads';
const DATA_VERSION_KEY = 'portfolio_data_version';
const DATA_VERSION = '2026-06-26-pdf-merge';

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

function loadActivities() {
  try {
    const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
    if (storedVersion === DATA_VERSION) {
      return loadFromStorage(STORAGE_KEY, sampleActivities);
    }

    localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
    saveToStorage(STORAGE_KEY, sampleActivities);
    return sampleActivities;
  } catch {
    return sampleActivities;
  }
}

export function ActivitiesProvider({ children }) {
  const [activities, setActivities] = useState(() =>
    loadActivities()
  );
  const [gallery, setGallery] = useState(() =>
    loadFromStorage(GALLERY_KEY, [])
  );
  const [certificates, setCertificates] = useState(() =>
    loadFromStorage(CERTS_KEY, [])
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [recentUploads, setRecentUploads] = useState(() =>
    loadFromStorage(RECENT_KEY, [])
  );
  const [formDraft, setFormDraft] = useState(() =>
    loadFromStorage(DRAFT_KEY, null)
  );
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Persist to localStorage
  useEffect(() => { saveToStorage(STORAGE_KEY, activities); }, [activities]);
  useEffect(() => { saveToStorage(GALLERY_KEY, gallery); }, [gallery]);
  useEffect(() => { saveToStorage(CERTS_KEY, certificates); }, [certificates]);
  useEffect(() => { saveToStorage(RECENT_KEY, recentUploads); }, [recentUploads]);
  useEffect(() => { saveToStorage(DRAFT_KEY, formDraft); }, [formDraft]);

  // Toast notification
  const showToast = useCallback((message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // Add to recent uploads tracker
  const trackRecentUpload = useCallback((item) => {
    setRecentUploads(prev => {
      const updated = [
        { ...item, uploadedAt: new Date().toISOString() },
        ...prev,
      ].slice(0, 20);
      return updated;
    });
  }, []);

  // Auto-save form draft
  const saveDraft = useCallback((draftData) => {
    setFormDraft(draftData);
  }, []);

  const clearDraft = useCallback(() => {
    setFormDraft(null);
    localStorage.removeItem(DRAFT_KEY);
  }, []);

  // ===== Activity CRUD =====
  const addActivity = useCallback((category, activity) => {
    const newId = `${category}-${Date.now()}`;
    const newActivity = { ...activity, id: newId, createdAt: new Date().toISOString() };
    setActivities(prev => ({
      ...prev,
      [category]: [newActivity, ...(prev[category] || [])],
    }));
    trackRecentUpload({ type: 'activity', category, id: newId, title: activity.eventName || activity.topic });
    showToast('Activity added successfully!');
  }, [trackRecentUpload, showToast]);

  const updateActivity = useCallback((category, id, updated) => {
    setActivities(prev => ({
      ...prev,
      [category]: (prev[category] || []).map(item =>
        item.id === id ? { ...item, ...updated, updatedAt: new Date().toISOString() } : item
      ),
    }));
    showToast('Activity updated successfully!');
  }, [showToast]);

  const deleteActivity = useCallback((category, id) => {
    setActivities(prev => ({
      ...prev,
      [category]: (prev[category] || []).filter(item => item.id !== id),
    }));
    showToast('Activity deleted', 'info');
  }, [showToast]);

  const uploadCertificateToActivity = useCallback((category, id, certs) => {
    setActivities(prev => ({
      ...prev,
      [category]: (prev[category] || []).map(item =>
        item.id === id ? { ...item, certificateFiles: [...(item.certificateFiles || []), ...certs] } : item
      ),
    }));
    showToast('Certificates uploaded!');
  }, [showToast]);



  // ===== Gallery CRUD =====
  const addGalleryImage = useCallback((imageData) => {
    const newId = `gal-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setGallery(prev => [
      { id: newId, ...imageData, addedAt: new Date().toISOString() },
      ...prev,
    ]);
    trackRecentUpload({ type: 'gallery', id: newId, title: imageData.title || 'Photo' });
    showToast('Photo added to gallery!');
  }, [trackRecentUpload, showToast]);

  const updateGalleryImage = useCallback((id, updated) => {
    setGallery(prev => prev.map(img =>
      img.id === id ? { ...img, ...updated } : img
    ));
    showToast('Photo details updated!');
  }, [showToast]);

  const deleteGalleryImage = useCallback((id) => {
    setGallery(prev => prev.filter(img => img.id !== id));
    showToast('Photo deleted from gallery', 'info');
  }, [showToast]);

  const uploadImagesToActivity = useCallback((category, id, images) => {
    setActivities(prev => {
      const catArray = prev[category] || [];
      const updatedArray = catArray.map(item =>
        item.id === id ? { ...item, galleryImages: [...(item.galleryImages || []), ...images] } : item
      );
      
      // Auto-generate gallery entries
      const activity = updatedArray.find(item => item.id === id);
      if (activity) {
        images.forEach(img => {
          addGalleryImage({
            src: img.data,
            title: activity.eventTitle || activity.eventName || activity.topic,
            description: activity.description,
            location: activity.location,
            date: activity.date || activity.year,
          });
        });
      }

      return { ...prev, [category]: updatedArray };
    });
    showToast('Event images uploaded!');
  }, [showToast, addGalleryImage]);

  const uploadDocumentsToActivity = useCallback((category, id, docs) => {
    setActivities(prev => ({
      ...prev,
      [category]: (prev[category] || []).map(item =>
        item.id === id ? { ...item, eventDocuments: [...(item.eventDocuments || []), ...docs] } : item
      ),
    }));
    showToast('Documents uploaded!');
  }, [showToast]);

  // ===== Certificate/Document CRUD =====
  const addCertificate = useCallback((certData) => {
    const newId = `cert-${Date.now()}`;
    setCertificates(prev => [
      { id: newId, ...certData, addedAt: new Date().toISOString() },
      ...prev,
    ]);
    trackRecentUpload({ type: 'certificate', id: newId, title: certData.name || 'Certificate' });
    showToast('Certificate uploaded!');
  }, [trackRecentUpload, showToast]);

  const updateCertificate = useCallback((id, updated) => {
    setCertificates(prev => prev.map(cert =>
      cert.id === id ? { ...cert, ...updated } : cert
    ));
    showToast('Certificate updated!');
  }, [showToast]);

  const deleteCertificate = useCallback((id) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
    showToast('Certificate deleted', 'info');
  }, [showToast]);

  // Admin toggle
  const toggleAdmin = useCallback(() => {
    setIsAdmin(prev => !prev);
  }, []);

  const resetToSample = useCallback(() => {
    setActivities(sampleActivities);
    setGallery([]);
    setCertificates([]);
    setRecentUploads([]);
    setFormDraft(null);
    saveToStorage(STORAGE_KEY, sampleActivities);
    saveToStorage(GALLERY_KEY, []);
    saveToStorage(CERTS_KEY, []);
    saveToStorage(RECENT_KEY, []);
    localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
    localStorage.removeItem(DRAFT_KEY);
    showToast('All data reset to defaults', 'info');
  }, [showToast]);

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        gallery,
        certificates,
        isAdmin,
        recentUploads,
        formDraft,
        toast,
        addActivity,
        updateActivity,
        deleteActivity,
        uploadCertificateToActivity,
        uploadImagesToActivity,
        uploadDocumentsToActivity,
        addGalleryImage,
        updateGalleryImage,
        deleteGalleryImage,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        toggleAdmin,
        resetToSample,
        saveDraft,
        clearDraft,
        showToast,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
}

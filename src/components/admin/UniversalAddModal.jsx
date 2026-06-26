import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivities } from '../../context/useActivities';
import { ACTIVITY_CATEGORIES } from '../../data/sampleData';
import './UniversalAddModal.css';

const CONTENT_TYPES = [
  { key: 'activity', label: 'Activity / Event', icon: '📋' },
  { key: 'gallery', label: 'Gallery Photo', icon: '🖼️' },
  { key: 'certificate', label: 'Certificate / Document', icon: '📜' },
];

const EVENT_TYPES = [
  'Expert Lecture', 'Workshop', 'FDP', 'Seminar', 'Conference',
  'Webinar', 'Hackathon', 'Panel Discussion', 'Keynote', 'Training',
  'Award Ceremony', 'Inauguration', 'Guest Lecture', 'Other',
];

const emptyActivityForm = {
  organizationName: '',
  eventTitle: '',
  eventType: '',
  topic: '',
  date: '',
  year: '',
  role: '',
  description: '',
  location: '',
  externalLink: '',
  tags: '',
};

export default function UniversalAddButton() {
  const { isAdmin, formDraft, saveDraft, clearDraft, addActivity, addGalleryImage, addCertificate } = useActivities();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      {/* Floating circular + button — bottom right with glassmorphism */}
      <motion.button
        className="universal-add-fab"
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        aria-label="Add New Content"
        title="Add New Content"
      >
        <span className="fab-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
        <span className="fab-label">Add New</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <UniversalAddModal
            onClose={() => setIsOpen(false)}
            draft={formDraft}
            onSaveDraft={saveDraft}
            onClearDraft={clearDraft}
            addActivity={addActivity}
            addGalleryImage={addGalleryImage}
            addCertificate={addCertificate}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function UniversalAddModal({ onClose, draft, onSaveDraft, onClearDraft, addActivity, addGalleryImage, addCertificate }) {
  const [contentType, setContentType] = useState(draft?.contentType || 'activity');
  const [category, setCategory] = useState(draft?.category || ACTIVITY_CATEGORIES[0].key);
  const [form, setForm] = useState(draft?.form || { ...emptyActivityForm });
  const [certPhoto, setCertPhoto] = useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [galleryData, setGalleryData] = useState({ title: '', description: '', location: '', date: '', src: null });
  const [certData, setCertData] = useState({ name: '', description: '', data: null, type: '', size: '' });
  const [isDragging, setIsDragging] = useState(false);
  const certPhotoRef = useRef(null);
  const eventImgRef = useRef(null);
  const docRef = useRef(null);
  const galleryRef = useRef(null);
  const certRef = useRef(null);
  const autoSaveRef = useRef(null);

  // Auto-save draft every 3 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (contentType === 'activity' && (form.eventTitle || form.organizationName)) {
        onSaveDraft({ contentType, category, form });
      }
    }, 3000);
    return () => clearInterval(autoSaveRef.current);
  }, [contentType, category, form, onSaveDraft]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCertPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCertPhoto({ name: file.name, data: reader.result, type: file.type });
    reader.readAsDataURL(file);
  };

  const handleEventImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setEventImages(prev => [...prev, { name: file.name, data: reader.result, type: file.type }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setDocuments(prev => [...prev, { name: file.name, data: reader.result, type: file.type, size: (file.size / 1024).toFixed(1) + ' KB' }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleGalleryImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setGalleryData(prev => ({ ...prev, src: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleCertFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCertData(prev => ({
      ...prev,
      name: prev.name || file.name,
      data: reader.result,
      type: file.type,
      size: (file.size / 1024).toFixed(1) + ' KB',
    }));
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (contentType === 'gallery' && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setGalleryData(prev => ({ ...prev, src: reader.result }));
        reader.readAsDataURL(file);
      }
    } else if (contentType === 'certificate' && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => setCertData(prev => ({
        ...prev,
        name: prev.name || file.name,
        data: reader.result,
        type: file.type,
        size: (file.size / 1024).toFixed(1) + ' KB',
      }));
      reader.readAsDataURL(file);
    } else if (contentType === 'activity') {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          if (file.type.startsWith('image/')) {
            setEventImages(prev => [...prev, { name: file.name, data: reader.result, type: file.type }]);
          } else {
            setDocuments(prev => [...prev, { name: file.name, data: reader.result, type: file.type, size: (file.size / 1024).toFixed(1) + ' KB' }]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, [contentType]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (contentType === 'activity') {
      const tagsArray = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      let year = form.year;
      if (!year && form.date) {
        const yearMatch = form.date.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) year = yearMatch[0];
      }
      addActivity(category, {
        ...form,
        year,
        tags: tagsArray,
        certificateFiles: certPhoto ? [certPhoto] : [],
        galleryImages: eventImages,
        eventDocuments: documents,
      });
    } else if (contentType === 'gallery') {
      if (!galleryData.src) return;
      addGalleryImage(galleryData);
    } else if (contentType === 'certificate') {
      if (!certData.data) return;
      addCertificate(certData);
    }

    onClearDraft();
    onClose();
  };

  const removeEventImage = (idx) => {
    setEventImages(prev => prev.filter((_, i) => i !== idx));
  };

  const removeDocument = (idx) => {
    setDocuments(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <motion.div
      className="uam-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="uam-panel"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 250 }}
        onClick={e => e.stopPropagation()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div className="uam-drag-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="uam-drag-overlay__content">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p>Drop files here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="uam-header">
          <div className="uam-header__left">
            <h2 className="uam-header__title">Add New Content</h2>
            {draft && contentType === 'activity' && (
              <span className="uam-header__draft-badge">Draft restored</span>
            )}
          </div>
          <button className="uam-header__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content type selector */}
        <div className="uam-type-selector">
          {CONTENT_TYPES.map(ct => (
            <button
              key={ct.key}
              className={`uam-type-btn ${contentType === ct.key ? 'active' : ''}`}
              onClick={() => setContentType(ct.key)}
            >
              <span>{ct.icon}</span>
              <span>{ct.label}</span>
            </button>
          ))}
        </div>

        {/* Form body */}
        <form className="uam-body" onSubmit={handleSubmit}>
          {/* ===== ACTIVITY FORM ===== */}
          {contentType === 'activity' && (
            <>
              {/* Category selector */}
              <div className="uam-field">
                <label className="uam-label">Category</label>
                <select className="uam-select" value={category} onChange={e => setCategory(e.target.value)}>
                  {ACTIVITY_CATEGORIES.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="uam-row">
                <div className="uam-field">
                  <label className="uam-label">Event Title *</label>
                  <input className="uam-input" name="eventTitle" value={form.eventTitle} onChange={handleChange} placeholder="e.g. National Conference 2025" required />
                </div>
                <div className="uam-field">
                  <label className="uam-label">Organization Name *</label>
                  <input className="uam-input" name="organizationName" value={form.organizationName} onChange={handleChange} placeholder="e.g. IEEE Bombay Section" required />
                </div>
              </div>

              <div className="uam-row">
                <div className="uam-field">
                  <label className="uam-label">Event Type</label>
                  <select className="uam-select" name="eventType" value={form.eventType} onChange={handleChange}>
                    <option value="">Select type...</option>
                    {EVENT_TYPES.map(et => (
                      <option key={et} value={et}>{et}</option>
                    ))}
                  </select>
                </div>
                <div className="uam-field">
                  <label className="uam-label">Role *</label>
                  <input className="uam-input" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Resource Person, Keynote Speaker" required />
                </div>
              </div>

              <div className="uam-field">
                <label className="uam-label">Topic *</label>
                <input className="uam-input" name="topic" value={form.topic} onChange={handleChange} placeholder="e.g. IoT in Agriculture" required />
              </div>

              <div className="uam-row">
                <div className="uam-field">
                  <label className="uam-label">Date *</label>
                  <input className="uam-input" name="date" value={form.date} onChange={handleChange} placeholder="e.g. March 15, 2025" required />
                </div>
                <div className="uam-field">
                  <label className="uam-label">Year</label>
                  <input className="uam-input" name="year" value={form.year} onChange={handleChange} placeholder="e.g. 2025" />
                </div>
              </div>

              <div className="uam-row">
                <div className="uam-field">
                  <label className="uam-label">Location</label>
                  <input className="uam-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. SITRC, Nashik, Maharashtra" />
                </div>
                <div className="uam-field">
                  <label className="uam-label">External Link</label>
                  <input className="uam-input" name="externalLink" value={form.externalLink} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>

              <div className="uam-field">
                <label className="uam-label">Tags / Keywords</label>
                <input className="uam-input" name="tags" value={form.tags} onChange={handleChange} placeholder="IoT, Embedded Systems, Workshop (comma-separated)" />
              </div>

              <div className="uam-field">
                <label className="uam-label">Detailed Description *</label>
                <textarea
                  className="uam-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="This session was conducted for engineering students on Startup Innovation and Entrepreneurship Development. Students learned about incubation support, idea validation, and startup funding opportunities."
                  rows="6"
                  required
                />
                <span className="uam-field__hint">{form.description.length} characters • Provide complete details about the event</span>
              </div>

              {/* Upload areas */}
              <div className="uam-uploads-grid">
                {/* Certificate upload */}
                <div className="uam-upload-box" onClick={() => certPhotoRef.current?.click()}>
                  <input ref={certPhotoRef} type="file" accept="image/*,.pdf" onChange={handleCertPhotoUpload} hidden />
                  {certPhoto ? (
                    <div className="uam-upload-box__preview">
                      <span className="uam-upload-box__check">✓</span>
                      <span className="uam-upload-box__filename">{certPhoto.name}</span>
                    </div>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                      <span>Upload Certificate</span>
                      <small>Image or PDF</small>
                    </>
                  )}
                </div>

                {/* Event images upload */}
                <div className="uam-upload-box" onClick={() => eventImgRef.current?.click()}>
                  <input ref={eventImgRef} type="file" accept="image/*" multiple onChange={handleEventImageUpload} hidden />
                  {eventImages.length > 0 ? (
                    <div className="uam-upload-box__preview">
                      <span className="uam-upload-box__check">✓</span>
                      <span className="uam-upload-box__filename">{eventImages.length} image{eventImages.length > 1 ? 's' : ''} selected</span>
                    </div>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span>Event Photos</span>
                      <small>Multiple images</small>
                    </>
                  )}
                </div>

                {/* Document upload */}
                <div className="uam-upload-box" onClick={() => docRef.current?.click()}>
                  <input ref={docRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" multiple onChange={handleDocUpload} hidden />
                  {documents.length > 0 ? (
                    <div className="uam-upload-box__preview">
                      <span className="uam-upload-box__check">✓</span>
                      <span className="uam-upload-box__filename">{documents.length} doc{documents.length > 1 ? 's' : ''} selected</span>
                    </div>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span>Documents</span>
                      <small>PDF, DOC, PPT</small>
                    </>
                  )}
                </div>
              </div>

              {/* Preview uploaded event images */}
              {eventImages.length > 0 && (
                <div className="uam-thumb-row">
                  {eventImages.map((img, i) => (
                    <div key={i} className="uam-thumb">
                      <img src={img.data} alt={img.name} />
                      <button type="button" className="uam-thumb__remove" onClick={() => removeEventImage(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview uploaded documents */}
              {documents.length > 0 && (
                <div className="uam-doc-list">
                  {documents.map((doc, i) => (
                    <div key={i} className="uam-doc-item">
                      <span>📄 {doc.name}</span>
                      <button type="button" className="uam-doc-item__remove" onClick={() => removeDocument(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ===== GALLERY FORM ===== */}
          {contentType === 'gallery' && (
            <>
              <div
                className={`uam-gallery-drop ${galleryData.src ? 'has-image' : ''}`}
                onClick={() => galleryRef.current?.click()}
              >
                <input ref={galleryRef} type="file" accept="image/*" onChange={handleGalleryImageUpload} hidden />
                {galleryData.src ? (
                  <img src={galleryData.src} alt="Preview" className="uam-gallery-drop__img" />
                ) : (
                  <div className="uam-gallery-drop__placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <p>Click or drag & drop to upload image</p>
                    <small>JPG, PNG, WebP</small>
                  </div>
                )}
              </div>

              <div className="uam-field">
                <label className="uam-label">Image Title *</label>
                <input
                  className="uam-input"
                  value={galleryData.title}
                  onChange={e => setGalleryData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. IEEE Day Celebration 2025"
                  required
                />
              </div>

              <div className="uam-field">
                <label className="uam-label">Description</label>
                <textarea
                  className="uam-textarea"
                  value={galleryData.description}
                  onChange={e => setGalleryData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="This photo was captured during the Expert Lecture on Embedded Systems conducted at SITRC Nashik."
                  rows="4"
                />
              </div>

              <div className="uam-row">
                <div className="uam-field">
                  <label className="uam-label">Event Location</label>
                  <input
                    className="uam-input"
                    value={galleryData.location}
                    onChange={e => setGalleryData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. SITRC, Nashik"
                  />
                </div>
                <div className="uam-field">
                  <label className="uam-label">Date</label>
                  <input
                    className="uam-input"
                    value={galleryData.date}
                    onChange={e => setGalleryData(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g. March 15, 2025"
                  />
                </div>
              </div>
            </>
          )}

          {/* ===== CERTIFICATE FORM ===== */}
          {contentType === 'certificate' && (
            <>
              <div
                className={`uam-gallery-drop ${certData.data ? 'has-image' : ''}`}
                onClick={() => certRef.current?.click()}
              >
                <input ref={certRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleCertFileUpload} hidden />
                {certData.data ? (
                  <div className="uam-cert-preview">
                    {certData.type?.includes('image') ? (
                      <img src={certData.data} alt="Preview" className="uam-gallery-drop__img" />
                    ) : (
                      <div className="uam-cert-preview__file">
                        <span className="uam-cert-preview__icon">📄</span>
                        <span>{certData.name}</span>
                        <small>{certData.size}</small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="uam-gallery-drop__placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p>Click or drag & drop certificate file</p>
                    <small>PDF, JPG, PNG, DOC</small>
                  </div>
                )}
              </div>

              <div className="uam-field">
                <label className="uam-label">Certificate Title *</label>
                <input
                  className="uam-input"
                  value={certData.name}
                  onChange={e => setCertData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. IEEE Senior Member Certificate"
                  required
                />
              </div>

              <div className="uam-field">
                <label className="uam-label">Description</label>
                <textarea
                  className="uam-textarea"
                  value={certData.description}
                  onChange={e => setCertData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Certificate received for delivering an expert lecture on Entrepreneurship Development and Startup Ecosystem."
                  rows="4"
                />
              </div>
            </>
          )}

          {/* Submit area */}
          <div className="uam-footer">
            <span className="uam-footer__hint">
              {contentType === 'activity' && draft ? '💾 Auto-saving draft' : ''}
            </span>
            <div className="uam-footer__actions">
              <button type="button" className="btn btn--outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn--primary uam-submit-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {contentType === 'activity' ? 'Add Activity' : contentType === 'gallery' ? 'Add to Gallery' : 'Upload Certificate'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivities } from '../../context/useActivities';
import './ActivityCard.css';

export default function ActivityCard({ activity, category, index = 0 }) {
  const { isAdmin, deleteActivity, uploadCertificateToActivity, uploadImagesToActivity, uploadDocumentsToActivity } = useActivities();
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expandDesc, setExpandDesc] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  const handleCertUpload = (e) => {
    const files = Array.from(e.target.files);
    const certs = [];
    let loaded = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        certs.push({ name: file.name, data: reader.result, type: file.type });
        loaded++;
        if (loaded === files.length) uploadCertificateToActivity(category, activity.id, certs);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const images = [];
    let loaded = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        images.push({ name: file.name, data: reader.result, type: file.type });
        loaded++;
        if (loaded === files.length) uploadImagesToActivity(category, activity.id, images);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files);
    const docs = [];
    let loaded = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        docs.push({ name: file.name, data: reader.result, type: file.type, size: (file.size / 1024).toFixed(1) + ' KB' });
        loaded++;
        if (loaded === files.length) uploadDocumentsToActivity(category, activity.id, docs);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteActivity(category, activity.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const descIsLong = activity.description?.length > 180;

  return (
    <motion.div
      className="activity-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="activity-card__header">
        <div className="activity-card__date-badge">
          {activity.date || activity.year}
        </div>
        <span className="activity-card__role-badge">{activity.role}</span>
        {activity.eventType && (
          <span className="activity-card__type-badge">{activity.eventType}</span>
        )}
      </div>

      <h4 className="activity-card__event">{activity.eventTitle}</h4>
      <p className="activity-card__org">{activity.organizationName}</p>

      {activity.location && (
        <div className="activity-card__meta-line">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>{activity.location}</span>
        </div>
      )}

      {activity.topic && activity.topic !== activity.eventTitle && (
        <div className="activity-card__topic">
          <span className="activity-card__topic-label">Topic:</span>
          <span>{activity.topic}</span>
        </div>
      )}

      <div className={`activity-card__desc ${expandDesc ? 'expanded' : ''}`}>
        {activity.description}
      </div>
      {descIsLong && (
        <button className="activity-card__read-more" onClick={() => setExpandDesc(!expandDesc)}>
          {expandDesc ? 'Show less' : 'Read more...'}
        </button>
      )}

      {/* Tags */}
      {activity.tags && activity.tags.length > 0 && (
        <div className="activity-card__tags">
          {(Array.isArray(activity.tags) ? activity.tags : [activity.tags]).map((tag, i) => (
            <span key={i} className="activity-card__tag">{tag}</span>
          ))}
        </div>
      )}

      {/* External link */}
      {activity.externalLink && (
        <a href={activity.externalLink} target="_blank" rel="noopener noreferrer" className="activity-card__link">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View Details
        </a>
      )}

      {/* Event images thumbnails */}
      {activity.galleryImages && activity.galleryImages.length > 0 && (
        <div className="activity-card__images">
          {activity.galleryImages.slice(0, 4).map((img, i) => (
            <div key={i} className="activity-card__img-thumb" onClick={() => setPreviewImg(img)}>
              <img src={img.data} alt={img.name} />
            </div>
          ))}
          {activity.galleryImages.length > 4 && (
            <div className="activity-card__img-more">+{activity.galleryImages.length - 4}</div>
          )}
        </div>
      )}

      {/* Documents */}
      {activity.eventDocuments && activity.eventDocuments.length > 0 && (
        <div className="activity-card__docs">
          {activity.eventDocuments.map((doc, i) => (
            <a key={i} href={doc.data} download={doc.name} className="activity-card__doc-badge">
              📄 {doc.name.length > 25 ? doc.name.substring(0, 25) + '…' : doc.name}
            </a>
          ))}
        </div>
      )}

      {/* Certificates badges */}
      {activity.certificateFiles && activity.certificateFiles.length > 0 && (
        <div className="activity-card__certs">
          {activity.certificateFiles.map((cert, i) => (
            <div key={i} className="activity-card__cert-badge" onClick={() => setPreviewImg(cert)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span>{cert.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Admin actions */}
      {isAdmin && (
        <div className="activity-card__actions">
          <button className="activity-card__btn activity-card__btn--edit" onClick={() => setShowEdit(true)} title="Edit Activity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <label className="activity-card__btn activity-card__btn--upload">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Cert
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handleCertUpload} style={{ display: 'none' }} />
          </label>
          <label className="activity-card__btn activity-card__btn--upload">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Photos
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
          <label className="activity-card__btn activity-card__btn--upload">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Docs
            <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" multiple onChange={handleDocUpload} style={{ display: 'none' }} />
          </label>
          <button className={`activity-card__btn activity-card__btn--delete ${confirmDelete ? 'confirm' : ''}`} onClick={handleDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            {confirmDelete ? 'Confirm?' : 'Delete'}
          </button>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {showEdit && <EditModal activity={activity} category={category} onClose={() => setShowEdit(false)} />}
      </AnimatePresence>

      {/* Image preview lightbox */}
      <AnimatePresence>
        {previewImg && (
          <motion.div className="edit-modal__overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewImg(null)} style={{ zIndex: 3000 }}>
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }} onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
              {previewImg.type?.includes('pdf') ? (
                <iframe src={previewImg.data} width="100%" height="600px" title={previewImg.name} />
              ) : (
                <img src={previewImg.data} alt={previewImg.name} style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px' }} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EditModal({ activity, category, onClose }) {
  const { updateActivity } = useActivities();
  const [form, setForm] = useState({
    category: activity.category || category || '',
    organizationName: activity.organizationName || activity.organization || '',
    eventTitle: activity.eventTitle || activity.eventName || '',
    eventType: activity.eventType || '',
    topic: activity.topic || '',
    date: activity.date || '',
    year: activity.year || '',
    role: activity.role || '',
    description: activity.description || '',
    location: activity.location || '',
    externalLink: activity.externalLink || '',
    tags: Array.isArray(activity.tags) ? activity.tags.join(', ') : (activity.tags || ''),
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    // Automatically set year if missing
    let year = form.year;
    if (!year && form.date) {
        const yearMatch = form.date.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) year = yearMatch[0];
    }
    
    updateActivity(category, activity.id, { ...form, tags: tagsArray, year });
    onClose();
  };

  return (
    <motion.div className="edit-modal__overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="edit-modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
        <div className="edit-modal__header">
          <h3>Edit Activity</h3>
          <button className="edit-modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form className="edit-modal__form" onSubmit={handleSubmit}>
          <div className="edit-modal__row">
            <div className="edit-modal__field"><label>Category</label><input name="category" value={form.category} onChange={handleChange} required /></div>
            <div className="edit-modal__field"><label>Year</label><input name="year" value={form.year} onChange={handleChange} placeholder="e.g. 2024" /></div>
          </div>
          <div className="edit-modal__row">
            <div className="edit-modal__field"><label>Organization</label><input name="organizationName" value={form.organizationName} onChange={handleChange} required /></div>
            <div className="edit-modal__field"><label>Event Title</label><input name="eventTitle" value={form.eventTitle} onChange={handleChange} required /></div>
          </div>
          <div className="edit-modal__row">
            <div className="edit-modal__field"><label>Event Type</label><input name="eventType" value={form.eventType} onChange={handleChange} placeholder="e.g. Workshop, FDP" /></div>
            <div className="edit-modal__field"><label>Topic</label><input name="topic" value={form.topic} onChange={handleChange} required /></div>
          </div>
          <div className="edit-modal__row">
            <div className="edit-modal__field"><label>Date</label><input name="date" value={form.date} onChange={handleChange} required /></div>
            <div className="edit-modal__field"><label>Role</label><input name="role" value={form.role} onChange={handleChange} required /></div>
          </div>
          <div className="edit-modal__row">
            <div className="edit-modal__field"><label>Location</label><input name="location" value={form.location} onChange={handleChange} placeholder="e.g. SITRC, Nashik" /></div>
            <div className="edit-modal__field"><label>External Link</label><input name="externalLink" value={form.externalLink} onChange={handleChange} placeholder="https://..." /></div>
          </div>
          <div className="edit-modal__field"><label>Tags</label><input name="tags" value={form.tags} onChange={handleChange} placeholder="IoT, Workshop (comma-separated)" /></div>
          <div className="edit-modal__field">
            <label>Detailed Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="5" required />
          </div>
          <div className="edit-modal__actions">
            <button type="button" className="btn btn--outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">Save Changes</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

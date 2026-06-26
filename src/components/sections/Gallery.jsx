import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivities } from '../../context/useActivities';
import './Gallery.css';

export default function Gallery() {
  const { gallery, isAdmin, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useActivities();
  const [lightbox, setLightbox] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileRef = useRef(null);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        addGalleryImage({
          src: reader.result,
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          location: '',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteGalleryImage(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  // Demo gallery images
  const demoImages = gallery.length > 0 ? gallery : [
    { id: 'demo-1', src: null, title: 'IEEE Day Celebration 2025', description: 'Annual IEEE Day event with students and faculty members.', location: 'SITRC, Nashik', date: 'October 1, 2025' },
    { id: 'demo-2', src: null, title: 'Women in Engineering Summit', description: 'WIE Leadership Summit for encouraging women in STEM.', location: 'Pune', date: 'August 20, 2025' },
    { id: 'demo-3', src: null, title: 'FDP on IoT Systems', description: '5-Day Faculty Development Program on IoT & Embedded Systems.', location: 'SITRC, Nashik', date: 'March 2025' },
    { id: 'demo-4', src: null, title: 'Smart India Hackathon', description: 'SIH Grand Finale judging panel participation.', location: 'Delhi', date: 'March 2025' },
    { id: 'demo-5', src: null, title: 'Research Paper Presentation', description: 'Paper presentation at IEEE ICOICT International Conference.', location: 'Mumbai', date: 'February 2025' },
    { id: 'demo-6', src: null, title: 'Innovation Challenge', description: 'SITRC Innovation Cell event mentoring student teams.', location: 'SITRC, Nashik', date: 'September 2024' },
  ];

  const displayImages = gallery.length > 0 ? gallery : demoImages;

  return (
    <section className="gallery-section section-padding section-alt" id="gallery">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="accent-line"></div>
          <div className="gallery-section__header">
            <div>
              <h2 className="section-title">
                <span className="activity-section__icon">🖼️</span>
                Photo Gallery
              </h2>
              <p className="section-subtitle">Snapshots from academic events, conferences, and workshops</p>
            </div>
            {isAdmin && (
              <button
                className="btn btn--primary activity-section__add-btn"
                onClick={() => fileRef.current?.click()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload Photos
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
              </button>
            )}
          </div>
        </motion.div>

        <div className="gallery-masonry">
          {displayImages.map((img, i) => (
            <motion.div
              key={img.id}
              className="gallery-masonry__item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => img.src && setLightbox(img)}
            >
              {img.src ? (
                <img src={img.src} alt={img.title} loading="lazy" />
              ) : (
                <div className="gallery-masonry__placeholder">
                  <div className="gallery-masonry__placeholder-icon">📷</div>
                  <span>{img.title}</span>
                </div>
              )}
              <div className="gallery-masonry__overlay">
                <h4>{img.title}</h4>
                {img.description && <p>{img.description}</p>}
                {img.location && (
                  <span className="gallery-masonry__location">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {img.location}
                  </span>
                )}
                {img.date && <span className="gallery-masonry__date">{img.date}</span>}
              </div>
              {isAdmin && img.src && (
                <div className="gallery-masonry__admin-btns" onClick={e => e.stopPropagation()}>
                  <button className="gallery-masonry__admin-btn" onClick={() => setEditItem(img)} title="Edit">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    className={`gallery-masonry__admin-btn gallery-masonry__admin-btn--del ${confirmDelete === img.id ? 'confirm' : ''}`}
                    onClick={() => handleDelete(img.id)}
                  >
                    {confirmDelete === img.id ? '✓' : '✕'}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {gallery.length === 0 && (
          <p className="gallery-section__hint">
            {isAdmin ? 'Upload event photos to populate the gallery' : 'Gallery images will appear here'}
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="gallery-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <motion.div
              className="gallery-lightbox__content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <img src={lightbox.src} alt={lightbox.title} />
              <div className="gallery-lightbox__info">
                <h3>{lightbox.title}</h3>
                {lightbox.description && <p className="gallery-lightbox__desc">{lightbox.description}</p>}
                <div className="gallery-lightbox__meta">
                  {lightbox.location && (
                    <span className="gallery-lightbox__meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {lightbox.location}
                    </span>
                  )}
                  {lightbox.date && (
                    <span className="gallery-lightbox__meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {lightbox.date}
                    </span>
                  )}
                </div>
              </div>
              <button className="gallery-lightbox__close" onClick={() => setLightbox(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Gallery Item Modal */}
      <AnimatePresence>
        {editItem && (
          <GalleryEditModal item={editItem} onClose={() => setEditItem(null)} onSave={updateGalleryImage} />
        )}
      </AnimatePresence>
    </section>
  );
}

function GalleryEditModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    title: item.title || '',
    description: item.description || '',
    location: item.location || '',
    date: item.date || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.id, form);
    onClose();
  };

  return (
    <motion.div className="edit-modal__overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="edit-modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
        <div className="edit-modal__header">
          <h3>Edit Photo Details</h3>
          <button className="edit-modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {item.src && (
          <div style={{ padding: '0 24px', marginTop: '16px' }}>
            <img src={item.src} alt={form.title} style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px' }} />
          </div>
        )}
        <form className="edit-modal__form" onSubmit={handleSubmit}>
          <div className="edit-modal__field">
            <label>Image Title</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div className="edit-modal__field">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows="3" placeholder="Describe the photo context..." />
          </div>
          <div className="edit-modal__row">
            <div className="edit-modal__field">
              <label>Location</label>
              <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. SITRC, Nashik" />
            </div>
            <div className="edit-modal__field">
              <label>Date</label>
              <input value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} placeholder="e.g. March 15, 2025" />
            </div>
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

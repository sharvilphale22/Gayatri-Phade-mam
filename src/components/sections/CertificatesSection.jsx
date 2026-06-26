import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivities } from '../../context/useActivities';
import './CertificatesSection.css';

export default function CertificatesSection() {
  const { certificates, isAdmin, addCertificate, updateCertificate, deleteCertificate } = useActivities();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const fileRef = useRef(null);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        addCertificate({
          name: file.name,
          description: '',
          data: reader.result,
          type: file.type,
          size: (file.size / 1024).toFixed(1) + ' KB',
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteCertificate(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleDownload = (cert) => {
    const link = document.createElement('a');
    link.href = cert.data;
    link.download = cert.name;
    link.click();
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('image')) return '🖼️';
    if (type?.includes('word') || type?.includes('document')) return '📝';
    return '📎';
  };

  // Demo certificates
  const demoCerts = [
    { id: 'demo-cert-1', name: 'IEEE Senior Member Certificate', description: 'Certificate of elevation to IEEE Senior Member status for significant contributions to engineering profession.', type: 'application/pdf', size: '245 KB', data: null },
    { id: 'demo-cert-2', name: 'Best Faculty Award 2019', description: 'Certificate received for outstanding teaching and research contributions at SITRC Nashik.', type: 'application/pdf', size: '180 KB', data: null },
    { id: 'demo-cert-3', name: 'Women Technologist Award', description: 'Certificate received for delivering an expert lecture on Entrepreneurship Development and Startup Ecosystem.', type: 'application/pdf', size: '320 KB', data: null },
    { id: 'demo-cert-4', name: 'FDP Completion Certificate', description: 'Completion certificate for AICTE-ISTE Faculty Development Program on IoT and Embedded Systems.', type: 'application/pdf', size: '156 KB', data: null },
    { id: 'demo-cert-5', name: 'Research Excellence Award', description: 'Award for excellence in research supervision and PhD student mentoring.', type: 'application/pdf', size: '290 KB', data: null },
    { id: 'demo-cert-6', name: 'Patent Registration Document', description: 'Patent registration document for Smart Flexible Pavement Deflectometer.', type: 'application/pdf', size: '410 KB', data: null },
  ];

  const displayCerts = certificates.length > 0 ? certificates : demoCerts;

  return (
    <section className="certs-section section-padding" id="certificates">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="accent-line"></div>
          <div className="certs-section__header">
            <div>
              <h2 className="section-title">
                <span className="activity-section__icon">📜</span>
                Certificates & Documents
              </h2>
              <p className="section-subtitle">Certificates, awards, and important academic documents</p>
            </div>
            {isAdmin && (
              <button className="btn btn--primary activity-section__add-btn" onClick={() => fileRef.current?.click()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload Document
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple onChange={handleUpload} style={{ display: 'none' }} />
              </button>
            )}
          </div>
        </motion.div>

        <div className="certs-section__grid">
          {displayCerts.map((cert, i) => (
            <motion.div
              key={cert.id}
              className="cert-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="cert-card__top">
                <div className="cert-card__icon">{getFileIcon(cert.type)}</div>
                <div className="cert-card__info">
                  <h4 className="cert-card__name">{cert.name}</h4>
                  <span className="cert-card__size">{cert.size}</span>
                </div>
              </div>
              {cert.description && (
                <p className="cert-card__desc">{cert.description}</p>
              )}
              <div className="cert-card__actions">
                {cert.data && (
                  <>
                    <button className="cert-card__btn cert-card__btn--preview" onClick={() => setPreviewDoc(cert)} title="Preview">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      Preview
                    </button>
                    <button className="cert-card__btn cert-card__btn--download" onClick={() => handleDownload(cert)} title="Download">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download
                    </button>
                  </>
                )}
                {isAdmin && (
                  <>
                    <button className="cert-card__btn cert-card__btn--edit" onClick={() => setEditItem(cert)} title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                    <button
                      className={`cert-card__btn cert-card__btn--delete ${confirmDelete === cert.id ? 'confirm' : ''}`}
                      onClick={() => handleDelete(cert.id)}
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      {confirmDelete === cert.id ? 'Confirm?' : 'Delete'}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {certificates.length === 0 && (
          <p className="gallery-section__hint">
            {isAdmin ? 'Upload certificates and documents to build your collection' : 'Documents will appear here'}
          </p>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div className="gallery-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewDoc(null)}>
            <motion.div className="cert-preview" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <div className="cert-preview__header">
                <div>
                  <h3>{previewDoc.name}</h3>
                  {previewDoc.description && <p className="cert-preview__desc">{previewDoc.description}</p>}
                </div>
                <div className="cert-preview__header-actions">
                  <button className="cert-preview__download-btn" onClick={() => handleDownload(previewDoc)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </button>
                  <button className="cert-preview__close-btn" onClick={() => setPreviewDoc(null)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
              <div className="cert-preview__body">
                {previewDoc.type?.includes('pdf') ? (
                  <iframe src={previewDoc.data} title={previewDoc.name} />
                ) : (
                  <img src={previewDoc.data} alt={previewDoc.name} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Certificate Modal */}
      <AnimatePresence>
        {editItem && (
          <CertEditModal item={editItem} onClose={() => setEditItem(null)} onSave={updateCertificate} />
        )}
      </AnimatePresence>
    </section>
  );
}

function CertEditModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    name: item.name || '',
    description: item.description || '',
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
          <h3>Edit Certificate Details</h3>
          <button className="edit-modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form className="edit-modal__form" onSubmit={handleSubmit}>
          <div className="edit-modal__field">
            <label>Certificate Title</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="edit-modal__field">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows="4" placeholder="Certificate received for delivering an expert lecture on Entrepreneurship Development..." />
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

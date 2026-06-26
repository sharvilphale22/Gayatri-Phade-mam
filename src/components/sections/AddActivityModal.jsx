import { useState } from 'react';
import { motion } from 'framer-motion';
import { useActivities } from '../../context/useActivities';
import './ActivityCard.css';

export default function AddActivityModal({ category, onClose }) {
  const { addActivity } = useActivities();
  const [form, setForm] = useState({
    organization: '',
    eventName: '',
    topic: '',
    date: '',
    role: '',
    description: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addActivity(category, { ...form, certificate: null });
    onClose();
  };

  return (
    <motion.div
      className="edit-modal__overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="edit-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="edit-modal__header">
          <h3>Add New Activity</h3>
          <button className="edit-modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form className="edit-modal__form" onSubmit={handleSubmit}>
          <div className="edit-modal__row">
            <div className="edit-modal__field">
              <label>Organization</label>
              <input
                name="organization"
                value={form.organization}
                onChange={handleChange}
                placeholder="e.g. IEEE Bombay Section"
                required
              />
            </div>
            <div className="edit-modal__field">
              <label>Event Name</label>
              <input
                name="eventName"
                value={form.eventName}
                onChange={handleChange}
                placeholder="e.g. National Conference 2025"
                required
              />
            </div>
          </div>
          <div className="edit-modal__row">
            <div className="edit-modal__field">
              <label>Topic</label>
              <input
                name="topic"
                value={form.topic}
                onChange={handleChange}
                placeholder="e.g. IoT in Agriculture"
                required
              />
            </div>
            <div className="edit-modal__field">
              <label>Date</label>
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                placeholder="e.g. March 15, 2025"
                required
              />
            </div>
          </div>
          <div className="edit-modal__field">
            <label>Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Resource Person, Keynote Speaker"
              required
            />
          </div>
          <div className="edit-modal__field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the activity..."
              rows="3"
              required
            />
          </div>
          <div className="edit-modal__actions">
            <button type="button" className="btn btn--outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">Add Activity</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

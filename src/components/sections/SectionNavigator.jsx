import { useState } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_CATEGORIES } from '../../data/sampleData';
import './SectionNavigator.css';

const allSections = [
  ...ACTIVITY_CATEGORIES,
  { key: 'gallery', label: 'Photo Gallery', icon: '🖼️' },
  { key: 'certificates', label: 'Certificates & Documents', icon: '📜' },
];

export default function SectionNavigator() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="section-nav section-padding section-alt" id="activities-overview">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="accent-line"></div>
          <h2 className="section-title">Professional Activities</h2>
          <p className="section-subtitle">
            Explore academic contributions, research activities, and professional engagements across multiple domains
          </p>
        </motion.div>

        <div className="section-nav__grid">
          {allSections.slice(0, isOpen ? allSections.length : 8).map((section, i) => (
            <motion.a
              key={section.key}
              href={`#${section.key}`}
              className="section-nav__card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={{ y: -3 }}
            >
              <span className="section-nav__card-icon">{section.icon}</span>
              <span className="section-nav__card-label">{section.label}</span>
              <svg
                className="section-nav__card-arrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </motion.a>
          ))}
        </div>

        {!isOpen && (
          <div className="section-nav__toggle-wrap">
            <button
              className="section-nav__toggle"
              onClick={() => setIsOpen(true)}
            >
              View All {allSections.length} Sections
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

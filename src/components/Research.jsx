import { useState } from 'react';
import './Research.css';
import { researchAreas as areas } from '../data/profileData';

export default function Research() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="research section-padding" id="research">
      <div className="container">
        <div className="accent-line"></div>
        <h2 className="section-title">Research Areas</h2>
        <p className="section-subtitle">Domains where I actively contribute and explore</p>

        <div className="research__grid">
          {areas.map((area, i) => (
            <div
              key={i}
              className={`research__card ${hoveredIdx === i ? 'research__card--active' : ''}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span className="research__icon">{area.icon}</span>
              <h3 className="research__card-title">{area.title}</h3>
              <p className="research__card-desc">{area.desc}</p>
              <div className="research__tags">
                {area.tags.map((tag) => (
                  <span key={tag} className="research__tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

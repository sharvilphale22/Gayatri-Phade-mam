import { useState } from 'react';
import './Publications.css';
import { publications } from '../data/profileData';

const filters = ['all', 'journal', 'conference'];

export default function Publications() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? publications
    : publications.filter((p) => p.type === activeFilter);

  return (
    <section className="publications section-padding section-alt" id="publications">
      <div className="container">
        <div className="accent-line"></div>
        <h2 className="section-title">Publications</h2>
        <p className="section-subtitle">Updated from 101 research papers, including journal publications and conference proceedings</p>

        <div className="pub__filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`pub__filter ${activeFilter === f ? 'pub__filter--active' : ''}`}
              onClick={() => setActiveFilter(f)}
              id={`filter-${f}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="pub__list">
          {filtered.map((pub, i) => (
            <div key={i} className="pub__item">
              <div className="pub__item-body">
                <span className={`pub__badge pub__badge--${pub.type}`}>
                  {pub.type === 'journal' ? 'Journal' : 'Conference'}
                </span>
                <h3 className="pub__title">{pub.title}</h3>
                <p className="pub__journal">{pub.journal}</p>
              </div>
              <div className="pub__item-meta">
                <span className="pub__year">{pub.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

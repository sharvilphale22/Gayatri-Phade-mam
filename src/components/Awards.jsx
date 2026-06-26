import { useState, useMemo, useCallback } from 'react';
import SearchFilter, { EmptyState } from './SearchFilter';
import './Awards.css';
import { awards } from '../data/profileData';

export default function Awards() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const filteredAwards = useMemo(() => {
    if (!searchQuery.trim()) return awards;
    const lowerQuery = searchQuery.toLowerCase();
    return awards.filter(
      (award) =>
        award.title.toLowerCase().includes(lowerQuery) ||
        award.organization.toLowerCase().includes(lowerQuery) ||
        award.date.includes(lowerQuery) ||
        award.description.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  return (
    <section className="awards section-padding section-alt" id="awards">
      <div className="container">
        <div className="accent-line"></div>
        <h2 className="section-title">Awards & Recognition</h2>
        <p className="section-subtitle">
          Awards, recognitions, appreciations, and honors merged from the latest PDF records
        </p>

        <SearchFilter
          placeholder="Search awards — try 'IEEE', '2020', 'Women'..."
          onFilterChange={handleFilterChange}
          resultCount={filteredAwards.length}
          totalCount={awards.length}
        />

        {filteredAwards.length > 0 ? (
          <div className="awards__grid">
            {filteredAwards.map((award, i) => (
              <div
                key={`${award.title}-${award.date}`}
                className="awards__card"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {award.image && (
                  <div className="awards__image-wrap">
                    <img src={award.image} alt={award.title} className="awards__image" />
                  </div>
                )}
                <div className="awards__card-header">
                  <span className="awards__icon">{award.kind === 'Recognition' ? '🎖️' : '🏆'}</span>
                  <span className="awards__year">{award.date || 'Recognition'}</span>
                </div>
                <h3 className="awards__title">{award.title}</h3>
                <p className="awards__org">{award.organization}</p>
                <p className="awards__desc">{award.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState query={searchQuery} />
        )}

        <div className="awards__total-badge">
          <span className="awards__total-number">{awards.length}</span>
          <span className="awards__total-label">Awards, Honors & Recognitions</span>
        </div>
      </div>
    </section>
  );
}

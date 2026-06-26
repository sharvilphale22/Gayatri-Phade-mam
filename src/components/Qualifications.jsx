import { useState, useMemo, useCallback } from 'react';
import SearchFilter, { EmptyState } from './SearchFilter';
import './Qualifications.css';
import { education as educationData, experience as experienceData } from '../data/profileData';

const education = educationData.map((item) => ({
  ...item,
  description: `${item.rank}${item.marks && item.marks !== 'NA' ? `, ${item.marks}%` : ''}.`,
}));

const experience = experienceData.map((item) => ({
  ...item,
  year: item.period,
}));

export default function Qualifications() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const allItems = useMemo(() => [
    ...education.map((item) => ({ ...item, type: 'education', searchText: `${item.degree} ${item.institution} ${item.year} ${item.description}` })),
    ...experience.map((item) => ({ ...item, type: 'experience', searchText: `${item.role} ${item.institution} ${item.year} ${item.description}` })),
  ], []);

  const filteredEducation = useMemo(() => {
    if (!searchQuery.trim()) return education;
    const lowerQuery = searchQuery.toLowerCase();
    return education.filter(
      (item) =>
        item.degree.toLowerCase().includes(lowerQuery) ||
        item.institution.toLowerCase().includes(lowerQuery) ||
        item.year.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const filteredExperience = useMemo(() => {
    if (!searchQuery.trim()) return experience;
    const lowerQuery = searchQuery.toLowerCase();
    return experience.filter(
      (item) =>
        item.role.toLowerCase().includes(lowerQuery) ||
        item.institution.toLowerCase().includes(lowerQuery) ||
        item.year.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const totalFiltered = filteredEducation.length + filteredExperience.length;
  const hasResults = totalFiltered > 0;

  return (
    <section className="qualifications section-padding section-alt" id="qualifications">
      <div className="container">
        <div className="accent-line"></div>
        <h2 className="section-title">Qualifications & Experience</h2>
        <p className="section-subtitle">My academic credentials and professional journey</p>

        <SearchFilter
          placeholder="Search qualifications — try 'Ph.D.', 'SITRC', 'Professor'..."
          onFilterChange={handleFilterChange}
          resultCount={totalFiltered}
          totalCount={allItems.length}
        />

        {hasResults ? (
          <div className="qual__grid">
            {/* Education Timeline */}
            {filteredEducation.length > 0 && (
              <div className="qual__column">
                <h3 className="qual__heading">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  Education
                </h3>
                <div className="timeline">
                  {filteredEducation.map((item, i) => (
                    <div key={i} className="timeline__item">
                      <div className="timeline__dot"></div>
                      <div className="timeline__content">
                        <h4 className="timeline__title">{item.degree}</h4>
                        <p className="timeline__place">{item.institution}</p>
                        <span className="timeline__year">{item.year}</span>
                        <p className="timeline__desc">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Timeline */}
            {filteredExperience.length > 0 && (
              <div className="qual__column">
                <h3 className="qual__heading">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  Experience
                </h3>
                <div className="timeline">
                  {filteredExperience.map((item, i) => (
                    <div key={i} className="timeline__item">
                      <div className="timeline__dot"></div>
                      <div className="timeline__content">
                        <h4 className="timeline__title">{item.role}</h4>
                        <p className="timeline__place">{item.institution}</p>
                        <span className="timeline__year">{item.year}</span>
                        <p className="timeline__desc">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState query={searchQuery} />
        )}
      </div>
    </section>
  );
}

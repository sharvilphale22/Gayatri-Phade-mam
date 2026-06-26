import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import './GlobalSearch.css';
import {
  education,
  experience,
  awards,
  patents,
  researchAreas,
  publications,
  professionalMemberships,
  researchLinks,
} from '../data/profileData';

/* Centralised data that mirrors the updated PDF-backed sections. */
const searchableData = [
  ...education.map((item) => ({
    section: 'Qualifications',
    sectionId: 'qualifications',
    icon: '🎓',
    title: item.degree,
    subtitle: `${item.institution} • ${item.year}`,
    detail: `${item.rank} ${item.marks && item.marks !== 'NA' ? item.marks : ''}`,
  })),
  ...experience.map((item) => ({
    section: 'Experience',
    sectionId: 'qualifications',
    icon: '💼',
    title: item.role,
    subtitle: `${item.institution} • ${item.period}`,
    detail: item.description,
  })),
  ...awards.slice(0, 40).map((item) => ({
    section: 'Awards',
    sectionId: 'awards',
    icon: item.kind === 'Recognition' ? '🎖️' : '🏆',
    title: item.title,
    subtitle: `${item.organization} • ${item.date}`,
    detail: item.description,
  })),
  ...patents.map((item) => ({
    section: 'Patents',
    sectionId: 'patents',
    icon: '🧪',
    title: item.title,
    subtitle: `${item.status} • ${item.year}`,
    detail: item.number,
  })),
  ...researchAreas.map((item) => ({
    section: 'Research',
    sectionId: 'research',
    icon: item.icon,
    title: item.title,
    subtitle: item.tags.join(', '),
    detail: item.desc,
  })),
  ...publications.slice(0, 60).map((item) => ({
    section: 'Publications',
    sectionId: 'publications',
    icon: '📰',
    title: item.title,
    subtitle: `${item.journal} • ${item.year}`,
    detail: item.type,
  })),
  ...professionalMemberships.map((item) => ({
    section: 'Professional Memberships',
    sectionId: 'Professional Memberships',
    icon: '🎖️',
    title: item.body,
    subtitle: item.membershipNo,
    detail: 'Professional body membership',
  })),
  ...researchLinks.map((item) => ({
    section: 'Research Links',
    sectionId: 'Research Links',
    icon: '🔗',
    title: item.name,
    subtitle: item.url,
    detail: 'Research profile link',
  })),
];

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQ = query.toLowerCase();
    return searchableData.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQ) ||
        item.subtitle.toLowerCase().includes(lowerQ) ||
        item.detail.toLowerCase().includes(lowerQ) ||
        item.section.toLowerCase().includes(lowerQ)
    );
  }, [query]);

  /* Group results by section */
  const groupedResults = useMemo(() => {
    const groups = {};
    results.forEach((item) => {
      if (!groups[item.section]) groups[item.section] = [];
      groups[item.section].push(item);
    });
    return groups;
  }, [results]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.trim().length > 0);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  const handleResultClick = useCallback((sectionId) => {
    setIsOpen(false);
    setQuery('');
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className={`gsearch ${isFocused ? 'gsearch--focused' : ''}`} ref={wrapRef}>
      <div className="gsearch__input-wrap">
        <svg className="gsearch__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="gsearch__input"
          placeholder="Search portfolio..."
          value={query}
          onChange={handleChange}
          onFocus={() => { setIsFocused(true); if (query.trim()) setIsOpen(true); }}
          onBlur={() => setIsFocused(false)}
          id="global-search-input"
          aria-label="Search entire portfolio"
          autoComplete="off"
        />
        {query && (
          <button className="gsearch__clear" onClick={handleClear} aria-label="Clear search" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="gsearch__dropdown">
          {results.length > 0 ? (
            <>
              <div className="gsearch__count">
                <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} found
              </div>
              {Object.entries(groupedResults).map(([section, items]) => (
                <div key={section} className="gsearch__group">
                  <div className="gsearch__group-header">{section}</div>
                  {items.map((item, i) => (
                    <button
                      key={`${section}-${i}`}
                      className="gsearch__result"
                      onClick={() => handleResultClick(item.sectionId)}
                      type="button"
                    >
                      <span className="gsearch__result-icon">{item.icon}</span>
                      <div className="gsearch__result-body">
                        <span className="gsearch__result-title">{item.title}</span>
                        <span className="gsearch__result-sub">{item.subtitle}</span>
                      </div>
                      <svg className="gsearch__result-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <div className="gsearch__empty">
              <p>No results for "<strong>{query}</strong>"</p>
              <span>Try searching for awards, patents, IoT, IEEE, Ph.D., etc.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

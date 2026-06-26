import { useState, useCallback } from 'react';
import './SearchFilter.css';

export default function SearchFilter({ placeholder = 'Search...', onFilterChange, resultCount, totalCount }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    onFilterChange(value);
  }, [onFilterChange]);

  const handleClear = useCallback(() => {
    setQuery('');
    onFilterChange('');
  }, [onFilterChange]);

  return (
    <div className={`search-filter ${isFocused ? 'search-filter--focused' : ''}`}>
      <div className="search-filter__input-wrap">
        <svg
          className="search-filter__icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="search-filter__input"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          id="search-filter-input"
          aria-label={placeholder}
        />
        {query && (
          <button
            className="search-filter__clear"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      {query && (
        <p className="search-filter__count">
          Showing <strong>{resultCount}</strong> of {totalCount} results
          {resultCount === 0 && ' — try a different keyword'}
        </p>
      )}
    </div>
  );
}

/* Empty state component for when search yields no results */
export function EmptyState({ query }) {
  return (
    <div className="search-empty">
      <div className="search-empty__icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
      <h4 className="search-empty__title">No results found</h4>
      <p className="search-empty__desc">
        No matches for "<strong>{query}</strong>". Try searching with different keywords like "IEEE", "Ph.D.", or "2020".
      </p>
    </div>
  );
}

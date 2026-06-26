import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivities } from '../../context/useActivities';
import { YEAR_FILTERS, filterByYear, searchActivities, sortByLatest } from '../../data/sampleData';
import ActivityCard from './ActivityCard';
import AddActivityModal from './AddActivityModal';
import './ActivitySection.css';

export default function ActivitySection({ categoryKey, title, subtitle, icon, isAlt = false }) {
  const { activities, isAdmin } = useActivities();
  const [yearFilter, setYearFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortLatest, setSortLatest] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const categoryActivities = useMemo(
    () => activities[categoryKey] || [],
    [activities, categoryKey]
  );

  const filteredActivities = useMemo(() => {
    let result = categoryActivities;
    result = filterByYear(result, yearFilter);
    result = searchActivities(result, searchQuery);
    if (sortLatest) result = sortByLatest(result);
    return result;
  }, [categoryActivities, yearFilter, searchQuery, sortLatest]);

  return (
    <section
      className={`activity-section section-padding ${isAlt ? 'section-alt' : ''}`}
      id={categoryKey}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="accent-line"></div>
          <div className="activity-section__header">
            <div>
              <h2 className="section-title">
                <span className="activity-section__icon">{icon}</span>
                {title}
              </h2>
              <p className="section-subtitle">{subtitle}</p>
            </div>
            {isAdmin && (
              <button
                className="btn btn--primary activity-section__add-btn"
                onClick={() => setShowAdd(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Activity
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters toolbar */}
        <div className="activity-section__toolbar">
          <div className="activity-section__filters">
            {YEAR_FILTERS.map(year => (
              <button
                key={year}
                className={`activity-section__filter-btn ${yearFilter === year ? 'active' : ''}`}
                onClick={() => setYearFilter(year)}
              >
                {year === 'All' ? 'All Years' : year === 'Previous' ? '< 2024' : year}
              </button>
            ))}
          </div>
          <div className="activity-section__search-sort">
            <div className="activity-section__search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className={`activity-section__sort-btn ${sortLatest ? 'active' : ''}`}
              onClick={() => setSortLatest(!sortLatest)}
              title="Sort by latest"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <polyline points="19 12 12 19 5 12"/>
              </svg>
              Latest
            </button>
          </div>
        </div>

        {/* Activity cards grid */}
        <div className="activity-section__grid">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity, i) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                category={categoryKey}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredActivities.length === 0 && (
          <motion.div
            className="activity-section__empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="activity-section__empty-icon">📭</span>
            <p>No activities found{searchQuery ? ` for "${searchQuery}"` : ''}
              {yearFilter !== 'All' ? ` in ${yearFilter}` : ''}
            </p>
          </motion.div>
        )}

        <div className="activity-section__count">
          Showing {filteredActivities.length} of {categoryActivities.length} activities
        </div>

        <AnimatePresence>
          {showAdd && (
            <AddActivityModal
              category={categoryKey}
              onClose={() => setShowAdd(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

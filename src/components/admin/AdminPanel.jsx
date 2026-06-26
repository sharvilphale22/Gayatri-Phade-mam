import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivities } from '../../context/useActivities';
import { ACTIVITY_CATEGORIES } from '../../data/sampleData';
import './AdminPanel.css';

const ADMIN_PASSWORD = 'SITRC@2026';

export default function AdminPanel() {
  const {
    isAdmin, toggleAdmin, resetToSample,
    activities, gallery, certificates, recentUploads,
    deleteActivity, deleteGalleryImage, deleteCertificate,
  } = useActivities();
  const [showPanel, setShowPanel] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [dashboardTab, setDashboardTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);

  // Calculate stats
  const totalActivities = Object.values(activities).reduce(
    (sum, arr) => sum + (arr?.length || 0), 0
  );

  const categoriesWithData = Object.entries(activities).filter(
    ([, arr]) => arr && arr.length > 0
  ).length;

  // Flat list of all activities for searching
  const allActivitiesFlat = useMemo(() => {
    const flat = [];
    Object.entries(activities).forEach(([catKey, items]) => {
      (items || []).forEach(item => {
        flat.push({ ...item, _category: catKey });
      });
    });
    return flat;
  }, [activities]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    let result = allActivitiesFlat;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.eventTitle?.toLowerCase().includes(q) ||
        item.eventName?.toLowerCase().includes(q) ||
        item.organizationName?.toLowerCase().includes(q) ||
        item.organization?.toLowerCase().includes(q) ||
        item.topic?.toLowerCase().includes(q) ||
        item.role?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    }
    if (filterYear !== 'All') {
      result = result.filter(item => {
        const match = item.date?.match(/\d{4}/);
        const year = match ? match[0] : '';
        if (filterYear === 'Previous') return year && parseInt(year) < 2024;
        return year === filterYear;
      });
    }
    if (filterCategory !== 'All') {
      result = result.filter(item => item._category === filterCategory);
    }
    return result;
  }, [allActivitiesFlat, searchQuery, filterYear, filterCategory]);

  // Filtered gallery
  const filteredGallery = useMemo(() => {
    if (!searchQuery.trim()) return gallery;
    const q = searchQuery.toLowerCase();
    return gallery.filter(img =>
      img.title?.toLowerCase().includes(q) ||
      img.description?.toLowerCase().includes(q) ||
      img.location?.toLowerCase().includes(q)
    );
  }, [gallery, searchQuery]);

  // Filtered certificates
  const filteredCertificates = useMemo(() => {
    if (!searchQuery.trim()) return certificates;
    const q = searchQuery.toLowerCase();
    return certificates.filter(cert =>
      cert.name?.toLowerCase().includes(q) ||
      cert.description?.toLowerCase().includes(q)
    );
  }, [certificates, searchQuery]);

  const handleReset = () => {
    if (confirmReset) {
      resetToSample();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
    }
  };

  const handleDeleteActivity = (category, id) => {
    if (confirmDeleteItem === id) {
      deleteActivity(category, id);
      setConfirmDeleteItem(null);
    } else {
      setConfirmDeleteItem(id);
      setTimeout(() => setConfirmDeleteItem(null), 3000);
    }
  };

  const handleDeleteGallery = (id) => {
    if (confirmDeleteItem === id) {
      deleteGalleryImage(id);
      setConfirmDeleteItem(null);
    } else {
      setConfirmDeleteItem(id);
      setTimeout(() => setConfirmDeleteItem(null), 3000);
    }
  };

  const handleDeleteCert = (id) => {
    if (confirmDeleteItem === id) {
      deleteCertificate(id);
      setConfirmDeleteItem(null);
    } else {
      setConfirmDeleteItem(id);
      setTimeout(() => setConfirmDeleteItem(null), 3000);
    }
  };

  const closeLogin = () => {
    setShowLogin(false);
    setPassword('');
    setPasswordError('');
  };

  const handleAdminButtonClick = () => {
    if (isAdmin) {
      setShowPanel(false);
      toggleAdmin();
      return;
    }

    setShowLogin(true);
    setPassword('');
    setPasswordError('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      toggleAdmin();
      setShowPanel(true);
      closeLogin();
      return;
    }

    setPasswordError('Incorrect Password');
  };

  const DASHBOARD_TABS = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'events', label: 'Events', icon: '📋' },
    { key: 'gallery', label: 'Gallery', icon: '🖼️' },
    { key: 'certificates', label: 'Certificates', icon: '📜' },
  ];

  const getCategoryLabel = (key) => {
    const cat = ACTIVITY_CATEGORIES.find(c => c.key === key);
    return cat ? cat.label : key;
  };

  const getCategoryIcon = (key) => {
    const cat = ACTIVITY_CATEGORIES.find(c => c.key === key);
    return cat ? cat.icon : '📋';
  };

  return (
    <>
      {/* Floating admin toggle — bottom LEFT */}
      <button
        className="admin-fab"
        onClick={handleAdminButtonClick}
        title={isAdmin ? 'Exit Admin Mode' : 'Enter Admin Mode'}
      >
        {isAdmin ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        )}
      </button>

      {/* Admin login dialog */}
      <AnimatePresence>
        {showLogin && !isAdmin && (
          <motion.div
            className="admin-login__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLogin}
          >
            <motion.form
              className="admin-login"
              initial={{ y: 24, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              onClick={e => e.stopPropagation()}
              onSubmit={handleLoginSubmit}
            >
              <div className="admin-login__header">
                <div className="admin-login__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div>
                  <h2>Admin Login</h2>
                  <p>Enter password to access the dashboard</p>
                </div>
              </div>

              <label className="admin-login__label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                className={`admin-login__input ${passwordError ? 'admin-login__input--error' : ''}`}
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Enter admin password"
                autoComplete="current-password"
                autoFocus
              />
              {passwordError && (
                <p className="admin-login__error" role="alert">{passwordError}</p>
              )}

              <div className="admin-login__actions">
                <button type="button" className="admin-login__btn admin-login__btn--cancel" onClick={closeLogin}>
                  Cancel
                </button>
                <button type="submit" className="admin-login__btn admin-login__btn--submit">
                  Login
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin banner */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            className="admin-banner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container admin-banner__inner">
              <div className="admin-banner__left">
                <div className="admin-banner__indicator"></div>
                <span className="admin-banner__text">
                  <strong>Admin Mode Active</strong> — Add, edit, delete activities and manage uploads
                </span>
              </div>
              <div className="admin-banner__actions">
                <button
                  className="admin-banner__btn admin-banner__btn--stats"
                  onClick={() => setShowPanel(!showPanel)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                  Dashboard
                </button>
                <button
                  className="admin-banner__btn admin-banner__btn--exit"
                  onClick={toggleAdmin}
                >
                  Exit Admin
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Dashboard Panel */}
      <AnimatePresence>
        {showPanel && isAdmin && (
          <motion.div
            className="admin-dashboard__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPanel(false)}
          >
            <motion.div
              className="admin-dashboard"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="admin-dashboard__header">
                <h2>Admin Dashboard</h2>
                <button className="admin-dashboard__close" onClick={() => setShowPanel(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Tab navigation */}
              <div className="admin-dashboard__tabs">
                {DASHBOARD_TABS.map(tab => (
                  <button
                    key={tab.key}
                    className={`admin-dashboard__tab ${dashboardTab === tab.key ? 'active' : ''}`}
                    onClick={() => { setDashboardTab(tab.key); setSearchQuery(''); setFilterYear('All'); setFilterCategory('All'); }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Search bar (for events, gallery, certificates tabs) */}
              {dashboardTab !== 'overview' && (
                <div className="admin-dashboard__search-bar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text"
                    placeholder={`Search ${dashboardTab}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="admin-dashboard__search-clear" onClick={() => setSearchQuery('')}>✕</button>
                  )}
                </div>
              )}

              {/* Filters for events tab */}
              {dashboardTab === 'events' && (
                <div className="admin-dashboard__filters">
                  <div className="admin-dashboard__filter-group">
                    <label>Year</label>
                    <select value={filterYear} onChange={e => setFilterYear(e.target.value)}>
                      <option value="All">All Years</option>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="Previous">&lt; 2024</option>
                    </select>
                  </div>
                  <div className="admin-dashboard__filter-group">
                    <label>Category</label>
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                      <option value="All">All Categories</option>
                      {ACTIVITY_CATEGORIES.map(cat => (
                        <option key={cat.key} value={cat.key}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="admin-dashboard__content">
                {/* ===== OVERVIEW TAB ===== */}
                {dashboardTab === 'overview' && (
                  <>
                    {/* Stats */}
                    <div className="admin-dashboard__stats">
                      <div className="admin-stat">
                        <span className="admin-stat__number">{totalActivities}</span>
                        <span className="admin-stat__label">Activities</span>
                      </div>
                      <div className="admin-stat">
                        <span className="admin-stat__number">{gallery.length}</span>
                        <span className="admin-stat__label">Photos</span>
                      </div>
                      <div className="admin-stat">
                        <span className="admin-stat__number">{certificates.length}</span>
                        <span className="admin-stat__label">Certificates</span>
                      </div>
                      <div className="admin-stat">
                        <span className="admin-stat__number">{categoriesWithData}</span>
                        <span className="admin-stat__label">Categories</span>
                      </div>
                    </div>

                    {/* Recent uploads */}
                    {recentUploads.length > 0 && (
                      <>
                        <h3 className="admin-dashboard__section-title">Recent Uploads</h3>
                        <div className="admin-dashboard__recent">
                          {recentUploads.slice(0, 8).map((item, i) => (
                            <div key={i} className="admin-recent-item">
                              <span className="admin-recent-item__type">
                                {item.type === 'gallery' ? '🖼️' : item.type === 'certificate' ? '📜' : '📋'}
                              </span>
                              <div className="admin-recent-item__info">
                                <span className="admin-recent-item__title">{item.title}</span>
                                <span className="admin-recent-item__time">
                                  {new Date(item.uploadedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Quick links to sections */}
                    <h3 className="admin-dashboard__section-title">Activity Sections</h3>
                    <div className="admin-dashboard__categories">
                      {ACTIVITY_CATEGORIES.map(cat => {
                        const count = (activities[cat.key] || []).length;
                        return (
                          <a key={cat.key} href={`#${cat.key}`} className="admin-dashboard__cat-link" onClick={() => setShowPanel(false)}>
                            <span className="admin-dashboard__cat-icon">{cat.icon}</span>
                            <span className="admin-dashboard__cat-label">{cat.label}</span>
                            <span className="admin-dashboard__cat-count">{count}</span>
                          </a>
                        );
                      })}
                      <a href="#gallery" className="admin-dashboard__cat-link" onClick={() => setShowPanel(false)}>
                        <span className="admin-dashboard__cat-icon">🖼️</span>
                        <span className="admin-dashboard__cat-label">Photo Gallery</span>
                        <span className="admin-dashboard__cat-count">{gallery.length}</span>
                      </a>
                      <a href="#certificates" className="admin-dashboard__cat-link" onClick={() => setShowPanel(false)}>
                        <span className="admin-dashboard__cat-icon">📜</span>
                        <span className="admin-dashboard__cat-label">Certificates</span>
                        <span className="admin-dashboard__cat-count">{certificates.length}</span>
                      </a>
                    </div>

                    {/* Quick actions */}
                    <h3 className="admin-dashboard__section-title">Quick Actions</h3>
                    <div className="admin-dashboard__quick-actions">
                      <button
                        className={`admin-dashboard__action-btn ${confirmReset ? 'admin-dashboard__action-btn--danger' : ''}`}
                        onClick={handleReset}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1 4 1 10 7 10"/>
                          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                        </svg>
                        {confirmReset ? '⚠️ Click again to confirm reset' : 'Reset All Data to Defaults'}
                      </button>
                    </div>
                  </>
                )}

                {/* ===== EVENTS TAB ===== */}
                {dashboardTab === 'events' && (
                  <>
                    <div className="admin-manage__count">
                      Showing {filteredActivities.length} of {allActivitiesFlat.length} activities
                    </div>
                    <div className="admin-manage__list">
                      {filteredActivities.length === 0 && (
                        <div className="admin-manage__empty">
                          <span>📭</span>
                          <p>No activities match your search</p>
                        </div>
                      )}
                      {filteredActivities.map(item => (
                        <div key={item.id} className="admin-manage__item">
                          <div className="admin-manage__item-top">
                            <span className="admin-manage__item-icon">{getCategoryIcon(item._category)}</span>
                            <div className="admin-manage__item-info">
                              <span className="admin-manage__item-title">{item.eventTitle || item.eventName}</span>
                              <span className="admin-manage__item-meta">{item.organizationName || item.organization} • {item.date || item.year}</span>
                              <span className="admin-manage__item-cat">{getCategoryLabel(item._category)}</span>
                            </div>
                          </div>
                          <div className="admin-manage__item-actions">
                            <a href={`#${item._category}`} className="admin-manage__action-btn admin-manage__action-btn--view" onClick={() => setShowPanel(false)} title="View">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </a>
                            <button
                              className={`admin-manage__action-btn admin-manage__action-btn--delete ${confirmDeleteItem === item.id ? 'confirm' : ''}`}
                              onClick={() => handleDeleteActivity(item._category, item.id)}
                              title="Delete"
                            >
                              {confirmDeleteItem === item.id ? '✓' : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ===== GALLERY TAB ===== */}
                {dashboardTab === 'gallery' && (
                  <>
                    <div className="admin-manage__count">
                      {filteredGallery.length} photo{filteredGallery.length !== 1 ? 's' : ''} in gallery
                    </div>
                    <div className="admin-manage__list">
                      {filteredGallery.length === 0 && (
                        <div className="admin-manage__empty">
                          <span>🖼️</span>
                          <p>{gallery.length === 0 ? 'No photos uploaded yet. Use the + button to add photos.' : 'No photos match your search'}</p>
                        </div>
                      )}
                      {filteredGallery.map(img => (
                        <div key={img.id} className="admin-manage__item admin-manage__item--gallery">
                          <div className="admin-manage__item-top">
                            {img.src ? (
                              <div className="admin-manage__thumb">
                                <img src={img.src} alt={img.title} />
                              </div>
                            ) : (
                              <span className="admin-manage__item-icon">📷</span>
                            )}
                            <div className="admin-manage__item-info">
                              <span className="admin-manage__item-title">{img.title}</span>
                              <span className="admin-manage__item-meta">
                                {img.location && `${img.location} • `}{img.date || 'No date'}
                              </span>
                            </div>
                          </div>
                          <div className="admin-manage__item-actions">
                            <a href="#gallery" className="admin-manage__action-btn admin-manage__action-btn--view" onClick={() => setShowPanel(false)} title="View">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </a>
                            <button
                              className={`admin-manage__action-btn admin-manage__action-btn--delete ${confirmDeleteItem === img.id ? 'confirm' : ''}`}
                              onClick={() => handleDeleteGallery(img.id)}
                              title="Delete"
                            >
                              {confirmDeleteItem === img.id ? '✓' : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ===== CERTIFICATES TAB ===== */}
                {dashboardTab === 'certificates' && (
                  <>
                    <div className="admin-manage__count">
                      {filteredCertificates.length} certificate{filteredCertificates.length !== 1 ? 's' : ''}
                    </div>
                    <div className="admin-manage__list">
                      {filteredCertificates.length === 0 && (
                        <div className="admin-manage__empty">
                          <span>📜</span>
                          <p>{certificates.length === 0 ? 'No certificates uploaded yet. Use the + button to upload.' : 'No certificates match your search'}</p>
                        </div>
                      )}
                      {filteredCertificates.map(cert => (
                        <div key={cert.id} className="admin-manage__item">
                          <div className="admin-manage__item-top">
                            <span className="admin-manage__item-icon">
                              {cert.type?.includes('pdf') ? '📄' : cert.type?.includes('image') ? '🖼️' : '📎'}
                            </span>
                            <div className="admin-manage__item-info">
                              <span className="admin-manage__item-title">{cert.name}</span>
                              <span className="admin-manage__item-meta">{cert.size || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="admin-manage__item-actions">
                            <a href="#certificates" className="admin-manage__action-btn admin-manage__action-btn--view" onClick={() => setShowPanel(false)} title="View">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </a>
                            {cert.data && (
                              <a href={cert.data} download={cert.name} className="admin-manage__action-btn admin-manage__action-btn--download" title="Download">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              </a>
                            )}
                            <button
                              className={`admin-manage__action-btn admin-manage__action-btn--delete ${confirmDeleteItem === cert.id ? 'confirm' : ''}`}
                              onClick={() => handleDeleteCert(cert.id)}
                              title="Delete"
                            >
                              {confirmDeleteItem === cert.id ? '✓' : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

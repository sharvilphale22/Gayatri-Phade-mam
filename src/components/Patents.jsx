import './Patents.css';
import { patents } from '../data/profileData';

export default function Patents() {
  return (
    <section className="patents section-padding" id="patents">
      <div className="container">
        <div className="accent-line"></div>
        <h2 className="section-title">Patents & Innovations</h2>
        <p className="section-subtitle">
          9 patents covering IoT, assistive technology, smart systems, automation, agriculture, and healthcare
        </p>

        <div className="patents__grid">
          {patents.map((patent, i) => (
            <div
              key={i}
              className="patents__card"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="patents__card-top">
                <span className="patents__status-badge" data-status={patent.status.toLowerCase()}>
                  {patent.status}
                </span>
                <span className="patents__year">{patent.year}</span>
              </div>
              <h3 className="patents__title">{patent.title}</h3>
              <p className="patents__desc">{patent.description}</p>
              <div className="patents__footer">
                <span className="patents__tag">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  {patent.number}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="patents__summary">
          <div className="patents__summary-stat">
            <span className="patents__summary-number">9</span>
            <span className="patents__summary-label">Total Patents</span>
          </div>
          <div className="patents__summary-divider"></div>
          <div className="patents__summary-stat">
            <span className="patents__summary-number">4</span>
            <span className="patents__summary-label">Granted</span>
          </div>
          <div className="patents__summary-divider"></div>
          <div className="patents__summary-stat">
            <span className="patents__summary-number">4</span>
            <span className="patents__summary-label">Filed/Published</span>
          </div>
          <div className="patents__summary-divider"></div>
          <div className="patents__summary-stat">
            <span className="patents__summary-number">1</span>
            <span className="patents__summary-label">Under Examination</span>
          </div>
        </div>
      </div>
    </section>
  );
}

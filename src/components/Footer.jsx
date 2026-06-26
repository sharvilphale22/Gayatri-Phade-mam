import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container footer__inner">
        <div className="footer__left">
          <span className="footer__name">Dr. Gayatri M. Phade</span>
          <span className="footer__copy">© {year} All rights reserved. | Professor & HOD, E&TC — SITRC, Nashik</span>
        </div>
        <div className="footer__links">
          <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer">Google Scholar</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:gayatri.phade@sitrc.org">Email</a>
        </div>
      </div>
    </footer>
  );
}

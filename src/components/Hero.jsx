

import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__greeting">Welcome</p>
          <h1 className="hero__name">Dr. Gayatri M. Phade</h1>
          <p className="hero__role">Professor &amp; Head of Department — Electronics &amp; Telecommunication Engineering</p>
          <p className="hero__institution">Sandip Institute of Technology and Research Centre (SITRC), Nashik</p>
          <p className="hero__desc">
            Administrator, Academician, Researcher, and Entrepreneur with 19 years of
            teaching and 3.5 years of industrial experience. Empowering innovation,
            research, and women entrepreneurship across disciplines.
          </p>
          <div className="hero__actions">
            <a href="#about" className="btn btn--primary">View Profile</a>
            <a href="#awards" className="btn btn--outline">Awards & Recognition</a>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__avatar">
            <img
              src="/images/profile.png"
              alt="Dr. Gayatri M. Phade"
              className="hero__avatar-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import './About.css';
import { profileStats } from '../data/profileData';

const stats = [
  { number: profileStats.teachingYears, label: 'Years Teaching' },
  { number: profileStats.researchPapers, label: 'Research Papers' },
  { number: profileStats.patents, label: 'Patents Filed' },
  { number: profileStats.awards, label: 'Awards Received' },
];

export default function About() {
  return (
    <section className="about section-padding" id="about">
      <div className="container">
        <div className="accent-line"></div>
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">A brief introduction to my academic journey</p>

        <div className="about__grid">
          <div className="about__text">
            <p>
              Dr. Gayatri M. Phade is an accomplished Administrator, Academician, Researcher, 
              and Entrepreneur with 19 years of teaching experience and 3.5 years of industrial experience. 
              She serves as Professor & Head of the E&TC Department at Sandip Institute of Technology & Research Centre, Nashik, affiliated with Savitribai Phule Pune University.
            </p>
            <p>
              Her expertise areas include Embedded Systems, Power Electronics, Agriculture Drones, Internet of Things, and Entrepreneurship Development. She holds a BE in Electronics Engineering, ME in Electronics Engineering, PhD in E&TC, Diploma in Business Management, and Diploma in Information & Software Management.
            </p>
            <p>
              She is an IEEE Senior Member, IEI Fellow, and holds active professional memberships with ISTE, IETE, EWB, IFERP, IAENG, and ISBA. Her research is widely recognized across major platforms including Google Scholar, ORCID, ResearchGate, Scopus, Web of Science, LinkedIn, and Vidwan.
            </p>
          </div>

          <div className="about__info">
            <div className="about__details">
              <div className="about__detail">
                <span className="about__detail-label">Designation</span>
                <span className="about__detail-value">Professor & Head, E&TC Department</span>
              </div>
              <div className="about__detail">
                <span className="about__detail-label">Organization</span>
                <span className="about__detail-value">SITRC, Nashik</span>
              </div>
              <div className="about__detail">
                <span className="about__detail-label">Affiliation</span>
                <span className="about__detail-value">Savitribai Phule Pune University</span>
              </div>
              <div className="about__detail">
                <span className="about__detail-label">Expertise</span>
                <span className="about__detail-value">IoT, Embedded Systems, Agriculture Drones & Power Electronics</span>
              </div>
              <div className="about__detail">
                <span className="about__detail-label">Qualifications</span>
                <span className="about__detail-value">PhD (E&TC), ME, BE, DBM, DISM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="about__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="about__stat">
              <span className="about__stat-number">{stat.number}</span>
              <span className="about__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

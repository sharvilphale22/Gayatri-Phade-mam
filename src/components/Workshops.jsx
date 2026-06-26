import { useState } from 'react';
import './Workshops.css';

const workshops = [
  {
    title: 'Faculty Development Program on IoT & Embedded Systems',
    description: 'A 5-day FDP covering IoT architectures, sensor integration, ARM-based embedded systems, and hands-on lab sessions with real hardware.',
    date: 'March 2023',
    role: 'Resource Person',
    participants: '60+',
  },
  {
    title: 'Hands-on Workshop on Arduino & Raspberry Pi',
    description: 'Two-day intensive workshop covering Arduino programming, Raspberry Pi setup, sensor interfacing, and building IoT prototypes.',
    date: 'January 2023',
    role: 'Organizer & Speaker',
    participants: '80+',
  },
  {
    title: 'National Seminar on Women Entrepreneurship in Technology',
    description: 'Presented research on empowering women through technology-enabled entrepreneurship, skill development initiatives, and innovation programs.',
    date: 'September 2022',
    role: 'Keynote Speaker',
    participants: '120+',
  },
  {
    title: 'Workshop on Research Methodology & Paper Writing',
    description: 'Guided participants through research design, literature review, academic writing conventions, and journal/conference submission processes.',
    date: 'July 2022',
    role: 'Resource Person',
    participants: '45+',
  },
  {
    title: 'Technical Training on Smart Agriculture Using IoT',
    description: 'Hands-on training sessions on sensor-based agriculture monitoring, drone applications in farming, and IoT-driven precision agriculture solutions.',
    date: 'February 2022',
    role: 'Co-organizer',
    participants: '50+',
  },
];

export default function Workshops() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="workshops section-padding" id="workshops">
      <div className="container">
        <div className="accent-line"></div>
        <h2 className="section-title">Workshops & Seminars</h2>
        <p className="section-subtitle">Events I have organized, conducted, and participated in</p>

        <div className="workshop__list">
          {workshops.map((ws, i) => (
            <div
              key={i}
              className={`workshop__item ${openIdx === i ? 'workshop__item--open' : ''}`}
            >
              <button
                className="workshop__header"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                id={`workshop-${i}`}
              >
                <div className="workshop__header-left">
                  <span className="workshop__date">{ws.date}</span>
                  <h3 className="workshop__title">{ws.title}</h3>
                </div>
                <svg
                  className="workshop__chevron"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="workshop__body">
                <p className="workshop__desc">{ws.description}</p>
                <div className="workshop__meta">
                  <span className="workshop__meta-item">
                    <strong>Role:</strong> {ws.role}
                  </span>
                  <span className="workshop__meta-item">
                    <strong>Participants:</strong> {ws.participants}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

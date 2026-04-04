// src/pages/AboutPage.jsx

import React from 'react';
import profilePhoto from '../assets/me.png';
import DevilDash from '../components/DevilDash/DevilDash';
import './About.css';

const skills = {
  'UX Skillset': ['User Research', 'Information Architecture', 'Wireframing', 'Interactive Prototyping', 'User Testing', 'Design Systems'],
  'Tools': ['Figma', 'Sketch', 'Adobe Creative Suite', 'InVision', 'Zeplin', 'Google Analytics'],
  'Development': ['React', 'TypeScript', 'CSS Modules', 'Storybook', 'Git'],
};

const stats = [
  { value: '15+', label: 'Years of experience' },
  { value: '70+', label: 'Projects delivered' },
  { value: '3',   label: 'Countries worked in' },
];

const AboutPage = () => {
  return (
    <div className="about-page hc-main-wrapper">

      {/* ── Headline Section ── */}
      <div className="about-headline-wrap">
        <div className="about-headline-text">
          <h1 className="about-headline">
            I turn complexity<br />into clarity.
          </h1>
        </div>

        {/* ── Game moved inside the wrap to sit horizontally ── */}
        <section className="about-headline-game">
          <p className="about-game-label">take a break</p>
          <DevilDash autoStart={true} /> 
        </section>
      </div>
   

      {/* ── Hero: photo + bio ── */}
      <section className="about-hero">
        <div className="about-photo-wrap">
          <img src={profilePhoto} alt="Davide Gomiero" className="about-photo" />
          <div className="about-photo-tag">Product Designer · Milan</div>
        </div>

        <div className="about-bio">
          <p className="firstSentence">
            Product Designer with 15+ years at the intersection of UX strategy, UI craft, and frontend development.
          </p>
          <p>
            I am a product designer with a decade-plus track record of blending communication design with frontend expertise.
            My career began in the world of data and marketing, which continues to fuel my obsession with user behavior
            and evidence-based design. Whether I'm building a design system from scratch or conducting deep-dive user
            research, I focus on creating products that are functional, scalable, and human-centric.
          </p>
          <div className="about-actions">
            {/* <a href="/path-to-resume.pdf" target="_blank" rel="noopener noreferrer" className="about-resume-btn">
              View Resume →
            </a> */}
            <a href="mailto:gomiero.david@email.com" className="about-contact-link">
              gomiero.david@email.com
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="about-stats">
        {stats.map((s, i) => (
          <div key={i} className="about-stat">
            <span className="about-stat-value">{s.value}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Skills ── */}
      <section className="about-skills">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="about-skill-col">
            <h3 className="about-skill-title">{category}</h3>
            <div className="about-skill-tags">
              {items.map(skill => (
                <span key={skill} className="about-skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

     

      {/* ── Footer links ── */}
      <section className="about-links">
        <a href="https://www.linkedin.com/in/davide-gomiero-30983755/" target="_blank" rel="noopener noreferrer" className="about-link-item">
          <span className="about-link-label">LinkedIn</span>
          <span className="about-link-arrow">↗</span>
        </a>
        <a href="https://github.com/4031979" target="_blank" rel="noopener noreferrer" className="about-link-item">
          <span className="about-link-label">GitHub — Nox Lab UI</span>
          <span className="about-link-arrow">↗</span>
        </a>
        {/* <a href="https://4031979.github.io/nox-lab-ui/" target="_blank" rel="noopener noreferrer" className="about-link-item">
          <span className="about-link-label">Storybook</span>
          <span className="about-link-arrow">↗</span>
        </a> */}
      </section>

    </div>
  );
};

export default AboutPage;
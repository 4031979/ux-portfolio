import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkPage.css';

// ─── Assets ──────────────────────────────────────────────────────────────────
import mscImage     from '../assets/mscPreview.png';
import detectionImg from '../assets/Nozomi-02.png';

import artboard2    from '../assets/Artboard_2.svg';

const WorkPage = () => {
  const navigate = useNavigate();
  const projectsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
  
    const projects = projectsRef.current;
  
    projects.forEach((project) => {
      if (project) observer.observe(project);
    });
  
    return () => {
      projects.forEach((project) => {
        if (project) observer.unobserve(project);
      });
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: "SAV: Helps you manage your finances better.",
      tags: ["UI/UX Design", "Branding"],
      description: "Financial Planning Reimagined.",
      mockup: mscImage,
      color: "#FF9A56",
      link: "/work/1",
    },
    {
      id: 2,
      title: "WeDataNation: Designing your data future",
      tags: ["Branding", "UI/UX"],
      description: "Data Analytics Dashboard.",
      mockup: detectionImg,
      color: "#4ECDC4",
      link: "/work/2",
    },
    {
      id: 3,
      title: "Telary Studio: Creative Excellence",
      tags: ["Web Design", "Branding"],
      description: "Design Agency Portfolio.",
      mockup: artboard2,
      color: "#6366F1",
      link: "/work/3",
    },
  ];

  return (
    <div className="hc-main-wrapper work-page">
      <header className="work-header">
        <h1 className="work-main-title">Selected Work</h1>
        <p className="work-subtitle">A collection of projects that showcase innovation and detail.</p>
      </header>

      <div className="projects-container">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => (projectsRef.current[index] = el)}
            className={`project-section ${index % 2 !== 0 ? 'layout-right' : ''}`}
          >
            <div className="project-visual">
              <div
                className="project-mockup-container"
                style={{ backgroundColor: `${project.color}15` }}
              >
                <img src={project.mockup} alt={project.title} className="project-mockup" />
              </div>
            </div>
            <div className="project-content">
              <div className="project-tags">
                {project.tags.map((tag, i) => (
                  <span key={i} className="project-tag">{tag}</span>
                ))}
              </div>
              <h2 className="project-title">{project.title}</h2>
              <p className="project-description">{project.description}</p>
              <button
                onClick={() => navigate(project.link)}
                className="project-cta"
              >
                Explore project →
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="work-cta-section">
        <div className="work-cta-content">
          <h2>Let's create something amazing together</h2>
          <p>Have a project in mind? I'd love to hear about it.</p>
          <a href="mailto:your.email@example.com" className="work-cta-button">
            Start a conversation
          </a>
        </div>
      </section>
    </div>
  );
};

export default WorkPage;
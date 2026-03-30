import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import solidformVideo from '../assets/solidform01.mp4';
import telarycover from '../assets/cover-home.jpg';
import nozomicover from '../assets/Nozomi-02.png';
import hanglagecover from '../assets/Exylus-targ-2.png'

const HomePage = () => {
  return (
    <div className="hc-main-wrapper">
      {/* 1. Hero Minimalista */}
      <section className="hc-hero">
        <h1 className="hc-hero-title">Human-first design.</h1>
        <h1 className="hc-hero-title"> Where strategy meets craft.</h1>
      </section>

      {/* 2. Video in evidenza (Full width, stile editoriale) */}
      <section className="hc-featured-video">
        <video src={solidformVideo} autoPlay loop muted playsInline />
        <div className="hc-video-meta">
          <Link to="/work/rtk" className="hc-meta-title">Solidform</Link>
          <span className="hc-meta-cat">UX/UI Design / Development</span>
        </div>
      </section>

      {/* 3. Portfolio Grid */}
      <section className="hc-work-grid">
        <ProjectCard title="CoStar Group" category="Visual Design" link="/work/3" image={telarycover} />
        <ProjectCard title="Rokt" category="UX Design" link="/work/4" image={hanglagecover} />
        <ProjectCard title="Nozomi Networks" category="UX/UI Design" link="/work/2" image={nozomicover} />
      </section>
    </div>
  );
};

const ProjectCard = ({ title, category, link, image }) => (
  <Link to={link} className="hc-project-card">
    <div className="hc-card-placeholder">
      {image && <img src={image} alt={title} className="hc-card-image" />}
    </div>
    <div className="hc-card-text">
      <h3>{title}</h3>
      <p>{category}</p>
    </div>
  </Link>
);

export default HomePage;
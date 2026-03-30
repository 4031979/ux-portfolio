// src/components/home/ProjectCard.jsx - SIMPLEST VERSION

import React from 'react';
import '../../styles/ProjectCard.css';

const ProjectCard = ({ icon, title, subtitle, period, link, id }) => {
  return (
    <div className="single-card">
      <div className="card-top">
        <div className="card-icon">{icon}</div>
        <h3 className="card-title">{title}</h3>
      </div>
      
      <a href="#" className="card-button">
        Visit Project
      </a>
      
      <div className="card-bottom">
        <p className="card-subtitle">{subtitle}</p>
        <p className="card-period">{period}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
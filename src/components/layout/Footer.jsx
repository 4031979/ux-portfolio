// src/components/layout/Footer.jsx

import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© Davide Gomiero {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
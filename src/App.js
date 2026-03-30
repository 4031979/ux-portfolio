// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer'; // ADD THIS
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProjectDetail from './pages/ProjectDetail';
import AdminDashboard from './pages/AdminDashboard';
import ChatWidget from './components/ChatWidget';
import './styles/variables.css';
import './styles/global.css';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className={`app ${theme}`}>
        <Navigation theme={theme} toggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer /> {/* ADD THIS */}
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;
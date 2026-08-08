import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container fade-in">
      <nav className="landing-nav">
        <div className="logo">CareConnect Hub</div>
        <button className="nav-signin" onClick={() => navigate('/auth')}>Sign In</button>
      </nav>

      <main className="landing-hero">
        <h1 className="hero-title">Experience Healthcare, <br/>Simplified.</h1>
        <p className="hero-subtitle">Unified discovery, appointment booking, and emergency blood services directly at your fingertips.</p>
        <button className="primary-btn pulse-glow" onClick={() => navigate('/auth')}>Get Started</button>
      </main>
    </div>
  );
};

export default Landing;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { CalendarHeart, Droplet } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />
      
      <main className="home-main">
        {/* Dashboard Hero Banner */}
        <section className="dashboard-hero fade-in">
          <div className="hero-content">
            <h1>Welcome to CareConnect, Ajay</h1>
            <p>Your central hub for managing health, appointments, and blood donations. Stay connected with top specialists and critical services.</p>
            <button className="primary-action-btn" onClick={() => navigate('/appointment')}>Find a Doctor Now</button>
          </div>
          <div className="hero-stats">
            <div className="hq-stat">
              <span className="hq-num">24/7</span>
              <span className="hq-label">Support</span>
            </div>
            <div className="hq-stat">
              <span className="hq-num">100+</span>
              <span className="hq-label">Specialists</span>
            </div>
            <div className="hq-stat">
              <span className="hq-num">Active</span>
              <span className="hq-label">Blood Banks</span>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header fade-in" style={{ animationDelay: '0.1s' }}>
            <h2>Core Services</h2>
            <p>Access our primary healthcare systems</p>
          </div>
          <div className="services-grid">
            {/* Appointment Card */}
            <div className="service-card appointment-card fade-in" style={{ animationDelay: '0.2s' }} onClick={() => navigate('/appointment')}>
              <div className="card-icon-wrapper">
                <CalendarHeart size={48} color="white" />
              </div>
              <h2>Book Appointment</h2>
              <p>Find the right doctor, see wait times, and book visits instantly. Filter by specialty or disease.</p>
              <button className="text-btn">Explore Doctors &rarr;</button>
            </div>

            {/* Blood Donation Card */}
            <div className="service-card blood-card fade-in" style={{ animationDelay: '0.3s' }} onClick={() => navigate('/blood')}>
              <div className="card-icon-wrapper blood-icon">
                <Droplet size={48} color="white" />
              </div>
              <h2>Blood Services</h2>
              <p>Search for blood availability in real-time or register as a donor to save lives in your community.</p>
              <button className="text-btn">Find / Donate Blood &rarr;</button>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header fade-in" style={{ animationDelay: '0.4s' }}>
            <h2>Quick Actions</h2>
          </div>
          
          <div className="quick-action-grid fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="action-tile" onClick={() => navigate('/dashboard')}>
              <div className="tile-icon-bg"><Droplet size={24} color="#ff3b3b" /></div>
              <div className="tile-text">
                <h3>Provider Dashboard</h3>
                <p>Manage blood inventory</p>
              </div>
            </div>
            <div className="action-tile disabled">
              <div className="tile-icon-bg"><CalendarHeart size={24} color="#86868b" /></div>
              <div className="tile-text">
                <h3>Medical Records</h3>
                <p>Coming Soon</p>
              </div>
            </div>
            <div className="action-tile disabled">
              <div className="tile-icon-bg"><CalendarHeart size={24} color="#86868b" /></div>
              <div className="tile-text">
                <h3>Online Pharmacy</h3>
                <p>Coming Soon</p>
              </div>
            </div>
          </div>
        </section>

        <section className="specialties-section fade-in" style={{ animationDelay: '0.6s' }}>
          <h3>Popular Specialties</h3>
          <div className="pill-container">
            <span className="pill" onClick={() => navigate('/appointment', { state: { query: 'Cardiology' } })}>Cardiology</span>
            <span className="pill" onClick={() => navigate('/appointment', { state: { query: 'Neurology' } })}>Neurology</span>
            <span className="pill" onClick={() => navigate('/appointment', { state: { query: 'Orthopedics' } })}>Orthopedics</span>
            <span className="pill" onClick={() => navigate('/appointment', { state: { query: 'Pediatrics' } })}>Pediatrics</span>
            <span className="pill" onClick={() => navigate('/appointment', { state: { query: 'Gynecology' } })}>Gynecology</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

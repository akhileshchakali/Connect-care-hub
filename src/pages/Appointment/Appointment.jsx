import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { Clock, CheckCircle, MapPin, Search } from 'lucide-react';
import './Appointment.css';

import { MOCK_DOCTORS } from '../../data/doctors.js';

const Appointment = () => {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(location.state?.query || '');
  const navigate = useNavigate();

  // Read location query from router state if available (passed from Navbar)
  const locationQuery = location.state?.location?.toLowerCase() || '';

  const filteredDoctors = MOCK_DOCTORS.filter(doc => {
    const q = searchQuery.toLowerCase();
    
    // Check if it matches the text search (disease, specialty, name)
    const matchesSearch = q === '' || 
           doc.name.toLowerCase().includes(q) || 
           doc.specialty.toLowerCase().includes(q) || 
           doc.location.toLowerCase().includes(q);
           
    // Check if it matches the selected global city location
    const matchesLocation = locationQuery === '' || doc.location.toLowerCase().includes(locationQuery);

    return matchesSearch && matchesLocation;
  });

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handlePayment = () => {
    setStep(3);
  };

  return (
    <div className="appointment-container">
      <Navbar />
      
      <main className="appointment-main">
        {step === 1 && (
          <div className="doctor-search-section fade-in">
            <h1>Find your specialist</h1>
            <div className="search-bar large-search">
               <Search size={24} color="#86868b" />
               <input 
                 type="text" 
                 placeholder="Search by disease, specialty, or doctor name" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>

            <div className="doctors-list">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doc => (
                  <div key={doc.id} className="doctor-card">
                    <div className="doc-info">
                      <h3>{doc.name}</h3>
                      <p className="doc-specialty">{doc.specialty}</p>
                      <p className="doc-location">
                        <MapPin size={16} /> 
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doc.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="location-link"
                        >
                          {doc.location}
                        </a>
                      </p>
                    </div>
                    <div className="doc-status">
                      <div className="wait-badge">
                        <Clock size={16} /> Wait: {doc.waitTime} ({doc.queue} ahead)
                      </div>
                      <button className="primary-btn sm-btn" onClick={() => handleBook(doc)}>Book • {doc.fee}</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#86868b', padding: '3rem 0', fontSize: '1.2rem' }}>
                   No specialist found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && selectedDoctor && (
          <div className="payment-section fade-in">
            <div className="checkout-card">
              <h2>Confirm Booking</h2>
              <div className="checkout-details">
                <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
                <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
                <p><strong>Hospital:</strong> {selectedDoctor.location}</p>
                <div className="live-queue-box">
                  <Clock size={20} color="#0071e3" />
                  <span>Real-time Wait: <strong>{selectedDoctor.waitTime}</strong></span>
                  <p>People ahead of you: {selectedDoctor.queue}</p>
                </div>
                <div className="amount-box">
                  <span>Total Amount</span>
                  <h3>{selectedDoctor.fee}</h3>
                </div>
              </div>
              <button className="primary-btn full-width" onClick={handlePayment}>Pay Now (Mock)</button>
              <button className="text-btn full-width mt-10" onClick={() => setStep(1)}>Cancel</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="success-section fade-in">
            <CheckCircle size={80} color="#34c759" />
            <h2>Appointment Confirmed!</h2>
            <p>Your booking with {selectedDoctor?.name} is successful.</p>
            <p>Please arrive 10 minutes before your estimated wait time.</p>
            <button className="primary-btn mt-20" onClick={() => navigate('/home')}>Return to Home</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Appointment;

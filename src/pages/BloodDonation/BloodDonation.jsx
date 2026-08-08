import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Droplet, Search, ShieldCheck } from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import './BloodDonation.css';

const BloodDonation = () => {
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'donate'
  const [bloodGroup, setBloodGroup] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Donor state
  const [donorGroup, setDonorGroup] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');

  const handleSearch = async () => {
    setSearched(true);
    if (!bloodGroup) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const docRef = doc(db, 'blood_inventory', bloodGroup);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().units > 0) {
        setResults([{
          id: 'city-hospital',
          name: 'City Hospital Reserve',
          location: 'Central Node',
          distance: '0.0 km',
          group: bloodGroup,
          units: docSnap.data().units
        }]);
      } else {
        setResults([]);
      }
    } catch (e) {
      console.error("Error fetching inventory:", e);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donorGroup || !donorName || !donorPhone) {
      alert("Please fill all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'blood_donors'), {
        name: donorName,
        phone: donorPhone,
        group: donorGroup,
        registeredAt: new Date().toISOString()
      });
      alert("Registered successfully! Thank you for being a donor.");
      setDonorName('');
      setDonorPhone('');
      setDonorGroup('');
    } catch (error) {
      console.error("Error registering donor: ", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="blood-container">
      <Navbar />
      
      <main className="blood-main">
        <div className="blood-header fade-in">
          <h1>Blood Donation & Services</h1>
          <p>Every drop counts. Request blood or become a donor today.</p>
        </div>

        <div className="blood-toggle-container fade-in">
          <div className="blood-toggle">
            <button 
              className={`toggle-btn ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => {setActiveTab('search'); setSearched(false);}}
            >
              Search Blood
            </button>
            <button 
              className={`toggle-btn ${activeTab === 'donate' ? 'active' : ''}`}
              onClick={() => setActiveTab('donate')}
            >
              Donate Blood
            </button>
          </div>
        </div>

        {activeTab === 'search' && (
          <div className="search-blood-section fade-in">
            <div className="search-filters">
              <select 
                value={bloodGroup} 
                onChange={(e) => setBloodGroup(e.target.value)}
                className="blood-select"
              >
                <option value="">Any Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              <button className="primary-btn search-btn-bld" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Searching...' : <><Search size={18} /> Find Availability</>}
              </button>
            </div>

            {searched && (
              <div className="blood-results">
                {results.length > 0 ? (
                  results.map(bank => (
                    <div key={bank.id} className="blood-bank-card">
                      <div className="bb-info">
                        <h3>{bank.name}</h3>
                        <p>{bank.location} • {bank.distance}</p>
                      </div>
                      <div className="bb-stats">
                        <div className="blood-badge">{bank.group}</div>
                        <span className="units-avail">{bank.units} units available</span>
                      </div>
                      <button className="primary-btn reserve-btn">Reserve</button>
                    </div>
                  ))
                ) : (
                  <div className="no-blood-found">
                    <Droplet size={48} color="#ff3b3b" />
                    <h3>No blood available for {bloodGroup}</h3>
                    <p>Would you like to send an emergency broadcast to registered donors?</p>
                    <button className="primary-btn emergency-btn">Send Emergency Request</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'donate' && (
          <div className="donate-blood-section fade-in">
            <div className="donate-card">
              <ShieldCheck size={48} color="#34c759" />
              <h2>Register as a Donor</h2>
              <p>Your donation can save up to 3 lives. Register to be notified of emergency shortages in your area.</p>
              
              <form className="donate-form" onSubmit={handleDonate}>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="blood-select full-width mt-10" 
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  style={{ boxSizing: 'border-box' }}
                  required 
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="blood-select full-width mt-10" 
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  style={{ boxSizing: 'border-box' }}
                  required 
                />
                <select 
                  className="blood-select full-width mt-10" 
                  value={donorGroup}
                  onChange={(e) => setDonorGroup(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Your Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <button type="submit" className="primary-btn full-width mt-20" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Complete Registration'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BloodDonation;

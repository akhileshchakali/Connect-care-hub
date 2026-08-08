import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, User, ChevronDown, LogOut, LayoutDashboard, LocateFixed } from 'lucide-react';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Navbar.css';

const MOCK_LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(location.state?.location || 'Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const locationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationSelect(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/appointment', { 
      state: { 
        query: searchQuery,
        location: selectedLocation 
      } 
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDetectLocation = (e) => {
    e.stopPropagation();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Free client-side reverse geocoding API
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          
          const city = data.city || data.locality || data.principalSubdivision || "Unknown Location";
          setSelectedLocation(city);

          // If we are currently on the appointment page, re-trigger the search with the new location
          if (location.pathname === '/appointment') {
             navigate('/appointment', { 
               state: { 
                 query: searchQuery,
                 location: city 
               },
               replace: true 
             });
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        } finally {
          setIsLocating(false);
          setShowLocationSelect(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      }
    );
  };

  return (
    <nav className="zomato-navbar">
      <div className="nav-left">
        <h2 className="nav-logo" onClick={() => navigate('/home')}>CareConnect</h2>
      </div>
      
      <div className="nav-search-container">
        <div className="search-location" ref={locationRef} onClick={() => setShowLocationSelect(!showLocationSelect)}>
          <MapPin size={20} color="#ff7e67" />
          <input 
            type="text" 
            placeholder="Location" 
            value={selectedLocation} 
            readOnly 
            className="location-input"
          />
          <ChevronDown size={16} color="#86868b" className={`chevron ${showLocationSelect ? 'open' : ''}`} />
          
          {showLocationSelect && (
            <div className="location-dropdown fade-in">
              <div 
                className="location-option detect-location"
                onClick={handleDetectLocation}
              >
                <LocateFixed size={16} color="var(--primary-color)" /> 
                <span style={{ color: 'var(--primary-color)', fontWeight: 500 }}>
                  {isLocating ? 'Detecting...' : 'Detect My Location'}
                </span>
              </div>
              <div className="dropdown-divider"></div>
              {MOCK_LOCATIONS.map(loc => (
                <div 
                  key={loc} 
                  className="location-option"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLocation(loc);
                    setShowLocationSelect(false);
                    
                    // If we are currently on the appointment page, re-trigger the search with the new location
                    if (location.pathname === '/appointment') {
                       navigate('/appointment', { 
                         state: { 
                           query: searchQuery,
                           location: loc 
                         },
                         replace: true
                       });
                    }
                  }}
                >
                  <MapPin size={16} color="#86868b" /> {loc}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="search-divider"></div>
        <form className="search-query" onSubmit={handleSearch}>
          <Search size={20} color="#86868b" />
          <input 
             type="text" 
             placeholder="Search for doctor, hospital or disease" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" style={{ display: 'none' }}></button>
        </form>
      </div>

      <div className="nav-right">
        <div className="user-profile-wrapper" ref={profileRef}>
          <div className="user-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="avatar">
              <User size={20} color="white" />
            </div>
            <span>{currentUser?.displayName || currentUser?.email?.split('@')[0]?.toUpperCase() || 'USER'}</span>
            <ChevronDown size={16} className={`chevron ${showProfileMenu ? 'open' : ''}`} />
          </div>
          
          {showProfileMenu && (
            <div className="profile-dropdown fade-in">
              <div className="dropdown-header">
                <strong>{currentUser?.displayName || 'CareConnect User'}</strong>
                <p>{currentUser?.email || 'Not signed in'}</p>
              </div>
              <div className="dropdown-divider"></div>
              {currentUser?.email === 'admin@careconnect.com' && (
                <div className="dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}>
                  <LayoutDashboard size={18} /> Provider Dashboard
                </div>
              )}
              <div className="dropdown-item danger" onClick={handleSignOut}>
                <LogOut size={18} /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

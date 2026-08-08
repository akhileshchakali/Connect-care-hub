import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Auth from './pages/Auth/Auth';
import Home from './pages/Home/Home';
import Appointment from './pages/Appointment/Appointment';
import BloodDonation from './pages/BloodDonation/BloodDonation';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

import Chatbot from './components/Chatbot/Chatbot';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/blood" element={<BloodDonation />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;

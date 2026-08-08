import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';

const Auth = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setError('');
    setEmail('');
    setPassword('');
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // In a real app, you would also save the 'name' to the user profile or Firestore
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <nav className="auth-nav" onClick={() => navigate('/')}>
        &larr; Back to Home
      </nav>
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front auth-surface">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to manage your appointments and health.</p>
            <form onSubmit={handleSignIn}>
              {error && !isFlipped && <div className="auth-error">{error}</div>}
              <div className="input-group">
                <input 
                   type="email" 
                   placeholder="Email Address" 
                   required 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input 
                   type="password" 
                   placeholder="Password" 
                   required 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="primary-btn auth-btn" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <p className="toggle-text">
              Don't have an account? <span onClick={handleFlip}>Sign Up</span>
            </p>
          </div>

          <div className="flip-card-back auth-surface">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Join CareConnect Hub today.</p>
            <form onSubmit={handleSignUp}>
              {error && isFlipped && <div className="auth-error">{error}</div>}
              <div className="input-group">
                <input 
                   type="text" 
                   placeholder="Full Name" 
                   required 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input 
                   type="email" 
                   placeholder="Email Address" 
                   required 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input 
                   type="password" 
                   placeholder="Password" 
                   required 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="primary-btn auth-btn" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            <p className="toggle-text">
              Already have an account? <span onClick={handleFlip}>Sign In</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

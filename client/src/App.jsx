import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import ProfileWizard from './pages/ProfileWizard';
import GeminiRecommend from './pages/GeminiRecommend';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('medimeal_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('medimeal_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medimeal_user');
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <ErrorBoundary>
          <div className="App">
            <Navbar user={user} onLogout={handleLogout} />
            <Routes>
              <Route 
                path="/" 
                element={
                  <Landing 
                    showAbout={showAbout} 
                    setShowAbout={setShowAbout} 
                  />
                } 
              />
              <Route 
                path="/login" 
                element={
                  user ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />
                } 
              />
              <Route 
                path="/signup" 
                element={
                  user ? <Navigate to="/profile" /> : <Signup onLogin={handleLogin} />
                } 
              />
              <Route 
                path="/profile" 
                element={
                  user ? <UserProfile /> : <Navigate to="/login" />
                } 
              />
              <Route 
                path="/profile-wizard" 
                element={
                  user ? <ProfileWizard /> : <Navigate to="/login" />
                } 
              />
              <Route 
                path="/recommendations" 
                element={
                  user ? <GeminiRecommend /> : <Navigate to="/login" />
                } 
              />
            </Routes>
          </div>
        </ErrorBoundary>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;


import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import AddUser from './components/AddUser/AddUser';
import Scheduler from './components/Schedule/Scheduler';
import Dashboard from './components/DashBoard/Dashboard';
import Errror from './components/Errror';
import './App.css';
import PostSignUpScreen from './components/Home/PostSignUpScreen';
import CreateAccount from './components/Home/CreateAccount';
import JoinTeam from './components/Home/JoinTeam';
import VerificationPage from './components/Home/VerificationPage';
import { getAuth } from 'firebase/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user); // Set true if user is logged in, false otherwise
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Navbar />} {/* Render Navbar only if logged in */}
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post-signup" element={<PostSignUpScreen />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/join-team" element={<JoinTeam />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/schedule" element={<Scheduler />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Errror />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
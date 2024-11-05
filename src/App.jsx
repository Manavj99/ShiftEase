// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import AddUser from './components/AddUser/AddUser';
import Scheduler from './components/Schedule/Scheduler';
import Dashboard from './components/DashBoard/Dashboard';
import Errror from './components/Errror';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Home />} />
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
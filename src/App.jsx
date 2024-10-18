// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import AddUser from './components/AddUser/AddUser';
import Errror from './components/Errror';  // Import the Errror component
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
            <Route path="*" element={<Errror />} />  {/* This will catch all undefined routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
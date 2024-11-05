import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Errror.css';

const Errror = () => {
  const navigate = useNavigate();

  return (
    <div className='error-container'>
      <div className="error-content">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <button className='btn-primary' onClick={() => navigate("/")}>
          Go to Home Page
        </button>
      </div>
    </div>
  );
}

export default Errror;
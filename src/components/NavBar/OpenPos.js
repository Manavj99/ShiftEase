import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import './OpenPos.css';

const OpenPos = ({ countryName, openPositions }) => {
  return (
    <div className="open-pos-container">
      <div className="svg-line">
        <span className="line-width">
          {countryName}
          <hr className="line-separator" />
        </span>
        <svg
          className="join-us-icon"
          width="14"
          height="18"
          role="img"
          aria-label="Join Us Icon" // Accessibility label
        >
          <path d="M7,0.2c-3.9,0-7,3.1-7,7c0,5.2,6.5,10.2,6.8,10.4c0.1,0.1,0.2,0.1,0.2,0.1s0.2,0,0.2-0.1C7.5,17.5,14,12.4,14,7.2C14,3.4,10.9,0.2,7,0.2z M7,10.2c-1.6,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S8.6,10.2,7,10.2z"></path>
        </svg>
      </div>
      <div className="open-positions" style={{ fontSize: "1rem", color: "grey" }}>
        {openPositions}
      </div>
      <br />
    </div>
  );
};

// Define prop types
OpenPos.propTypes = {
  countryName: PropTypes.string.isRequired,
  openPositions: PropTypes.string.isRequired,
};

export default OpenPos;
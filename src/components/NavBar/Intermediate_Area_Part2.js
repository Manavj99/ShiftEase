import React from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types"; // Import PropTypes
import './Intermediate_Area_Part2.css';

const Intermediate_Area_Part2 = ({ date, text }) => {
  return (
    <div className="intermediate-area">
      <div className="intermediate-area-content">
        <div className="date">{date}</div>
        <div className="text">{text}</div>
        <Button variant="outlined" color="secondary" className="read-more-button">
          Read More
        </Button>
      </div>
    </div>
  );
};

// Define prop types
Intermediate_Area_Part2.propTypes = {
  date: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Intermediate_Area_Part2;
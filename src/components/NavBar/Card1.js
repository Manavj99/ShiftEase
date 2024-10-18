import React from "react";
import PropTypes from "prop-types";
import "./Card1.css";
import Typography from "@material-ui/core/Typography";

const Card1 = ({ src1, src2, caption1, caption2 }) => {
  return (
    <>
      <div className="card card1_row1" data-aos="fade-up-right">
        <img src={src1} alt={caption1} />
        <div className="caption">
          <Typography variant="h6" style={{ color: "black", fontWeight: "bold", textAlign: "center" }}>
            {caption1}
          </Typography>
        </div>
      </div>

      <div className="card card1_row2" data-aos="fade-up-left">
        <img src={src2} alt={caption2} />
        <div className="caption">
          <Typography variant="h6" style={{ color: "black", fontWeight: "bold", textAlign: "center" }}>
            {caption2}
          </Typography>
        </div>
      </div>
    </>
  );
};

// Define prop types
Card1.propTypes = {
  src1: PropTypes.string.isRequired,
  src2: PropTypes.string.isRequired,
  caption1: PropTypes.string,
  caption2: PropTypes.string,
};

export default Card1;
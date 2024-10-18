import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import './Details.css';

const Details = () => {
  const [loginData, setLoginData] = useState(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const todayDate = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const getUser = localStorage.getItem("user_login");
    if (getUser) {
      const user = JSON.parse(getUser);
      setLoginData(user);

      if (user.date === todayDate) {
        setTimeout(() => {
          setShow(true);
        }, 3000);
      }
    } else {
      navigate("/");
    }
  }, [navigate, todayDate]);

  const handleClose = () => setShow(false);

  const userLogout = () => {
    localStorage.removeItem("user_login");
    navigate("/");
  };

  if (!loginData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container">
      <h1>Details Page</h1>
      <h2>Welcome, {loginData.name}</h2>
      <Button onClick={userLogout}>Log Out</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Happy Birthday!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>We hope you have a great day, {loginData.name}!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Details;
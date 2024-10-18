import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import Button from 'react-bootstrap/Button';
import AddUserModal from './AddUserModal';
import AddPositionModal from './AddPositionModal';
import './addUser.css';

function AddUser() {
  const [userModalShow, setUserModalShow] = useState(false);
  const [positionModalShow, setPositionModalShow] = useState(false);
  const [positions, setPositions] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribePositions = db.collection('positions').onSnapshot((snapshot) => {
      setPositions(snapshot.docs.map((doc) => doc.data().position));
    });

    const unsubscribeUsers = db.collection('users').onSnapshot((snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data()));
    });

    return () => {
      unsubscribePositions();
      unsubscribeUsers();
    };
  }, []);

  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const addPosition = (position) => {
    setPositions((prevPositions) => [...prevPositions, position]);
  };

  return (
    <div className="add-user-container">
      <Button variant="primary" onClick={() => setUserModalShow(true)}>
        Create User
      </Button>
      <Button variant="secondary" onClick={() => setPositionModalShow(true)}>
        Add Position
      </Button>

      <AddUserModal
        show={userModalShow}
        onHide={() => setUserModalShow(false)}
        positions={positions}
        addUser={addUser}
      />

      <AddPositionModal
        show={positionModalShow}
        onHide={() => setPositionModalShow(false)}
        addPosition={addPosition}
      />
    </div>
  );
}

export default AddUser;
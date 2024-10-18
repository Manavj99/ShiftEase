import React, { useState } from 'react';
import { db } from '../services/firebase';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

function AddPositionModal({ show, onHide, addPosition }) {
  const [newPosition, setNewPosition] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPosition = async (e) => {
    e.preventDefault();
    if (newPosition.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const positionRef = await db.collection('positions').add({ position: newPosition.trim() });
        addPosition({ id: positionRef.id, position: newPosition.trim() });
        setNewPosition("");
        onHide();
      } catch (error) {
        console.error("Error adding position:", error);
        setError("Failed to add position. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Position name cannot be empty.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="add-position-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add Position</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleAddPosition}>
          <Form.Group className="mb-3">
            <Form.Label>New Position:</Form.Label>
            <Form.Control
              type="text"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              required
              disabled={isLoading}
            />
          </Form.Group>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Position'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddPositionModal;
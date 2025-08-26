import React, { useState } from 'react';
import { db } from '../services/firebase';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

function AddRoleModal({ show, onHide, addRole }) {
  const [newRole, setNewRole] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (newRole.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const roleRef = await db.collection('roles').add({ role: newRole.trim() });
        addRole({ id: roleRef.id, role: newRole.trim() });
        setNewRole("");
        onHide();
      } catch (error) {
        console.error("Error adding role:", error);
        setError("Failed to add role. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Role name cannot be empty.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="add-role-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleAddRole}>
          <Form.Group className="mb-3">
            <Form.Label>New Role:</Form.Label>
            <Form.Control
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              required
              disabled={isLoading}
            />
          </Form.Group>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Role'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddRoleModal;
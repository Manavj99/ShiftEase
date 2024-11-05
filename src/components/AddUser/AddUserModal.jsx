import React, { useState } from 'react';
import { db } from '../services/firebase';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function AddUserModal({ show, onHide, roles, addUser }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (name && role && email) {
          try {
              const newUser = { name, role, email };
              await db.collection('users').add(newUser);
              addUser(newUser);
              setName("");
              setRole("");
              setEmail("");
              onHide();
          } catch (error) {
              console.error("Error adding user:", error);
          }
      }
  };

  return (
      <Modal show={show} onHide={onHide} size="lg" centered className="add-user-modal">
          <Modal.Header closeButton>
              <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                      <Form.Label>Name:</Form.Label>
                      <Form.Control
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                      />
                  </Form.Group>
                  <Form.Group className="mb-3">
                      <Form.Label>Role:</Form.Label>
                      <Form.Select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                      >
                          <option value="">Select Role</option>
                          {roles.map((role, index) => (
                              <option key={index} value={role}>{role}</option>
                          ))}
                      </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                      <Form.Label>Email:</Form.Label>
                      <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                  </Form.Group>
                  <Button type="submit">Add User</Button>
              </Form>
          </Modal.Body>
      </Modal>
  );
}

export default AddUserModal;
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { db } from '../services/firebase';
import { setDoc, doc } from 'firebase/firestore';

function AddUserModal({ show, onHide, roles, addUser }) {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name && role && email) {
            try {
                const newUser = { 
                    name, 
                    role, 
                    email,
                    'Shift Role': {
                        orgs: [], // Add references to organizations here
                        subgroup: [] // Add references to subgroups here
                    }
                };
                await setDoc(doc(db, 'users', name.trim().replace(/\s+/g, '_').toLowerCase()), newUser);
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
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                    />
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Role"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <button type="submit">Add User</button>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default AddUserModal;
import React, { useState } from 'react';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

function AddUserForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !role) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userId = name.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
            await setDoc(doc(db, 'users', userId), {
                name,
                email,
                role
            });
            setName('');
            setEmail('');
            setRole('');
            alert('User added successfully!');
        } catch (error) {
            console.error("Error adding user: ", error);
            setError('Error adding user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role"
                required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add User'}
            </button>
        </form>
    );
}

export default AddUserForm;
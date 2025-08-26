import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './JoinTeam.css';

const JoinTeam = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const checkEmailInPending = async () => {
        try {
            const subgroupsSnapshot = await getDocs(collection(db, 'subgroup'));
            const subgroups = subgroupsSnapshot.docs;

            for (const subgroupDoc of subgroups) {
                const subgroupData = subgroupDoc.data();
                const pending = subgroupData.pending || {};

                for (const [name, details] of Object.entries(pending)) {
                    if (details.email === email) {
                        navigate('/verification'); // Navigate to verification page
                        return;
                    }
                }
            }

            alert('Email not found in pending list.');
        } catch (error) {
            console.error("Error checking email in pending: ", error);
            alert('Error checking email. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        checkEmailInPending();
    };

    return (
        <div className="join-team-container">
            <div className="join-team-content">
                <h2>Join My Team</h2>
                <form onSubmit={handleSubmit}>
                    <div className="email-input-section">
                        <label className="email-label">Email:</label>
                        <div className="email-input-container">
                            <input
                                type="email"
                                className="email-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-button">Check Email</button>
                </form>
            </div>
        </div>
    );
};

export default JoinTeam;
import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [studentId, setStudentId] = useState('');
    const [orgName, setOrgName] = useState('');
    const [subgroupName, setSubgroupName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            const orgRef = doc(db, 'orgs', 'org_' + userId);
            const currentTime = new Date().toISOString();

            await setDoc(orgRef, {
                name: orgName,
                group: {
                    [subgroupName]: doc(db, 'subgroup', 'subgroup_' + userId),
                },
                owner: {
                    [firstName + ' ' + lastName]: doc(db, 'users', userId)
                },
                time: currentTime
            });

            const subgroupRef = doc(db, 'subgroup', 'subgroup_' + userId);
            await setDoc(subgroupRef, {
                name: subgroupName,
                employee: {},
                managers: {
                    [firstName + ' ' + lastName]: doc(db, 'users', userId)
                },
                owner: {
                    [firstName + ' ' + lastName]: doc(db, 'users', userId)
                },
                pending: {}
            });

            await setDoc(doc(db, 'users', userId), {
                firstName,
                lastName,
                email,
                phoneNumber,
                studentId: studentId || null,
                role: 'manager',
                'Shift Role': {
                    orgs: orgRef,
                    subgroup: subgroupRef
                }
            });

            alert('Account created successfully!');
            navigate("/dashboard");
        } catch (error) {
            console.error("Error creating account: ", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Student ID (optional)"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Subgroup Name"
                value={subgroupName}
                onChange={(e) => setSubgroupName(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>Create Account</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default CreateAccount;
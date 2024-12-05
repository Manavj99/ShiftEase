import React, { useState } from 'react';
import { db } from '../services/firebase';
import { doc, setDoc, getDocs, collection, deleteField } from 'firebase/firestore'; // Import deleteField
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const VerificationForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [studentId, setStudentId] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("Starting form submission...");
    
        try {
            console.log("Creating user with email:", email);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            console.log("User created with ID:", userId);
    
            const subgroupsSnapshot = await getDocs(collection(db, 'subgroup'));
            let matchedRole = null;
            let matchedShiftRole = null;
            let isMatchFound = false;
            let subgroupId = null;
            let pending = {}; // Define pending here
            let pendingName = null; // Define pendingName here

            for (const subgroupDoc of subgroupsSnapshot.docs) {
                const subgroupData = subgroupDoc.data();
                pending = subgroupData.pending || {}; // Assign pending from subgroupData

                for (const [name, details] of Object.entries(pending)) { // Use name instead of pendingName
                    if (details.email === email) {
                        matchedRole = details.role;
                        matchedShiftRole = details.shiftRole;
                        subgroupId = subgroupDoc.id; // Store the subgroup ID
                        pendingName = name; // Assign name to pendingName
                        console.log("Match found for email:", email);
                        isMatchFound = true;
                        break;
                    }
                }
    
                if (isMatchFound) break; // Exit outer loop if match is found
            }
    
            if (!isMatchFound) {
                console.error("No pending entry found for the email.");
                alert('No pending entry found for the email. Please check your email or contact support.');
                return;
            }
    
            const userRef = doc(db, 'users', userId);
            console.log("Setting document for user...");
            await setDoc(userRef, {
                firstName,
                lastName,
                email,
                phoneNumber,
                studentId: studentId || null,
                role: matchedRole,
                'Shift Role': matchedShiftRole
            });
    
            // Remove the user from the pending map
            const subgroupRef = doc(db, 'subgroup', subgroupId);
            await setDoc(subgroupRef, {
                pending: {
                    ...pending,
                    [pendingName]: deleteField() // Use deleteField() to remove the entry
                }
            }, { merge: true });
    
            // Add the user to the appropriate map in the subgroup
            const updateData = {};
            const userReference = doc(db, 'users', userId);
            const subgroupData = {}; // Initialize subgroupData here

            if (matchedRole === 'employee') {
                updateData.employee = {
                    ...subgroupData.employee, // Ensure subgroupData is defined
                    [firstName + ' ' + lastName]: userReference
                };
            } else if (matchedRole === 'manager') {
                updateData.managers = {
                    ...subgroupData.managers,
                    [firstName + ' ' + lastName]: userReference
                };
            } else if (matchedRole === 'owner') {
                updateData.owner = {
                    ...subgroupData.owner,
                    [firstName + ' ' + lastName]: userReference
                };
            }
    
            await setDoc(subgroupRef, updateData, { merge: true });
    
            console.log("Verification successful!");
            alert('Verification successful!');
            navigate('/dashboard');
        } catch (error) {
            console.error("Error during verification: ", error);
            alert(`Error during verification: ${error.message}. Please try again.`);
        }
    };

    return (
        <div>
            <h1>Verification</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
                <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="Student ID (Optional)" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default VerificationForm;
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { getAuth } from 'firebase/auth';
import { db } from '../services/firebase'; // Import your Firestore instance
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentUserName, setCurrentUserName] = useState('');
    const [loading, setLoading] = useState(true);

    const userLogout = () => {
        const auth = getAuth();
        auth.signOut().then(() => {
            sessionStorage.removeItem('currentUserName');
            navigate("/");
        });
    }

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userId = user.uid;
                const userDocRef = doc(db, 'users', userId); // Reference to the user's document
                const userDocSnap = await getDoc(userDocRef); // Fetch the document

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const name = `${userData.firstName} ${userData.lastName}`; // Construct the full name
                    setCurrentUserName(name);
                    sessionStorage.setItem('currentUserName', name); // Store name in session storage
                } else {
                    console.error("User document does not exist.");
                    setCurrentUserName('Guest'); // Fallback if user document is not found
                }
            } else {
                const storedName = sessionStorage.getItem('currentUserName');
                setCurrentUserName(storedName || 'Guest');
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []);

    if (loading) {
        return null; // Optionally render a loading state
    }

    return (
        <div className="TopArea">
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="logo">
                        <strong>Shift Ease</strong>
                    </div>
                    <div className="nav-links">
                        <NavLink to="/dashboard" className="nav-link">
                            <Button variant="text" color="default">DASHBOARD</Button>
                        </NavLink>
                        <NavLink to="/schedule" className="nav-link">
                            <Button variant="text" color="default">SCHEDULE</Button>
                        </NavLink>
                        <NavLink to="/tasks" className="nav-link">
                            <Button variant="text" color="default">TASKS</Button>
                        </NavLink>
                        
                        <div className="user-dropdown">
                            <Button 
                                variant="outlined" 
                                color="default" 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-label={currentUserName}
                            >
                                {currentUserName}
                            </Button>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Button onClick={userLogout} variant="text" color="secondary" aria-label="Logout">
                                        Log out
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
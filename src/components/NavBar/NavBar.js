import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { getAuth } from 'firebase/auth';
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentUserName, setCurrentUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // New loading state

    const userLogout = () => {
        localStorage.removeItem("user_login");
        navigate("/");
    }

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setCurrentUserName(user.displayName || 'User'); // Use displayName or fallback to 'User'
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false); // Set loading to false after checking user
    }, []);

    const isAuthPage = location.pathname === '/' || location.pathname === '/signup';

    // Render the navbar only if not on auth pages and loading is complete
    if (isAuthPage || loading) {
        return null; // Do not render the navbar if on auth pages or still loading
    }

    return (
        <div className="TopArea">
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="logo">
                        <strong>Shift Ease.</strong>
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
                        <NavLink to="/messages" className="nav-link">
                            <Button variant="text" color="default">MESSAGES</Button>
                        </NavLink>
                        <div className="user-dropdown">
                            <Button 
                                variant="outlined" 
                                color="default" 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-label={currentUserName}
                            >
                                {currentUserName || 'User'}
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
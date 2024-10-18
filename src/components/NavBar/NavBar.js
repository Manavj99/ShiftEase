// client/src/components/NavBar/NavBar.js
import React from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    const userLogout = () => {
        localStorage.removeItem("user_login");
        navigate("/");
    }

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("user_login");

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <strong>Shift Ease.</strong>
                </div>
                {isLoggedIn && ( // Show navbar links only if logged in
                    <div className="nav-links">
                        <NavLink to="/dashboard" className="nav-link" activeClassName="active">
                            <Button variant="text" color="default">DASHBOARD</Button>
                        </NavLink>
                        <NavLink to="/schedule" className="nav-link" activeClassName="active">
                            <Button variant="text" color="default">SCHEDULE</Button>
                        </NavLink>
                        <NavLink to="/tasks" className="nav-link" activeClassName="active">
                            <Button variant="text" color="default">TASKS</Button>
                        </NavLink>
                        <NavLink to="/messages" className="nav-link" activeClassName="active">
                            <Button variant="text" color="default">MESSAGES</Button>
                        </NavLink>
                        <Button onClick={userLogout} variant="outlined" color="secondary" aria-label="Logout">
                            Logout
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
import React, { useState } from 'react';
import './Dashboard.css';
import EmployeeList from './EmployeeList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faUsers, faBriefcase, faMapMarkerAlt, faBullhorn, faCog } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const [view, setView] = useState('dashboard');

    const handleViewChange = (newView) => {
        setView(newView);
    };

    return (
        <>
            <div className="main-container">
                <div className="dashboard-cards">
                    <div className={`card-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => handleViewChange('dashboard')}>
                        <FontAwesomeIcon icon={faTh} className="icon" />
                        <span>DASHBOARD</span>
                    </div>
                    <div className={`card-item ${view === 'employees' ? 'active' : ''}`} onClick={() => handleViewChange('employees')}>
                        <FontAwesomeIcon icon={faUsers} className="icon" />
                        <span>EMPLOYEES</span>
                    </div>
                    <div className={`card-item ${view === 'positions' ? 'active' : ''}`} onClick={() => handleViewChange('positions')}>
                        <FontAwesomeIcon icon={faBriefcase} className="icon" />
                        <span>POSITIONS</span>
                    </div>
                    <div className={`card-item ${view === 'locations' ? 'active' : ''}`} onClick={() => handleViewChange('locations')}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                        <span>LOCATIONS</span>
                    </div>
                    <div className={`card-item ${view === 'announcements' ? 'active' : ''}`} onClick={() => handleViewChange('announcements')}>
                        <FontAwesomeIcon icon={faBullhorn} className="icon" />
                        <span>ANNOUNCEMENTS</span>
                    </div>
                    <div className={`card-item ${view === 'settings' ? 'active' : ''}`} onClick={() => handleViewChange('settings')}>
                        <FontAwesomeIcon icon={faCog} className="icon" />
                        <span>SETTINGS</span>
                    </div>
                </div>

                {view === 'dashboard' && (
                    <>
                        <div className="shift-status">
                            <span>THERE IS NO SHIFT ASSIGN TO YOU</span>
                        </div>

                        <div className="notification-panel">
                            <div className="panel-header">
                                <span className="active-tab">NOTIFICATIONS</span>
                                <span className="inactive-tab">SHIFTS</span>
                                <div className="blue-line"></div>
                            </div>
                            <div className="welcome-message">
                                <span>Welcome to the shift Ease!</span>
                            </div>
                        </div>
                    </>
                )}

                {view === 'employees' && <EmployeeList />}
            </div>
        </>
    );
};

export default Dashboard;
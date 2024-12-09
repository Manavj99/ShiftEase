import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';
import EmployeeList from './EmployeeList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faUsers, faBriefcase, faMapMarkerAlt, faBullhorn, faCog } from '@fortawesome/free-solid-svg-icons';
import { fetchAnnouncements, deleteAnnouncement, updateAnnouncement } from '../services/announcementService';
import AnnouncementForm from '../Announcement/AnnouncementForm';

const Dashboard = () => {
    const [view, setView] = useState('dashboard');
    const [announcements, setAnnouncements] = useState([]);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const pageSize = 5;

    const loadAnnouncements = useCallback(async (reset = false) => {
        setLoading(true);
        try {
            const { announcements: newAnnouncements, lastVisible: newLastVisible } = await fetchAnnouncements(
                reset ? null : lastVisible,
                pageSize
            );
            console.log("Fetched Announcements:", newAnnouncements); // Debug fetched announcements
            console.log("New Last Visible:", newLastVisible); // Debug pagination
            setAnnouncements(reset ? newAnnouncements : [...announcements, ...newAnnouncements]);
            setLastVisible(newLastVisible);
            if (reset) setCurrentPage(1); // Reset page if reloading
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    }, [lastVisible, pageSize, announcements]);    
    

    const handleNextPage = async () => {
        if (lastVisible) {
            await loadAnnouncements();
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = async () => {
        if (currentPage > 1) {
            setLoading(true);
            setError('');
            try {
                const prevPage = currentPage - 2;
                const previousLastVisible = announcements.slice(prevPage * pageSize, (prevPage + 1) * pageSize);
                setAnnouncements(previousLastVisible); // Update announcements for the previous page
                setCurrentPage((prev) => prev - 1);
            } catch (err) {
                console.error('Error loading previous page:', err);
                setError('Failed to load the previous page.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await deleteAnnouncement(id);
                setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
            } catch (err) {
                console.error('Error deleting announcement:', err);
                setError('Failed to delete announcement.');
            }
        }
    };

    useEffect(() => {
        if (view === 'announcements') {
            loadAnnouncements(true);
        }
    }, [view, loadAnnouncements]);

    return (
        <div className="main-container">
            <div className="dashboard-cards">
                <div className={`card-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
                    <FontAwesomeIcon icon={faTh} className="icon" />
                    <span>DASHBOARD</span>
                </div>
                <div className={`card-item ${view === 'employees' ? 'active' : ''}`} onClick={() => setView('employees')}>
                    <FontAwesomeIcon icon={faUsers} className="icon" />
                    <span>EMPLOYEES</span>
                </div>
                <div className={`card-item ${view === 'positions' ? 'active' : ''}`} onClick={() => setView('positions')}>
                    <FontAwesomeIcon icon={faBriefcase} className="icon" />
                    <span>POSITIONS</span>
                </div>
                <div className={`card-item ${view === 'locations' ? 'active' : ''}`} onClick={() => setView('locations')}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                    <span>LOCATIONS</span>
                </div>
                <div className={`card-item ${view === 'announcements' ? 'active' : ''}`} onClick={() => setView('announcements')}>
                    <FontAwesomeIcon icon={faBullhorn} className="icon" />
                    <span>ANNOUNCEMENTS</span>
                </div>
                <div className={`card-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>
                    <FontAwesomeIcon icon={faCog} className="icon" />
                    <span>SETTINGS</span>
                </div>
            </div>

            {view === 'dashboard' && (
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
            )}

            {view === 'employees' && <EmployeeList />}

            {view === 'announcements' && (
                <div className="announcements-section">
                    <h2>Announcements</h2>
                    <AnnouncementForm onAnnouncementAdded={() => loadAnnouncements(true)} />

                    {error && <p className="error-message">{error}</p>}

                    {loading ? (
                        <p>Loading announcements...</p>
                    ) : announcements.length === 0 ? (
                        <p>No announcements yet.</p>
                    ) : (
                        <ul>
                            {announcements.map((announcement) => (
                                <li key={announcement.id} className="announcement-item">
                                    {editingAnnouncement && editingAnnouncement.id === announcement.id ? (
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    await updateAnnouncement(editingAnnouncement.id, {
                                                        title: editingAnnouncement.title,
                                                        content: editingAnnouncement.content,
                                                    });
                                                    setEditingAnnouncement(null);
                                                    loadAnnouncements(true);
                                                } catch (err) {
                                                    console.error('Error updating announcement:', err);
                                                    setError('Failed to update announcement.');
                                                }
                                            }}
                                        >
                                            <input
                                                type="text"
                                                value={editingAnnouncement.title}
                                                onChange={(e) =>
                                                    setEditingAnnouncement((prev) => ({
                                                        ...prev,
                                                        title: e.target.value,
                                                    }))
                                                }
                                            />
                                            <textarea
                                                value={editingAnnouncement.content}
                                                onChange={(e) =>
                                                    setEditingAnnouncement((prev) => ({
                                                        ...prev,
                                                        content: e.target.value,
                                                    }))
                                                }
                                            />
                                            <button type="submit">Save</button>
                                            <button type="button" onClick={() => setEditingAnnouncement(null)}>
                                                Cancel
                                            </button>
                                        </form>
                                    ) : (
                                        <>
                                            <h3>{announcement.title}</h3>
                                            <p>{announcement.content}</p>
                                            <div>
                                                <button onClick={() => handleEdit(announcement)}>Edit</button>
                                                <button onClick={() => handleDelete(announcement.id)}>Delete</button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="pagination-controls">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1 || loading}>
                            Previous
                        </button>
                        <span>Page {currentPage}</span>
                        <button onClick={handleNextPage} disabled={!lastVisible || loading}>
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

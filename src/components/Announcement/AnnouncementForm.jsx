import React, { useState } from 'react';
import { addAnnouncement } from '../services/announcementService';
import './AnnouncementForm.css';

const AnnouncementForm = ({ onAnnouncementAdded }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Input Validation
        if (!title.trim() || !content.trim()) {
            setError('Both fields are required.');
            setSuccess('');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Add announcement
            await addAnnouncement({
                title: title.trim(),
                content: content.trim(),
                createdBy: 'Admin', // Example static createdBy field, replace with dynamic user if needed
                timestamp: new Date().toISOString(),
            });

            // Reset form and show success message
            setTitle('');
            setContent('');
            setSuccess('Announcement added successfully!');
            if (onAnnouncementAdded) onAnnouncementAdded();
        } catch (err) {
            console.error('Error adding announcement:', err);
            setError('Failed to add announcement. Please try again.');
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="announcement-form">
            <h3>Add Announcement</h3>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                        placeholder="Enter announcement title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={loading}
                        placeholder="Enter announcement content"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Announcement'}
                </button>
            </form>
        </div>
    );
};

export default AnnouncementForm;

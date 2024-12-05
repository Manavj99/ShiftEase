import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostSignUpScreen.css';

const PostSignUpScreen = () => {
    const navigate = useNavigate();

    const handleCreateAccountClick = () => {
        navigate('/create-account');
    };

    const handleJoinTeamClick = () => {
        navigate('/join-team'); // Navigate to the Join Team page
    };

    return (
        <div className="post-signup-container">
            <div className="post-signup-content">
                <div className="welcome-message">
                    <div className="welcome-title">Hello there!</div>
                    <div className="welcome-subtitle">What are you here to do today?</div>
                </div>
                <div className="option-container">
                    <div className="option-box" onClick={handleJoinTeamClick}>
                        <div className="option-description">I want to find my team and see my schedule.</div>
                        <div className="option-title">Join my coworkers on Shift Ease</div>
                    </div>
                </div>
                <div className="option-container">
                    <div className="option-box" onClick={handleCreateAccountClick}>
                        <div className="option-description">I want to see if Shift Ease is right for my business.</div>
                        <div className="option-title">Create a new Shift Ease account</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostSignUpScreen;
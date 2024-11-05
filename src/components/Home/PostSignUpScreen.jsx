import React from 'react';

const PostSignUpScreen = () => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#F2F5F7' }}>
            <div style={{ width: 625, height: 383, left: 984, top: 367, position: 'absolute' }}>
                <div style={{ width: 457, height: 86, left: 2, top: 0, position: 'absolute' }}>
                    <div style={{ color: '#2051E5', fontSize: 40, fontFamily: 'SF Pro Display', fontWeight: '600', wordWrap: 'break-word' }}>
                        Hello there!
                    </div>
                    <div style={{ color: '#6C6C6C', fontSize: 20, fontFamily: 'SF Pro Display', fontWeight: '400', wordWrap: 'break-word', marginTop: 15 }}>
                        What are you here to do today?
                    </div>
                </div>
                <div style={{ width: 625, height: 100, left: 0, top: 151, position: 'absolute' }}>
                    <div style={{ background: 'white', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.10)', borderRadius: 5, border: '1px #DCDCDC solid', padding: 20 }}>
                        <div style={{ color: '#6C6C6C', fontSize: 16, fontFamily: 'SF Pro Display', fontWeight: '400', wordWrap: 'break-word' }}>
                            I want to find my team and see my schedule.
                        </div>
                        <div style={{ color: '#353535', fontSize: 20, fontFamily: 'SF Pro Display', fontWeight: '600', wordWrap: 'break-word' }}>
                            Join my coworkers on Shift Ease
                        </div>
                    </div>
                </div>
                <div style={{ width: 625, height: 100, left: 0, top: 283, position: 'absolute' }}>
                    <div style={{ background: 'white', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.10)', borderRadius: 5, border: '1px #DCDCDC solid', padding: 20 }}>
                        <div style={{ color: '#6C6C6C', fontSize: 16, fontFamily: 'SF Pro Display', fontWeight: '400', wordWrap: 'break-word' }}>
                            I want to see if Shift Ease is right for my business.
                        </div>
                        <div style={{ color: '#353535', fontSize: 20, fontFamily: 'SF Pro Display', fontWeight: '600', wordWrap: 'break-word' }}>
                            Create a new Shift Ease account
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostSignUpScreen;
// client/src/components/Home/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Components from './StyledComponents';
import { auth, db } from '../services/firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Home = () => {
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);
    const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" });
    const [signInData, setSignInData] = useState({ email: "", password: "" });

    const handleSignUpChange = (e) => {
        const { value, name } = e.target;
        setSignUpData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignInChange = (e) => {
        const { value, name } = e.target;
        setSignInData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { name, email, password } = signUpData;

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await db.collection('users').doc(result.user.uid).set({
                name,
                email,
                role: 'employee'
            });
            toast.success('Account created successfully');
            setIsSignIn(true);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        const { email, password } = signInData;
    
        try {
            await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem("user_login", true); // Store login state
            toast.success('Logged in successfully');
            navigate("/adduser");
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            localStorage.setItem("user_login", true); // Store login state
            toast.success('Logged in with Google successfully');
            navigate("/adduser");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Components.Container>
            
            <Components.SignInContainer sig={isSignIn}>
                <Components.Form onSubmit={handleSignIn}>
                    <Components.Title>Sign In</Components.Title>
                    <Components.Input type='email' name="email" placeholder='Email' onChange={handleSignInChange} required />
                    <Components.Input type='password' name='password' placeholder='Password' onChange={handleSignInChange} required />
                    <Components.GoogleButton onClick={handleGoogleSignIn}>
                Sign in with Google
            </Components.GoogleButton>
                    <Components.Button type="submit">Sign In</Components.Button>
                </Components.Form>
            </Components.SignInContainer>

            <Components.SignUpContainer sig={isSignIn}>
                <Components.Form onSubmit={handleSignUp}>
                    <Components.Title>Create Account</Components.Title>
                    <Components.Input type='text' name='name' placeholder='Name' onChange={handleSignUpChange} required />
                    <Components.Input type='email' name='email' placeholder='Email' onChange={handleSignUpChange} required />
                    <Components.Input type='password' name='password' placeholder='Password' onChange={handleSignUpChange} required />
                    <Components.GoogleButton onClick={handleGoogleSignIn}>
                Sign in with Google
            </Components.GoogleButton>
                    <Components.Button type="submit">Sign Up</Components.Button>
                </Components.Form>
            </Components.SignUpContainer>

            <Components.OverlayContainer sig={isSignIn}>
                <Components.Overlay sig={isSignIn}>
                    <Components.LeftOverlayPanel sig={isSignIn}>
                        <Components.Title>Welcome Back!</Components.Title>
                       
                        <Components.GhostButton onClick={() => setIsSignIn(true)}>Sign In</Components.GhostButton>
                    </Components.LeftOverlayPanel>

                    <Components.RightOverlayPanel sig={isSignIn}>
                        <Components.Title>Hello, Friend!</Components.Title>
                        
                        <Components.GhostButton onClick={() => setIsSignIn(false)}>Sign Up</Components.GhostButton>
                    </Components.RightOverlayPanel>
                </Components.Overlay>
            </Components.OverlayContainer>
        </Components.Container>
    );
};

export default Home;
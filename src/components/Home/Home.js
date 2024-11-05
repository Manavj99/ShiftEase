// src/components/Home/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Components from './StyledComponents';
import { auth, db } from '../services/firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const Home = () => {
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);
    const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "", confirmPassword: "", role:"" });
    const [signInData, setSignInData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignInChange = (e) => {
        const { name, value } = e.target;
        setSignInData(prev => ({ ...prev, [name]: value }));
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, role } = signUpData;
    
        // Validation checks
        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
    
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
    
        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long");
            return;
        }
    
        setLoading(true);
        setErrorMessage("");
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User created:", user);
            await updateProfile(user, { displayName: name });
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                role
            });
            localStorage.setItem("user_login", true);
            navigate("/adduser");
        } catch (error) {
            console.error("Sign-up error:", error);
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage("This email is already in use. Please use a different email.");
            } else {
                setErrorMessage("Error: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        const { email, password } = signInData;

        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem("user_login", true);
            navigate("/dashboard");
            
        } catch (error) {
            console.error("Sign-in error:", error);
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            localStorage.setItem("user_login", true);
            navigate("/adduser");
        } catch (error) {
            console.error("Google sign-in error:", error);
            setErrorMessage("Error logging in with Google: " + error.message);
        }
    };

    const handleAuthError = (error) => {
        console.error("Handling error:", error);
        if (error && error.code) {
            switch (error.code) {
                case 'auth/invalid-email':
                    setErrorMessage("The email address is not valid.");
                    break;
                case 'auth/user-not-found':
                    setErrorMessage("No user found with this email. Please sign up.");
                    break;
                case 'auth/wrong-password':
                    setErrorMessage("Incorrect password. Please try again.");
                    break;
                default:
                    setErrorMessage("Error: " + error.message);
                    break;
            }
        } else {
            setErrorMessage("An unknown error occurred. Please try again.");
        }
    };

    return (
        <Components.Container>
          
            <Components.SignInContainer sig={isSignIn}>
            
                <Components.Form onSubmit={handleSignIn}>
                    <Components.Title>Sign In</Components.Title>
                    <Components.Input 
                        type='email' 
                        name="email" 
                        placeholder='Email' 
                        onChange={handleSignInChange} 
                        required 
                    />
                    <Components.Input 
                        type={showPassword ? 'text' : 'password'} 
                        name='password' 
                        placeholder='Password' 
                        onChange={handleSignInChange} 
                        required 
                    />
                    <Components.ShowPasswordButton type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"} Password
                    </Components.ShowPasswordButton>
                    {errorMessage && <Components.ErrorMessage>{errorMessage}</Components.ErrorMessage>}
                    <Components.GoogleButton onClick={handleGoogleSignIn}>
                        Sign in with Google
                    </Components.GoogleButton>
                    <Components.Button type="submit" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </Components.Button>
                </Components.Form>
            </Components.SignInContainer>

            <Components.SignUpContainer sig={isSignIn}>
           
                <Components.Form onSubmit={handleSignUp}>
                    <Components.Title>Create Account</Components.Title>
                    <Components.Input 
                        type='text' 
                        name='name' 
                        placeholder='Name' 
                        onChange={handleSignUpChange} 
                        required 
                    />
                    <Components.Input 
                        type='email' 
                        name='email' 
                        placeholder='Email' 
                        onChange={handleSignUpChange} 
                        required 
                    />
                    <Components.Input 
                        type={showPassword ? 'text' : 'password'} 
                        name='password' 
                        placeholder='Password' 
                        onChange={handleSignUpChange} 
                        required 
                    />
                    <Components.Input 
                        type={showPassword ? 'text' : 'password'} 
                        name='confirmPassword' 
                        placeholder='Confirm Password' 
                        onChange={handleSignUpChange} 
                        required 
                    />
                    <Components.ShowPasswordButton type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"} Password
                    </Components.ShowPasswordButton>
                   <Components.RoleContainer>
                        <Components.RoleLabel>Role:</Components.RoleLabel>
                        <Components.RoleSelect name="role" onChange={handleSignUpChange} required>
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                        </Components.RoleSelect>
                    </Components.RoleContainer>
                    
                    {errorMessage && <Components.ErrorMessage>{errorMessage}</Components.ErrorMessage>}
                    <Components.GoogleButton onClick={handleGoogleSignIn}>
                        Sign in with Google
                    </Components.GoogleButton>
                    <Components.Button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Components.Button>
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
import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import * as Components from './components';
import { toast } from 'react-toastify';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await firestore.collection('users').doc(result.user.uid).set({
          email: email,
          role: 'employee'
        });
        toast.success('Account created successfully!');
      } else {
        await auth.signInWithEmailAndPassword(email, password);
        toast.success('Signed in successfully!');
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
  };

  return (
    <Components.Container>
      <Components.SignUpContainer sig={!isSignUp}>
        <Components.Form onSubmit={handleAuth}>
          <Components.Title>{isSignUp ? 'Create Account' : 'Sign In'}</Components.Title>
          <Components.Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Components.Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Components.Button type="submit">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.OverlayContainer sig={!isSignUp}>
        <Components.Overlay sig={!isSignUp}>
          <Components.LeftOverlayPanel sig={!isSignUp}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              To keep connected with us please login with your personal info
            </Components.Paragraph>
            <Components.GhostButton onClick={toggleMode}>
              Sign In
            </Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel sig={!isSignUp}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph>
              Enter your personal details and start journey with us
            </Components.Paragraph>
            <Components.GhostButton onClick={toggleMode}>
              Sign Up
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default Auth;
import styled from 'styled-components';

export const RoleSelect = styled.select`
  margin: 12px 0;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #b0d6f1;
  border-radius: 8px;
  width: 100%;
  background-color: #f0f9ff;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #5ba1d6;
  }
`;

export const RoleContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0;
`;

export const RoleLabel = styled.label`
  margin-right: 12px;
  font-size: 14px;
  color: #4a6fa1;
`;

export const ShowPasswordButton = styled.button`
  border-radius: 20px;
  border: 1px solid #5ba1d6;
  background-color: transparent;
  color: #5ba1d6;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #5ba1d6;
    color: white;
  }

  &:focus {
    outline: none;
  }
`;

export const ErrorMessage = styled.div`
  color: #d9534f;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
  font-size: 12px;
`;

export const GoogleButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 45px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357ae8;
  }

  &:focus {
    outline: none;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #003366, #5ba1d6); /* Dark blue to light blue gradient */
  border-radius: 50px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  width: 700px;
  max-width: 100%;
  min-height: 550px;
`;

export const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props => props.sig !== true && `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  `}
`;

export const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${props => props.sig !== true && `transform: translateX(100%);`}
`;

export const Form = styled.form`
  background-color: #f0f9ff; /* Light blue background */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px;
  height: 100%;
  text-align: center;
  gap: 10px;
`;

export const Title = styled.h1`
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #003366; /* Dark blue text */
  font-size: 22px;
`;

export const Input = styled.input`
  background-color: #f0f9ff;
  border: 1px solid #b0d6f1;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  border-radius: 5px;
  font-size: 12px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #5ba1d6;
  }
`;

export const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #003366; /* Dark blue border */
  background-color: #003366; /* Dark blue background */
  color: #ffffff; /* White text */
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in, background-color 0.3s;

  &:active {
    transform: scale(0.95);
  }

  &:hover {
    background-color: #5ba1d6; /* Light blue on hover */
  }

  &:focus {
    outline: none;
  }
`;

export const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
  color: #ffffff;

  &:hover {
    background-color: #ffffff;
    color: #003366; /* Dark blue text on hover */
  }
`;

export const Anchor = styled.a`
  color: #4a6fa1;
  font-size: 12px;
  text-decoration: none;
  margin: 15px 0;

  &:hover {
    text-decoration: underline;
  }
`;

export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${props => props.sig !== true && `transform: translateX(-100%);`}
`;

export const Overlay = styled.div`
  background: linear-gradient(to right, #003366, #5ba1d6); /* Dark blue to light blue gradient */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${props => props.sig !== true && `transform: translateX(50%);`}
`;

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

export const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${props => props.sig !== true && `transform: translateX(0);`}
`;

export const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${props => props.sig !== true && `transform: translateX(20%);`}
`;

export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
  color: #4a6fa1;
`;


import styled from 'styled-components';


export const RoleSelect = styled.select`
    margin: 10px 0;
    font-size: 12px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;
export const RoleContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;
`;

export const RoleLabel = styled.label`
    margin-right: 10px;
    font-size: 14px;
`;

export const ShowPasswordButton = styled.button`
    border-radius: 20px;
    border: 1px solid #007bff;
    background-color: transparent;
    color: #007bff;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 12px;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        background-color: #007bff;
        color: white;
    }

    &:focus {
        outline: none;
    }
`;
export const ErrorMessage = styled.div`
    color: red;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
    font-size: 12px;
`;


export const GoogleButton = styled.button`
    background-color: #4285F4;
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
    background-color: #fff;
    border-radius: 50px;
    left: 25%;
    top: 50%;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: relative;
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
    ${props => props.sig !== true ? `
        transform: translateX(100%);
        opacity: 1;
        z-index: 5;
    ` : null}
`;

export const SignInContainer = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    left: 0;
    width: 50%;
    z-index: 2;
    ${props => (props.sig !== true ? `transform: translateX(100%);` : null)}
`;

export const Form = styled.form`
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 40px; /* Increased padding for better spacing */
    height: 100%;
    text-align: center;
`;

export const Title = styled.h1`
    font-weight: bold;
    margin: 0;
    color: #333; /* Darker text for better readability */
    font-size: 22px; /* Increased font size by 1px */
`;

export const Input = styled.input`
    background-color: #eee;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
    border-radius: 5px;
    font-size: 12px;
`;

export const Button = styled.button`
    border-radius: 20px;
    border: 1px solid #ff4b2b;
    background-color: #ff4b2b;
    color: #ffffff;
    font-size: 10px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    &:active {
        transform: scale(0.95);
    }
    &:focus {
        outline: none;
    }
`;

export const GhostButton = styled(Button)`
    background-color: transparent;
    border-color: #ffffff;
`;

export const Anchor = styled.a`
    color: #333;
    font-size: 12px;
    text-decoration: none;
    margin: 15px 0;
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
    ${props => props.sig !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div`
    background: #ff416c;
    background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c);
    background: linear-gradient(to right, #ff4b2b, #ff416c);
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
    ${props => (props.sig !== true ? `transform: translateX(50%);` : null)}
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
    ${props => props.sig !== true ? `transform: translateX(0);` : null}
`;

export const RightOverlayPanel = styled(OverlayPanel)`
    right: 0;
    transform: translateX(0);
    ${props => props.sig !== true ? `transform: translateX(20%);` : null}
`;

export const Paragraph = styled.p`
    font-size: 10px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
`;
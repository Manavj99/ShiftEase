import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock child components
jest.mock('./components/Navbar/Navbar', () => () => <div data-testid="mock-navbar">Navbar</div>);
jest.mock('./components/Dashboard/Dashboard', () => () => <div data-testid="mock-dashboard">Dashboard</div>);
jest.mock('./components/Footer/Footer', () => () => <div data-testid="mock-footer">Footer</div>);

test('renders App component with main structure', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  

  expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
  
  expect(screen.getByRole('main')).toBeInTheDocument();
  
  expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument();
  
  expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
});

test('renders ShiftEase title', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  const titleElement = screen.getByText(/ShiftEase/i);
  expect(titleElement).toBeInTheDocument();
});
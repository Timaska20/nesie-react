// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage.jsx';
import { CreditProvider } from './context/CreditContext';

function App() {
  return (
    <CreditProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </CreditProvider>
  );
}

export default App;

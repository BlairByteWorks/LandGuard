import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import LandingPage from './pages/LandingPage';
import LoginRegisterPage from './pages/LoginRegisterPage';
import PropertyTrustReportPage from './pages/PropertyTrustReportPage';
import SellerUploadDeedPage from './pages/SellerUploadDeedPage';
import RegistrarVerificationPage from './pages/RegistrarVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HelpCenterPage from './pages/HelpCenterPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route path="/report" element={<PropertyTrustReportPage />} />
        <Route path="/seller-upload" element={<SellerUploadDeedPage />} />
        <Route path="/registrar-verify" element={<RegistrarVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
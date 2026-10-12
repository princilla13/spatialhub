import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlansPage from './pages/PlansPage';
import TermsPage from './pages/TermsPage';
import ReportAbusePage from './pages/ReportAbusePage';
import HubPage from './pages/HubPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/terms-of-service" element={<TermsPage />} />
      <Route path="/report-abuse" element={<ReportAbusePage />} />
      <Route path="/hub" element={<HubPage />} />
      <Route path="/dashboard" element={<Navigate to="/hub" replace />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

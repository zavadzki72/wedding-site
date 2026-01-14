import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ManageLayout from './pages/manage/ManageLayout';
import ManagePage from './pages/manage/ManagePage';
import GuestReplyPage from './pages/GuestReplyPage';
import GuestsPage from './pages/manage/GuestsPage';
import ManageGifts from './pages/manage/ManageGifts';
import GiftsPage from './pages/GiftsPage';
import SelectionPage from './pages/SelectionPage';
import PaymentStatusPage from './pages/PaymentStatusPage';

import './App.css';
import './styles/GiftsPage.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/gifts" element={<GiftsPage />} />
        <Route path="/selection" element={<SelectionPage />} />
        <Route path="/payment-status" element={<PaymentStatusPage />} />

        <Route path="/guest-invite/:inviteId" element={<GuestReplyPage />} />

        <Route
          path="/manage"
          element={
            <ProtectedRoute>
              <ManageLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagePage />} /> 
          <Route path="invites" element={<ManagePage />} />
          <Route path="guests" element={<GuestsPage />} />
          <Route path="gifts" element={<ManageGifts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CityModal from './components/CityModal';
import AuthModal from './components/AuthModal';

// Pages
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatBooking from './pages/SeatBooking';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmation from './pages/BookingConfirmation';
import ProfileBookings from './pages/ProfileBookings';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <BrowserRouter>
      <AuthProvider>
        <CityProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar onSearchChange={(q) => setGlobalSearch(q)} />
            
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home globalSearch={globalSearch} />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/book/:showId" element={<SeatBooking />} />
                <Route path="/checkout" element={<PaymentPage />} />
                <Route path="/confirmation/:bookingId" element={<BookingConfirmation />} />
                <Route path="/bookings" element={<ProfileBookings />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>

            <Footer />

            {/* Global Modals */}
            <CityModal />
            <AuthModal />
          </div>
        </CityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

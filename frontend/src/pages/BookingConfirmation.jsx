import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  Share2,
  ArrowRight,
  Film,
  Ticket
} from 'lucide-react';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const location = useLocation();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (!booking) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${bookingId}`);
      if (res.data.success) {
        setBooking(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div>Generating digital e-ticket...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h3>Booking Not Found</h3>
        <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem', maxWidth: '780px' }}>
      
      {/* Success Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 0 24px rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle2 size={36} />
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '0.4rem' }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Your digital ticket has been issued. An SMS & email receipt has been sent to your registered account.
        </p>
      </div>

      {/* The Printable Digital E-Ticket (District & BMS Style) */}
      <div
        id="printable-ticket"
        className="glass-panel"
        style={{
          background: 'linear-gradient(145deg, #131824 0%, #0d111a 100%)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-lg), 0 0 40px rgba(0, 0, 0, 0.6)',
          marginBottom: '2rem'
        }}
      >
        {/* Ticket Header */}
        <div style={{
          background: 'var(--brand-gradient)',
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Film size={22} />
            <span style={{ fontWeight: 900, letterSpacing: '0.05em', fontSize: '1.15rem' }}>IMOVIES ADMISSION PASS</span>
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.05em'
          }}>
            {booking.bookingId}
          </div>
        </div>

        {/* Ticket Body */}
        <div style={{ padding: '2rem' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            
            {/* Movie Poster */}
            <div style={{ width: '130px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--shadow-md)' }}>
              <img
                src={booking.showDetails?.poster}
                alt={booking.showDetails?.movieTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Movie & Show Info */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>
                {booking.showDetails?.movieTitle}
              </h2>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge-brand">{booking.showDetails?.format}</span>
                <span className="badge-outline">{booking.showDetails?.language}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <MapPin size={16} color="var(--brand-primary)" />
                  <strong>{booking.showDetails?.theatreName}</strong> ({booking.showDetails?.screenName})
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <Calendar size={16} color="var(--text-dim)" />
                  <span>{booking.showDetails?.showDate}</span>
                  <span style={{ margin: '0 0.2rem' }}>•</span>
                  <Clock size={16} color="var(--text-dim)" />
                  <span style={{ color: '#fff', fontWeight: 700 }}>{booking.showDetails?.showTime}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Seat Numbers Highlight (Large BMS Style) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SEATS ASSIGNED
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--brand-crimson)' }}>
                {booking.seats?.map(s => s.seatId).join(', ')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {booking.seats?.length} {booking.seats?.length === 1 ? 'Ticket' : 'Tickets'} ({booking.seats?.[0]?.tier?.toUpperCase()} TIER)
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AMOUNT PAID
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fff' }}>
                ₹{booking.totalAmount}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                Transaction ID: {booking.paymentId}
              </div>
            </div>
          </div>

          {/* Barcode & Simulated QR Code */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px dashed var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: '#fff',
                padding: '8px',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                {/* SVG QR Code Simulation */}
                <svg width="68" height="68" viewBox="0 0 24 24" fill="#000">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm0-4h2v2h-2v-2zm-8-6h2v2h-2v-2zm2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm-4-4h2v2h-2v-2zm8 0h2v2h-2v-2z"/>
                </svg>
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Scan at Cinema Entry</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Show this digital QR code to usher</div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Booking Reference: <strong>{booking.bookingId}</strong><br />
              Issued on: {new Date(booking.createdAt).toLocaleDateString()}
            </div>
          </div>

        </div>
      </div>

      {/* Ticket Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        <button
          onClick={handlePrint}
          className="btn-secondary"
          style={{ padding: '0.75rem 1.75rem' }}
        >
          <Download size={18} /> Print / Save E-Ticket
        </button>

        <Link
          to="/bookings"
          className="btn-primary"
          style={{ padding: '0.75rem 1.75rem' }}
        >
          View in Booking History <ArrowRight size={18} />
        </Link>
      </div>

    </div>
  );
}

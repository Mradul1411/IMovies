import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  User,
  Shield,
  ChevronRight
} from 'lucide-react';

export default function ProfileBookings() {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('Change of plans');
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setUpcomingBookings(res.data.upcoming || []);
        setPastBookings(res.data.past || []);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      const res = await api.post(`/bookings/${cancelModalBooking._id}/cancel`, {
        reason: cancellationReason
      });
      if (res.data.success) {
        setMessage(res.data.message);
        setCancelModalBooking(null);
        fetchBookings(); // refresh
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setCancelling(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <User size={48} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ marginBottom: '0.5rem' }}>Please Sign In</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Sign in to view your tickets and booking history.
        </p>
        <button onClick={() => openAuthModal('login')} className="btn-primary">
          Sign In Now
        </button>
      </div>
    );
  }

  const currentList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem', maxWidth: '900px' }}>
      
      {/* User Header Profile Card */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-strong)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user.name}</h2>
              {user.role === 'admin' && (
                <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  ADMIN
                </span>
              )}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.email} • {user.city}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
              {upcomingBookings.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Upcoming</div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              {pastBookings.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Completed</div>
          </div>
        </div>
      </div>

      {message && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Tabs Switch */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'upcoming' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'upcoming' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          Upcoming Bookings ({upcomingBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          style={{
            padding: '0.75rem 1.5rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'past' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'past' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          Past / Cancelled ({pastBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading your tickets...
        </div>
      ) : currentList.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Ticket size={48} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            No {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Tickets
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Explore trending movies and book tickets with real-time seat tracking.
          </p>
          <Link to="/" className="btn-primary">Browse Blockbusters</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {currentList.map((b) => {
            const isCancelled = b.status === 'cancelled';

            return (
              <div
                key={b._id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  alignItems: 'center',
                  opacity: isCancelled ? 0.75 : 1
                }}
              >
                {/* Movie Poster */}
                <img
                  src={b.showDetails?.poster}
                  alt={b.showDetails?.movieTitle}
                  style={{ width: '80px', height: '110px', borderRadius: '8px', objectFit: 'cover' }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{b.showDetails?.movieTitle}</h3>
                    <span className="badge-outline">{b.showDetails?.format}</span>
                    {isCancelled ? (
                      <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        CANCELLED
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        CONFIRMED
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    {b.showDetails?.theatreName} ({b.showDetails?.screenName})
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    <span>📅 {b.showDetails?.showDate}</span>
                    <span>⏰ {b.showDetails?.showTime}</span>
                  </div>

                  <div style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Seats: </span>
                    <strong style={{ color: 'var(--brand-crimson)' }}>
                      {b.seats?.map(s => s.seatId).join(', ')}
                    </strong>
                    <span style={{ color: 'var(--text-dim)', marginLeft: '1rem' }}>Total: </span>
                    <strong style={{ color: '#fff' }}>₹{b.totalAmount}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                  <Link
                    to={`/confirmation/${b.bookingId}`}
                    state={{ booking: b }}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.5rem 0.8rem', width: '100%' }}
                  >
                    View E-Ticket
                  </Link>

                  {!isCancelled && activeTab === 'upcoming' && (
                    <button
                      onClick={() => setCancelModalBooking(b)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        fontSize: '0.8rem',
                        padding: '0.5rem 0.8rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        width: '100%',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel Ticket
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalBooking && (
        <div className="modal-backdrop" onClick={() => setCancelModalBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Ticket Cancellation</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ref: {cancelModalBooking.bookingId}</p>
              </div>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              Are you sure you want to cancel your booking for <strong>{cancelModalBooking.showDetails?.movieTitle}</strong> on {cancelModalBooking.showDetails?.showDate}?
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span>Subtotal Paid:</span>
                <span>₹{cancelModalBooking.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 700, paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Refund Amount:</span>
                <span>₹{cancelModalBooking.subtotal}</span>
              </div>
            </div>

            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Reason for Cancellation
            </label>
            <select
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              style={{
                width: '100%',
                background: '#161c2a',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem',
                color: '#fff',
                marginBottom: '1.5rem'
              }}
            >
              <option value="Change of plans">Change of plans</option>
              <option value="Booked wrong date/showtime">Booked wrong date/showtime</option>
              <option value="Duplicate booking">Duplicate booking</option>
              <option value="Personal emergency">Personal emergency</option>
            </select>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setCancelModalBooking(null)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={cancelling}
                style={{
                  flex: 1,
                  background: 'var(--brand-primary)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  padding: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {cancelling ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

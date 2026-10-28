import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import FoodBeverageModal from '../components/FoodBeverageModal';
import {
  ChevronLeft,
  Clock,
  Info,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Armchair
} from 'lucide-react';

export default function SeatBooking() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const socket = getSocket();

  const [show, setShow] = useState(null);
  const [layout, setLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSnacksModalOpen, setIsSnacksModalOpen] = useState(false);

  // 10 minute countdown timer (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    fetchShowDetails();

    // Socket.io room join
    socket.emit('join_show', { showId });

    // Real-time seat lock listener
    socket.on('seats_locked', ({ seatIds }) => {
      setLayout(prevLayout =>
        prevLayout.map(row => ({
          ...row,
          seats: row.seats.map(seat =>
            seatIds.includes(seat.seatId) ? { ...seat, status: 'locked' } : seat
          )
        }))
      );
    });

    // Real-time seat unlock listener
    socket.on('seats_unlocked', ({ seatIds }) => {
      setLayout(prevLayout =>
        prevLayout.map(row => ({
          ...row,
          seats: row.seats.map(seat =>
            seatIds.includes(seat.seatId) ? { ...seat, status: 'available' } : seat
          )
        }))
      );
    });

    // Real-time seats confirmed booked
    socket.on('seats_confirmed_booked', ({ seatIds }) => {
      setLayout(prevLayout =>
        prevLayout.map(row => ({
          ...row,
          seats: row.seats.map(seat =>
            seatIds.includes(seat.seatId) ? { ...seat, status: 'booked' } : seat
          )
        }))
      );
    });

    return () => {
      socket.emit('leave_show', { showId });
      socket.off('seats_locked');
      socket.off('seats_unlocked');
      socket.off('seats_confirmed_booked');
    };
  }, [showId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchShowDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/shows/${showId}`);
      if (res.data.success) {
        setShow(res.data.data);
        setLayout(res.data.data.layout);
      }
    } catch (err) {
      setError('Unable to load seat layout.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeatSelection = (seat) => {
    if (seat.status === 'booked' || seat.status === 'locked') return;

    const isAlreadySelected = selectedSeats.some(s => s.seatId === seat.seatId);

    if (isAlreadySelected) {
      const updated = selectedSeats.filter(s => s.seatId !== seat.seatId);
      setSelectedSeats(updated);
      socket.emit('unlock_seats', { showId, seatIds: [seat.seatId] });
    } else {
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats at a time.');
        return;
      }
      const price = show.pricing[seat.tier] || 250;
      const updated = [...selectedSeats, { ...seat, price }];
      setSelectedSeats(updated);
      socket.emit('lock_seats', { showId, seatIds: [seat.seatId], userId: user?.id });
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalSeatsPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  const handleProceedClick = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    // Open snacks modal
    setIsSnacksModalOpen(true);
  };

  const handleSnacksConfirm = (snacksList) => {
    setIsSnacksModalOpen(false);
    // Navigate to payment page with show, selectedSeats, snacks
    navigate(`/checkout`, {
      state: {
        showId,
        show,
        selectedSeats,
        snacks: snacksList
      }
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading real-time seating map...</div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h3>Error loading show details</h3>
        <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '7rem' }}>
      
      {/* Top Header Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem 0'
      }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '0.4rem' }}>
              <ChevronLeft size={22} />
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{show.movie?.title}</h2>
                <span className="badge-outline">{show.movie?.certificate}</span>
                <span className="badge-brand" style={{ fontSize: '0.7rem' }}>{show.format}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {show.theatre?.name} • {show.screenName} | <strong style={{ color: '#fff' }}>{show.showDate}</strong> at <strong style={{ color: '#fff' }}>{show.showTime}</strong>
              </div>
            </div>
          </div>

          {/* 10-Minute Lock Countdown Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '0.45rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            color: '#f87171',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            <Clock size={16} />
            <span>Time Left: {formatTimer(timeLeft)}</span>
          </div>

        </div>
      </div>

      {/* Main Seat Map Layout */}
      <div className="container" style={{ paddingTop: '2.5rem' }}>

        {/* Seat Matrix */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          overflowX: 'auto',
          padding: '0.5rem 0'
        }}>
          {layout.map((rowGroup) => {
            const price = show.pricing[rowGroup.priceKey] || 250;

            return (
              <div key={rowGroup.row} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                
                {/* Row Tier Label (District style) */}
                {(rowGroup.row === 'H' || rowGroup.row === 'F' || rowGroup.row === 'B') && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    marginTop: rowGroup.row !== 'H' ? '0.75rem' : '0',
                    color: rowGroup.tier === 'vip' ? '#c084fc' : rowGroup.tier === 'prime' ? '#60a5fa' : '#34d399',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <Armchair size={15} />
                    <span>{rowGroup.tierName} — ₹{price}</span>
                  </div>
                )}

                {/* Seats in row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: '24px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--text-dim)',
                    textAlign: 'center'
                  }}>
                    {rowGroup.row}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {rowGroup.seats.map((seat, seatIdx) => {
                      const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
                      const isAisle = (seatIdx === 4 || seatIdx === 8); // aisle gap

                      let seatClass = 'seat-button ';
                      if (isSelected) {
                        seatClass += 'seat-selected';
                      } else if (seat.status === 'booked') {
                        seatClass += 'seat-booked';
                      } else if (seat.status === 'locked') {
                        seatClass += 'seat-locked';
                      } else {
                        seatClass += `seat-available-${seat.tier}`;
                      }

                      return (
                        <React.Fragment key={seat.seatId}>
                          {isAisle && <div style={{ width: '24px' }} />}
                          <button
                            onClick={() => toggleSeatSelection(seat)}
                            disabled={seat.status === 'booked' || (seat.status === 'locked' && !isSelected)}
                            className={seatClass}
                            title={`${seat.seatId} (${seat.tier.toUpperCase()}) - ₹${price}`}
                          >
                            {seat.number}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <span style={{
                    width: '24px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--text-dim)',
                    textAlign: 'center'
                  }}>
                    {rowGroup.row}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Curved Screen Visualization at Front / Bottom of Auditorium */}
        <div className="cinema-screen-container">
          <div className="cinema-screen-label">
            <Sparkles size={14} color="var(--brand-primary)" />
            All eyes this way please! Screen here
            <Sparkles size={14} color="var(--brand-primary)" />
          </div>
          <div className="cinema-screen-beam" />
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          margin: '3rem auto 1rem',
          padding: '1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '650px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="seat-button seat-available-classic" style={{ width: '22px', height: '20px', margin: 0 }}>✓</div>
            <span>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="seat-button seat-selected" style={{ width: '22px', height: '20px', margin: 0 }}>✓</div>
            <span>Selected ({selectedSeats.length})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="seat-button seat-locked" style={{ width: '22px', height: '20px', margin: 0 }}>⏳</div>
            <span>Locked (Live Hold)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="seat-button seat-booked" style={{ width: '22px', height: '20px', margin: 0 }}>✕</div>
            <span>Sold Out</span>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Summary Bar */}
      {selectedSeats.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(16, 20, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-strong)',
          padding: '1rem 0',
          zIndex: 900,
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.7)'
        }}>
          <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Selected ({selectedSeats.length} Seats):
                </span>
                <span style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
                  {selectedSeats.map(s => s.seatId).join(', ')}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Base Price (Taxes & fees calculated at checkout)
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Subtotal</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>₹{totalSeatsPrice}</div>
              </div>

              <button
                onClick={handleProceedClick}
                className="btn-primary"
                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
              >
                Proceed <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Food & Beverage Modal */}
      <FoodBeverageModal
        isOpen={isSnacksModalOpen}
        onClose={() => setIsSnacksModalOpen(false)}
        onConfirm={handleSnacksConfirm}
      />

    </div>
  );
}

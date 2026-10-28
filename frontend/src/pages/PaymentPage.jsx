import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { getSocket } from '../services/socket';
import {
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Lock,
  ArrowLeft,
  Film,
  Ticket
} from 'lucide-react';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = getSocket();

  const { showId, show, selectedSeats, snacks = [] } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING'
  const [upiId, setUpiId] = useState('alex@okhdfcbank');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8892',
    name: 'Alex Johnson',
    expiry: '08/28',
    cvv: '342'
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!show || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h3>No booking session active</h3>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Please select a movie and seats first.</p>
        <Link to="/" className="btn-primary">Browse Movies</Link>
      </div>
    );
  }

  // Financial calculations
  const seatsTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const snacksTotal = snacks.reduce((acc, s) => acc + (s.price * s.quantity), 0);
  const subtotal = seatsTotal + snacksTotal;
  const convenienceFee = Math.round(selectedSeats.length * 32.5); // ₹32.50 per ticket
  const taxes = Math.round(convenienceFee * 0.18); // 18% GST on convenience fee
  const grandTotal = subtotal + convenienceFee + taxes;

  const handlePayNow = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Simulate realistic payment gateway authorization delay
      await new Promise(resolve => setTimeout(resolve, 1400));

      const payload = {
        showId,
        seats: selectedSeats.map(s => ({
          seatId: s.seatId,
          row: s.row,
          number: s.number,
          tier: s.tier,
          price: s.price
        })),
        snacks: snacks.map(s => ({
          name: s.name,
          quantity: s.quantity,
          price: s.price
        })),
        paymentMethod: paymentMethod === 'CARD' ? 'Credit/Debit Card' : paymentMethod === 'NETBANKING' ? 'Netbanking' : 'UPI'
      };

      const res = await api.post('/bookings', payload);

      if (res.data.success) {
        // Broadcast socket booked confirmation
        socket.emit('seats_booked_broadcast', {
          showId,
          seatIds: selectedSeats.map(s => s.seatId)
        });

        // Navigate to booking confirmation screen
        navigate(`/confirmation/${res.data.data.bookingId}`, {
          state: { booking: res.data.data }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem', maxWidth: '1000px' }}>
      
      {/* Top back button */}
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost"
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ArrowLeft size={18} /> Modify Seats
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* Left: Payment Method Selection */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Choose Payment Method
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Encrypted & Secure 256-Bit SSL Checkout
          </p>

          {/* Payment Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
            
            {/* UPI Option */}
            <div
              onClick={() => setPaymentMethod('UPI')}
              style={{
                background: paymentMethod === 'UPI' ? 'rgba(229, 9, 20, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: paymentMethod === 'UPI' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: paymentMethod === 'UPI' ? '1rem' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <QrCode size={22} color={paymentMethod === 'UPI' ? 'var(--brand-primary)' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>UPI / QR Instant Checkout</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Google Pay, PhonePe, Paytm, BHIM</div>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'UPI'} onChange={() => {}} style={{ accentColor: 'var(--brand-primary)' }} />
              </div>

              {paymentMethod === 'UPI' && (
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@bank"
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem 0.85rem',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ShieldCheck size={14} /> Verified UPI ID Ready for Instant Authorization
                  </div>
                </div>
              )}
            </div>

            {/* Credit / Debit Card Option */}
            <div
              onClick={() => setPaymentMethod('CARD')}
              style={{
                background: paymentMethod === 'CARD' ? 'rgba(229, 9, 20, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: paymentMethod === 'CARD' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: paymentMethod === 'CARD' ? '1rem' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CreditCard size={22} color={paymentMethod === 'CARD' ? 'var(--brand-primary)' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Credit / Debit Cards</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Visa, MasterCard, RuPay, Amex</div>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'CARD'} onChange={() => {}} style={{ accentColor: 'var(--brand-primary)' }} />
              </div>

              {paymentMethod === 'CARD' && (
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.55rem', color: '#fff' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Valid Thru</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.55rem', color: '#fff' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        maxLength={4}
                        style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.55rem', color: '#fff' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Netbanking Option */}
            <div
              onClick={() => setPaymentMethod('NETBANKING')}
              style={{
                background: paymentMethod === 'NETBANKING' ? 'rgba(229, 9, 20, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: paymentMethod === 'NETBANKING' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: paymentMethod === 'NETBANKING' ? '1rem' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Building size={22} color={paymentMethod === 'NETBANKING' ? 'var(--brand-primary)' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Net Banking</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>All major Indian public & private banks</div>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'NETBANKING'} onChange={() => {}} style={{ accentColor: 'var(--brand-primary)' }} />
              </div>

              {paymentMethod === 'NETBANKING' && (
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#161c2a',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem',
                      color: '#fff'
                    }}
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.95rem',
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Lock size={18} />
            {isProcessing ? 'Authorizing Payment with Bank...' : `Pay ₹${grandTotal} Securely`}
          </button>
        </div>

        {/* Right: Booking Summary Receipt (District / BMS Style) */}
        <div>
          <div className="glass-panel" style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}>
            
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Booking Summary
            </h3>

            {/* Movie details */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <img
                src={show.movie?.poster}
                alt={show.movie?.title}
                style={{ width: '60px', height: '80px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{show.movie?.title}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '2px 0' }}>
                  {show.format} • {show.language} • {show.movie?.certificate}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {show.theatre?.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--brand-crimson)', fontWeight: 600 }}>
                  {show.showDate} | {show.showTime}
                </div>
              </div>
            </div>

            {/* Financial itemized rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Seats ({selectedSeats.map(s => s.seatId).join(', ')})
                </span>
                <span style={{ fontWeight: 700, color: '#fff' }}>₹{seatsTotal}</span>
              </div>

              {snacks.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    F&B Snacks ({snacks.reduce((a, c) => a + c.quantity, 0)} items)
                  </span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>₹{snacksTotal}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Internet Handling Fees</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>₹{convenienceFee}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Integrated GST (18%)</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>₹{taxes}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px dashed var(--border-subtle)',
                marginTop: '0.5rem',
                fontSize: '1.2rem',
                fontWeight: 900
              }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--brand-primary)' }}>₹{grandTotal}</span>
              </div>

            </div>

            {/* Cancellation guarantee notice */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              marginTop: '1.5rem',
              fontSize: '0.75rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <CheckCircle size={16} />
              <span>Free cancellation up to 2 hours before showtime</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

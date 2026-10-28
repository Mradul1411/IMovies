import React from 'react';
import { Film, ShieldCheck, Heart, Sparkles, HelpCircle, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3.5rem 0 2rem',
      marginTop: '5rem'
    }}>
      <div className="container">
        
        {/* Cinema highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(229, 9, 20, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>100% Genuine Tickets</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Direct integration with official cinema halls</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Real-Time Seat Booking</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Live cinema hall seat selection & sync</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <PhoneCall size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>24/7 Dedicated Support</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Instant cancellation & seamless refunds</div>
            </div>
          </div>
        </div>

        {/* Footer main links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Film size={22} color="var(--brand-primary)" />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>IMOVIES</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              The modern movie ticketing standard built with District & BookMyShow inspiration. Seamless showtime exploration, live seat picking, and digital e-tickets.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>Cinema Chains</h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>PVR INOX Multiplexes</li>
              <li>Cinépolis Cinemas</li>
              <li>Miraj Cinemas</li>
              <li>MovieMax</li>
              <li>Prasads Multiplex</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>Trending Genres</h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Action & Thrillers</li>
              <li>Sci-Fi & Adventures</li>
              <li>Comedy & Horror</li>
              <li>IMAX 3D Blockbusters</li>
              <li>Regional Cinema (Telugu, Tamil)</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>Top Cities</h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Mumbai & Navi Mumbai</li>
              <li>Delhi-NCR & Gurugram</li>
              <li>Bengaluru & Whitefield</li>
              <li>Hyderabad & Cyberabad</li>
              <li>Chennai & Pune</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          color: 'var(--text-dim)',
          fontSize: '0.8rem'
        }}>
          <div>© {new Date().getFullYear()} IMovies Entertainment Pvt Ltd. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Engineered with <Heart size={14} color="var(--brand-primary)" fill="var(--brand-primary)" /> for cinema lovers
          </div>
        </div>

      </div>
    </footer>
  );
}

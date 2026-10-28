import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Phone, ShieldCheck, Film, Sparkles } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register } = useAuth();

  const [tab, setTab] = useState(authModalTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const emailInputRef = useRef(null);

  useEffect(() => {
    const el = emailInputRef.current;
    if (!el) return;

    const stripInjectedStyles = () => {
      if (el.style.backgroundImage || el.style.background) {
        el.style.removeProperty('background-image');
        el.style.removeProperty('background');
      }
      if (el.hasAttribute('data-temp-mail-org')) {
        el.removeAttribute('data-temp-mail-org');
      }
    };

    stripInjectedStyles();
    const observer = new MutationObserver(stripInjectedStyles);
    observer.observe(el, { attributes: true, attributeFilter: ['style', 'data-temp-mail-org'] });

    return () => observer.disconnect();
  }, [tab]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, phone });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      if (role === 'admin') {
        await login('admin@imovies.com', 'admin123');
      } else {
        await login('user@imovies.com', 'user123');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Film size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>IMOVIES</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Cinema ticket booking made simple</p>
            </div>
          </div>
          <button onClick={closeAuthModal} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.9rem',
              background: tab === 'login' ? 'var(--brand-primary)' : 'transparent',
              color: tab === 'login' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.9rem',
              background: tab === 'register' ? 'var(--brand-primary)' : 'transparent',
              color: tab === 'register' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Demo Login Quick Actions */}
        <div style={{
          marginBottom: '1.25rem',
          padding: '0.75rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={14} color="#fbbf24" /> One-Click Demo Credentials
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.45rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.45rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <ShieldCheck size={14} /> Admin User
            </button>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tab === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Full Name
              </label>
              <div className="auth-input-wrapper">
                <User size={18} color="var(--text-dim)" />
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="auth-input-field"
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <Mail size={18} color="var(--text-dim)" />
              <input
                ref={emailInputRef}
                type="text"
                inputMode="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                data-lpignore="true"
                data-1p-ignore="true"
                className="auth-input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Password
            </label>
            <div className="auth-input-wrapper">
              <Lock size={18} color="var(--text-dim)" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                className="auth-input-field"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Phone Number (Optional)
              </label>
              <div className="auth-input-wrapper">
                <Phone size={18} color="var(--text-dim)" />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className="auth-input-field"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In to IMovies' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

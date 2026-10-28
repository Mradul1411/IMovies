import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import api from '../services/api';
import {
  Film,
  MapPin,
  Search,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Ticket,
  Shield,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ onSearchChange }) {
  const { user, logout, openAuthModal, isAdmin } = useAuth();
  const { selectedCity, openCityModal } = useCity();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      // ignore silently if not logged in
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchQuery);
    }
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {}
  };

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 900 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand Logo & Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(229, 9, 20, 0.45)'
            }}>
              <Film size={22} color="#ffffff" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
                <span style={{ color: '#fff' }}>I</span>
                <span style={{ color: 'var(--brand-primary)' }}>MOVIES</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>
                District & BMS Experience
              </div>
            </div>
          </Link>

          {/* City Selector Pill */}
          <button
            onClick={openCityModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            className="hover-bright"
          >
            <MapPin size={15} color="var(--brand-primary)" />
            <span>{selectedCity}</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>
        </div>

        {/* Global Search Bar (District / BMS style) */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: '1',
            maxWidth: '460px',
            margin: '0 1.5rem',
            display: 'none',
            position: 'relative'
          }}
          className="desktop-search"
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 1rem',
            gap: '0.6rem',
            width: '100%',
            transition: 'border-color 0.2s ease'
          }}>
            <Search size={18} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search movies by title, genre, cast..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                width: '100%',
                fontSize: '0.875rem'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  if (onSearchChange) onSearchChange('');
                }}
                style={{ color: 'var(--text-dim)', padding: 0 }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </form>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          <Link
            to="/"
            style={{
              color: 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '0.4rem 0.6rem',
              transition: 'color 0.2s'
            }}
            className="nav-link"
          >
            Movies
          </Link>

          {/* Admin Dashboard shortcut button if user is Admin or for easy switching */}
          {isAdmin && (
            <Link
              to="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              <Shield size={14} /> Admin
            </Link>
          )}

          {/* Notifications Bell */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowProfileDropdown(false);
                }}
                className="btn-ghost"
                style={{ position: 'relative', padding: '0.55rem' }}
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'var(--brand-primary)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifDropdown && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '320px',
                  padding: '1rem',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 1000
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{ fontSize: '0.75rem', color: 'var(--brand-crimson)' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {notifications.length === 0 ? (
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center', padding: '1.5rem 0' }}>
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} style={{
                          background: n.read ? 'transparent' : 'rgba(255, 255, 255, 0.04)',
                          borderLeft: n.read ? 'none' : '3px solid var(--brand-primary)',
                          padding: '0.5rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{n.title}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Account / Profile / Login */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifDropdown(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.35rem 0.75rem 0.35rem 0.4rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '210px',
                  padding: '0.5rem',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 1000
                }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>

                  <Link
                    to="/bookings"
                    onClick={() => setShowProfileDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    className="hover-bg"
                  >
                    <Ticket size={16} color="var(--brand-primary)" />
                    My Bookings
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowProfileDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.85rem',
                        color: '#fbbf24',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      className="hover-bg"
                    >
                      <Shield size={16} />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileDropdown(false);
                      navigate('/');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      color: '#f87171',
                      width: '100%',
                      borderRadius: 'var(--radius-sm)',
                      marginTop: '0.2rem'
                    }}
                    className="hover-bg"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
            >
              Sign In
            </button>
          )}

        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-search { display: block !important; }
        }
        .hover-bg:hover {
          background: rgba(255, 255, 255, 0.07);
        }
        .nav-link:hover {
          color: #fff !important;
        }
      `}</style>
    </header>
  );
}

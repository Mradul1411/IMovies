import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ALL_INDIAN_CITIES } from '../context/CityContext';
import {
  Shield,
  DollarSign,
  Ticket,
  Film,
  Building,
  Plus,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'movies' | 'theatres' | 'shows'
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Forms
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    poster: '',
    banner: '',
    trailerUrl: '',
    genres: 'Action, Sci-Fi',
    languages: 'English, Hindi',
    duration: 150,
    releaseDate: '2025-01-01',
    rating: 8.8,
    formats: '2D, 3D, IMAX 3D',
    certificate: 'U/A',
    director: ''
  });

  const [newTheatre, setNewTheatre] = useState({
    name: '',
    chain: 'PVR INOX',
    city: 'Mumbai',
    address: '',
    amenities: 'Dolby Atmos, Laser Projection, Recliner Seats'
  });

  const [newShow, setNewShow] = useState({
    movieId: '',
    theatreId: '',
    screenName: 'Audi 1 - IMAX',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '07:30 PM',
    format: 'IMAX 3D',
    language: 'English',
    vipPrice: 450,
    primePrice: 280,
    classicPrice: 180
  });

  useEffect(() => {
    if (isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, moviesRes, theatresRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/movies'),
        api.get('/theatres')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setRecentBookings(statsRes.data.recentBookings || []);
      }
      if (moviesRes.data.success) {
        setMovies(moviesRes.data.data);
        if (moviesRes.data.data.length > 0) {
          setNewShow(prev => ({ ...prev, movieId: moviesRes.data.data[0]._id }));
        }
      }
      if (theatresRes.data.success) {
        setTheatres(theatresRes.data.data);
        if (theatresRes.data.data.length > 0) {
          setNewShow(prev => ({ ...prev, theatreId: theatresRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    setActionSuccess('');
    setActionError('');
    try {
      const payload = {
        ...newMovie,
        genres: newMovie.genres.split(',').map(s => s.trim()),
        languages: newMovie.languages.split(',').map(s => s.trim()),
        formats: newMovie.formats.split(',').map(s => s.trim())
      };
      const res = await api.post('/movies', payload);
      if (res.data.success) {
        setActionSuccess('Movie added successfully!');
        setMovies(prev => [res.data.data, ...prev]);
        setNewMovie({
          title: '',
          description: '',
          poster: '',
          banner: '',
          trailerUrl: '',
          genres: 'Action, Sci-Fi',
          languages: 'English, Hindi',
          duration: 150,
          releaseDate: '2025-01-01',
          rating: 8.8,
          formats: '2D, 3D, IMAX 3D',
          certificate: 'U/A',
          director: ''
        });
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to add movie');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie and all its shows?')) return;
    try {
      const res = await api.delete(`/movies/${id}`);
      if (res.data.success) {
        setActionSuccess('Movie deleted successfully');
        setMovies(prev => prev.filter(m => m._id !== id));
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete movie');
    }
  };

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    setActionSuccess('');
    setActionError('');
    try {
      const payload = {
        ...newTheatre,
        amenities: newTheatre.amenities.split(',').map(s => s.trim())
      };
      const res = await api.post('/theatres', payload);
      if (res.data.success) {
        setActionSuccess('Theatre added successfully!');
        setTheatres(prev => [...prev, res.data.data]);
        setNewTheatre({
          name: '',
          chain: 'PVR INOX',
          city: 'Mumbai',
          address: '',
          amenities: 'Dolby Atmos, Laser Projection, Recliner Seats'
        });
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to add theatre');
    }
  };

  const handleDeleteTheatre = async (id) => {
    if (!window.confirm('Delete this theatre?')) return;
    try {
      const res = await api.delete(`/theatres/${id}`);
      if (res.data.success) {
        setActionSuccess('Theatre deleted successfully');
        setTheatres(prev => prev.filter(t => t._id !== id));
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete theatre');
    }
  };

  const handleScheduleShow = async (e) => {
    e.preventDefault();
    setActionSuccess('');
    setActionError('');
    try {
      const payload = {
        movieId: newShow.movieId,
        theatreId: newShow.theatreId,
        screenName: newShow.screenName,
        showDate: newShow.showDate,
        showTime: newShow.showTime,
        format: newShow.format,
        language: newShow.language,
        pricing: {
          vip: Number(newShow.vipPrice),
          prime: Number(newShow.primePrice),
          classic: Number(newShow.classicPrice)
        }
      };
      const res = await api.post('/shows', payload);
      if (res.data.success) {
        setActionSuccess('Show scheduled successfully!');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to schedule show');
    }
  };

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <Shield size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
        <h2>Admin Privileges Required</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
          Please sign in with the Admin account to access cinema management controls.
        </p>
        <button onClick={() => openAuthModal('login')} className="btn-primary">
          Sign In as Admin
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      
      {/* Admin Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Admin Cinema Console</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Manage movies, theatres, screen schedules, and track live ticket revenue
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'movies', label: '🎬 Movies' },
            { id: 'theatres', label: '🏛️ Theatres' },
            { id: 'shows', label: '🎟️ Shows' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setActionSuccess(''); setActionError(''); }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: activeTab === t.id ? 'var(--brand-primary)' : 'transparent',
                color: activeTab === t.id ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {actionSuccess && (
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
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#f87171',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div>
          {/* 4 Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#34d399', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Revenue</span>
                <DollarSign size={20} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                ₹{stats?.totalRevenue?.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>Confirmed transactions</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Bookings</span>
                <Ticket size={20} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                {stats?.totalBookings || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Across all cinema screens</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#60a5fa', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Active Movies</span>
                <Film size={20} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                {stats?.totalMovies || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Now running in theatres</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#c084fc', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Theatres & Chains</span>
                <Building size={20} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                {stats?.totalTheatres || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>PVR, INOX, Cinepolis, Miraj</div>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Recent Booking Transactions</h3>
            {recentBookings.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', padding: '2rem 0', textAlign: 'center' }}>No bookings logged yet.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Ref ID</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Movie</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Theatre</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Seats</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map(b => (
                      <tr key={b._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: '#fff' }}>{b.bookingId}</td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>{b.showDetails?.movieTitle}</td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>{b.showDetails?.theatreName}</td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--brand-crimson)', fontWeight: 700 }}>
                          {b.seats?.map(s => s.seatId).join(', ')}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800 }}>₹{b.totalAmount}</td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: b.status === 'confirmed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: b.status === 'confirmed' ? '#34d399' : '#f87171'
                          }}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MOVIES CRUD */}
      {activeTab === 'movies' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Add Movie Form */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} color="var(--brand-primary)" /> Add New Movie
            </h3>

            <form onSubmit={handleCreateMovie} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Movie Title</label>
                <input
                  type="text"
                  placeholder="e.g. Avatar: Fire and Ash"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  required
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Poster Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newMovie.poster}
                  onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
                  required
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Banner Backdrop URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newMovie.banner}
                  onChange={(e) => setNewMovie({ ...newMovie, banner: e.target.value })}
                  required
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Synopsis / Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed synopsis of the film..."
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  required
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Genres (comma-sep)</label>
                  <input
                    type="text"
                    value={newMovie.genres}
                    onChange={(e) => setNewMovie({ ...newMovie, genres: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Languages</label>
                  <input
                    type="text"
                    value={newMovie.languages}
                    onChange={(e) => setNewMovie({ ...newMovie, languages: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Duration (mins)</label>
                  <input
                    type="number"
                    value={newMovie.duration}
                    onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Certificate</label>
                  <select
                    value={newMovie.certificate}
                    onChange={(e) => setNewMovie({ ...newMovie, certificate: e.target.value })}
                    style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                  >
                    <option value="U">U (Universal)</option>
                    <option value="U/A">U/A (Parental)</option>
                    <option value="A">A (Adults Only)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
                Save Movie
              </button>
            </form>
          </div>

          {/* Current Movies List */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Existing Movies Catalog ({movies.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '550px', overflowY: 'auto' }}>
              {movies.map(m => (
                <div
                  key={m._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img src={m.poster} alt={m.title} style={{ width: '45px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{m.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {m.genres?.join(', ')} • {m.duration}m • {m.certificate}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMovie(m._id)}
                    style={{ color: '#f87171', padding: '0.5rem' }}
                    title="Delete Movie"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: THEATRES CRUD */}
      {activeTab === 'theatres' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Add Theatre Form */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} color="var(--brand-primary)" /> Register Theatre / Multiplex
            </h3>

            <form onSubmit={handleCreateTheatre} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Theatre Name</label>
                <input
                  type="text"
                  placeholder="e.g. INOX: R-City Mall, Ghatkopar"
                  value={newTheatre.name}
                  onChange={(e) => setNewTheatre({ ...newTheatre, name: e.target.value })}
                  required
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Chain</label>
                  <select
                    value={newTheatre.chain}
                    onChange={(e) => setNewTheatre({ ...newTheatre, chain: e.target.value })}
                    style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                  >
                    <option value="PVR INOX">PVR INOX</option>
                    <option value="Cinepolis">Cinepolis</option>
                    <option value="Miraj">Miraj</option>
                    <option value="MovieMax">MovieMax</option>
                    <option value="Prasads">Prasads</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>City</label>
                  <select
                    value={newTheatre.city}
                    onChange={(e) => setNewTheatre({ ...newTheatre, city: e.target.value })}
                    style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                  >
                    {ALL_INDIAN_CITIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.state})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Full Address</label>
                <input
                  type="text"
                  placeholder="3rd Floor, Commercial Mall, MG Road..."
                  value={newTheatre.address}
                  onChange={(e) => setNewTheatre({ ...newTheatre, address: e.target.value })}
                  required
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Amenities (comma-sep)</label>
                <input
                  type="text"
                  value={newTheatre.amenities}
                  onChange={(e) => setNewTheatre({ ...newTheatre, amenities: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
                Save Theatre
              </button>
            </form>
          </div>

          {/* Current Theatres List */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Registered Theatres ({theatres.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '550px', overflowY: 'auto' }}>
              {theatres.map(t => (
                <div
                  key={t._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="badge-outline" style={{ fontSize: '0.7rem' }}>{t.chain}</span>
                      <strong style={{ color: '#fff' }}>{t.name}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      📍 {t.city} • {t.address}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTheatre(t._id)}
                    style={{ color: '#f87171', padding: '0.5rem' }}
                    title="Delete Theatre"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: SCHEDULE SHOWS */}
      {activeTab === 'shows' && (
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--brand-primary)" /> Schedule New Cinema Show
            </h3>

            <form onSubmit={handleScheduleShow} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Select Movie</label>
                <select
                  value={newShow.movieId}
                  onChange={(e) => setNewShow({ ...newShow, movieId: e.target.value })}
                  style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.7rem', color: '#fff' }}
                >
                  {movies.map(m => (
                    <option key={m._id} value={m._id}>{m.title} ({m.certificate})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Select Theatre</label>
                <select
                  value={newShow.theatreId}
                  onChange={(e) => setNewShow({ ...newShow, theatreId: e.target.value })}
                  style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.7rem', color: '#fff' }}
                >
                  {theatres.map(t => (
                    <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Show Date</label>
                  <input
                    type="date"
                    value={newShow.showDate}
                    onChange={(e) => setNewShow({ ...newShow, showDate: e.target.value })}
                    style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.7rem', color: '#fff' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Show Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 07:30 PM"
                    value={newShow.showTime}
                    onChange={(e) => setNewShow({ ...newShow, showTime: e.target.value })}
                    style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.7rem', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Format</label>
                  <select
                    value={newShow.format}
                    onChange={(e) => setNewShow({ ...newShow, format: e.target.value })}
                    style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.7rem', color: '#fff' }}
                  >
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX 2D">IMAX 2D</option>
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="4DX">4DX</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Screen Name</label>
                  <input
                    type="text"
                    value={newShow.screenName}
                    onChange={(e) => setNewShow({ ...newShow, screenName: e.target.value })}
                    style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.7rem', color: '#fff' }}
                  />
                </div>
              </div>

              {/* Price tiers */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Price Tiers (₹)
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.7rem', color: '#c084fc' }}>VIP Recliner</span>
                    <input
                      type="number"
                      value={newShow.vipPrice}
                      onChange={(e) => setNewShow({ ...newShow, vipPrice: e.target.value })}
                      style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', color: '#fff' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.7rem', color: '#60a5fa' }}>Prime</span>
                    <input
                      type="number"
                      value={newShow.primePrice}
                      onChange={(e) => setNewShow({ ...newShow, primePrice: e.target.value })}
                      style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', color: '#fff' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.7rem', color: '#34d399' }}>Classic</span>
                    <input
                      type="number"
                      value={newShow.classicPrice}
                      onChange={(e) => setNewShow({ ...newShow, classicPrice: e.target.value })}
                      style={{ width: '100%', background: '#161c2a', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', color: '#fff' }}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
                Schedule Show
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

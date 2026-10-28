import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCity } from '../context/CityContext';
import TrailerModal from '../components/TrailerModal';
import {
  Star,
  Clock,
  Calendar,
  Play,
  MapPin,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCity } = useCity();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [theatresWithShows, setTheatresWithShows] = useState([]);
  const [showsLoading, setShowsLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Generate next 4 dates
  const generateDates = () => {
    const list = [];
    for (let i = 0; i <= 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      list.push({ iso, label: dayName, dateStr: `${dayNum} ${monthName}` });
    }
    return list;
  };

  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState(dates[0].iso);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    if (movie) {
      fetchShows();
    }
  }, [movie, selectedDate, selectedCity]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/movies/${id}`);
      if (res.data.success) {
        setMovie(res.data.data);
      }
    } catch (err) {
      setError('Movie details not found.');
    } finally {
      setLoading(false);
    }
  };

  const fetchShows = async () => {
    setShowsLoading(true);
    try {
      const res = await api.get('/shows', {
        params: {
          movieId: id,
          showDate: selectedDate,
          city: selectedCity
        }
      });
      if (res.data.success) {
        setTheatresWithShows(res.data.theatresWithShows || []);
      }
    } catch (err) {
      console.error('Failed to load shows:', err);
    } finally {
      setShowsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading movie experience...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Movie Not Found</h2>
        <Link to="/" className="btn-primary">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Movie Hero Banner Backdrop */}
      <div style={{
        position: 'relative',
        minHeight: '440px',
        backgroundImage: `url(${movie.banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '3rem 0'
      }}>
        {/* Gradient overlays */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, #090b10 5%, rgba(9, 11, 16, 0.8) 50%, rgba(9, 11, 16, 0.5) 100%)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-end' }}>
            
            {/* Poster */}
            <div style={{
              width: '220px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0
            }}>
              <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <span className="badge-rating">
                  <Star size={13} fill="#fbbf24" strokeWidth={0} /> {movie.rating}/10 ({movie.votesCount?.toLocaleString()} votes)
                </span>
                <span className="badge-outline">{movie.certificate}</span>
                <span className="badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={12} /> {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
                <span className="badge-outline">{movie.languages?.join(', ')}</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, marginBottom: '0.75rem' }}>
                {movie.title}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {movie.genres?.map(g => (
                  <span key={g} style={{
                    fontSize: '0.85rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {g}
                  </span>
                ))}
                {movie.formats?.map(f => (
                  <span key={f} style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {f}
                  </span>
                ))}
              </div>

              {movie.trailerUrl && (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1.4rem', fontSize: '0.9rem' }}
                >
                  <Play size={16} fill="#fff" /> Watch Official Trailer
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
        
        {/* Synopsis & Cast */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>About the Movie</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {movie.description}
            </p>
            {movie.director && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Director: </span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{movie.director}</span>
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Top Cast</h3>
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {movie.cast?.map((actor, idx) => (
                <div key={idx} style={{ textAlign: 'center', width: '90px', flexShrink: 0 }}>
                  <img
                    src={actor.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={actor.name}
                    style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.4rem', border: '2px solid var(--border-subtle)' }}
                  />
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {actor.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {actor.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Date Selector Tabs (District & BMS Style) */}
        <div style={{
          position: 'sticky',
          top: '72px',
          zIndex: 800,
          background: 'rgba(9, 11, 16, 0.95)',
          backdropFilter: 'blur(16px)',
          padding: '1rem 0',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto' }}>
            {dates.map((d) => {
              const active = selectedDate === d.iso;
              return (
                <button
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: active ? 'var(--brand-gradient)' : 'rgba(255, 255, 255, 0.04)',
                    border: active ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    color: active ? '#fff' : 'var(--text-muted)',
                    textAlign: 'center',
                    minWidth: '95px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: active ? '#fff' : 'var(--text-main)' }}>
                    {d.dateStr}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theatres & Showtimes Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              Theatres in {selectedCity}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Fast Filling
              </span>
            </div>
          </div>

          {showsLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Checking theatre schedules...
            </div>
          ) : theatresWithShows.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <MapPin size={40} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No shows found for this date</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Try selecting another date tab above or switch cities.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {theatresWithShows.map(({ theatre, shows }) => (
                <div
                  key={theatre._id}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  {/* Theatre header */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '1.25rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px'
                        }}>
                          {theatre.chain}
                        </span>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                          {theatre.name}
                        </h4>
                      </div>
                      <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {theatre.address}
                      </p>
                    </div>

                    {/* Amenities pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {theatre.amenities?.map((amenity, aIdx) => (
                        <span key={aIdx} style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.2rem 0.5rem'
                        }}>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Showtimes grid */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {shows.map(show => {
                      const isFastFilling = show.status === 'fast-filling';
                      const isAlmostFull = show.status === 'almost-full';

                      return (
                        <button
                          key={show._id}
                          onClick={() => navigate(`/book/${show._id}`)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.65rem 1.15rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.3rem',
                            minWidth: '125px',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                          className="showtime-btn"
                        >
                          <div style={{
                            fontSize: '1rem',
                            fontWeight: 800,
                            color: isAlmostFull ? '#f87171' : isFastFilling ? '#fbbf24' : '#34d399'
                          }}>
                            {show.showTime}
                          </div>
                          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                              {show.format}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>•</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                              {show.language}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            From ₹{show.pricing?.classic || 180}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />

      <style>{`
        .showtime-btn:hover {
          border-color: var(--brand-primary) !important;
          background: rgba(229, 9, 20, 0.12) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(229, 9, 20, 0.25);
        }
      `}</style>
    </div>
  );
}

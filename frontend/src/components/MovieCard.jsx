import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Ticket, Clock } from 'lucide-react';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie._id}`} className="movie-card">
      {/* Poster */}
      <div className="poster-wrapper">
        <img src={movie.poster} alt={movie.title} loading="lazy" />
        
        {/* Rating & Format Pill Top Bar */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2
        }}>
          <span style={{
            background: 'rgba(10, 13, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#fbbf24',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.2rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Star size={12} fill="#fbbf24" strokeWidth={0} /> {movie.rating}
          </span>

          <span style={{
            background: 'rgba(10, 13, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.2rem 0.45rem',
            fontSize: '0.7rem',
            fontWeight: 700
          }}>
            {movie.certificate}
          </span>
        </div>

        {/* Poster Bottom Overlay (District style) */}
        <div className="poster-overlay">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            marginBottom: '0.35rem'
          }}>
            {movie.formats?.slice(0, 2).map(f => (
              <span key={f} style={{
                background: 'rgba(229, 9, 20, 0.85)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.15rem 0.4rem',
                borderRadius: '3px'
              }}>
                {f}
              </span>
            ))}
            <span style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 600,
              padding: '0.15rem 0.4rem',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              <Clock size={10} /> {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </span>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            marginBottom: '0.3rem',
            color: '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {movie.title}
          </h3>

          <div style={{
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            marginBottom: '0.5rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {movie.genres?.join(', ')}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: '0.5rem'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {movie.languages?.join(', ')}
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--brand-crimson)',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            <Ticket size={14} /> Book
          </span>
        </div>
      </div>
    </Link>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Ticket, Star, ChevronLeft, ChevronRight, Clock, ShieldAlert } from 'lucide-react';
import TrailerModal from './TrailerModal';

export default function HeroBanner({ movies = [] }) {
  const featuredMovies = movies.filter(m => m.isFeatured).length > 0
    ? movies.filter(m => m.isFeatured)
    : movies.slice(0, 3);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerMovie, setTrailerMovie] = useState(null);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;

  const current = featuredMovies[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <div style={{ position: 'relative', margin: '1.5rem 0 3rem' }}>
      <div
        className="hero-banner"
        style={{
          backgroundImage: `url(${current.banner})`,
          transition: 'background-image 0.5s ease-in-out'
        }}
      >
        <div className="hero-gradient" />

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
          
          {/* Metadata badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
            <span className="badge-brand">District Spotlight</span>
            <span className="badge-rating">
              <Star size={13} fill="#fbbf24" strokeWidth={0} /> {current.rating}/10 ({current.votesCount?.toLocaleString()} votes)
            </span>
            <span className="badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} /> {Math.floor(current.duration / 60)}h {current.duration % 60}m
            </span>
            <span className="badge-outline">{current.certificate}</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '0.85rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}>
            {current.title}
          </h1>

          {/* Genres & Formats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.1rem' }}>
            {current.genres?.map(g => (
              <span key={g} style={{
                fontSize: '0.8rem',
                color: 'var(--text-main)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(4px)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {g}
              </span>
            ))}
            <span style={{ color: 'var(--text-dim)', margin: '0 0.3rem', alignSelf: 'center' }}>•</span>
            {current.formats?.map(f => (
              <span key={f} style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#60a5fa',
                background: 'rgba(59, 130, 246, 0.15)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)'
              }}>
                {f}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {current.description}
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Link
              to={`/movie/${current._id}`}
              className="btn-primary"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
            >
              <Ticket size={18} /> Book Tickets
            </Link>

            {current.trailerUrl && (
              <button
                type="button"
                onClick={() => setTrailerMovie(current)}
                className="btn-secondary"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
              >
                <Play size={16} fill="#fff" /> Watch Trailer
              </button>
            )}
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          zIndex: 3
        }}>
          <button
            onClick={handlePrev}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          
          {/* Indicator dots */}
          <div style={{ display: 'flex', gap: '0.4rem', margin: '0 0.5rem' }}>
            {featuredMovies.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: idx === currentIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: idx === currentIndex ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerMovie && (
        <TrailerModal
          isOpen={!!trailerMovie}
          onClose={() => setTrailerMovie(null)}
          trailerUrl={trailerMovie.trailerUrl}
          movieTitle={trailerMovie.title}
        />
      )}
    </div>
  );
}

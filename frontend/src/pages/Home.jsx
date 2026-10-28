import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useCity } from '../context/CityContext';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import { Film, Flame, Sparkles, Clapperboard } from 'lucide-react';

export default function Home({ globalSearch }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { selectedCity } = useCity();
  const [searchParams] = useSearchParams();

  // Filters
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');

  const querySearch = searchParams.get('search') || globalSearch || '';

  useEffect(() => {
    fetchMovies();
  }, [selectedCity, selectedGenre, selectedLanguage, selectedFormat, querySearch]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedLanguage !== 'All') params.language = selectedLanguage;
      if (selectedFormat !== 'All') params.format = selectedFormat;
      if (querySearch) params.search = querySearch;

      const res = await api.get('/movies', { params });
      if (res.data.success) {
        setMovies(res.data.data);
      }
    } catch (err) {
      setError('Unable to load movies. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSelectedFormat('All');
  };

  return (
    <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
      
      {/* Hero Banner Showcase */}
      {!querySearch && <HeroBanner movies={movies} />}

      {/* Filter Bar */}
      <FilterBar
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        selectedFormat={selectedFormat}
        onSelectFormat={setSelectedFormat}
        onReset={handleResetFilters}
      />

      {/* Header section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(229, 9, 20, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-primary)'
          }}>
            <Flame size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              {querySearch ? `Search Results for "${querySearch}"` : 'Now Showing in Cinemas'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Showing {movies.length} blockbuster movies in {selectedCity}
            </p>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                height: '380px',
                animation: 'pulse 1.5s infinite ease-in-out'
              }}
            />
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#f87171' }}>
          {error}
        </div>
      ) : movies.length === 0 ? (
        <div className="glass-panel" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          margin: '2rem 0'
        }}>
          <Clapperboard size={48} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Movies Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            We couldn't find any movies matching your current filter criteria.
          </p>
          <button onClick={handleResetFilters} className="btn-primary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

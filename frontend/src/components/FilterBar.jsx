import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Comedy', 'Drama', 'Horror'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Telugu', 'Tamil'];
const FORMATS = ['All', '2D', '3D', 'IMAX 3D', '4DX'];

export default function FilterBar({
  selectedGenre,
  onSelectGenre,
  selectedLanguage,
  onSelectLanguage,
  selectedFormat,
  onSelectFormat,
  onReset
}) {
  const isFiltered = selectedGenre !== 'All' || selectedLanguage !== 'All' || selectedFormat !== 'All';

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
          <Filter size={16} color="var(--brand-primary)" />
          <span>Filters</span>
        </div>
        {isFiltered && (
          <button
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
            className="hover-bright"
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        
        {/* Genre Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', paddingBottom: '2px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', minWidth: '65px', fontWeight: 600 }}>GENRE:</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {GENRES.map(genre => {
              const active = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => onSelectGenre(genre)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    background: active ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: active ? '#fff' : 'var(--text-muted)',
                    border: active ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', paddingBottom: '2px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', minWidth: '65px', fontWeight: 600 }}>LANGUAGE:</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {LANGUAGES.map(lang => {
              const active = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  onClick={() => onSelectLanguage(lang)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    background: active ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: active ? '#fff' : 'var(--text-muted)',
                    border: active ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Format Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', paddingBottom: '2px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', minWidth: '65px', fontWeight: 600 }}>FORMAT:</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {FORMATS.map(fmt => {
              const active = selectedFormat === fmt;
              return (
                <button
                  key={fmt}
                  onClick={() => onSelectFormat(fmt)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    background: active ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
                    color: active ? '#fff' : 'var(--text-muted)',
                    border: active ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

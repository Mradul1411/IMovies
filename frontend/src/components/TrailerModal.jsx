import React from 'react';
import { X } from 'lucide-react';

export default function TrailerModal({ isOpen, onClose, trailerUrl, movieTitle }) {
  if (!isOpen) return null;

  // Extract YouTube ID
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  const embedUrl = getEmbedUrl(trailerUrl);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '850px',
          width: '95%',
          background: '#090b10',
          padding: 0,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{movieTitle} — Official Trailer</h3>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          ) : (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}>
              Trailer preview unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useCity } from '../context/CityContext';
import { MapPin, X, Check, Search, Sparkles, Compass } from 'lucide-react';

export default function CityModal() {
  const { isCityModalOpen, closeCityModal, selectedCity, changeCity, popularCities, allCities } = useCity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  // Filter cities based on search and region
  const filteredCities = useMemo(() => {
    return allCities.filter(city => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion =
        selectedRegion === 'All' ||
        (selectedRegion === 'Popular' && popularCities.some(p => p.name === city.name)) ||
        city.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [allCities, popularCities, searchQuery, selectedRegion]);

  if (!isCityModalOpen) return null;

  const regions = ['All', 'Popular', 'North', 'South', 'West', 'East', 'Central', 'North-East'];

  return (
    <div className="modal-backdrop" onClick={closeCityModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          width: '95%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(229, 9, 20, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)'
            }}>
              <MapPin size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Choose Your City</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Select from {allCities.length}+ cities across all states in India
              </p>
            </div>
          </div>
          <button onClick={closeCityModal} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Search Bar & Region Filters */}
        <div style={{ padding: '1.25rem 1.75rem 0.5rem', background: 'rgba(10, 13, 20, 0.6)' }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '0.6rem 1.15rem',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <Search size={18} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search by city or state (e.g. Jaipur, Kochi, Pune, Gujarat, Kerala)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                width: '100%',
                fontSize: '0.9rem'
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-muted)', padding: 0 }}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            scrollbarWidth: 'none'
          }}>
            {regions.map(r => {
              const active = selectedRegion === r;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    background: active ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: active ? '#fff' : 'var(--text-muted)',
                    border: active ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {r === 'Popular' ? '⭐ Popular' : r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '1.25rem 1.75rem 2rem', overflowY: 'auto', flex: 1 }}>
          
          {/* Top Popular Cities (Shown if no search query is active and Region is All or Popular) */}
          {!searchQuery && (selectedRegion === 'All' || selectedRegion === 'Popular') && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem'
              }}>
                <Sparkles size={14} color="#fbbf24" /> Popular Metros
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
                gap: '0.75rem'
              }}>
                {popularCities.map((city) => {
                  const isSelected = selectedCity === city.name;
                  return (
                    <button
                      key={city.id}
                      onClick={() => changeCity(city.name)}
                      style={{
                        background: isSelected ? 'rgba(229, 9, 20, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.85rem 0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      className="city-btn"
                    >
                      <span style={{ fontSize: '1.6rem' }}>{city.icon}</span>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: isSelected ? '#fff' : 'var(--text-main)',
                        textAlign: 'center',
                        lineHeight: 1.2
                      }}>
                        {city.name}
                      </span>
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: 'var(--brand-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff'
                        }}>
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Cities Section */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {searchQuery ? `Search Results (${filteredCities.length})` : `All Cities (${filteredCities.length})`}
              </div>
            </div>

            {filteredCities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No cities found matching "{searchQuery}".
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: '0.6rem'
              }}>
                {filteredCities.map((city) => {
                  const isSelected = selectedCity === city.name;
                  return (
                    <button
                      key={city.name}
                      onClick={() => changeCity(city.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'rgba(229, 9, 20, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid var(--brand-primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.15s ease',
                        textAlign: 'left'
                      }}
                      className="city-btn"
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: isSelected ? '#fff' : 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {city.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {city.state}
                        </div>
                      </div>

                      {isSelected && (
                        <Check size={14} color="var(--brand-primary)" strokeWidth={3} style={{ flexShrink: 0, marginLeft: '4px' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`
        .city-btn:hover {
          background: rgba(229, 9, 20, 0.12) !important;
          border-color: rgba(229, 9, 20, 0.4) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

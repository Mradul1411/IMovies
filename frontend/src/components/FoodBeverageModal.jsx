import React, { useState } from 'react';
import { X, Plus, Minus, Utensils, ArrowRight } from 'lucide-react';

const SNACKS_MENU = [
  {
    id: 'popcorn-butter',
    name: 'Jumbo Butter Popcorn (Salted)',
    category: 'Popcorn',
    price: 320,
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=300&q=80',
    description: 'Crisp, hot, cinema-fresh popcorn with melted butter'
  },
  {
    id: 'popcorn-cheese-caramel',
    name: 'Gourmet Cheese & Caramel Combo',
    category: 'Popcorn',
    price: 360,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=300&q=80',
    description: 'The ultimate sweet & savory crunchy popcorn mix'
  },
  {
    id: 'nachos-cheese',
    name: 'Crispy Mexican Nachos + Warm Cheese Dip',
    category: 'Snacks',
    price: 290,
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=300&q=80',
    description: 'Golden tortilla chips served with chunky salsa & jalapeno cheese'
  },
  {
    id: 'coke-large',
    name: 'Coca-Cola Fountain Drink (600ml)',
    category: 'Beverages',
    price: 180,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80',
    description: 'Ice-cold refreshing Coca-Cola'
  }
];

export default function FoodBeverageModal({ isOpen, onClose, onConfirm, initialSnacks = [] }) {
  const [quantities, setQuantities] = useState(() => {
    const map = {};
    initialSnacks.forEach(s => {
      map[s.id || s.name] = s.quantity;
    });
    return map;
  });

  if (!isOpen) return null;

  const updateQty = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const getSelectedSnacksList = () => {
    return SNACKS_MENU.filter(item => (quantities[item.id] || 0) > 0).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantities[item.id]
    }));
  };

  const snacksTotal = getSelectedSnacksList().reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const handleProceed = () => {
    onConfirm(getSelectedSnacksList());
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '95%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <Utensils size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Grab A Bite (Optional)</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pre-order fresh cinema concessions & skip concession lines</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Snacks List */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          {SNACKS_MENU.map((snack) => {
            const qty = quantities[snack.id] || 0;
            return (
              <div
                key={snack.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: qty > 0 ? '1px solid rgba(229, 9, 20, 0.4)' : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={snack.image}
                    alt={snack.name}
                    style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                      {snack.name}
                    </h4>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                      {snack.description}
                    </p>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      ₹{snack.price}
                    </span>
                  </div>
                </div>

                {/* Counter */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'rgba(0,0,0,0.4)',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <button
                    onClick={() => updateQty(snack.id, -1)}
                    disabled={qty === 0}
                    style={{
                      color: qty > 0 ? '#fff' : 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px'
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => updateQty(snack.id, 1)}
                    style={{
                      color: 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10, 13, 20, 0.9)'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Snacks Total</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>₹{snacksTotal}</div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <button
              onClick={() => {
                onConfirm([]);
              }}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
            >
              Skip
            </button>
            <button
              onClick={handleProceed}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem' }}
            >
              Continue to Pay <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

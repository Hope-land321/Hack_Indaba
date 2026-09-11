import React from 'react';
import { Sprout, Mic, LayoutDashboard, CheckCircle2, Sparkles, Languages } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, recordCount }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 19, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(52, 211, 153, 0.2)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Logo & Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('agriculteur')}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Sprout size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-font" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Agri<span className="gradient-text">Voix</span> Bénin
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                <Sparkles size={10} /> Bivariant AI
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Conseil Agricole Vocal & Structuration de Données (INRAB / FAO)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            id="tab-agriculteur"
            onClick={() => setActiveTab('agriculteur')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: activeTab === 'agriculteur' ? '1px solid var(--primary-light)' : '1px solid transparent',
              background: activeTab === 'agriculteur' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: activeTab === 'agriculteur' ? '#34d399' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Mic size={18} />
            <span>Espace Agriculteur</span>
          </button>

          <button
            id="tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: activeTab === 'dashboard' ? '1px solid var(--primary-light)' : '1px solid transparent',
              background: activeTab === 'dashboard' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: activeTab === 'dashboard' ? '#34d399' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <LayoutDashboard size={18} />
            <span>Base de Données ({recordCount})</span>
          </button>

          <button
            id="tab-validation"
            onClick={() => setActiveTab('validation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: activeTab === 'validation' ? '1px solid var(--primary-light)' : '1px solid transparent',
              background: activeTab === 'validation' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: activeTab === 'validation' ? '#34d399' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircle2 size={18} />
            <span>Validation NLP & Lexique</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

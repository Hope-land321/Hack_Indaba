import React from 'react';
import { Sprout, Mic, LayoutDashboard } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, recordCount }) {
  const handleAdminClick = () => {
    if (activeTab === 'dashboard' || activeTab === 'validation') {
      setActiveTab('agriculteur');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 19, 14, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(52, 211, 153, 0.2)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '66px'
      }}>
        {/* Logo & Branding Officiel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('agriculteur')}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
          }}>
            <Sprout size={22} color="#ffffff" />
          </div>
          <div>
            <span className="brand-font" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              Agri<span className="gradient-text">Voix</span> Bénin 🇧🇯
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Assistance Vocale Agricole INRAB / FAO</div>
          </div>
        </div>

        {/* Navigation : Mode Agriculteur (Public) vs Espace Admin Direct */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            id="tab-agriculteur"
            onClick={() => setActiveTab('agriculteur')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: activeTab === 'agriculteur' ? '1.5px solid #10b981' : '1px solid transparent',
              background: activeTab === 'agriculteur' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === 'agriculteur' ? '#34d399' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Mic size={16} />
            <span>Agriculteur (Vocal)</span>
          </button>

          <button
            id="tab-admin"
            onClick={handleAdminClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: activeTab === 'dashboard' || activeTab === 'validation' ? '1.5px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === 'dashboard' || activeTab === 'validation' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0,0,0,0.3)',
              color: activeTab === 'dashboard' || activeTab === 'validation' ? '#f59e0b' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <LayoutDashboard size={16} />
            <span>Espace Admin ({recordCount})</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

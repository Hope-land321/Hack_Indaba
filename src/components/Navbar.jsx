import React from 'react';
import { Sprout, Mic, LayoutDashboard, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, recordCount }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 19, 14, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(52, 211, 153, 0.2)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo & Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('agriculteur')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Sprout size={24} color="#ffffff" />
          </div>
          <div>
            <span className="brand-font" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              Agri<span className="gradient-text">Voix</span> Bénin 🇧🇯
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem', marginLeft: '8px' }}>
              <ShieldCheck size={10} /> RAG INRAB
            </span>
          </div>
        </div>

        {/* Navigation Tabs : Agriculteur (Vocal) vs Admin / Agent */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            id="tab-agriculteur"
            onClick={() => setActiveTab('agriculteur')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: activeTab === 'agriculteur' ? '1.5px solid #10b981' : '1px solid transparent',
              background: activeTab === 'agriculteur' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === 'agriculteur' ? '#34d399' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Mic size={18} />
            <span>Agriculteur (Vocal WhatsApp)</span>
          </button>

          <button
            id="tab-admin"
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: activeTab === 'dashboard' || activeTab === 'validation' ? '1.5px solid #f59e0b' : '1px solid transparent',
              background: activeTab === 'dashboard' || activeTab === 'validation' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              color: activeTab === 'dashboard' || activeTab === 'validation' ? '#f59e0b' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <LayoutDashboard size={18} />
            <span>Espace Agent / Admin ({recordCount})</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

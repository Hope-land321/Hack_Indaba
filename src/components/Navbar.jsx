import React, { useState } from 'react';
import { Sprout, Mic, Lock, LayoutDashboard } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, recordCount }) {
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleAdminClick = () => {
    if (activeTab === 'dashboard' || activeTab === 'validation') {
      setActiveTab('agriculteur');
    } else {
      setShowAdminPinModal(true);
      setPinInput('');
      setPinError(false);
    }
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    // PIN administrateur par défaut : 1234
    if (pinInput === '1234' || pinInput === 'admin') {
      setShowAdminPinModal(false);
      setActiveTab('dashboard');
    } else {
      setPinError(true);
    }
  };

  return (
    <>
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

          {/* Navigation : Mode Agriculteur (Public) vs Espace Admin (Protégé) */}
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
              <Lock size={14} />
              <span>Espace Admin ({recordCount})</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Modal d'accès Administrateur Protégé */}
      {showAdminPinModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-card" style={{ maxWidth: '380px', width: '100%', padding: '28px', textAlign: 'center', border: '1px solid #f59e0b' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: '#f59e0b' }}>
              <Lock size={24} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Accès Agent Agricole / Admin</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Entrez le code d'accès administrateur pour accéder à la carte des alertes et aux notifications. (Code par défaut : <code>1234</code>)
            </p>

            <form onSubmit={handleVerifyPin}>
              <input
                type="password"
                placeholder="Code PIN (ex: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.4)',
                  border: pinError ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  marginBottom: '14px'
                }}
              />

              {pinError && (
                <div style={{ color: '#ef4444', fontSize: '0.78rem', marginBottom: '12px', fontWeight: 600 }}>
                  Code PIN incorrect (Essayez 1234)
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowAdminPinModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Annuler
                </button>
                <button type="submit" className="gradient-btn" style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#f59e0b', color: '#000000', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                  Accéder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

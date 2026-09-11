import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, AlertTriangle, Bell, ShieldCheck } from 'lucide-react';
import { speakFonTTS } from '../services/bivariantApi';

export default function AgriAdvisory({ data }) {
  const [isPlayingFonAudio, setIsPlayingFonAudio] = useState(false);

  useEffect(() => {
    if (data && data.conseil_fon) {
      setIsPlayingFonAudio(true);
      speakFonTTS(data.conseil_fon);
      const timer = setTimeout(() => setIsPlayingFonAudio(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data) return null;

  const handleReplayFonVoice = () => {
    setIsPlayingFonAudio(true);
    speakFonTTS(data.conseil_fon);
    setTimeout(() => setIsPlayingFonAudio(false), 7000);
  };

  const isUnknown = data.is_known === false;

  return (
    <div style={{
      maxWidth: '580px',
      margin: '24px auto 0',
      background: 'rgba(18, 38, 28, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '28px 22px',
      border: isUnknown ? '2px solid #f59e0b' : '2px solid #10b981',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
      textAlign: 'center'
    }}>
      {/* Alerte et Statut en cas de Problème Inconnu / Non Répertorié */}
      {isUnknown ? (
        <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', padding: '14px', borderRadius: '16px', marginBottom: '20px' }}>
          <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Bell size={18} className="recording-pulse" />
            <span>Alerte Transmise à l'Agent Agricole de Zone</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: '6px' }}>
            Ce problème n'est pas encore répertorié dans la base INRAB. Une notification prioritaire a été envoyée à l'administrateur.
          </p>
        </div>
      ) : (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', padding: '6px 14px', borderRadius: '20px', border: '1px solid #10b981', marginBottom: '16px' }}>
          <ShieldCheck size={14} color="#34d399" />
          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>Recommandation INRAB / FAO Homologuée</span>
        </div>
      )}

      {/* Titre du Diagnostic */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: isUnknown ? '#f59e0b' : '#6ee7b7', marginBottom: '4px' }}>
        {data.probleme}
      </h2>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        Agriculteur : <strong style={{ color: '#ffffff' }}>{data.agriculteur_name}</strong> ({data.commune})
      </p>

      {/* BLOC RÉPONSE VOCALE FON (facebook/mms-tts-fon) */}
      <div style={{
        background: isUnknown ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)',
        border: isUnknown ? '1.5px solid #f59e0b' : '1.5px solid #10b981',
        borderRadius: '20px',
        padding: '22px',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '0.82rem', color: isUnknown ? '#fcd34d' : '#a7f3d0', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
          🔊 Nùɖɔɖɔ Fon (Synthèse Vocale)
        </div>

        <p style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, lineHeight: '1.5', margin: '10px 0' }}>
          "{data.conseil_fon}"
        </p>

        <button
          onClick={handleReplayFonVoice}
          className="gradient-btn"
          style={{
            marginTop: '8px',
            padding: '12px 24px',
            borderRadius: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.95rem',
            background: isUnknown ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : undefined
          }}
        >
          <Volume2 size={22} className={isPlayingFonAudio ? 'recording-pulse' : ''} />
          <span>{isPlayingFonAudio ? 'Lecture Vocale Fon...' : 'Réécouter l\'Audio Fon'}</span>
        </button>
      </div>

      {/* Pictogrammes Visuels */}
      <div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
          💡 Consignes Visuelles Pratiques :
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {isUnknown ? (
            <>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '8px 14px', fontSize: '0.85rem', fontWeight: 700, color: '#fcd34d' }}>🍃 Conserver échantillon</div>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '8px 14px', fontSize: '0.85rem', fontWeight: 700, color: '#fcd34d' }}>📱 Attendre visite Agent</div>
            </>
          ) : (
            <>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #10b981', borderRadius: '12px', padding: '8px 14px', fontSize: '0.85rem', fontWeight: 700, color: '#6ee7b7' }}>🌱 Semences INRAB</div>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #10b981', borderRadius: '12px', padding: '8px 14px', fontSize: '0.85rem', fontWeight: 700, color: '#6ee7b7' }}>🔥 Brûler plants atteints</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

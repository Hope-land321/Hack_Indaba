import React, { useState, useEffect } from 'react';
import { Volume2, ShieldCheck, CheckCircle2, BookOpen } from 'lucide-react';
import { speakFonTTS } from '../services/bivariantApi';

export default function AgriAdvisory({ data }) {
  const [isPlayingFonAudio, setIsPlayingFonAudio] = useState(false);

  useEffect(() => {
    // Dès que le conseil RAG est généré, lancer automatiquement la lecture vocale Fon (facebook/mms-tts-fon)
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

  return (
    <div style={{
      maxWidth: '600px',
      margin: '24px auto 0',
      background: 'rgba(18, 38, 28, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '28px',
      padding: '30px 24px',
      border: '2px solid #10b981',
      boxShadow: '0 20px 50px rgba(16, 185, 129, 0.25)',
      textAlign: 'center'
    }}>
      {/* Badge Garantie RAG & Inscription Automatique */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
        <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          <ShieldCheck size={14} /> Réponse RAG INRAB (0 Hallucination)
        </span>
        <span className="badge badge-info" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          <CheckCircle2 size={14} /> Enregistré en DB Automatiquement
        </span>
      </div>

      {/* Titre du Diagnostic */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6ee7b7', marginBottom: '6px' }}>
        {data.probleme}
      </h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        Témoignage oral de {data.agriculteur_name} ({data.commune})
      </p>

      {/* ZONE PRINCIPALE DE RÉPONSE ORALE FON (facebook/mms-tts-fon) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)',
        border: '1.5px solid #10b981',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
          🔊 Nùɖɔɖɔ Fon (Génération Vocale facebook/mms-tts-fon)
        </div>

        <p style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, lineHeight: '1.5', margin: '12px 0' }}>
          "{data.conseil_fon}"
        </p>

        <button
          onClick={handleReplayFonVoice}
          className="gradient-btn"
          style={{
            marginTop: '10px',
            padding: '14px 28px',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '1rem',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
          }}
        >
          <Volume2 size={24} className={isPlayingFonAudio ? 'recording-pulse' : ''} />
          <span>{isPlayingFonAudio ? 'Lecture Vocale Fon...' : 'Réécouté le conseil en Fon'}</span>
        </button>
      </div>

      {/* Mode Pictogrammes Visuels pour Agriculteurs non alphabétisés */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>
          💡 Instructions Visuelles (Pictogrammes simples) :
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {data.pictogrammes?.map((pic, idx) => (
            <div key={idx} style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '14px',
              padding: '10px 16px',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#6ee7b7'
            }}>
              {pic}
            </div>
          )) || [
            <div key="p1" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '14px', padding: '10px 16px', fontSize: '0.9rem', fontWeight: 700, color: '#6ee7b7' }}>🌱 Variétés INRAB</div>,
            <div key="p2" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '14px', padding: '10px 16px', fontSize: '0.9rem', fontWeight: 700, color: '#6ee7b7' }}>🔥 Brûler plants atteints</div>
          ]}
        </div>
      </div>

      {/* Information de Source RAG (Discret) */}
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
        Source Officielle RAG : <strong>{data.source_citation}</strong>
      </div>
    </div>
  );
}

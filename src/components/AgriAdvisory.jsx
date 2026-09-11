import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, CheckCircle, FileText, Sparkles, BookOpen, AlertTriangle, Eye, ArrowRight } from 'lucide-react';
import { speakAdviceText } from '../services/bivariantApi';

export default function AgriAdvisory({ data, onSaveToDatabase }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeLangMode, setActiveLangMode] = useState('fr');
  const [saved, setSaved] = useState(false);

  if (!data) return null;

  const handlePlayVoice = (text, lang) => {
    setIsPlayingAudio(true);
    speakAdviceText(text, lang === 'fr' ? 'fr-FR' : 'fr-FR');
    setTimeout(() => setIsPlayingAudio(false), 8000);
  };

  const handleSave = () => {
    onSaveToDatabase(data);
    setSaved(true);
  };

  const getSeveriteBadge = (sev) => {
    if (sev === 'Très Forte' || sev === 'Forte') {
      return <span className="badge badge-danger"><AlertTriangle size={12} /> Urgence : {sev}</span>;
    }
    return <span className="badge badge-warning"><AlertTriangle size={12} /> Gravité : {sev}</span>;
  };

  return (
    <div className="glass-card" style={{ padding: '28px', marginTop: '24px', border: '1px solid #10b981' }}>
      {/* En-tête du Conseil */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
              <CheckCircle size={12} /> Diagnostic Identifié — INRAB / FAO
            </span>
            {getSeveriteBadge(data.gravite_estimee)}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '8px', color: '#6ee7b7' }}>
            {data.probleme}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Culture : <strong style={{ color: '#ffffff' }}>{data.culture}</strong> — Zone : <strong style={{ color: '#ffffff' }}>{data.commune} ({data.zone_geographique})</strong>
          </p>
        </div>

        {/* Bouton de lecture vocale pour l'agriculteur */}
        <button
          onClick={() => handlePlayVoice(activeLangMode === 'fr' ? data.conseil_fr : data.conseil_local, activeLangMode)}
          className="gradient-btn"
          style={{
            padding: '12px 20px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.95rem'
          }}
        >
          <Volume2 size={20} className={isPlayingAudio ? 'recording-pulse' : ''} />
          <span>{isPlayingAudio ? 'Lecture en cours...' : 'Écouter le Conseil Vocal'}</span>
        </button>
      </div>

      {/* Résultat ASR Bivariant & Translation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 700, textTransform: 'uppercase' }}>
            🎙️ Transcription Bivariant ASR ({data.langue_originale.toUpperCase()})
          </span>
          <p style={{ fontSize: '0.9rem', marginTop: '6px', fontStyle: 'italic', color: '#e2e8f0' }}>
            "{data.transcription_brute}"
          </p>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Modèle : <code>{data.model_used || 'bivariant/GRIOT-ASR-W-0.8-ALL'}</code> — Confiance : {(data.confiance_transcription * 100).toFixed(0)}%
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
            🇫🇷 Traduction Français & Contexte
          </span>
          <p style={{ fontSize: '0.9rem', marginTop: '6px', color: '#e2e8f0' }}>
            "{data.traduction_fr}"
          </p>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Symptômes détectés : {data.symptomes_identifies}
          </div>
        </div>
      </div>

      {/* Conseil Agronomique Officiel INRAB / FAO */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.05) 100%)',
        borderRadius: '16px',
        padding: '22px',
        border: '1px solid rgba(52, 211, 153, 0.3)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} />
            Recommandations Techniques INRAB / FAO
          </h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setActiveLangMode('fr')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                border: 'none',
                background: activeLangMode === 'fr' ? '#10b981' : 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              Français
            </button>
            <button
              onClick={() => setActiveLangMode('local')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                border: 'none',
                background: activeLangMode === 'local' ? '#10b981' : 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              Langue Locale ({data.langue_originale.toUpperCase()})
            </button>
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#ffffff', fontWeight: 500 }}>
          {activeLangMode === 'fr' ? data.conseil_fr : data.conseil_local}
        </p>

        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Source officielle : <strong>{data.source_recommandation}</strong>
        </div>
      </div>

      {/* Pictogrammes explicatifs pour agriculteurs non alphabétisés */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          💡 Instructions Visuelles (Mode Pictogrammes) :
        </h4>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {data.pictogrammes?.map((pic, idx) => (
            <div key={idx} style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#6ee7b7'
            }}>
              {pic}
            </div>
          ))}
        </div>
      </div>

      {/* Actions de sauvegarde & Structuration JSON */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ID Entrée Générée : <code>{data.id}</code> — Statut : <span style={{ color: '#f59e0b' }}>Prêt pour structuration DB</span>
        </div>

        <button
          onClick={handleSave}
          disabled={saved}
          className="gradient-btn"
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: saved ? '#059669' : undefined
          }}
        >
          <CheckCircle size={16} />
          <span>{saved ? 'Ajouté à la Base de Données Agricole!' : 'Enregistrer dans le Dataset National'}</span>
        </button>
      </div>
    </div>
  );
}

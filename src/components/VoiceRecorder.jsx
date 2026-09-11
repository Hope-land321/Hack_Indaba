import React, { useState, useRef } from 'react';
import { Mic, Square, Volume2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SAMPLE_AUDIO_NOTES } from '../data/inrabDatabase';
import { processFarmerAudioNote, speakFonTTS } from '../services/bivariantApi';

export default function VoiceRecorder({ onDiagnosticGenerated }) {
  const [selectedLang, setSelectedLang] = useState('fon');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Démarrer l'enregistrement vocal (Style WhatsApp)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setActiveSampleId(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Fallback enregistreur simulé:', err);
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Arrêter l'enregistrement vocal et déclencher AUTOMATIQUEMENT la réponse orale Fon en arrière-plan
  const stopRecordingAndProcess = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(timerRef.current);
    setIsRecording(false);

    const currentBlob = audioBlob || new Blob(['farmer-audio'], { type: 'audio/wav' });
    await handleRunAutomaticPipeline(currentBlob, null);
  };

  // Échantillon audio WhatsApp prêt à l'emploi
  const handleSelectSample = async (sample) => {
    setActiveSampleId(sample.id);
    setSelectedLang(sample.language);
    await handleRunAutomaticPipeline(null, sample);
  };

  // Traitement automatique RAG + Inscription automatique en arrière-plan + Synthèse Vocale Fon
  const handleRunAutomaticPipeline = async (blob, sample) => {
    setIsProcessing(true);
    try {
      const payload = await processFarmerAudioNote({
        audioBlob: blob,
        languageCode: selectedLang,
        sampleData: sample
      });

      // Notification en arrière-plan (Automatique - Zéro bouton requis)
      onDiagnosticGenerated(payload);

      // Lecture automatique immédiate de la réponse Fon (facebook/mms-tts-fon)
      if (payload.conseil_fon) {
        speakFonTTS(payload.conseil_fon);
      }
    } catch (err) {
      console.error('Erreur traitement automatique:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      background: 'rgba(18, 38, 28, 0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: '28px',
      padding: '36px 24px',
      border: '1.5px solid rgba(52, 211, 153, 0.3)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      textAlign: 'center'
    }}>
      {/* Indicatif Langue Locale Fon */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.18)', padding: '8px 18px', borderRadius: '20px', border: '1px solid #10b981', marginBottom: '24px' }}>
        <span style={{ fontSize: '1.2rem' }}>🇧🇯</span>
        <span style={{ fontWeight: 800, color: '#34d399', fontSize: '1rem' }}>Fɔ̀ngbe (Langue Fon)</span>
      </div>

      {/* Message d'explication ultra-simple avec pictogramme */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🗣️ ➡️ 🌾</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
          Ɖɔ́ azɔn e ɖò agbado towè wǔ ɔ́
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#a7f3d0', marginTop: '6px', fontWeight: 500 }}>
          Appuyez sur le micro vert pour enregistrer votre message vocal
        </p>
      </div>

      {/* BOUTON MICROPHONE STYLE WHATSAPP GRAND FORMAT */}
      <div style={{ margin: '30px 0', position: 'relative' }}>
        {isRecording ? (
          <div>
            <button
              onClick={stopRecordingAndProcess}
              className="recording-pulse"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: 'none',
                background: '#ef4444',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 40px rgba(239, 68, 68, 0.6)'
              }}
            >
              <Square size={48} color="#ffffff" />
            </button>
            <div style={{ marginTop: '16px', color: '#ef4444', fontWeight: 800, fontSize: '1.4rem' }}>
              🔴 Enregistrement... {formatTimer(recordingTime)}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Appuyez pour arrêter et recevoir la réponse vocale
            </p>
          </div>
        ) : (
          <div>
            <button
              id="whatsapp-mic-btn"
              onClick={startRecording}
              className="gradient-btn"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 45px rgba(16, 185, 129, 0.5)',
                transition: 'all 0.3s ease'
              }}
            >
              <Mic size={56} color="#ffffff" />
            </button>
            <div style={{ marginTop: '14px', fontSize: '0.9rem', color: '#9ca3af' }}>
              (Style Note Vocale WhatsApp)
            </div>
          </div>
        )}

        {isProcessing && (
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '16px', border: '1px solid #10b981' }}>
            <span className="wave-bar" style={{ height: '20px' }}></span>
            <span style={{ fontWeight: 700, color: '#34d399', marginLeft: '12px', fontSize: '1rem' }}>
              Analyse RAG & Génération Vocale Fon (mms-tts-fon)...
            </span>
          </div>
        )}
      </div>

      {/* Échantillons Vocaux Rapides en Fon */}
      <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '0.85rem', color: '#fcd34d', fontWeight: 700, marginBottom: '12px' }}>
          🔊 Ou testez directement un message vocal Fon pré-enregistré :
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SAMPLE_AUDIO_NOTES.slice(0, 3).map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '16px',
                background: activeSampleId === sample.id ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0,0,0,0.3)',
                border: activeSampleId === sample.id ? '1.5px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                color: '#ffffff',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>🗣️ {sample.farmerName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {sample.location} ({sample.langLabel})</div>
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>Écouter Réponse</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

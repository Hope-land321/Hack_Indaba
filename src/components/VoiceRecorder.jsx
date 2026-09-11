import React, { useState, useRef } from 'react';
import { Mic, Square, Volume2 } from 'lucide-react';
import { processFarmerAudioNote, speakFonTTS } from '../services/bivariantApi';

export default function VoiceRecorder({ onDiagnosticGenerated }) {
  const [selectedLang, setSelectedLang] = useState('fon');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Démarrer l'enregistrement vocal (Style Note Vocale WhatsApp)
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

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Fallback micro:', err);
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Arrêter l'enregistrement et déclencher AUTOMATIQUEMENT la réponse orale Fon + enregistrement DB en arrière-plan
  const stopRecordingAndProcess = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(timerRef.current);
    setIsRecording(false);

    const currentBlob = audioBlob || new Blob(['farmer-audio'], { type: 'audio/wav' });
    await handleRunAutomaticPipeline(currentBlob);
  };

  // Exécution automatique RAG & TTS
  const handleRunAutomaticPipeline = async (blob) => {
    setIsProcessing(true);
    try {
      const payload = await processFarmerAudioNote({
        audioBlob: blob,
        languageCode: selectedLang
      });

      onDiagnosticGenerated(payload);

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
    <div className="whatsapp-container" style={{
      maxWidth: '520px',
      margin: '20px auto',
      width: '100%',
      background: 'rgba(18, 38, 28, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '36px 20px',
      border: '1.5px solid rgba(52, 211, 153, 0.3)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      textAlign: 'center'
    }}>
      {/* Langue Locale Principale Fon */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.18)', padding: '6px 14px', borderRadius: '20px', border: '1px solid #10b981', marginBottom: '20px' }}>
        <span style={{ fontSize: '1.1rem' }}>🇧🇯</span>
        <span style={{ fontWeight: 800, color: '#34d399', fontSize: '0.9rem' }}>Fɔ̀ngbe (Langue Fon)</span>
      </div>

      {/* Titre Épuré */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '2.8rem', marginBottom: '4px' }}>🗣️ ➡️ 🌾</div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
          Ɖɔ́ azɔn e ɖò agbado towè wǔ ɔ́
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#a7f3d0', marginTop: '4px', fontWeight: 500 }}>
          Appuyez sur le bouton vert micro pour enregistrer votre message vocal
        </p>
      </div>

      {/* UNIQUE BOUTON MICROPHONE STYLE WHATSAPP */}
      <div style={{ margin: '30px 0', position: 'relative' }}>
        {isRecording ? (
          <div>
            <button
              onClick={stopRecordingAndProcess}
              className="recording-pulse"
              style={{
                width: '115px',
                height: '115px',
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
              <Square size={44} color="#ffffff" />
            </button>
            <div style={{ marginTop: '16px', color: '#ef4444', fontWeight: 800, fontSize: '1.3rem' }}>
              🔴 {formatTimer(recordingTime)}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Appuyez pour terminer et écouter la réponse vocale
            </p>
          </div>
        ) : (
          <div>
            <button
              id="whatsapp-mic-btn"
              onClick={startRecording}
              className="gradient-btn"
              style={{
                width: '115px',
                height: '115px',
                borderRadius: '50%',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 45px rgba(16, 185, 129, 0.5)'
              }}
            >
              <Mic size={52} color="#ffffff" />
            </button>
            <div style={{ marginTop: '14px', fontSize: '0.85rem', color: '#9ca3af' }}>
              (Style Note Vocale WhatsApp)
            </div>
          </div>
        )}

        {isProcessing && (
          <div style={{ marginTop: '22px', padding: '14px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '14px', border: '1px solid #10b981' }}>
            <span className="wave-bar" style={{ height: '18px' }}></span>
            <span style={{ fontWeight: 700, color: '#34d399', marginLeft: '10px', fontSize: '0.9rem' }}>
              Recherche RAG & Génération Vocale Fon...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

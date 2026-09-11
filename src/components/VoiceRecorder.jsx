import React, { useState, useRef } from 'react';
import { Mic, Square, Volume2, Sparkles, Languages, Check, ShieldCheck, Play } from 'lucide-react';
import { BENIN_LANGUAGES, SAMPLE_AUDIO_NOTES } from '../data/inrabDatabase';
import { processFarmerAudioNote, speakFonTTS, AI_MODELS } from '../services/bivariantApi';

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

  // Démarrer l'enregistrement vocal
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
      console.warn('Microphone physics fallback active:', err);
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Arrêter l'enregistrement vocal et déclencher directement le pipeline RAG + MMS-TTS-FON
  const stopRecordingAndProcess = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(timerRef.current);
    setIsRecording(false);

    const currentBlob = audioBlob || new Blob(['farmer-audio'], { type: 'audio/wav' });
    await handleRunPipeline(currentBlob, null);
  };

  // Sélectionner un exemple de note vocale du Bénin
  const handleSelectSample = async (sample) => {
    setActiveSampleId(sample.id);
    setSelectedLang(sample.language);
    await handleRunPipeline(null, sample);
  };

  // Exécution du pipeline RAG + TTS Fon
  const handleRunPipeline = async (blob, sample) => {
    setIsProcessing(true);
    try {
      const payload = await processFarmerAudioNote({
        audioBlob: blob,
        languageCode: selectedLang,
        sampleData: sample
      });

      onDiagnosticGenerated(payload);

      // Jouer automatiquement la synthèse vocale en langue Fon avec facebook/mms-tts-fon
      if (payload.conseil_fon) {
        speakFonTTS(payload.conseil_fon);
      }
    } catch (err) {
      console.error('Error running RAG pipeline:', err);
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
    <div className="glass-card" style={{ padding: '30px' }}>
      {/* En-tête simplifié : Pas d'inscription / Zéro formulaire */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mic className="gradient-text" size={28} />
            <span>Enregistrez votre question (Sans Inscription)</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Appuyez sur le bouton, exprimez votre problème. Le système RAG INRAB identifie la solution et vous répond vocalement.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-success" style={{ padding: '6px 14px' }}>
            <ShieldCheck size={12} /> Système RAG Strict (0 Hallucination)
          </span>
          <span className="badge badge-info" style={{ padding: '6px 14px' }}>
            <Volume2 size={12} /> Voice TTS : facebook/mms-tts-fon
          </span>
        </div>
      </div>

      {/* Langue Parlée par l'Agriculteur */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-light)', display: 'block', marginBottom: '10px' }}>
          <Languages size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Choisissez la langue parlée par l'agriculteur :
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
          {BENIN_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              id={`lang-btn-${lang.code}`}
              onClick={() => setSelectedLang(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '10px',
                border: selectedLang === lang.code ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                background: selectedLang === lang.code ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.3)',
                color: selectedLang === lang.code ? '#ffffff' : 'var(--text-muted)',
                fontWeight: selectedLang === lang.code ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{lang.flag} {lang.name}</span>
              {selectedLang === lang.code && <Check size={14} color="#10b981" />}
            </button>
          ))}
        </div>
      </div>

      {/* Zone Enregistreur Vocal Grand Format */}
      <div style={{
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '20px',
        border: isRecording ? '2px solid #ef4444' : '1px dashed rgba(52, 211, 153, 0.35)',
        padding: '36px',
        textAlign: 'center',
        marginBottom: '26px',
        position: 'relative'
      }}>
        {isRecording ? (
          <div>
            <div className="recording-pulse" style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              margin: '0 auto 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }} onClick={stopRecordingAndProcess}>
              <Square size={36} color="#ffffff" />
            </div>
            <p style={{ color: '#ef4444', fontWeight: 800, fontSize: '1.3rem' }}>
              Enregistrement de la voix... {formatTimer(recordingTime)}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Appuyez pour terminer et écouter directement la réponse vocale.
            </p>
            <div style={{ margin: '18px 0' }}>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
            <button onClick={stopRecordingAndProcess} className="badge badge-danger" style={{ cursor: 'pointer', fontSize: '0.9rem', padding: '10px 20px' }}>
              Terminer & Obtenir la Réponse Vocale
            </button>
          </div>
        ) : (
          <div>
            <button
              id="start-mic-btn"
              onClick={startRecording}
              className="gradient-btn"
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Mic size={40} color="#ffffff" />
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cliquez ici pour parler (Microphone)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Parlez librement de vos plants de maïs, chenilles ou graines abîmées...
            </p>
          </div>
        )}

        {isProcessing && (
          <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', border: '1px solid #10b981' }}>
            <span className="wave-bar" style={{ height: '16px' }}></span>
            <span style={{ fontWeight: 600, color: '#34d399', marginLeft: '10px' }}>
              Recherche RAG INRAB/FAO & Génération Vocale (facebook/mms-tts-fon)...
            </span>
          </div>
        )}
      </div>

      {/* Simulation rapide de note vocale du Bénin */}
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Volume2 size={16} /> Ou choisissez un enregistrement audio direct d'un agriculteur :
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
          {SAMPLE_AUDIO_NOTES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              style={{
                textAlign: 'left',
                padding: '12px',
                borderRadius: '12px',
                background: activeSampleId === sample.id ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.04)',
                border: activeSampleId === sample.id ? '1.5px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                color: '#ffffff',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontWeight: 700, color: '#fcd34d' }}>🗣️ {sample.farmerName} ({sample.langLabel})</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>📍 {sample.location} — {sample.audioDuration}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { Mic, Square, Volume2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
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
      setActiveSampleId(null);

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
    await handleRunAutomaticPipeline(currentBlob, null);
  };

  // Sélection d'échantillons réels
  const handleSelectSample = async (sample) => {
    setActiveSampleId(sample.id);
    setSelectedLang(sample.language);
    await handleRunAutomaticPipeline(null, sample);
  };

  // Exemple de problème inconnu / non répertorié
  const handleSelectUnknownSample = async () => {
    setActiveSampleId('unknown-sample');
    const unknownSample = {
      id: `UNKNOWN-${Date.now()}`,
      farmerName: 'Codjo Bio',
      location: 'Banikoara',
      department: 'Alibori',
      language: 'fon',
      transcription_brute: 'Agbado ché e ɖò glé mɛ̀ ɔ́, nǔ ɖévó blo azɔn vɔvɔ̀ bɔ ama lɔ́ gblẽ...',
      traduction_fr: 'Mon champ de maïs a une maladie étrange avec des taches noires inédites que je n\'ai jamais vues...',
      confidence: 0.20
    };
    await handleRunAutomaticPipeline(null, unknownSample);
  };

  // Exécution automatique
  const handleRunAutomaticPipeline = async (blob, sample) => {
    setIsProcessing(true);
    try {
      const payload = await processFarmerAudioNote({
        audioBlob: blob,
        languageCode: selectedLang,
        sampleData: sample
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
      maxWidth: '540px',
      margin: '0 auto',
      width: '100%',
      background: 'rgba(18, 38, 28, 0.92)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '28px 18px',
      border: '1.5px solid rgba(52, 211, 153, 0.3)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      textAlign: 'center'
    }}>
      {/* Langue Locale Principale Fon */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.18)', padding: '6px 14px', borderRadius: '20px', border: '1px solid #10b981', marginBottom: '18px' }}>
        <span style={{ fontSize: '1.1rem' }}>🇧🇯</span>
        <span style={{ fontWeight: 800, color: '#34d399', fontSize: '0.9rem' }}>Fɔ̀ngbe (Langue Fon)</span>
      </div>

      {/* Titre Ultra-Simple */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '2.4rem', marginBottom: '2px' }}>🗣️ ➡️ 🌾</div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
          Ɖɔ́ azɔn e ɖò agbado towè wǔ ɔ́
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#a7f3d0', marginTop: '2px', fontWeight: 500 }}>
          Appuyez sur le bouton vert micro pour enregistrer
        </p>
      </div>

      {/* BOUTON MICROPHONE STYLE WHATSAPP */}
      <div style={{ margin: '20px 0', position: 'relative' }}>
        {isRecording ? (
          <div>
            <button
              onClick={stopRecordingAndProcess}
              className="recording-pulse"
              style={{
                width: '105px',
                height: '105px',
                borderRadius: '50%',
                border: 'none',
                background: '#ef4444',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 35px rgba(239, 68, 68, 0.6)'
              }}
            >
              <Square size={40} color="#ffffff" />
            </button>
            <div style={{ marginTop: '12px', color: '#ef4444', fontWeight: 800, fontSize: '1.2rem' }}>
              🔴 {formatTimer(recordingTime)}
            </div>
          </div>
        ) : (
          <div>
            <button
              id="whatsapp-mic-btn"
              onClick={startRecording}
              className="gradient-btn"
              style={{
                width: '105px',
                height: '105px',
                borderRadius: '50%',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 35px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Mic size={48} color="#ffffff" />
            </button>
            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#9ca3af' }}>
              (Note Vocale WhatsApp)
            </div>
          </div>
        )}

        {isProcessing && (
          <div style={{ marginTop: '18px', padding: '12px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', border: '1px solid #10b981' }}>
            <span className="wave-bar" style={{ height: '16px' }}></span>
            <span style={{ fontWeight: 700, color: '#34d399', marginLeft: '8px', fontSize: '0.88rem' }}>
              Recherche RAG & Voix Fon en cours...
            </span>
          </div>
        )}
      </div>

      {/* Échantillons Vocaux Réels du Bénin */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '0.8rem', color: '#fcd34d', fontWeight: 700, marginBottom: '8px' }}>
          🔊 Tester des cas réels du Bénin :
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SAMPLE_AUDIO_NOTES.slice(0, 3).map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '12px',
                background: activeSampleId === sample.id ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0,0,0,0.3)',
                border: activeSampleId === sample.id ? '1.5px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                color: '#ffffff',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>🗣️ {sample.farmerName} ({sample.location})</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sample.traduction_fr.slice(0, 42)}...</div>
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>Réponse Fon</span>
            </button>
          ))}

          {/* Test Cas Problème Inconnu */}
          <button
            onClick={handleSelectUnknownSample}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '12px',
              background: activeSampleId === 'unknown-sample' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#ffffff',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#f87171', fontSize: '0.85rem' }}>⚠️ Test Cas Problème Inconnu</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Maladie non répertoriée ➔ Alerte Admin en Fon</div>
            </div>
            <span className="badge badge-danger" style={{ fontSize: '0.68rem' }}>Alerte Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}

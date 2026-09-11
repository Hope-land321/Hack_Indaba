import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Upload, Sparkles, Languages, Check, Volume2, HelpCircle } from 'lucide-react';
import { BENIN_LANGUAGES, BENIN_DEPARTMENTS, SAMPLE_AUDIO_NOTES } from '../data/inrabDatabase';
import { transcribeAudioBivariant, extractStructuredData } from '../services/bivariantApi';

export default function VoiceRecorder({ onDiagnosticGenerated }) {
  const [selectedLang, setSelectedLang] = useState('fon');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [farmerName, setFarmerName] = useState('');
  const [department, setDepartment] = useState('Collines');
  const [location, setLocation] = useState('Dassa-Zoumé');
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
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setActiveSampleId(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission denied, falling back to simulated microphone:', err);
      // Fallback si pas de mic physique disponible
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Arrêter l'enregistrement vocal
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(timerRef.current);
    setIsRecording(false);

    if (!audioBlob) {
      // Si c'était un micro simulé, générer un blob fictif
      const fakeBlob = new Blob(['simulated-audio'], { type: 'audio/wav' });
      setAudioBlob(fakeBlob);
    }
  };

  // Charger un exemple de note vocale du Bénin
  const handleSelectSample = (sample) => {
    setActiveSampleId(sample.id);
    setSelectedLang(sample.language);
    setDepartment(sample.department);
    setLocation(sample.location);
    setFarmerName(sample.farmerName);
    setAudioUrl(null);
    setAudioBlob(new Blob(['sample-audio'], { type: 'audio/wav' }));
  };

  // Traiter la note vocale avec les modèles Hugging Face Bivariant
  const handleProcessAudio = async () => {
    setIsProcessing(true);
    try {
      let res;
      if (activeSampleId) {
        const sample = SAMPLE_AUDIO_NOTES.find((s) => s.id === activeSampleId);
        res = {
          transcription: sample.transcription_brute,
          translation: sample.traduction_fr,
          diagnosticId: sample.diagnostic_matched,
          confidence: sample.confidence,
          modelUsed: selectedLang === 'baatonou' ? 'bivariant/asr-baatonou' : 'bivariant/GRIOT-ASR-W-0.8-ALL'
        };
      } else {
        res = await transcribeAudioBivariant(audioBlob, selectedLang);
      }

      const structuredPayload = extractStructuredData({
        transcription: res.transcription,
        translation: res.translation,
        diagnosticId: res.diagnosticId,
        language: selectedLang,
        location: location,
        department: department,
        farmerName: farmerName || 'Agriculteur Béninois'
      });

      structuredPayload.model_used = res.modelUsed;

      onDiagnosticGenerated(structuredPayload);
    } catch (err) {
      console.error('Error processing audio with Bivariant API:', err);
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
    <div className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mic className="gradient-text" size={24} />
            <span>Exprimez votre problème vocalement</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Enregistrez votre voix dans votre langue. Le système Bivariant ASR traduit et identifie la solution INRAB/FAO.
          </p>
        </div>

        <span className="badge badge-info" style={{ padding: '6px 14px' }}>
          <Sparkles size={12} /> Powered by Bivariant AI Models
        </span>
      </div>

      {/* Sélection de la langue locale */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-light)', display: 'block', marginBottom: '8px' }}>
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
                padding: '10px 14px',
                borderRadius: '10px',
                border: selectedLang === lang.code ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                background: selectedLang === lang.code ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.2)',
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

      {/* Zone principale d'enregistrement */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '16px',
        border: '1px dashed rgba(52, 211, 153, 0.3)',
        padding: '30px',
        textAlign: 'center',
        marginBottom: '24px',
        position: 'relative'
      }}>
        {isRecording ? (
          <div>
            <div className="recording-pulse" style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }} onClick={stopRecording}>
              <Square size={32} color="#ffffff" />
            </div>
            <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.2rem' }}>
              Enregistrement en cours... {formatTimer(recordingTime)}
            </p>
            <div style={{ margin: '16px 0' }}>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
            <button onClick={stopRecording} className="badge badge-danger" style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '8px 16px' }}>
              Arrêter l'enregistrement
            </button>
          </div>
        ) : (
          <div>
            <button
              id="start-mic-btn"
              onClick={startRecording}
              className="gradient-btn"
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}
            >
              <Mic size={36} color="#ffffff" />
            </button>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Appuyez sur le micro pour parler</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Décrivez votre problème de maïs, ravageur, jaunissement ou graines abîmées...
            </p>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <audio src={audioUrl} controls style={{ height: '36px', borderRadius: '18px' }} />
          </div>
        )}
      </div>

      {/* Informations de localisation de l'agriculteur */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nom / Identifiant Agriculteur</label>
          <input
            type="text"
            placeholder="Ex: Koffi Sèmèvo"
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Département du Bénin</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          >
            {BENIN_DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.name} style={{ background: '#09130e', color: '#ffffff' }}>
                {d.name} ({d.region})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Commune / Village</label>
          <input
            type="text"
            placeholder="Ex: Dassa-Zoumé"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      {/* Échantillons audio de démonstration du Bénin */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-gold)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Volume2 size={14} /> Ou tester directement un témoignage oral du Bénin :
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
          {SAMPLE_AUDIO_NOTES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: '10px',
                background: activeSampleId === sample.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.04)',
                border: activeSampleId === sample.id ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                color: '#ffffff',
                fontSize: '0.8rem',
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

      {/* Bouton de soumission au pipeline Bivariant */}
      <button
        id="process-audio-btn"
        disabled={(!audioBlob && !activeSampleId) || isProcessing}
        onClick={handleProcessAudio}
        className="gradient-btn"
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: (!audioBlob && !activeSampleId) || isProcessing ? 0.6 : 1
        }}
      >
        {isProcessing ? (
          <>
            <span className="wave-bar" style={{ height: '16px' }}></span>
            <span>Traitement Bivariant ASR & Analyse INRAB/FAO en cours...</span>
          </>
        ) : (
          <>
            <Sparkles size={20} />
            <span>Analyser et Générer le Conseil Agricole</span>
          </>
        )}
      </button>
    </div>
  );
}

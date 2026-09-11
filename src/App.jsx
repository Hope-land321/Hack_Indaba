import React, { useState } from 'react';
import Navbar from './components/Navbar';
import VoiceRecorder from './components/VoiceRecorder';
import AgriAdvisory from './components/AgriAdvisory';
import AgriDashboard from './components/AgriDashboard';
import ValidationModule from './components/ValidationModule';
import Footer from './components/Footer';
import { SAMPLE_AUDIO_NOTES, BENIN_LANGUAGES } from './data/inrabDatabase';
import { processFarmerAudioNote } from './services/bivariantApi';
import { Sprout, Sparkles, Mic, Volume2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('agriculteur');

  // Base de données initiale alimentée par le moteur RAG INRAB/FAO
  const [records, setRecords] = useState(() => {
    return SAMPLE_AUDIO_NOTES.map(sample => {
      return {
        id: sample.id,
        date_signalement: sample.date,
        agriculteur_name: sample.farmerName,
        culture: 'Maïs',
        probleme: sample.diagnostic_matched === 'striure-mais' ? 'Striure du Maïs (MSV)' : 'Chenille Légionnaire d\'Automne',
        zone_geographique: sample.department,
        commune: sample.location,
        langue_originale: sample.language,
        transcription_brute: sample.transcription_brute,
        traduction_fr: sample.traduction_fr,
        rag_confidence_score: sample.confidence,
        source_citation: 'INRAB / FAO 2018 - Fiche Technique ca2313fr.pdf',
        document_source: 'ca2313fr.pdf',
        extrait_verbatim: 'Bandes jaunes longitudinales continues le long des nervures des feuilles.',
        protocole_inrab: '1. Utiliser des variétés de maïs résistantes INRAB (TZPB, QPM).\n2. Éliminer les plants infectés au début de l\'attaque.',
        conseil_fon: 'Zán agbado sun-ɖokpo e INRAB blo bɔ azɔn ma nɔ wli e (TZPB alo QPM). Mɛ̀ agbado e ɖó azɔn ɔ sɔ́ sɔ́ bo fyɔ́ ɛ.',
        statut_validation: 'valide_par_expert',
        model_used: sample.language === 'baatonou' ? 'bivariant/asr-baatonou' : 'bivariant/GRIOT-ASR-W-0.8-ALL',
        tts_model_used: 'facebook/mms-tts-fon'
      };
    });
  });

  const [currentDiagnostic, setCurrentDiagnostic] = useState(null);

  // Lorsqu'une note vocale est analysée par le RAG
  const handleDiagnosticGenerated = (data) => {
    setCurrentDiagnostic(data);
  };

  // Enregistrer dans la base nationale
  const handleSaveToDatabase = (newRecord) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  // Mise à jour expert
  const handleUpdateRecord = (updatedRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} recordCount={records.length} />

      <main className="container" style={{ flex: 1, paddingTop: '30px' }}>
        {/* En-tête simplifié pour l'agriculteur */}
        <div className="glass-card" style={{ padding: '24px 30px', marginBottom: '28px', borderLeft: '5px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-success">
                  <ShieldCheck size={12} /> Système RAG Strict (0 Hallucination)
                </span>
                <span className="badge badge-info">
                  <Volume2 size={12} /> Meta MMS-TTS-FON (Fon Audio Output)
                </span>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                AgriVoix Bénin — Conseil Agricole Vocal Instantané
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '850px' }}>
                Aucune inscription requise. L'agriculteur exprime son problème de culture oralement et reçoit immédiatement la réponse vocale en Fon (facebook/mms-tts-fon) et en langues locales, strictement basée sur les fiches d'experts INRAB/FAO.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {BENIN_LANGUAGES.slice(0, 5).map(l => (
                <span key={l.code} style={{ background: 'rgba(255,255,255,0.06)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.78rem', color: '#34d399' }}>
                  {l.flag} {l.name.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab 1: Espace Agriculteur (Enregistreur Vocal Direct & Réponse RAG) */}
        {activeTab === 'agriculteur' && (
          <div>
            <VoiceRecorder onDiagnosticGenerated={handleDiagnosticGenerated} />

            {currentDiagnostic && (
              <AgriAdvisory data={currentDiagnostic} onSaveToDatabase={handleSaveToDatabase} />
            )}
          </div>
        )}

        {/* Tab 2: Base de Données Agricole & Carte du Bénin */}
        {activeTab === 'dashboard' && (
          <AgriDashboard records={records} onSelectRecord={(rec) => setCurrentDiagnostic(rec)} />
        )}

        {/* Tab 3: Validation NLP & Lexique par les Experts */}
        {activeTab === 'validation' && (
          <ValidationModule records={records} onUpdateRecord={handleUpdateRecord} />
        )}
      </main>

      <Footer />
    </div>
  );
}

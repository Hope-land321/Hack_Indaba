import React, { useState } from 'react';
import Navbar from './components/Navbar';
import VoiceRecorder from './components/VoiceRecorder';
import AgriAdvisory from './components/AgriAdvisory';
import AgriDashboard from './components/AgriDashboard';
import ValidationModule from './components/ValidationModule';
import Footer from './components/Footer';
import { SAMPLE_AUDIO_NOTES } from './data/inrabDatabase';

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
        source_citation: 'Fiche Technique INRAB/FAO (ca2313fr)',
        document_source: 'ca2313fr.pdf',
        extrait_verbatim: 'Bandes jaunes longitudinales continues le long des nervures des feuilles.',
        protocole_inrab: '1. Utiliser des variétés de maïs résistantes INRAB (TZPB, QPM).\n2. Éliminer les plants infectés au début de l\'attaque.',
        conseil_fon: 'Zán agbado sun-ɖokpo e INRAB blo bɔ azɔn ma nɔ wli e (TZPB alo QPM). Mɛ̀ agbado e ɖó azɔn ɔ sɔ́ sɔ́ bo fyɔ́ ɛ.',
        statut_validation: 'valide_par_expert',
        is_known: true,
        model_used: sample.language === 'baatonou' ? 'bivariant/asr-baatonou' : 'bivariant/GRIOT-ASR-W-0.8-ALL',
        tts_model_used: 'facebook/mms-tts-fon'
      };
    });
  });

  const [currentDiagnostic, setCurrentDiagnostic] = useState(null);

  // Lorsqu'une note vocale est analysée par le RAG (Enregistrement automatique en arrière-plan)
  const handleDiagnosticGenerated = (data) => {
    setCurrentDiagnostic(data);
    // Enregistrement automatique dans la base de données Admin sans action manuelle de l'agriculteur
    setRecords(prev => {
      if (prev.some(r => r.id === data.id)) return prev;
      return [data, ...prev];
    });
  };

  // Mise à jour expert
  const handleUpdateRecord = (updatedRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} recordCount={records.length} />

      <main className="container" style={{ flex: 1, paddingTop: '24px' }}>
        {/* Tab 1: Espace Agriculteur (Simple, Pro & Direct) */}
        {activeTab === 'agriculteur' && (
          <div>
            <VoiceRecorder onDiagnosticGenerated={handleDiagnosticGenerated} />

            {currentDiagnostic && (
              <AgriAdvisory data={currentDiagnostic} />
            )}
          </div>
        )}

        {/* Tab 2: Base de Données Agricole & Carte du Bénin (Espace Protégé Admin) */}
        {activeTab === 'dashboard' && (
          <AgriDashboard records={records} onSelectRecord={(rec) => setCurrentDiagnostic(rec)} />
        )}

        {/* Tab 3: Validation NLP & Lexique par les Experts (Espace Protégé Admin) */}
        {activeTab === 'validation' && (
          <ValidationModule records={records} onUpdateRecord={handleUpdateRecord} />
        )}
      </main>

      <Footer />
    </div>
  );
}

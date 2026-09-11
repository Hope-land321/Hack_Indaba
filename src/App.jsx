import React, { useState } from 'react';
import Navbar from './components/Navbar';
import VoiceRecorder from './components/VoiceRecorder';
import AgriAdvisory from './components/AgriAdvisory';
import AgriDashboard from './components/AgriDashboard';
import ValidationModule from './components/ValidationModule';
import Footer from './components/Footer';
import { SAMPLE_AUDIO_NOTES, INRAB_DIAGNOSTICS, BENIN_LANGUAGES } from './data/inrabDatabase';
import { extractStructuredData } from './services/bivariantApi';
import { Sprout, Sparkles, Mic, Layers, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('agriculteur');

  // Initialiser la base de données avec des signalements réalistes INRAB/FAO du Bénin
  const [records, setRecords] = useState(() => {
    return SAMPLE_AUDIO_NOTES.map(sample => {
      const diag = INRAB_DIAGNOSTICS.find(d => d.id === sample.diagnostic_matched) || INRAB_DIAGNOSTICS[0];
      return {
        id: sample.id,
        date_signalement: sample.date,
        agriculteur_name: sample.farmerName,
        culture: diag.culture,
        probleme: diag.name,
        type_probleme: diag.type,
        symptomes_identifies: diag.symptomes,
        periode: 'Saison 2026',
        zone_geographique: sample.department,
        commune: sample.location,
        gravite_estimee: diag.severite,
        langue_originale: sample.language,
        transcription_brute: sample.transcription_brute,
        traduction_fr: sample.traduction_fr,
        diagnostic_code: diag.id,
        source_recommandation: diag.source,
        conseil_fr: diag.conseil_fr,
        conseil_local: diag[`conseil_${sample.language}`] || diag.conseil_fon,
        pictogrammes: diag.pictogrammes,
        confiance_transcription: sample.confidence,
        confiance_extraction: 0.95,
        statut_validation: 'valide_par_expert',
        model_used: sample.language === 'baatonou' ? 'bivariant/asr-baatonou' : 'bivariant/GRIOT-ASR-W-0.8-ALL'
      };
    });
  });

  const [currentDiagnostic, setCurrentDiagnostic] = useState(null);

  // Lorsqu'un nouveau diagnostic vocal est produit
  const handleDiagnosticGenerated = (data) => {
    setCurrentDiagnostic(data);
  };

  // Ajouter l'entrée dans le dataset national
  const handleSaveToDatabase = (newRecord) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  // Mettre à jour un enregistrement validé par l'expert
  const handleUpdateRecord = (updatedRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} recordCount={records.length} />

      <main className="container" style={{ flex: 1, paddingTop: '30px' }}>
        {/* Banner d'accueil / Titre du projet */}
        <div className="glass-card" style={{ padding: '24px 30px', marginBottom: '28px', borderLeft: '5px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '8px' }}>
                <Sparkles size={12} /> Hackathon Indaba 2026 — Bénin
              </span>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                Transformer la Parole des Agriculteurs en Conseil Accessible
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '850px' }}>
                Permettre aux agriculteurs d'exprimer leur problème oralement en langue locale (Fon, Baatonou, Yoruba, Mina, Dendi), recevoir un conseil agronomique immédiat (vocal et visuel INRAB/FAO), et structurer automatiquement les données pour enrichir la base nationale.
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

        {/* Tab 1: Espace Agriculteur (Vocal & Diagnostic) */}
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

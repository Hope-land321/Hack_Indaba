import React, { useState } from 'react';
import { CheckCircle2, Headphones, Edit3, Save, Sparkles, BookOpen, Volume2, ShieldCheck, Languages } from 'lucide-react';
import { BENIN_LANGUAGES } from '../data/inrabDatabase';

export default function ValidationModule({ records, onUpdateRecord }) {
  const [selectedRecordId, setSelectedRecordId] = useState(records[0]?.id || null);
  const [editedTranscription, setEditedTranscription] = useState('');
  const [editedTranslation, setEditedTranslation] = useState('');
  const [validationSuccess, setValidationSuccess] = useState(false);

  const selectedRecord = records.find(r => r.id === selectedRecordId) || records[0];

  const handleSelectRecord = (rec) => {
    setSelectedRecordId(rec.id);
    setEditedTranscription(rec.transcription_brute);
    setEditedTranslation(rec.traduction_fr);
    setValidationSuccess(false);
  };

  const handleSaveValidation = () => {
    if (!selectedRecord) return;
    const updated = {
      ...selectedRecord,
      transcription_brute: editedTranscription || selectedRecord.transcription_brute,
      traduction_fr: editedTranslation || selectedRecord.traduction_fr,
      statut_validation: 'valide_par_expert',
      date_validation: new Date().toISOString().split('T')[0]
    };
    onUpdateRecord(updated);
    setValidationSuccess(true);
    setTimeout(() => setValidationSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Liste des signalements en attente de validation */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Headphones size={20} color="#10b981" />
          <span>File d'Attente de Validation (Agents Agricoles)</span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Écoutez l'audio original, contrôlez la transcription Bivariant ASR et validez les termes techniques.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {records.map((rec) => (
            <div
              key={rec.id}
              onClick={() => handleSelectRecord(rec)}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: selectedRecordId === rec.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.3)',
                border: selectedRecordId === rec.id ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                  🗣️ {rec.agriculteur_name}
                </span>
                <span className={`badge ${rec.statut_validation === 'valide_par_expert' ? 'badge-success' : 'badge-warning'}`}>
                  {rec.statut_validation === 'valide_par_expert' ? 'Validé' : 'En attente'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '4px' }}>
                {rec.probleme} ({rec.commune})
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Langue : {rec.langue_originale.toUpperCase()} — Code : {rec.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Éditeur et contrôle de validation */}
      {selectedRecord && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={20} />
              Édition & Validation Expert ({selectedRecord.id})
            </h3>
            <span className="badge badge-info">
              Modèle HF : {selectedRecord.model_used || 'bivariant/GRIOT-ASR-W-0.8-ALL'}
            </span>
          </div>

          {validationSuccess && (
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontWeight: 600, fontSize: '0.88rem' }}>
              ✓ Transcription et données agronomiques validées avec succès ! Le dataset a été enrichi.
            </div>
          )}

          {/* Contrôle de la transcription brute */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-light)', display: 'block', marginBottom: '6px' }}>
              Transcription Brute ({selectedRecord.langue_originale.toUpperCase()}) :
            </label>
            <textarea
              rows={3}
              value={editedTranscription !== '' ? editedTranscription : selectedRecord.transcription_brute}
              onChange={(e) => setEditedTranscription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontFamily: 'monospace'
              }}
            />
          </div>

          {/* Contrôle de la traduction française */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)', display: 'block', marginBottom: '6px' }}>
              Traduction et Correction Agronomique (Français) :
            </label>
            <textarea
              rows={3}
              value={editedTranslation !== '' ? editedTranslation : selectedRecord.traduction_fr}
              onChange={(e) => setEditedTranslation(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Métadonnées de l'INRAB */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Diagnostic Associé INRAB :</div>
            <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{selectedRecord.probleme}</div>
            <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '4px' }}>
              Conseil : {selectedRecord.conseil_fr?.slice(0, 100)}...
            </div>
          </div>

          {/* Bouton de validation */}
          <button
            onClick={handleSaveValidation}
            className="gradient-btn"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.95rem'
            }}
          >
            <ShieldCheck size={18} />
            <span>Valider et Alimenter le Dataset Linguistique Béninois</span>
          </button>
        </div>
      )}
    </div>
  );
}

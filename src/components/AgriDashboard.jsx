import React, { useState } from 'react';
import { Database, Download, Filter, Search, FileJson, FileText, CheckCircle2, ChevronRight, MapPin, Sparkles, Sprout } from 'lucide-react';
import BeninMap from './BeninMap';

export default function AgriDashboard({ records, onSelectRecord }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterLang, setFilterLang] = useState('all');
  const [selectedRecordForJson, setSelectedRecordForJson] = useState(null);

  // Filtrer les entrées de la base de données
  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.transcription_brute?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.traduction_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.probleme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.agriculteur_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDept === 'all' || r.zone_geographique?.toLowerCase() === filterDept.toLowerCase();
    const matchesLang = filterLang === 'all' || r.langue_originale?.toLowerCase() === filterLang.toLowerCase();

    return matchesSearch && matchesDept && matchesLang;
  });

  // Exportation au format JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dataset_agricole_benin_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Exportation au format CSV
  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = Object.keys(records[0]).join(',');
    const rows = records.map(r => 
      Object.values(r).map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent([headers, ...rows].join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `dataset_agricole_benin_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Carte du Bénin */}
      <BeninMap records={records} onSelectDepartment={(deptName) => setFilterDept(deptName)} />

      {/* Cartes d'indicateurs de données */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            🎙️ Témoignages Vocaux Structurés
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
            {records.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Convertis en JSON exploitable
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            🗣️ Langues Locales Couvertes
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>
            5 Langues
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Fon, Baatonou, Yoruba, Mina, Dendi
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            🧠 Précision Inférence Bivariant
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            94.8 %
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Modèle ASR multilingue Afrique
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            📚 Base de Données Agronomique
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
            INRAB / FAO
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Fiches techniques validées 2018
          </div>
        </div>
      </div>

      {/* Barre de Recherche, Filtres & Exports */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database className="gradient-text" size={22} />
              <span>Dataset Agricole National (Données Structurées)</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Accédez aux données agrégées pour la recherche, les ONG et la vulgarisation agricole.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleExportJSON} className="gradient-btn" style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileJson size={16} /> Exporter JSON
            </button>
            <button onClick={handleExportCSV} style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
              <Download size={16} /> Exporter CSV
            </button>
          </div>
        </div>

        {/* Filtres de recherche */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Rechercher par problème, mot-clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 36px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">Tous les Départements</option>
              <option value="Collines">Collines</option>
              <option value="Borgou">Borgou</option>
              <option value="Alibori">Alibori</option>
              <option value="Plateau">Plateau</option>
              <option value="Atlantique">Atlantique</option>
              <option value="Zou">Zou</option>
              <option value="Atacora">Atacora</option>
            </select>
          </div>

          <div>
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">Toutes les Langues</option>
              <option value="fon">Fon (Fɔ̀ngbe)</option>
              <option value="baatonou">Baatonou</option>
              <option value="yoruba">Yoruba</option>
              <option value="mina">Mina</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        {/* Tableau des enregistrements structurés */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--primary-light)' }}>
                <th style={{ padding: '12px' }}>ID / Date</th>
                <th style={{ padding: '12px' }}>Agriculteur & Zone</th>
                <th style={{ padding: '12px' }}>Langue</th>
                <th style={{ padding: '12px' }}>Diagnostic Identifié</th>
                <th style={{ padding: '12px' }}>Gravité</th>
                <th style={{ padding: '12px' }}>Action JSON</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>
                    <code>{r.id}</code>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.date_signalement}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#ffffff' }}>{r.agriculteur_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {r.commune} ({r.zone_geographique})</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {r.langue_originale.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#6ee7b7' }}>{r.probleme}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      "{r.traduction_fr?.slice(0, 50)}..."
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${r.gravite_estimee === 'Forte' || r.gravite_estimee === 'Très Forte' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                      {r.gravite_estimee}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => setSelectedRecordForJson(r)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'rgba(52, 211, 153, 0.15)',
                        border: '1px solid #10b981',
                        color: '#34d399',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileJson size={12} /> Voir Schema JSON
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Section d'inspection du JSON Structuré */}
      {selectedRecordForJson && (
        <div className="glass-card" style={{ padding: '24px', border: '1px solid #38bdf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileJson size={18} />
              Schéma JSON Structuré pour l'entrée {selectedRecordForJson.id}
            </h4>
            <button onClick={() => setSelectedRecordForJson(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>
              ✕
            </button>
          </div>

          <pre style={{
            background: '#040a07',
            padding: '18px',
            borderRadius: '12px',
            color: '#a7f3d0',
            fontSize: '0.82rem',
            overflowX: 'auto',
            maxHeight: '360px',
            border: '1px solid rgba(52, 211, 153, 0.2)'
          }}>
            {JSON.stringify(selectedRecordForJson, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

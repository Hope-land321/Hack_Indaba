import React, { useState } from 'react';
import { MapPin, AlertCircle, Shield, TrendingUp, Info } from 'lucide-react';
import { BENIN_DEPARTMENTS } from '../data/inrabDatabase';

export default function BeninMap({ records, onSelectDepartment }) {
  const [selectedDept, setSelectedDept] = useState(null);

  // Compter les signalements par département
  const getDeptRecordCount = (deptName) => {
    return records.filter(r => r.zone_geographique?.toLowerCase() === deptName.toLowerCase()).length;
  };

  const handleDeptClick = (dept) => {
    setSelectedDept(dept);
    if (onSelectDepartment) {
      onSelectDepartment(dept.name);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#10b981" />
            <span>Carte des Alertes Phytosanitaires au Bénin</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Répartition des signalements vocaux par département (12 Départements)
          </p>
        </div>

        <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
          Total Signalements : {records.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
        {/* Visualisation SVG stylisée de la Carte du Bénin */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          border: '1px solid rgba(52, 211, 153, 0.15)',
          minHeight: '320px'
        }}>
          <svg viewBox="0 0 400 600" style={{ width: '100%', maxHeight: '340px' }}>
            {/* Forme schématique des 12 départements du Bénin du Nord au Sud */}

            {/* ALIBORI (Nord) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[0])} style={{ cursor: 'pointer' }}>
              <path d="M 150,20 L 280,30 L 290,140 L 170,130 Z" fill={selectedDept?.id === 'alibori' ? '#34d399' : 'rgba(16, 185, 129, 0.25)'} stroke="#10b981" strokeWidth="2" />
              <text x="210" y="80" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Alibori ({getDeptRecordCount('Alibori')})</text>
            </g>

            {/* ATACORA (Nord-Ouest) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[1])} style={{ cursor: 'pointer' }}>
              <path d="M 70,50 L 150,20 L 170,130 L 90,150 Z" fill={selectedDept?.id === 'atacora' ? '#34d399' : 'rgba(5, 150, 105, 0.25)'} stroke="#10b981" strokeWidth="2" />
              <text x="120" y="90" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Atacora ({getDeptRecordCount('Atacora')})</text>
            </g>

            {/* BORGOU (Nord-Est) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[3])} style={{ cursor: 'pointer' }}>
              <path d="M 170,130 L 290,140 L 270,250 L 160,240 Z" fill={selectedDept?.id === 'borgou' ? '#34d399' : 'rgba(22, 163, 74, 0.25)'} stroke="#10b981" strokeWidth="2" />
              <text x="220" y="190" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Borgou ({getDeptRecordCount('Borgou')})</text>
            </g>

            {/* DONGA (Nord-Ouest/Centre) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[6])} style={{ cursor: 'pointer' }}>
              <path d="M 90,150 L 170,130 L 160,240 L 80,220 Z" fill={selectedDept?.id === 'donga' ? '#34d399' : 'rgba(34, 197, 94, 0.25)'} stroke="#10b981" strokeWidth="2" />
              <text x="120" y="190" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Donga ({getDeptRecordCount('Donga')})</text>
            </g>

            {/* COLLINES (Centre) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[4])} style={{ cursor: 'pointer' }}>
              <path d="M 80,220 L 270,250 L 250,340 L 90,320 Z" fill={selectedDept?.id === 'collines' ? '#f59e0b' : 'rgba(245, 158, 11, 0.25)'} stroke="#f59e0b" strokeWidth="2" />
              <text x="175" y="285" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Collines ({getDeptRecordCount('Collines')})</text>
            </g>

            {/* ZOU (Centre-Sud) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[11])} style={{ cursor: 'pointer' }}>
              <path d="M 90,320 L 250,340 L 230,420 L 100,410 Z" fill={selectedDept?.id === 'zou' ? '#34d399' : 'rgba(234, 179, 8, 0.25)'} stroke="#10b981" strokeWidth="2" />
              <text x="165" y="370" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Zou ({getDeptRecordCount('Zou')})</text>
            </g>

            {/* PLATEAU (Sud-Est) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[10])} style={{ cursor: 'pointer' }}>
              <path d="M 230,420 L 280,420 L 270,500 L 220,500 Z" fill={selectedDept?.id === 'plateau' ? '#34d399' : 'rgba(2, 132, 199, 0.25)'} stroke="#10b981" strokeWidth="2" />
              <text x="250" y="460" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Plateau ({getDeptRecordCount('Plateau')})</text>
            </g>

            {/* OUEME (Sud-Est) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[9])} style={{ cursor: 'pointer' }}>
              <path d="M 180,480 L 230,480 L 220,550 L 180,550 Z" fill={selectedDept?.id === 'oueme' ? '#34d399' : 'rgba(14, 165, 233, 0.25)'} stroke="#10b981" strokeWidth="2" />
              <text x="200" y="520" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Ouémé ({getDeptRecordCount('Ouémé')})</text>
            </g>

            {/* COUFFO (Sud-Ouest) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[5])} style={{ cursor: 'pointer' }}>
              <path d="M 100,410 L 170,420 L 160,490 L 90,480 Z" fill={selectedDept?.id === 'couffo' ? '#34d399' : 'rgba(101, 163, 13, 0.25)'} stroke="#10b981" strokeWidth="2" />
              <text x="130" y="450" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Couffo ({getDeptRecordCount('Couffo')})</text>
            </g>

            {/* MONO (Sud-Ouest) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[8])} style={{ cursor: 'pointer' }}>
              <path d="M 90,480 L 160,490 L 150,560 L 90,550 Z" fill={selectedDept?.id === 'mono' ? '#34d399' : 'rgba(74, 222, 222, 0.25)'} stroke="#10b981" strokeWidth="2" />
              <text x="120" y="525" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Mono ({getDeptRecordCount('Mono')})</text>
            </g>

            {/* ATLANTIQUE (Sud) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[2])} style={{ cursor: 'pointer' }}>
              <path d="M 160,490 L 220,500 L 210,560 L 150,560 Z" fill={selectedDept?.id === 'atlantique' ? '#34d399' : 'rgba(52, 211, 153, 0.25)'} stroke="#10b981" strokeWidth="2" />
              <text x="180" y="530" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Atlantique ({getDeptRecordCount('Atlantique')})</text>
            </g>

            {/* LITTORAL (Cotonou) */}
            <g onClick={() => handleDeptClick(BENIN_DEPARTMENTS[7])} style={{ cursor: 'pointer' }}>
              <circle cx="190" cy="565" r="14" fill={selectedDept?.id === 'littoral' ? '#ef4444' : '#10b981'} />
              <text x="190" y="569" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Littoral</text>
            </g>
          </svg>
        </div>

        {/* Liste des Départements et Détails */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {BENIN_DEPARTMENTS.map((dept) => {
              const count = getDeptRecordCount(dept.name);
              const isSelected = selectedDept?.id === dept.id;
              return (
                <div
                  key={dept.id}
                  onClick={() => handleDeptClick(dept)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.3)',
                    border: isSelected ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{dept.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{dept.region}</div>
                  </div>
                  <span className={`badge ${count > 0 ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {selectedDept && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '14px', borderRadius: '12px', border: '1px solid #10b981' }}>
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.95rem' }}>
                📍 Département sélectionné : {selectedDept.name} ({selectedDept.chefLieu})
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Total des alertes enregistrées : <strong>{getDeptRecordCount(selectedDept.name)}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

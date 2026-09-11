import React from 'react';
import { Sprout, ExternalLink, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '60px',
      borderTop: '1px solid rgba(52, 211, 153, 0.2)',
      background: 'rgba(6, 13, 9, 0.95)',
      padding: '40px 0 24px'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px', marginBottom: '30px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sprout size={18} color="#ffffff" />
              </div>
              <span className="brand-font" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Agri<span className="gradient-text">Voix</span> Bénin
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Transformation de la parole des agriculteurs béninois en conseils agricoles accessibles et structuration automatique de données pour la recherche et la vulgarisation.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-light)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Modèles & Inférence
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a href="https://huggingface.co/bivariant" target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={12} /> Bivariant Hugging Face <ExternalLink size={12} />
                </a>
              </li>
              <li>• bivariant/GRIOT-ASR-W-0.8-ALL (ASR)</li>
              <li>• bivariant/Griot-MT-1.3B-ALL (Traduction)</li>
              <li>• bivariant/asr-baatonou (Baatonum)</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-light)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Sources & Références
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>• INRAB (Institut National des Recherches Agricoles du Bénin)</li>
              <li>• FAO Bénin — Fiches Techniques 2018 (ca2306fr & ca2313fr)</li>
              <li>• Hackathon Indaba Bénin 2026</li>
            </ul>
          </div>
        </div>

        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © 2026 AgriVoix Bénin — Développé avec <Heart size={12} color="#ef4444" style={{ display: 'inline' }} /> pour les agriculteurs du Bénin.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Fon (Fɔ̀ngbe)</span>
            <span>Baatonum</span>
            <span>Yorùbá</span>
            <span>Gen-Gbe</span>
            <span>Dendi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

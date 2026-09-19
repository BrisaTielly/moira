import React from 'react';
import { Share2, BookmarkCheck, Sparkles } from 'lucide-react';

export const FeatureCardsSection: React.FC = () => {
  return (
    <section
      id="cards-memoria"
      style={{
        width: '100%',
        padding: '80px 24px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        {/* Card 1: Cards Compartilháveis para Stories */}
        <div
          style={{
            backgroundColor: 'var(--bg-page)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '36px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-plum-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-plum)',
            }}
          >
            <Share2 size={20} />
          </div>

          <h3 style={{ fontSize: '24px', color: 'var(--text-main)' }}>
            Cards de Tiragem Compartilháveis
          </h3>

          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Transforme o resultado da sua tiragem em um card estético para compartilhar no Instagram Stories, TikTok ou guardar na sua galeria como lembrete do seu ciclo.
          </p>

          {/* Mini Mockup do Card de Compartilhamento */}
          <div
            style={{
              marginTop: '12px',
              backgroundColor: '#FAF5EE',
              border: '1px solid #D6C8A8',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8A7753', fontWeight: 700 }}>
              Moira · Síntese do Dia
            </span>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontStyle: 'italic', margin: '10px 0', color: '#3A3224' }}>
              “O caminho se abre quando você olha além do medo.”
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '12px', color: '#7E6D4E' }}>
              <span>A Estrela</span> • <span>A Força</span> • <span>O Mundo</span>
            </div>
          </div>
        </div>

        {/* Card 2: Continuidade & Memória Segura */}
        <div
          style={{
            backgroundColor: 'var(--bg-page)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '36px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-plum-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-plum)',
            }}
          >
            <BookmarkCheck size={20} />
          </div>

          <h3 style={{ fontSize: '24px', color: 'var(--text-main)' }}>
            Memória e Retorno Contínuo
          </h3>

          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            A Moira lembra das suas conversas e decisões anteriores somente se você autorizar. Reencontre temas passados e acompanhe o desenrolar das suas escolhas ao longo do tempo.
          </p>

          {/* Mini Mockup de Memória Autorizada (V2 Prancha 03) */}
          <div
            style={{
              marginTop: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Sparkles size={20} color="var(--brand-plum)" />
            <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.4' }}>
              <span style={{ fontWeight: 600, display: 'block' }}>Memória autorizada:</span>
              <span style={{ color: 'var(--text-muted)' }}>“Você está considerando mudar de carreira e valoriza estabilidade.”</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

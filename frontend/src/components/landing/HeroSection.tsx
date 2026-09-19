import React from 'react';
import { MessageSquare, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStartReading: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartReading }) => {
  return (
    <section
      style={{
        width: '100%',
        padding: '64px 24px 80px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '56px',
          alignItems: 'center',
        }}
      >
        {/* Lado Esquerdo: Chamada Principal */}
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--brand-plum)',
              backgroundColor: 'var(--brand-plum-light)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              alignSelf: 'flex-start',
            }}
          >
            Aconselhamento Místico & Tarot com IA
          </span>

          <h1
            style={{
              fontSize: 'clamp(38px, 5vw, 56px)',
              lineHeight: '1.1',
              color: 'var(--text-main)',
              letterSpacing: '-0.025em',
            }}
          >
            Sua pergunta merece uma conversa.
          </h1>

          <p
            style={{
              fontSize: '19px',
              color: 'var(--text-muted)',
              lineHeight: '1.6',
              maxWidth: '480px',
            }}
          >
            Uma leitura de Tarot com IA e espaço para conversar. Aconselhamento pessoal, reflexão profunda e caminhos claros para suas decisões.
          </p>

          <div>
            <button
              type="button"
              onClick={onStartReading}
              className="btn-pill btn-plum"
              style={{
                fontSize: '17px',
                padding: '16px 32px',
                boxShadow: '0 8px 24px rgba(88, 51, 72, 0.28)',
              }}
            >
              Começar minha leitura
              <ArrowRight size={18} />
            </button>
          </div>

          {/* 3 Badges de Valor (Direto do mockup V2) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--brand-plum)' }}><MessageSquare size={16} /></span>
              <span>Tarot com IA e conversa real</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--brand-plum)' }}><ShieldCheck size={16} /></span>
              <span>Privado e seguro</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--brand-plum)' }}><Heart size={16} /></span>
              <span>Mais clareza para suas decisões</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Preview Interativo da Consulta (Fidelidade V2) */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            padding: '28px',
            boxShadow: 'var(--shadow-elevated)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            textAlign: 'left',
          }}
        >
          {/* Mensagem Inicial da Moira */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-plum)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              m
            </div>
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '12px 18px',
                borderRadius: '16px',
                borderTopLeftRadius: '4px',
                fontSize: '14px',
                color: 'var(--text-main)',
                lineHeight: '1.5',
                maxWidth: '85%',
              }}
            >
              Olá! Eu sou a Moira. Vamos fazer uma leitura de Tarot juntos? Me conte o que gostaria de explorar.
            </div>
          </div>

          {/* Resposta do Consulente */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div
              style={{
                backgroundColor: '#EAE6E1',
                padding: '12px 18px',
                borderRadius: '16px',
                borderTopRightRadius: '4px',
                fontSize: '14px',
                color: 'var(--text-main)',
                maxWidth: '85%',
              }}
            >
              Quero entender o que me espera nessa fase da minha vida.
            </div>
          </div>

          {/* Revelação das Cartas da Moira */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-plum)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              m
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  borderTopLeftRadius: '4px',
                  fontSize: '14px',
                  color: 'var(--text-main)',
                }}
              >
                Com base na sua pergunta, estas são as cartas da sua leitura:
              </div>

              {/* Grid com 3 cartas de Tarot em estilo clássico Rider-Waite / V2 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginTop: '4px',
                }}
              >
                {/* Carta 1 */}
                <div
                  style={{
                    backgroundColor: '#FAF5EA',
                    border: '1px solid #D6C8A8',
                    borderRadius: '8px',
                    padding: '8px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    textAlign: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#8A7753' }}>XVII</span>
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1.3',
                      backgroundColor: '#E8DFC9',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#65573B',
                      fontSize: '20px',
                    }}
                  >
                    ⭐
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#4A3E26' }}>
                    A Estrela
                  </span>
                </div>

                {/* Carta 2 */}
                <div
                  style={{
                    backgroundColor: '#FAF5EA',
                    border: '1px solid #D6C8A8',
                    borderRadius: '8px',
                    padding: '8px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    textAlign: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#8A7753' }}>VIII</span>
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1.3',
                      backgroundColor: '#E8DFC9',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#65573B',
                      fontSize: '20px',
                    }}
                  >
                    🦁
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#4A3E26' }}>
                    A Força
                  </span>
                </div>

                {/* Carta 3 */}
                <div
                  style={{
                    backgroundColor: '#FAF5EA',
                    border: '1px solid #D6C8A8',
                    borderRadius: '8px',
                    padding: '8px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    textAlign: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#8A7753' }}>XXI</span>
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1.3',
                      backgroundColor: '#E8DFC9',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#65573B',
                      fontSize: '20px',
                    }}
                  >
                    🌐
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#4A3E26' }}>
                    O Mundo
                  </span>
                </div>
              </div>

              {/* Mensagem Síntese */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  borderTopLeftRadius: '4px',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                  lineHeight: '1.5',
                }}
              >
                Essas cartas trazem mensagens sobre esperança, coragem e um ciclo importante se completando. Vamos conversar sobre o que elas revelam?
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

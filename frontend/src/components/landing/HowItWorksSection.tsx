import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'A Pergunta Pessoal',
      desc: 'Você escreve com suas palavras o momento que deseja clarear. Sem julgamentos e sem fórmulas pré-prontas.',
      badge: 'Escuta genuína',
    },
    {
      number: '02',
      title: 'Tiragem em Painel Próprio',
      desc: 'A escolha das cartas acontece em um ambiente visual exclusivo, respeitando o ritual e a sacralidade da leitura.',
      badge: 'Interatividade real',
    },
    {
      number: '03',
      title: 'Conversa & Aconselhamento',
      desc: 'A Moira interpreta os arcanos integrando ao seu contexto de vida, permitindo perguntas e reflexões contínuas.',
      badge: 'Sem respostas genéricas',
    },
  ];

  return (
    <section
      id="como-funciona"
      style={{
        width: '100%',
        padding: '90px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: 'var(--brand-plum)',
        }}
      >
        O Ritual da Moira
      </span>

      <h2
        style={{
          fontSize: 'clamp(30px, 4vw, 42px)',
          color: 'var(--text-main)',
          marginTop: '10px',
          marginBottom: '16px',
        }}
      >
        Não é um robô. É um espaço de escuta.
      </h2>

      <p
        style={{
          fontSize: '18px',
          color: 'var(--text-muted)',
          maxWidth: '640px',
          margin: '0 auto 56px',
          lineHeight: '1.6',
        }}
      >
        A Moira combina a simbologia dos arcanos com tecnologia de ponta para criar uma experiência contemplativa, visual e verdadeiramente transformadora.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          textAlign: 'left',
        }}
      >
        {steps.map((step) => (
          <div
            key={step.number}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              position: 'relative',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '36px',
                fontWeight: 700,
                color: 'var(--brand-plum)',
                opacity: 0.35,
              }}
            >
              {step.number}
            </span>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--brand-plum)',
                backgroundColor: 'var(--brand-plum-light)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                alignSelf: 'flex-start',
              }}
            >
              {step.badge}
            </span>

            <h3 style={{ fontSize: '20px', color: 'var(--text-main)' }}>
              {step.title}
            </h3>

            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

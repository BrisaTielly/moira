import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Preciso criar uma conta para fazer a primeira leitura?',
      answer:
        'Não. Na Moira, você começa apenas informando o nome pelo qual prefere ser chamada. A primeira tiragem completa é liberada sem exigir cadastro, e sua sessão fica guardada temporariamente neste navegador.',
    },
    {
      question: 'Qual a diferença entre a Moira e um chatbot comum de IA?',
      answer:
        'A Moira não responde de forma robótica ou simplista. Ela possui um painel de tiragem interativo com presença visual forte das cartas, respeita o tempo do ritual místico e constrói uma conversa empática com perguntas para que você encontre sua própria resposta.',
    },
    {
      question: 'Minhas perguntas e reflexões são confidenciais?',
      answer:
        'Sim, total privacidade. Suas consultas não são compartilhadas publicamente e suas memórias só são armazenadas se você expressamente consentir ao final da experiência.',
    },
    {
      question: 'Posso consultar qualquer tema da minha vida?',
      answer:
        'Com certeza. Seja trabalho, relacionamentos, transições difíceis ou buscas de autoconhecimento, a Moira acolhe sua questão de forma neutra e sem pré-julgamentos.',
    },
  ];

  return (
    <section
      id="faq"
      style={{
        width: '100%',
        padding: '90px 24px',
        maxWidth: '860px',
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
        Tire suas dúvidas
      </span>

      <h2
        style={{
          fontSize: 'clamp(30px, 4vw, 40px)',
          color: 'var(--text-main)',
          marginTop: '10px',
          marginBottom: '40px',
        }}
      >
        Perguntas Frequentes
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '17px',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={20}
                  color="var(--text-muted)"
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0,
                  }}
                />
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: '0 24px 20px',
                    fontSize: '15px',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

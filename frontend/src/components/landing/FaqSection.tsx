import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Preciso criar uma conta para fazer a primeira leitura?',
    answer:
      'Não. Você começa informando apenas o nome pelo qual prefere ser chamada. A primeira tiragem completa é liberada sem cadastro, e sua sessão fica guardada neste navegador.',
  },
  {
    question: 'Qual a diferença entre a Moira e um chatbot comum de IA?',
    answer:
      'A Moira não é uma caixa de texto genérica. A tiragem acontece num painel próprio, com cartas que você embaralha, corta e revela, e a interpretação vira uma conversa sobre o seu contexto, com perguntas que ajudam você a encontrar a sua própria resposta.',
  },
  {
    question: 'A Moira prevê o futuro?',
    answer:
      'Não, e ela não vai fingir que prevê. Aqui o Tarot é uma linguagem simbólica para refletir sobre o seu momento. A Moira oferece perspectivas e perguntas que trazem clareza, nunca sentenças, ameaças ou promessas de destino.',
  },
  {
    question: 'Minhas perguntas e reflexões são confidenciais?',
    answer:
      'Sim. Suas consultas não são públicas, e as memórias só são guardadas se você autorizar expressamente ao final da experiência.',
  },
  {
    question: 'Posso consultar qualquer tema da minha vida?',
    answer:
      'Pode. Trabalho, relacionamentos, transições difíceis ou autoconhecimento: a Moira acolhe a sua questão com neutralidade e sem julgamentos.',
  },
  {
    question: 'O que acontece depois da primeira leitura?',
    answer:
      'Você recebe a leitura completa, sem travas. Ao final, a Moira deixa uma reflexão para os próximos dias e você pode guardar tudo no seu Grimório Pessoal para voltar quando quiser.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" style={{ width: '100%', padding: '110px 24px', maxWidth: '860px', margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 44 }}>
        <span className="eyebrow">Tire suas dúvidas</span>
        <h2 className="section-title">Perguntas frequentes</h2>
      </Reveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          return (
            <Reveal key={faq.question} delay={index * 60}>
              <div className={`faq__item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="faq__btn"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span>{faq.question}</span>
                  <span className="faq__icon" aria-hidden="true">
                    <Plus size={16} />
                  </span>
                </button>
                <div className="faq__panel" id={panelId} role="region" aria-hidden={!isOpen}>
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

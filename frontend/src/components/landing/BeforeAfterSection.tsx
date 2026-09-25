import React from 'react';
import { ArrowDown, Check, X } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

interface Contrast {
  before: string;
  after: string;
  note: string;
}

const CONTRASTS: Contrast[] = [
  {
    before: 'Horóscopo genérico, igual para todo mundo',
    after: 'Uma leitura que parte do seu nome e da sua pergunta',
    note: 'A Moira conecta os arquétipos das cartas ao momento que você descreveu, com as suas palavras.',
  },
  {
    before: 'Uma resposta pronta e fechada',
    after: 'Uma conversa que continua',
    note: 'Pergunte de novo, peça outro ângulo, aprofunde uma carta. A leitura se ajusta a você.',
  },
  {
    before: 'Clicar em “sortear” e pronto',
    after: 'Um ritual em que você participa',
    note: 'Você define a intenção, embaralha e corta o baralho. A leitura nasce do seu gesto.',
  },
  {
    before: 'Tiragens que se perdem no histórico',
    after: 'Um Grimório Pessoal que guarda a sua jornada',
    note: 'Leituras, cartas e reflexões ficam reunidas para você reencontrar quando quiser.',
  },
  {
    before: 'Previsões de destino e medo do que vem',
    after: 'Clareza prática para os próximos passos',
    note: 'O Tarot aqui é espelho, não sentença. Sem ameaças e sem promessas mágicas.',
  },
];

export const BeforeAfterSection: React.FC = () => (
  <section id="diferenca" className="ba">
    <div className="container ba__grid">
      <Reveal className="ba__sticky" variant="left">
        <span className="eyebrow">Da dúvida à clareza</span>
        <h2 className="section-title">
          Não é mais um app de tarot. <span className="grad-text">É a sua leitura.</span>
        </h2>
        <p className="section-lead">
          Você já viu leituras que serviriam para qualquer pessoa. A Moira foi feita para o contrário: escutar o que é só seu.
        </p>
      </Reveal>

      <ul className="ba__list" style={{ listStyle: 'none' }}>
        {CONTRASTS.map((item, i) => (
          <li key={item.after}>
            <Reveal className="ba__item" delay={i * 60}>
              <div className="ba__line ba__line--before">
                <span className="ba__icon">
                  <X size={13} strokeWidth={2.5} />
                </span>
                <span className="ba__strike">{item.before}</span>
              </div>
              <span className="ba__arrow" aria-hidden="true">
                <ArrowDown size={14} />
              </span>
              <div className="ba__line ba__line--after">
                <span className="ba__icon">
                  <Check size={13} strokeWidth={2.5} />
                </span>
                <span>{item.after}</span>
              </div>
              <p className="ba__note">{item.note}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

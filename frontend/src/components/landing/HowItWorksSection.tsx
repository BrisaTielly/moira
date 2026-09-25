import React, { useRef } from 'react';
import { MessageCircle, MoonStar } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { RitualDeck } from './RitualDeck';
import { TarotCard } from '../tarot/TarotCard';
import { SAMPLE_SPREAD } from '../../lib/arcana';
import { useInView } from '../../hooks/useInView';
import { useSectionProgressVar } from '../../hooks/useScrollVars';

const IntentViz: React.FC = () => (
  <div className="viz">
    <span className="viz-intent__label">Sua intenção</span>
    <div className="viz-intent__field">
      Estou pensando em mudar de trabalho, mas tenho medo de perder estabilidade.
      <span className="viz-intent__caret" aria-hidden="true" />
    </div>
    <div className="viz-intent__chips" aria-hidden="true">
      <span>Carreira</span>
      <span>Mudança</span>
      <span>Segurança</span>
    </div>
  </div>
);

const RevealViz: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.45 });
  return (
    <div ref={ref} id="revelacao" className="viz viz-reveal" style={{ scrollMarginTop: 140 }}>
      <div className="spread">
        {SAMPLE_SPREAD.map((face, i) => (
          <TarotCard key={face.name} face={face} flipped={inView} delay={300 + i * 380} />
        ))}
      </div>
      <div className="viz-reveal__labels" aria-hidden="true">
        <span>O que pesa</span>
        <span>O que sustenta</span>
        <span>O caminho</span>
      </div>
    </div>
  );
};

/** Fases da lua ilustrativas para "os próximos 7 dias". */
const MOONS = [0.15, 0.3, 0.45, 0.6, 0.75, 0.88, 1];
const DAYS = ['hoje', '2º', '3º', '4º', '5º', '6º', '7º'];

const CycleViz: React.FC = () => (
  <div className="viz">
    <div className="chat__row" style={{ animation: 'none' }}>
      <div className="chat__avatar" aria-hidden="true">m</div>
      <div className="chat__bubble">
        A Força pede coragem gentil, não pressa. Nos próximos 7 dias, observe onde você já é mais firme do que imagina.
      </div>
    </div>
    <div className="moons" aria-label="Ciclo dos próximos 7 dias">
      {MOONS.map((lit, i) => (
        <div
          key={DAYS[i]}
          className={`moon${i === 0 ? ' moon--today' : ''}`}
          style={{ ['--i' as string]: i, ['--lit' as string]: lit }}
        >
          <span className="moon__disc" />
          {DAYS[i]}
        </div>
      ))}
    </div>
    <span className="cycle-chip">
      <MoonStar size={15} /> Reflexão da semana guardada no seu Grimório
    </span>
  </div>
);

interface Step {
  num: string;
  tag: string;
  title: string;
  text: string;
  viz: React.ReactNode;
}

const STEPS: Step[] = [
  {
    num: '01',
    tag: 'Intenção',
    title: 'Você escreve a pergunta com as suas palavras',
    text: 'Sem fórmulas e sem julgamento. Quanto mais verdadeira a pergunta, mais a leitura fala de você.',
    viz: <IntentViz />,
  },
  {
    num: '02',
    tag: 'Experimente agora',
    title: 'Embaralhe e corte o baralho',
    text: 'A tiragem acontece num painel só dela, no seu ritmo. Você participa de cada gesto, e é por isso que a leitura é sua.',
    viz: <RitualDeck />,
  },
  {
    num: '03',
    tag: 'Revelação',
    title: 'As cartas se revelam, uma a uma',
    text: 'Cada arcano ocupa uma posição da sua pergunta. A Moira mostra como eles conversam entre si e com o seu momento.',
    viz: <RevealViz />,
  },
  {
    num: '04',
    tag: 'Conversa & ciclo',
    title: 'A conversa continua e o ciclo segue com você',
    text: 'Pergunte, aprofunde, peça outro ângulo. Ao final, a Moira deixa uma reflexão para os próximos dias, para você voltar e ver o que mudou.',
    viz: <CycleViz />,
  },
];

export const HowItWorksSection: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  useSectionProgressVar(timelineRef, 0.55);

  return (
    <section id="ritual" className="fio">
      <div className="container">
        <Reveal className="fio__intro">
          <span className="eyebrow">
            <MessageCircle size={13} /> O ritual da Moira
          </span>
          <h2 className="section-title">
            Na mitologia, as Moiras teciam o fio de cada vida. <span className="grad-text">Aqui, quem conduz o fio é você.</span>
          </h2>
          <p className="section-lead">
            Quatro gestos simples transformam uma pergunta solta num momento de clareza.
          </p>
        </Reveal>

        <div ref={timelineRef} className="fio__timeline">
          <span className="fio__track" aria-hidden="true" />
          <span className="fio__fill" aria-hidden="true" />
          <span className="fio__tip" aria-hidden="true" />

          {STEPS.map((step, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={step.num} className={`fio__step${flip ? ' fio__step--flip' : ''}`} variant="fade">
                <span className="fio__dot" aria-hidden="true" />
                <Reveal className="fio__text" variant={flip ? 'right' : 'left'} delay={80}>
                  <span className="fio__num">{step.num}</span>
                  <span className="fio__tag">{step.tag}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Reveal>
                <Reveal variant="scale" delay={200}>
                  {step.viz}
                </Reveal>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

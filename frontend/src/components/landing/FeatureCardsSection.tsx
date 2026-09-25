import React from 'react';
import { Check, Plus, Sparkles } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { TarotCard } from '../tarot/TarotCard';
import { SAMPLE_SPREAD, type ArcanaFace } from '../../lib/arcana';

/** Entradas ilustrativas do Grimório (placeholder de conteúdo). */
const ENTRIES: { date: string; face: ArcanaFace; text: string }[] = [
  { date: 'Lua nova · 1ª leitura', face: SAMPLE_SPREAD[0], text: 'Um recomeço pede esperança antes de certeza.' },
  { date: 'Quarto crescente', face: SAMPLE_SPREAD[1], text: 'Coragem gentil diante da mudança de trabalho.' },
  { date: 'Lua cheia', face: SAMPLE_SPREAD[2], text: 'Um ciclo se fecha, e você percebe o quanto cresceu.' },
];

const GrimoireViz: React.FC = () => (
  <div className="book">
    <div className="book__head">
      <span className="book__title">Grimório de Ana</span>
      <span className="book__meta">3 leituras · 1 ciclo</span>
    </div>
    {ENTRIES.map((entry, i) => (
      <div key={entry.date} className="entry" style={{ ['--i' as string]: i }}>
        <TarotCard face={entry.face} flipped className="entry__mini" />
        <div>
          <div className="entry__date">{entry.date}</div>
          <div className="entry__text">{entry.text}</div>
        </div>
      </div>
    ))}
    <div className="entry entry--next" style={{ ['--i' as string]: ENTRIES.length }}>
      <span className="entry__slot">
        <Plus size={16} />
      </span>
      <div className="entry__text">Sua próxima página começa com uma nova pergunta</div>
    </div>
  </div>
);

const StoryViz: React.FC = () => (
  <div className="story-stage">
    <div className="story" aria-label="Exemplo de card para Stories">
      <span className="story__brand">moira ✦</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        <span className="story__label">Minha carta guia</span>
        <p className="story__quote">“Eu escolho a coragem gentil.”</p>
      </div>
      <div className="story__cards">
        {SAMPLE_SPREAD.map((face) => (
          <TarotCard key={face.name} face={face} flipped />
        ))}
      </div>
      <span className="story__who">A Estrela · A Força · O Mundo</span>
    </div>
  </div>
);

const MemoryViz: React.FC = () => (
  <div className="memory">
    <span className="memory__q">Ao final da leitura, você decide:</span>
    <div className="switch-row">
      <span>Lembrar desta conversa na próxima vez</span>
      <span className="switch" role="presentation" />
    </div>
    <div className="memory__saved">
      <Sparkles size={18} />
      <div>
        <strong style={{ display: 'block' }}>Memória autorizada</strong>
        <span style={{ color: 'var(--text-muted)' }}>
          “Você está considerando mudar de carreira e valoriza estabilidade.”
        </span>
      </div>
    </div>
  </div>
);

interface Feature {
  num: string;
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  checks: string[];
  viz: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    num: '01',
    eyebrow: 'Grimório Pessoal',
    title: (
      <>
        Cada leitura vira uma página <span className="grad-text">da sua história.</span>
      </>
    ),
    text: 'Suas tiragens não somem num histórico. Elas se reúnem num Grimório que é só seu, com as cartas, as reflexões e os ciclos que você atravessou.',
    checks: ['Releia leituras antigas e perceba padrões', 'Acompanhe como suas escolhas se desenrolaram', 'Quanto mais você volta, mais a Moira te conhece'],
    viz: <GrimoireViz />,
  },
  {
    num: '02',
    eyebrow: 'Card para Stories',
    title: (
      <>
        Leve a sua carta guia <span className="grad-text">para onde você for.</span>
      </>
    ),
    text: 'Transforme a síntese da leitura num card bonito, pronto para os Stories ou para a galeria. Uma afirmação sua, não uma propaganda.',
    checks: ['Formato vertical para Instagram e TikTok', 'Sua frase-guia em destaque', 'Um lembrete visual do seu ciclo'],
    viz: <StoryViz />,
  },
  {
    num: '03',
    eyebrow: 'Memória com consentimento',
    title: (
      <>
        Ela lembra de você <span className="grad-text">só se você quiser.</span>
      </>
    ),
    text: 'A Moira pode retomar temas das conversas anteriores, mas só guarda o que você autorizar. Você decide o que fica.',
    checks: ['Nada é salvo sem a sua permissão', 'Suas perguntas não são públicas', 'Você pode apagar quando quiser'],
    viz: <MemoryViz />,
  },
];

export const FeatureCardsSection: React.FC = () => (
  <section id="grimorio" className="grim">
    <div className="container">
      <Reveal className="grim__intro">
        <span className="eyebrow">Depois da leitura</span>
        <h2 className="section-title">
          A resposta é só o começo. <span className="grad-text">A jornada fica com você.</span>
        </h2>
      </Reveal>

      {FEATURES.map((f, i) => {
        const flip = i % 2 === 1;
        return (
          <div key={f.num} className={`feat${flip ? ' feat--flip' : ''}`}>
            <Reveal className="feat__text" variant={flip ? 'right' : 'left'}>
              <span className="eyebrow eyebrow--bare">
                <span className="eyebrow__num">{f.num}</span>
                {f.eyebrow}
              </span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <ul className="checks">
                {f.checks.map((c) => (
                  <li key={c}>
                    <Check size={16} strokeWidth={2.5} />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal variant="scale" delay={150}>
              {f.viz}
            </Reveal>
          </div>
        );
      })}
    </div>
  </section>
);

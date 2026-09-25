import React from 'react';
import { ArrowRight, Heart, MessageSquare, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { TarotCard } from '../tarot/TarotCard';
import { SAMPLE_SPREAD } from '../../lib/arcana';
import { useInView } from '../../hooks/useInView';
import { useElapsed } from '../../hooks/useElapsed';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Sparkles4 } from '../motion/Sparkles';
import { isTypingAt, timelineDuration, visibleSteps } from '../../lib/heroSequence';

interface HeroSectionProps {
  onStartReading: () => void;
}

const MoiraAvatar = () => <div className="chat__avatar" aria-hidden="true">m</div>;

/** Prévia da conversa que "acontece" diante da visitante. */
const ChatPreview: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = useReducedMotion();
  const elapsed = useElapsed(inView, timelineDuration(), reduced);
  const shown = visibleSteps(elapsed);
  const typing = isTypingAt(elapsed);

  return (
    <div ref={ref} className="chat" aria-label="Prévia de uma leitura com a Moira">
      <div className="chat__head">
        <span className="chat__status">Moira está presente</span>
        <span>Leitura de 3 cartas</span>
      </div>

      {shown.has('greeting') && (
        <div className="chat__row">
          <MoiraAvatar />
          <div className="chat__bubble">
            Olá! Eu sou a Moira. Vamos fazer uma leitura de Tarot juntos? Me conte o que gostaria de explorar.
          </div>
        </div>
      )}

      {shown.has('question') && (
        <div className="chat__row chat__row--me">
          <div className="chat__bubble chat__bubble--me">
            Quero entender o que me espera nessa nova fase da minha vida.
          </div>
        </div>
      )}

      {shown.has('intro') && (
        <div className="chat__row">
          <MoiraAvatar />
          <div className="chat__stack">
            <div className="chat__bubble">Com base na sua pergunta, estas são as cartas da sua leitura:</div>
            <div className="spread">
              {SAMPLE_SPREAD.map((face, i) => (
                <TarotCard
                  key={face.name}
                  face={face}
                  flipped={shown.has((['card1', 'card2', 'card3'] as const)[i])}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {shown.has('synthesis') && (
        <div className="chat__row">
          <MoiraAvatar />
          <div className="chat__stack">
            <div className="chat__bubble">
              Essas cartas falam de esperança, coragem e um ciclo importante se completando. Vamos conversar sobre o que elas revelam para você?
            </div>
            <span className="chat__cta-hint">
              <Sparkles size={14} /> A conversa continua a partir daqui
            </span>
          </div>
        </div>
      )}

      {typing && (
        <div className="chat__row" aria-hidden="true">
          <MoiraAvatar />
          <div className="typing">
            <i />
            <i />
            <i />
          </div>
        </div>
      )}
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartReading }) => {
  return (
    <section className="hero">
      <div className="hero__aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Sparkles4 />

      <div className="container hero__grid">
        <div className="hero__copy intro">
          <span className="eyebrow" style={{ ['--i' as string]: 0 }}>
            ✦ Tarot com IA · Aconselhamento místico
          </span>

          <h1 className="hero__title" style={{ ['--i' as string]: 1 }}>
            Sua pergunta merece uma <span className="grad-text">conversa.</span>
          </h1>

          <p className="hero__lead" style={{ ['--i' as string]: 2 }}>
            Você embaralha, corta e escolhe suas cartas. A Moira lê o que elas dizem sobre o seu momento e conversa com você até a resposta fazer sentido.
          </p>

          <div className="hero__ctas" style={{ ['--i' as string]: 3 }}>
            <button type="button" onClick={onStartReading} className="btn-pill btn-plum btn-lg btn-shine">
              Começar minha leitura
              <ArrowRight size={18} />
            </button>
            <a href="#ritual" className="btn-pill btn-ghost" style={{ padding: '16px 24px' }}>
              Ver como funciona
            </a>
          </div>

          <div className="hero__micro" style={{ ['--i' as string]: 4 }}>
            <span>
              <Check size={14} /> Primeira leitura completa
            </span>
            <span>
              <Check size={14} /> Só com o seu nome
            </span>
            <span>
              <Check size={14} /> Sem cadastro
            </span>
          </div>

          <div className="hero__badges" style={{ ['--i' as string]: 5 }}>
            <div>
              <MessageSquare size={18} />
              <span>
                Tarot com IA
                <br />e conversa real
              </span>
            </div>
            <div>
              <ShieldCheck size={18} />
              <span>
                Privado
                <br />e seguro
              </span>
            </div>
            <div>
              <Heart size={18} />
              <span>
                Mais clareza para
                <br />suas decisões
              </span>
            </div>
          </div>
        </div>

        <div className="hero__stage">
          <div className="hero__halo" aria-hidden="true" />
          <ChatPreview />
        </div>
      </div>
    </section>
  );
};

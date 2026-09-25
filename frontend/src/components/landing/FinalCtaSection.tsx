import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { Sparkles4, type SparkleSpec } from '../motion/Sparkles';

interface FinalCtaSectionProps {
  onStartReading: () => void;
  userName?: string;
}

const STARS: SparkleSpec[] = [
  { top: '12%', left: '10%', size: 12, d: 0 },
  { top: '22%', left: '86%', size: 16, d: 1.4 },
  { top: '78%', left: '14%', size: 10, d: 2.2 },
  { top: '70%', left: '90%', size: 12, d: 0.8 },
  { top: '40%', left: '4%', size: 8, d: 3 },
  { top: '8%', left: '56%', size: 9, d: 1.9 },
];

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onStartReading, userName }) => (
  <section className="cta-final">
    <span className="cta-final__orbit" aria-hidden="true" />
    <span className="cta-final__orbit cta-final__orbit--2" aria-hidden="true" />
    <Sparkles4 items={STARS} />

    <Reveal className="cta-final__inner" variant="scale">
      <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--gold-soft)' }}>
        ✦ Sua vez
      </span>
      <h2>
        {userName ? `${userName}, as cartas` : 'As cartas'} já estão{' '}
        <span className="grad-text grad-text--light">esperando a sua pergunta.</span>
      </h2>
      <p>Escreva o que está no seu coração, embaralhe e descubra o que a leitura tem a dizer sobre o seu momento.</p>
      <button type="button" onClick={onStartReading} className="btn-pill btn-cream btn-lg btn-shine">
        {userName ? 'Voltar para minha pergunta' : 'Começar minha leitura'}
        <ArrowRight size={18} />
      </button>
      <div className="cta-final__micro">
        <span>
          <Check size={14} /> Sem cadastro
        </span>
        <span>
          <Check size={14} /> Privado
        </span>
        <span>
          <Check size={14} /> No seu tempo
        </span>
      </div>
    </Reveal>
  </section>
);

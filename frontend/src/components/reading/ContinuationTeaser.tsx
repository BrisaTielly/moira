import React, { useState } from 'react';
import { BookHeart, Lock, MessageCircle, MoonStar, Share2, Sparkles } from 'lucide-react';

const LOCKED = [
  { icon: <MessageCircle size={16} />, text: 'Conversar com a Moira sobre cada carta e aprofundar a sua pergunta' },
  { icon: <MoonStar size={16} />, text: 'Acompanhar o ciclo dos próximos 7 dias e voltar para ver o que mudou' },
  { icon: <BookHeart size={16} />, text: 'Guardar esta leitura como a primeira página do seu Grimório Pessoal' },
  { icon: <Share2 size={16} />, text: 'Criar o card da sua carta guia para os Stories' },
];

/**
 * Oferta de continuidade, exibida só DEPOIS da revelação completa (aha moment).
 * Sem preço inventado, sem urgência: os planos ainda não existem, e o texto diz isso.
 */
export const ContinuationTeaser: React.FC<{ variant?: 'after-reading' | 'limit' }> = ({ variant = 'after-reading' }) => {
  const [interested, setInterested] = useState(false);

  return (
    <section className="teaser" aria-labelledby="teaser-title">
      <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--gold-soft)' }}>
        <Sparkles size={13} /> {variant === 'limit' ? 'Sua jornada continua' : 'Sua leitura não termina aqui'}
      </span>
      <h3 id="teaser-title" className="teaser__title">
        {variant === 'limit'
          ? 'Sua leitura gratuita já foi revelada.'
          : 'As cartas abriram um caminho. Quer seguir por ele com a Moira?'}
      </h3>

      <ul className="teaser__list">
        {LOCKED.map((item) => (
          <li key={item.text}>
            <span className="teaser__icon" aria-hidden="true">{item.icon}</span>
            <span>{item.text}</span>
            <Lock size={14} className="teaser__lock" aria-label="Disponível nos planos" />
          </li>
        ))}
      </ul>

      {interested ? (
        <p className="teaser__note" role="status">
          Os planos da Moira estão sendo preparados com carinho. Quando abrirem, você poderá continuar exatamente daqui.
        </p>
      ) : (
        <button type="button" className="btn-pill btn-cream btn-lg btn-shine" onClick={() => setInterested(true)}>
          Quero continuar minha jornada
        </button>
      )}
    </section>
  );
};

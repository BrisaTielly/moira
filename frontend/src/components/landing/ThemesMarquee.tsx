import React from 'react';

const THEMES = [
  'Carreira',
  'Amor',
  'Recomeços',
  'Decisões difíceis',
  'Família',
  'Autoconhecimento',
  'Mudanças',
  'Propósito',
  'Amizades',
  'Ciclos que se fecham',
];

/** Faixa contínua de temas: "qualquer tema da sua vida cabe aqui". */
export const ThemesMarquee: React.FC = () => (
  <div className="marquee" role="region" aria-label="Temas que você pode trazer para a leitura">
    <div className="marquee__track">
      {[0, 1].map((copy) => (
        <div key={copy} style={{ display: 'flex' }} aria-hidden={copy === 1}>
          {THEMES.map((theme) => (
            <span key={theme} className="marquee__item">
              {theme}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

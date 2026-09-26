import React from 'react';
import { HeartHandshake, Phone, ExternalLink } from 'lucide-react';
import type { SupportMessage } from '../../types/session';

/** Extrai um número curto de telefone ("Ligue 188") para criar o link tel:. */
function phoneOf(contact: string): string | null {
  const match = contact.match(/\b(\d{3})\b/);
  return match ? match[1] : null;
}

/** Acolhimento quando a pergunta indica risco. Sem cartas, sem venda. */
export const SupportPanel: React.FC<{ support: SupportMessage; onBack: () => void }> = ({ support, onBack }) => (
  <section className="support" aria-labelledby="support-title">
    <span className="support__icon" aria-hidden="true">
      <HeartHandshake size={26} />
    </span>
    <h2 id="support-title" className="support__title">
      {support.title}
    </h2>
    <p className="support__message">{support.message}</p>

    <ul className="support__list">
      {support.resources.map((r) => {
        const phone = phoneOf(r.contact);
        const hasCvvSite = r.contact.includes('cvv.org.br');
        return (
          <li key={r.name} className="support__item">
            <div>
              <strong>{r.name}</strong>
              <span>{r.description}</span>
            </div>
            <div className="support__actions">
              {phone && (
                <a className="btn-pill btn-plum" href={`tel:${phone}`}>
                  <Phone size={15} /> {phone}
                </a>
              )}
              {hasCvvSite && (
                <a className="btn-pill btn-outline" href="https://cvv.org.br" target="_blank" rel="noreferrer">
                  Conversar pelo site <ExternalLink size={14} />
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>

    <p className="support__foot">
      Se você estiver em perigo agora, ligue 192 ou 190. Você merece cuidado.
    </p>
    <button type="button" className="btn-pill btn-ghost" onClick={onBack}>
      Voltar ao início
    </button>
  </section>
);

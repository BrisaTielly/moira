import React from 'react';
import { useScrolled } from '../../hooks/useScrolled';

interface NavbarProps {
  userName?: string;
  onEditName?: () => void;
  onStartReading: () => void;
}

const LINKS = [
  { href: '#ritual', label: 'O ritual' },
  { href: '#diferenca', label: 'Por que a Moira' },
  { href: '#grimorio', label: 'Seu grimório' },
  { href: '#faq', label: 'Dúvidas' },
];

export const Navbar: React.FC<NavbarProps> = ({ userName, onEditName, onStartReading }) => {
  const scrolled = useScrolled(24);

  return (
    <header className="nav-wrap">
      <div className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <a href="#" className="nav__brand" aria-label="Moira — início">
          moira
          <span className="nav__brand-star" aria-hidden="true">✦</span>
        </a>

        <nav className="nav__links" aria-label="Navegação principal">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          {userName ? (
            <div className="nav__user">
              <span style={{ color: 'var(--text-faint)' }}>Olá,</span>
              <strong style={{ fontWeight: 600, color: 'var(--brand-plum)' }}>{userName}</strong>
              {onEditName && (
                <button type="button" onClick={onEditName}>
                  editar
                </button>
              )}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onStartReading}
            className="btn-pill btn-plum nav__cta"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            {userName ? 'Ir para minha pergunta' : 'Começar leitura'}
          </button>
        </div>

        {/* O fio da Moira: acompanha o quanto da página já foi lido */}
        <span className="nav__thread" aria-hidden="true" />
      </div>
    </header>
  );
};

import React from 'react';

interface NavbarProps {
  userName?: string;
  onEditName?: () => void;
  onStartReading: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName,
  onEditName,
  onStartReading,
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: 'rgba(250, 249, 246, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <a
          href="#"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--brand-plum)',
              letterSpacing: '-0.02em',
            }}
          >
            moira
          </span>
        </a>

        {/* Links Centrais (Estilo Enxovaly / V2) */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
          className="nav-desktop-links"
        >
          <a
            href="#como-funciona"
            style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            Como funciona
          </a>
          <a
            href="#leitura"
            style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            Fazer pergunta
          </a>
          <a
            href="#cards-memoria"
            style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            A experiência
          </a>
          <a
            href="#faq"
            style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            Dúvidas
          </a>
        </nav>

        {/* Ação à Direita */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {userName ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
              }}
            >
              <span style={{ color: 'var(--text-faint)' }}>Olá,</span>
              <strong style={{ fontWeight: 600, color: 'var(--brand-plum)' }}>{userName}</strong>
              {onEditName && (
                <button
                  type="button"
                  onClick={onEditName}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: '0 2px',
                  }}
                >
                  editar
                </button>
              )}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onStartReading}
            className="btn-pill btn-plum"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            {userName ? 'Ir para minha pergunta' : 'Entrar na leitura'}
          </button>
        </div>
      </div>
    </header>
  );
};

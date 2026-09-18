import React from 'react';

interface HeaderProps {
  userName?: string;
  onEditName?: () => void;
  showNameBadge?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  onEditName,
  showNameBadge = false,
}) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-parchment-light)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Brand / Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--text-main)',
              lineHeight: 1,
            }}
          >
            M
            <span
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '0.9em',
              }}
            >
              <span style={{ opacity: 0.9 }}>O</span>
              <span
                style={{
                  position: 'absolute',
                  fontSize: '0.55em',
                  color: 'var(--accent-orange)',
                  fontWeight: 900,
                  transform: 'translateY(-1px)',
                }}
              >
                ✦
              </span>
            </span>
            IRA
          </span>
        </div>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}
        >
          Perguntas também abrem caminhos
        </span>
      </div>

      {/* Center Tagline (Desktop) */}
      <div
        className="header-tagline"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        <span>Tarot</span>
        <span style={{ color: 'var(--border-subtle)' }}>/</span>
        <span>Escuta</span>
        <span style={{ color: 'var(--border-subtle)' }}>/</span>
        <span>Perspectiva</span>
      </div>

      {/* Right Side Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {showNameBadge && userName && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              color: 'var(--text-main)',
            }}
          >
            <span style={{ color: 'var(--text-faint)', fontSize: '12px' }}>Consulente:</span>
            <strong style={{ fontWeight: 600 }}>{userName}</strong>
            {onEditName && (
              <button
                type="button"
                onClick={onEditName}
                title="Editar como quer ser chamada"
                aria-label="Editar nome"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-plum)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '2px 4px',
                }}
              >
                Editar
              </button>
            )}
          </div>
        )}

        {/* Moon Phase Icon */}
        <div
          title="Fases da Lua · Símbolo do Portal"
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            color: 'var(--accent-purple)',
            opacity: 0.85,
            userSelect: 'none',
          }}
        >
          <span>☽</span>
          <span>●</span>
          <span>☾</span>
        </div>
      </div>
    </header>
  );
};

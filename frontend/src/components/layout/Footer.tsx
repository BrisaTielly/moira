import React from 'react';

interface FooterProps {
  onResetSession: () => void;
  hasActiveSession: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onResetSession, hasActiveSession }) => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#FFFFFF',
        padding: '48px 24px 32px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '26px',
                fontWeight: 700,
                color: 'var(--brand-plum)',
              }}
            >
              moira
            </span>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Uma leitura de Tarot com IA e espaço para conversar.
            </p>
          </div>

          {hasActiveSession && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 16px',
                fontSize: '13px',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Sessão local ativa</span>
              <button
                type="button"
                onClick={onResetSession}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-plum)',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Reiniciar sessão
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--text-faint)',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span>© {new Date().getFullYear()} Moira. Todos os direitos reservados.</span>
          <span>Desenvolvido com carinho para o universo místico.</span>
        </div>
      </div>
    </footer>
  );
};

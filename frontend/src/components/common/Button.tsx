import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'lime' | 'plum' | 'secondary' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'lime',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'lime':
        return {
          backgroundColor: 'var(--accent-lime)',
          color: 'var(--text-on-lime)',
          border: '1px solid #9fb916',
          boxShadow: '0 2px 8px rgba(196, 222, 43, 0.25)',
        };
      case 'plum':
        return {
          backgroundColor: 'var(--accent-plum)',
          color: 'var(--text-on-plum)',
          border: '1px solid #442336',
          boxShadow: '0 2px 8px rgba(88, 51, 72, 0.25)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-subtle)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid transparent',
        };
      default:
        return {};
    }
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: variant === 'ghost' ? '8px 12px' : '14px 28px',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-sans)',
        fontSize: '15px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: variant === 'lime' ? 'uppercase' : 'none',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        width: '100%',
        ...getVariantStyles(),
      }}
      className={`moira-btn ${className}`}
    >
      {isLoading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg
            style={{
              animation: 'spin 1s linear infinite',
              width: '18px',
              height: '18px',
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          Processando...
        </span>
      ) : (
        <>
          {children}
          {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
        </>
      )}
    </button>
  );
};

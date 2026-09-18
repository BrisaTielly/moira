import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}) => {
  const defaultId = useId();
  const inputId = id || defaultId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', textAlign: 'left' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: error ? 'var(--accent-error)' : 'var(--text-muted)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        style={{
          width: '100%',
          padding: '14px 18px',
          fontSize: '16px',
          fontFamily: 'var(--font-sans)',
          color: 'var(--text-main)',
          backgroundColor: 'var(--bg-input)',
          border: error ? '1.5px solid var(--accent-error)' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          transition: 'all 0.2s ease',
        }}
        onFocus={(e) => {
          e.target.style.backgroundColor = 'var(--bg-input-focus)';
          e.target.style.borderColor = error ? 'var(--accent-error)' : 'var(--border-strong)';
        }}
        onBlur={(e) => {
          e.target.style.backgroundColor = 'var(--bg-input)';
          e.target.style.borderColor = error ? 'var(--accent-error)' : 'var(--border-subtle)';
        }}
        className={`moira-input ${className}`}
        {...props}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          style={{
            fontSize: '13px',
            color: 'var(--accent-error)',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          style={{
            fontSize: '13px',
            color: 'var(--text-faint)',
            marginTop: '2px',
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

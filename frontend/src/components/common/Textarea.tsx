import React, { useId } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: { current: number; max: number };
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  charCount,
  id,
  className = '',
  ...props
}) => {
  const defaultId = useId();
  const textareaId = id || defaultId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {label && (
          <label
            htmlFor={textareaId}
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
        {charCount && (
          <span
            style={{
              fontSize: '12px',
              color: charCount.current > charCount.max ? 'var(--accent-error)' : 'var(--text-faint)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {charCount.current}/{charCount.max}
          </span>
        )}
      </div>

      <textarea
        id={textareaId}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        style={{
          width: '100%',
          minHeight: '140px',
          padding: '16px 18px',
          fontSize: '16px',
          lineHeight: '1.6',
          fontFamily: 'var(--font-sans)',
          color: 'var(--text-main)',
          backgroundColor: 'var(--bg-input)',
          border: error ? '1.5px solid var(--accent-error)' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          resize: 'vertical',
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
        className={`moira-textarea ${className}`}
        {...props}
      />

      {error && (
        <p
          id={`${textareaId}-error`}
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
          id={`${textareaId}-helper`}
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

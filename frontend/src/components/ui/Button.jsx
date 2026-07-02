import React from 'react';

/* ── Button variant styles ── */
const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
  },
  secondary: {
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
    boxShadow: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 2px 8px rgba(239,68,68,0.35)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
    boxShadow: 'none',
  },
  success: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 2px 8px rgba(16,185,129,0.35)',
  },
  warning: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#ffffff',
    border: 'none',
    boxShadow: 'none',
  },
};

const sizeStyles = {
  xs: { padding: '5px 10px', fontSize: '11.5px' },
  sm: { padding: '7px 13px', fontSize: '12.5px' },
  md: { padding: '9px 16px', fontSize: '13.5px' },
  lg: { padding: '11px 20px', fontSize: '14.5px' },
};

const Button = React.forwardRef(({
  children, variant = 'primary', size = 'md', loading = false,
  disabled = false, icon: Icon, iconRight: IconRight, className = '',
  style = {}, ...props
}, ref) => {
  const vs = variantStyles[variant] || variantStyles.primary;
  const ss = sizeStyles[size] || sizeStyles.md;

  return (
    <>
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`sc-btn sc-btn--${variant} sc-btn--${size} press-effect ${className}`}
        style={{ ...vs, ...ss, ...style }}
        {...props}
      >
        {loading ? (
          <svg
            className="sc-btn__spinner"
            fill="none"
            viewBox="0 0 24 24"
            style={{ width: 14, height: 14, animation: 'spin 0.75s linear infinite', flexShrink: 0 }}
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : Icon ? (
          <Icon size={13} style={{ flexShrink: 0 }} />
        ) : null}
        {children}
        {IconRight && !loading && <IconRight size={13} style={{ flexShrink: 0 }} />}
      </button>

      <style>{`
        .sc-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          cursor: pointer;
          transition: filter 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .sc-btn:hover:not(:disabled) {
          filter: brightness(1.08);
        }
        .sc-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: none;
        }
        .sc-btn--ghost:hover:not(:disabled) {
          background: var(--nav-hover-bg);
          filter: none;
        }
        .sc-btn--secondary:hover:not(:disabled) {
          background: var(--bg-surface-2);
          filter: none;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
});

Button.displayName = 'Button';
export default Button;

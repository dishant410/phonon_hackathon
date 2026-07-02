import React from 'react';

const variants = {
  primary: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
  },
  secondary: {
    background: '#fff',
    color: '#374151',
    border: '1.5px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 14px rgba(239,68,68,0.30)',
  },
  ghost: {
    background: 'transparent',
    color: '#64748b',
    border: 'none',
    boxShadow: 'none',
  },
  success: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 14px rgba(16,185,129,0.30)',
  },
  warning: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 12px rgba(245,158,11,0.25)',
  },
  outline: {
    background: 'transparent',
    color: '#4f46e5',
    border: '1.5px solid #4f46e5',
    boxShadow: 'none',
  },
};

const sizes = {
  xs: { padding: '5px 11px',  fontSize: '11.5px', borderRadius: '7px' },
  sm: { padding: '7px 14px',  fontSize: '12.5px', borderRadius: '8px' },
  md: { padding: '9px 18px',  fontSize: '13.5px', borderRadius: '10px' },
  lg: { padding: '11px 22px', fontSize: '14.5px', borderRadius: '11px' },
};

const Button = React.forwardRef(({
  children, variant = 'primary', size = 'md', loading = false,
  disabled = false, icon: Icon, iconRight: IconRight,
  className = '', style = {}, ...props
}, ref) => {
  const vs = variants[variant] || variants.primary;
  const ss = sizes[size] || sizes.md;

  return (
    <>
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`sc-btn sc-btn--${variant} press ${className}`}
        style={{ ...vs, ...ss, ...style }}
        {...props}
      >
        {loading ? (
          <svg style={{ width: 14, height: 14, animation: 'btnSpin 0.7s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
            <path fill="currentColor" opacity="0.8" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : Icon ? (
          <Icon size={13} style={{ flexShrink: 0 }} />
        ) : null}
        {children}
        {!loading && IconRight && <IconRight size={13} style={{ flexShrink: 0 }} />}
      </button>
      <style>{`
        .sc-btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 7px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: -0.01em;
          transition: filter 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
          outline: none;
        }
        .sc-btn:hover:not(:disabled) { filter: brightness(1.07); }
        .sc-btn:disabled { opacity: 0.55; cursor: not-allowed; filter: none; }
        .sc-btn--ghost:hover:not(:disabled) { background: #f1f5f9 !important; filter: none; color: #4f46e5; }
        .sc-btn--secondary:hover:not(:disabled) { background: #f8fafc !important; border-color: #c7d2fe !important; filter: none; }
        .sc-btn--outline:hover:not(:disabled) { background: #eef2ff !important; filter: none; }
        @keyframes btnSpin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
});

Button.displayName = 'Button';
export default Button;

import React from 'react';

const Card = ({ children, className = '', hover = false, padding = true, style = {} }) => (
  <div
    className={`sc-card ${hover ? 'sc-card--hover' : ''} ${!padding ? 'sc-card--no-padding' : ''} ${className}`}
    style={style}
  >
    {children}
    <style>{`
      .sc-card {
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 22px;
        transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
      }
      .sc-card--hover:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
        border-color: var(--border-strong);
      }
      .sc-card--no-padding {
        padding: 0;
      }
    `}</style>
  </div>
);

Card.Header = ({ children, className = '', actions }) => (
  <div className={`sc-card-header ${className}`}>
    <div style={{ flex: 1 }}>{children}</div>
    {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>}
    <style>{`
      .sc-card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 18px;
      }
    `}</style>
  </div>
);

Card.Title = ({ children, className = '' }) => (
  <h3
    className={className}
    style={{
      fontSize: '14.5px',
      fontWeight: 600,
      color: 'var(--text-primary)',
      letterSpacing: '-0.01em',
    }}
  >
    {children}
  </h3>
);

Card.Body = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export default Card;

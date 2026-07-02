import React from 'react';

const Card = ({ children, className = '', hover = false, padding = true, style = {} }) => (
  <>
    <div
      className={`sc-card ${hover ? 'sc-card--hover' : ''} ${!padding ? 'sc-card--no-pad' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
    <style>{`
      .sc-card {
        background: #ffffff;
        border: 1px solid #e8edf5;
        border-radius: 16px;
        box-shadow: 0 1px 4px rgba(15,23,42,0.05), 0 4px 16px rgba(15,23,42,0.03);
        padding: 22px;
        transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
      }
      .sc-card--hover:hover {
        box-shadow: 0 8px 30px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.05);
        transform: translateY(-2px);
        border-color: #c7d2fe;
      }
      .sc-card--no-pad { padding: 0; }
    `}</style>
  </>
);

Card.Header = ({ children, className = '', actions }) => (
  <div className={`sc-card-hdr ${className}`}>
    <div style={{ flex: 1 }}>{children}</div>
    {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>}
    <style>{`
      .sc-card-hdr {
        display: flex; align-items: flex-start; justify-content: space-between;
        margin-bottom: 18px;
      }
    `}</style>
  </div>
);

Card.Title = ({ children, className = '' }) => (
  <h3 className={className} style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
    {children}
  </h3>
);

Card.Body = ({ children, className = '', style = {} }) => (
  <div className={className} style={style}>{children}</div>
);

export default Card;

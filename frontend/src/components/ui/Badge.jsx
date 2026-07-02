import React from 'react';

const variantStyles = {
  default: { bg: 'rgba(100,116,139,0.12)', color: '#64748b' },
  success: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  warning: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  danger: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  info: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  purple: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  indigo: { bg: 'rgba(99,102,241,0.12)', color: '#6366f1' },
};

const Badge = ({ children, variant = 'default', dot = false, className = '', style = {} }) => {
  const vs = variantStyles[variant] || variantStyles.default;
  return (
    <span
      className={`sc-badge ${className}`}
      style={{ background: vs.bg, color: vs.color, ...style }}
    >
      {dot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
      )}
      {children}
      <style>{`
        .sc-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 9px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
      `}</style>
    </span>
  );
};

/* Convenience mappers */
export const riskLevelBadge = (level) => {
  const map = { low: 'success', medium: 'warning', high: 'danger', critical: 'danger' };
  return <Badge variant={map[level] || 'default'} dot>{level?.toUpperCase()}</Badge>;
};

export const statusBadge = (status) => {
  const map = {
    open: 'danger', in_progress: 'warning', mitigated: 'success', accepted: 'info',
    closed: 'default', implemented: 'success', partial: 'warning',
    not_implemented: 'danger', planned: 'info', active: 'success',
    draft: 'default', review: 'warning', approved: 'success', deprecated: 'default', expired: 'danger',
    pending: 'warning',
  };
  return <Badge variant={map[status] || 'default'}>{status?.replace(/_/g, ' ')?.toUpperCase()}</Badge>;
};

export default Badge;

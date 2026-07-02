import React from 'react';

const variantMap = {
  default: { bg: '#f1f5f9',           color: '#64748b' },
  success: { bg: '#dcfce7',           color: '#16a34a' },
  warning: { bg: '#fef9c3',           color: '#ca8a04' },
  danger:  { bg: '#fee2e2',           color: '#dc2626' },
  info:    { bg: '#dbeafe',           color: '#2563eb' },
  purple:  { bg: '#f5f3ff',           color: '#7c3aed' },
  indigo:  { bg: '#eef2ff',           color: '#4338ca' },
};

const Badge = ({ children, variant = 'default', dot = false, className = '', style = {} }) => {
  const v = variantMap[variant] || variantMap.default;
  return (
    <>
      <span
        className={`sc-badge ${className}`}
        style={{ background: v.bg, color: v.color, ...style }}
      >
        {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />}
        {children}
      </span>
      <style>{`
        .sc-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 9px;
          border-radius: 99px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
};

export const riskLevelBadge = (level) => {
  const map = { low: 'success', medium: 'warning', high: 'danger', critical: 'danger' };
  return <Badge variant={map[level] || 'default'} dot>{level?.toUpperCase()}</Badge>;
};

export const statusBadge = (status) => {
  const map = {
    open: 'danger', in_progress: 'warning', mitigated: 'success', accepted: 'info',
    closed: 'default', implemented: 'success', partial: 'warning',
    not_implemented: 'danger', planned: 'info', active: 'success',
    draft: 'default', review: 'warning', approved: 'success', deprecated: 'default',
    expired: 'danger', pending: 'warning',
  };
  return <Badge variant={map[status] || 'default'}>{status?.replace(/_/g, ' ')?.toUpperCase()}</Badge>;
};

export default Badge;

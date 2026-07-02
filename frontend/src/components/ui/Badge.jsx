import React from 'react';

const variants = {
  default: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800',
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-800',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 ring-1 ring-indigo-200 dark:ring-indigo-800',
};

const Badge = ({ children, variant = 'default', dot = false, className = '' }) => (
  <span className={`
    inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
    ${variants[variant]} ${className}
  `}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
    {children}
  </span>
);

// Convenience mappers
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

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  indigo: { grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,0.30)' },
  emerald: { grad: 'linear-gradient(135deg,#10b981,#059669)', glow: 'rgba(16,185,129,0.30)' },
  amber: { grad: 'linear-gradient(135deg,#f59e0b,#d97706)', glow: 'rgba(245,158,11,0.30)' },
  red: { grad: 'linear-gradient(135deg,#ef4444,#dc2626)', glow: 'rgba(239,68,68,0.30)' },
  blue: { grad: 'linear-gradient(135deg,#3b82f6,#2563eb)', glow: 'rgba(59,130,246,0.30)' },
  purple: { grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', glow: 'rgba(139,92,246,0.30)' },
};

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color = 'indigo', loading = false, subtitle }) => {
  const c = colorMap[color] || colorMap.indigo;

  if (loading) {
    return (
      <div className="sc-stat-card">
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 12, width: '55%', borderRadius: 6, marginBottom: 14 }} />
          <div className="skeleton" style={{ height: 28, width: '40%', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 10, width: '30%', borderRadius: 6, marginTop: 10 }} />
        </div>
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
        <style>{statCardStyles}</style>
      </div>
    );
  }

  return (
    <div className="sc-stat-card sc-stat-card--hover">
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="sc-stat-card__title">{title}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
          <p className="sc-stat-card__value">{value ?? '—'}</p>
          {subtitle && <span className="sc-stat-card__subtitle">{subtitle}</span>}
        </div>
        {trendLabel && (
          <div
            className="sc-stat-card__trend"
            style={{ color: trend >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}
          >
            {trend >= 0
              ? <TrendingUp size={11} />
              : <TrendingDown size={11} />
            }
            <span>{trendLabel}</span>
          </div>
        )}
      </div>

      {Icon && (
        <div
          className="sc-stat-card__icon"
          style={{
            background: c.grad,
            boxShadow: `0 6px 18px ${c.glow}`,
          }}
        >
          <Icon size={19} color="#fff" />
        </div>
      )}

      <style>{statCardStyles}</style>
    </div>
  );
};

const statCardStyles = `
  .sc-stat-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 22px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  }
  .sc-stat-card--hover:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
    border-color: var(--border-strong);
  }
  .sc-stat-card__title {
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .sc-stat-card__value {
    font-size: 26px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .sc-stat-card__subtitle {
    font-size: 12px;
    color: var(--text-muted);
  }
  .sc-stat-card__trend {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 11.5px;
    font-weight: 600;
  }
  .sc-stat-card__icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }
  .sc-stat-card--hover:hover .sc-stat-card__icon {
    transform: scale(1.06);
  }
`;

export default StatCard;

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  indigo:  { grad: 'linear-gradient(135deg,#4f46e5,#6366f1)', glow: '0 8px 24px rgba(79,70,229,0.30)',  bg: '#eef2ff' },
  emerald: { grad: 'linear-gradient(135deg,#10b981,#059669)', glow: '0 8px 24px rgba(16,185,129,0.28)', bg: '#ecfdf5' },
  amber:   { grad: 'linear-gradient(135deg,#f59e0b,#d97706)', glow: '0 8px 24px rgba(245,158,11,0.28)', bg: '#fffbeb' },
  red:     { grad: 'linear-gradient(135deg,#ef4444,#dc2626)', glow: '0 8px 24px rgba(239,68,68,0.28)',  bg: '#fef2f2' },
  blue:    { grad: 'linear-gradient(135deg,#3b82f6,#2563eb)', glow: '0 8px 24px rgba(59,130,246,0.28)', bg: '#eff6ff' },
  purple:  { grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', glow: '0 8px 24px rgba(139,92,246,0.28)', bg: '#f5f3ff' },
};

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color = 'indigo', loading = false, subtitle }) => {
  const c = colorMap[color] || colorMap.indigo;

  if (loading) {
    return (
      <>
        <div className="sc-stat-card">
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 11, width: '55%', marginBottom: 14 }} />
            <div className="skeleton" style={{ height: 28, width: '40%', marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 9, width: '30%' }} />
          </div>
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0 }} />
          <style>{statStyle}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sc-stat-card sc-stat-card--hover">
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="sc-stat__label">{title}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
            <p className="sc-stat__value">{value ?? '—'}</p>
            {subtitle && <span className="sc-stat__sub">{subtitle}</span>}
          </div>
          {trendLabel && (
            <div className="sc-stat__trend" style={{ color: trend >= 0 ? '#10b981' : '#ef4444' }}>
              {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{trendLabel}</span>
            </div>
          )}
        </div>
        <div className="sc-stat__icon" style={{ background: c.grad, boxShadow: c.glow }}>
          <Icon size={20} color="#fff" />
        </div>
        <style>{statStyle}</style>
      </div>
    </>
  );
};

const statStyle = `
  .sc-stat-card {
    background: #fff;
    border: 1px solid #e8edf5;
    border-radius: 16px;
    padding: 22px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow: 0 1px 4px rgba(15,23,42,0.05);
    transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
  }
  .sc-stat-card--hover:hover {
    box-shadow: 0 10px 32px rgba(15,23,42,0.10);
    transform: translateY(-3px);
    border-color: #c7d2fe;
  }
  .sc-stat__label {
    font-size: 12px; font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .sc-stat__value {
    font-size: 28px; font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.035em;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .sc-stat__sub {
    font-size: 12px; color: #94a3b8;
  }
  .sc-stat__trend {
    display: flex; align-items: center; gap: 4px;
    margin-top: 8px;
    font-size: 11.5px; font-weight: 700;
  }
  .sc-stat__icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }
  .sc-stat-card--hover:hover .sc-stat__icon {
    transform: scale(1.08) rotate(3deg);
  }
`;

export default StatCard;

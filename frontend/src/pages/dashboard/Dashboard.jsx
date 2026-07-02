import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  AlertTriangle, Shield, CheckCircle, FileText,
  Activity, Percent, ArrowUpRight
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import RiskHeatmap from '../../components/charts/RiskHeatmap';
import ComplianceChart from '../../components/charts/ComplianceChart';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [matrixData, setMatrixData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, matrixRes, trendRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRiskMatrix(),
        dashboardService.getComplianceScore()
      ]);
      setStats(statsRes.data.data);
      setMatrixData(matrixRes.data.data.risks || []);
      setTrendData(trendRes.data.data.trend || []);
    } catch (err) {
      toast.error('Failed to load GRC dashboard KPIs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Welcome Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>Compliance &amp; Risk Center</h1>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>SOC 2 Type II &amp; DPDP Act audit tracking control panel.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={Activity}
            onClick={fetchDashboardData}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard
          title="Overall Compliance Score"
          value={stats ? `${stats.overallComplianceScore}%` : '0%'}
          icon={Percent}
          color="indigo"
          loading={loading}
          subtitle={`Target: 95%`}
        />
        <StatCard
          title="Active Risks"
          value={stats?.risks?.open || 0}
          icon={AlertTriangle}
          color="red"
          loading={loading}
          trend={stats?.risks?.critical > 0 ? -1 : 1}
          trendLabel={stats?.risks?.critical > 0 ? `${stats.risks.critical} Critical Item` : 'Healthy Level'}
        />
        <StatCard
          title="Implemented Controls"
          value={`${stats?.controls?.implemented || 0} / ${stats?.controls?.total || 0}`}
          icon={Shield}
          color="emerald"
          loading={loading}
          subtitle={`${stats?.controls?.complianceScore || 0}% Coverage`}
        />
        <StatCard
          title="Privacy Obligations (DPDP)"
          value={`${stats?.privacy?.completed || 0} / ${stats?.privacy?.total || 0}`}
          icon={CheckCircle}
          color="blue"
          loading={loading}
          subtitle={`${stats?.privacy?.score || 0}% Completed`}
        />
      </div>

      {/* Dual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 18 }}>
        <Card>
          <Card.Header>
            <Card.Title>Compliance Score Trend</Card.Title>
            <p className="text-xs text-slate-400">Monthly progress of SOC 2 controls vs DPDP privacy items.</p>
          </Card.Header>
          <Card.Body>
            <ComplianceChart trendData={trendData} />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Inherited Risk Heatmap (4x4)</Card.Title>
            <p className="text-xs text-slate-400">Interactive matrix layout of Likelihood code versus Impact weight.</p>
          </Card.Header>
          <Card.Body>
            <RiskHeatmap data={matrixData} />
          </Card.Body>
        </Card>
      </div>

      {/* DPDP Section highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
        <Card style={{ gridColumn: 'span 2' }}>
          <Card.Header>
            <Card.Title>Regulatory Compliance Bulletins</Card.Title>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <div style={{ padding: 8, borderRadius: 8, background: 'rgba(99,102,241,0.12)', color: '#6366f1', flexShrink: 0 }}>
                  <FileText size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    DPDP Act Compliance Readiness
                    <span style={{ fontSize: 10.5, padding: '1px 8px', borderRadius: 99, background: 'rgba(16,185,129,0.12)', color: '#10b981', fontWeight: 600 }}>New Act</span>
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.55 }}>Section 7 is now mandatory. Ensure consent templates and logs of Consent Managers are digitized and stored in your Compliance Controls section.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 10, background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ padding: 8, borderRadius: 8, background: 'var(--nav-hover-bg)', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <FileText size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    SOC 2 Type II Testing Period
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.55 }}>The current testing window ends soon. Ensure all automated logging policies, database encryption and penetration test evidence reports are validated.</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Auditor Quicklinks</Card.Title>
          </Card.Header>
          <Card.Body style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['Control Mapping System', '/controls'], ['Evidence File Collector', '/audit'], ['Obligations Checklist', '/privacy']].map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 14px', borderRadius: 10,
                  border: '1px solid var(--border)',
                  transition: 'background 0.15s, border-color 0.15s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--nav-hover-bg)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
                <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
              </a>
            ))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

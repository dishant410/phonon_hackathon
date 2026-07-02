import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  AlertTriangle, Shield, CheckCircle, FileText,
  Users, Activity, Percent, ArrowUpRight
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
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
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Compliance & Risk Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">SOC 2 Type II & DPDP Act audit tracking control panel.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <Activity size={15} /> Refresh Dashboard
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Regulatory Compliance Bulletins</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-800/30">
                <div className="p-2 rounded bg-indigo-500/10 text-indigo-500">
                  <FileText size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    DPDP Act Compliance Readiness
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium">New Act</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Section 7 is now mandatory. Ensure consent templates and logs of Consent Managers are digitized and stored in your Compliance Controls section.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30">
                <div className="p-2 rounded bg-slate-500/10 text-slate-400">
                  <FileText size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    SOC 2 Type II Testing Period
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">The current testing window ends soon. Ensure all automated logging policies, database encryption and penetration test evidence reports are validated.</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Auditor Quicklinks</Card.Title>
          </Card.Header>
          <Card.Body className="space-y-2">
            <a href="/controls" className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <span className="text-sm text-slate-700 dark:text-slate-350">Control Mapping System</span>
              <ArrowUpRight size={16} className="text-slate-400" />
            </a>
            <a href="/audit" className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <span className="text-sm text-slate-700 dark:text-slate-350">Evidence File Collector</span>
              <ArrowUpRight size={16} className="text-slate-400" />
            </a>
            <a href="/privacy" className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <span className="text-sm text-slate-700 dark:text-slate-350">Obligations Checklist</span>
              <ArrowUpRight size={16} className="text-slate-400" />
            </a>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

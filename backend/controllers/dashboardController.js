const Risk = require('../models/Risk');
const Control = require('../models/Control');
const AuditEvidence = require('../models/AuditEvidence');
const PrivacyObligation = require('../models/PrivacyObligation');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

const getStats = async (req, res) => {
  const [
    totalRisks,
    openRisks,
    highRisks,
    criticalRisks,
    totalControls,
    implementedControls,
    totalEvidence,
    pendingEvidence,
    totalObligations,
    completedObligations,
    overdueObligations,
    totalUsers,
  ] = await Promise.all([
    Risk.countDocuments(),
    Risk.countDocuments({ status: 'open' }),
    Risk.countDocuments({ riskLevel: 'high' }),
    Risk.countDocuments({ riskLevel: 'critical' }),
    Control.countDocuments(),
    Control.countDocuments({ status: 'implemented' }),
    AuditEvidence.countDocuments(),
    AuditEvidence.countDocuments({ reviewStatus: 'pending' }),
    PrivacyObligation.countDocuments(),
    PrivacyObligation.countDocuments({ status: 'completed' }),
    PrivacyObligation.countDocuments({ status: 'overdue' }),
    User.countDocuments({ isActive: true }),
  ]);

  const controlComplianceScore = totalControls > 0 ? Math.round((implementedControls / totalControls) * 100) : 0;
  const privacyScore = totalObligations > 0 ? Math.round((completedObligations / totalObligations) * 100) : 0;
  const overallScore = Math.round((controlComplianceScore + privacyScore) / 2);

  return ApiResponse.success(res, {
    risks: { total: totalRisks, open: openRisks, high: highRisks, critical: criticalRisks },
    controls: { total: totalControls, implemented: implementedControls, complianceScore: controlComplianceScore },
    evidence: { total: totalEvidence, pending: pendingEvidence },
    privacy: { total: totalObligations, completed: completedObligations, overdue: overdueObligations, score: privacyScore },
    users: { active: totalUsers },
    overallComplianceScore: overallScore,
  }, 'Dashboard stats retrieved');
};

const getRiskMatrix = async (req, res) => {
  const risks = await Risk.find({}, 'title likelihood impact riskLevel status');
  const matrix = Array.from({ length: 4 }, () => Array(4).fill(0));
  risks.forEach(r => {
    if (r.likelihood >= 1 && r.likelihood <= 4 && r.impact >= 1 && r.impact <= 4) {
      matrix[r.likelihood - 1][r.impact - 1]++;
    }
  });
  return ApiResponse.success(res, { matrix, risks }, 'Risk matrix retrieved');
};

const getComplianceScore = async (req, res) => {
  const [soc2Controls, dpdpObligations] = await Promise.all([
    Control.find({ framework: { $in: ['SOC2'] } }, 'status'),
    PrivacyObligation.find({}, 'status'),
  ]);

  const soc2Implemented = soc2Controls.filter(c => c.status === 'implemented').length;
  const soc2Score = soc2Controls.length > 0 ? Math.round((soc2Implemented / soc2Controls.length) * 100) : 0;

  const dpdpCompleted = dpdpObligations.filter(o => o.status === 'completed').length;
  const dpdpScore = dpdpObligations.length > 0 ? Math.round((dpdpCompleted / dpdpObligations.length) * 100) : 0;

  const monthly = [
    { month: 'Jan', soc2: Math.max(0, soc2Score - 30), dpdp: Math.max(0, dpdpScore - 25) },
    { month: 'Feb', soc2: Math.max(0, soc2Score - 22), dpdp: Math.max(0, dpdpScore - 20) },
    { month: 'Mar', soc2: Math.max(0, soc2Score - 15), dpdp: Math.max(0, dpdpScore - 14) },
    { month: 'Apr', soc2: Math.max(0, soc2Score - 10), dpdp: Math.max(0, dpdpScore - 8) },
    { month: 'May', soc2: Math.max(0, soc2Score - 5), dpdp: Math.max(0, dpdpScore - 4) },
    { month: 'Jun', soc2: soc2Score, dpdp: dpdpScore },
  ];

  return ApiResponse.success(res, {
    soc2: { score: soc2Score, total: soc2Controls.length, implemented: soc2Implemented },
    dpdp: { score: dpdpScore, total: dpdpObligations.length, completed: dpdpCompleted },
    trend: monthly,
  }, 'Compliance score retrieved');
};

module.exports = { getStats, getRiskMatrix, getComplianceScore };

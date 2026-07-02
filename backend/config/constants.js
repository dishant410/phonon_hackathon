module.exports = {
  ROLES: {
    ADMIN: 'admin',
    SECURITY_MANAGER: 'security_manager',
    AUDITOR: 'auditor',
    EMPLOYEE: 'employee',
  },
  RISK_STATUS: {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    MITIGATED: 'mitigated',
    ACCEPTED: 'accepted',
    CLOSED: 'closed',
  },
  RISK_CATEGORIES: ['operational', 'technical', 'compliance', 'financial', 'reputational', 'data_privacy'],
  LIKELIHOOD: { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 },
  IMPACT: { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 },
  CONTROL_STATUS: {
    IMPLEMENTED: 'implemented',
    PARTIAL: 'partial',
    NOT_IMPLEMENTED: 'not_implemented',
    PLANNED: 'planned',
  },
  CONTROL_TYPES: ['preventive', 'detective', 'corrective', 'compensating'],
  REVIEW_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
  PRIVACY_OBLIGATION_TYPES: ['consent', 'notice', 'dsar', 'breach_notification', 'data_retention', 'cross_border_transfer'],
  FRAMEWORKS: ['SOC2', 'DPDP', 'ISO27001', 'GDPR'],
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
};

const User = require('../models/User');
const Risk = require('../models/Risk');
const Control = require('../models/Control');
const PrivacyObligation = require('../models/PrivacyObligation');
const Policy = require('../models/Policy');
const logger = require('./logger');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      logger.info('Database already contains records. Skipping auto-seeding.');
      return;
    }

    logger.info('Starting GRC Platform Auto-Seed...');

    // 1. Create Users
    const admin = await User.create({
      name: 'Elena Rostova',
      email: 'admin@securecomply.com',
      password: 'Password123!',
      role: 'admin',
      department: 'Executive Board',
    });

    const manager = await User.create({
      name: 'Rajesh Kumar',
      email: 'manager@securecomply.com',
      password: 'Password123!',
      role: 'security_manager',
      department: 'Security & Compliance',
    });

    const auditor = await User.create({
      name: 'Sarah Jenkins',
      email: 'auditor@securecomply.com',
      password: 'Password123!',
      role: 'auditor',
      department: 'External Audit Services',
    });

    const employee = await User.create({
      name: 'Devon Miller',
      email: 'employee@securecomply.com',
      password: 'Password123!',
      role: 'employee',
      department: 'Engineering Platforms',
    });

    logger.info('Pre-populated 4 GRC Roles successfully (Password: Password123!)');

    // 2. Create Controls
    const c1 = await Control.create({
      controlId: 'AC-01',
      title: 'MFA Enforcement on Infrastructure Accounts',
      description: 'Enforce multi-factor authentication for all cloud provider console accesses and database terminals.',
      type: 'preventive',
      status: 'implemented',
      owner: manager._id,
      framework: ['SOC2'],
      soc2Category: 'CC6',
      testingProcedure: 'Verify IAM console setting. Pull active users list from CLI and check MFA active status key.',
      createdBy: admin._id,
    });

    const c2 = await Control.create({
      controlId: 'DS-02',
      title: 'Database Encryption At Rest',
      description: 'All production databases must be configured to utilize AWS KMS or MongoDB encrypted cluster keys.',
      type: 'preventive',
      status: 'implemented',
      owner: manager._id,
      framework: ['SOC2'],
      soc2Category: 'CC6',
      testingProcedure: 'Retrieve AWS RDS console configuration overview and confirm KMS master key encryption is enabled.',
      createdBy: admin._id,
    });

    const c3 = await Control.create({
      controlId: 'CM-01',
      title: 'Consent Manager Collection Interface',
      description: 'Implement a UI consent manager configuration dialog that records explicit user permissions before cookies start logging.',
      type: 'preventive',
      status: 'partial',
      owner: employee._id,
      framework: ['DPDP'],
      testingProcedure: 'Verify presence of cookie consent box on home page. Verify consent data model logs are recorded correctly.',
      createdBy: admin._id,
    });

    // 3. Create Risks
    const r1 = await Risk.create({
      title: 'Credential Stuffing Vulnerability',
      description: 'Lack of rate-limiting or MFA on corporate portals could allow third-party credential compromise.',
      category: 'technical',
      likelihood: 3,
      impact: 4,
      status: 'open',
      owner: manager._id,
      mitigationPlan: 'Deploy cloudflare WAF rules, trigger MFA validation checks on all external facing portals.',
      framework: ['SOC2'],
      linkedControls: [c1._id],
      createdBy: admin._id,
    });

    const r2 = await Risk.create({
      title: 'Consent Database Audit Failures',
      description: 'Inability to provide proof of explicit user choice for DPDP Section 6 obligations, resulting in legal regulatory penalties.',
      category: 'data_privacy',
      likelihood: 2,
      impact: 3,
      status: 'in_progress',
      owner: employee._id,
      mitigationPlan: 'Integrate consent recording backend API and store choice logs inside auditable MongoDB database collection.',
      framework: ['DPDP'],
      linkedControls: [c3._id],
      createdBy: admin._id,
    });

    // 4. Create Privacy obligations (DPDP)
    await PrivacyObligation.create({
      title: 'Explicit Consent Managers Registration',
      description: 'Configure and publish details of registered Consent Managers allowed to request corporate data on behalf of principals.',
      obligationType: 'consent',
      dpdpSection: 'Section 6 (Consent parameters)',
      status: 'pending',
      responsibleParty: employee._id,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      dataSubjectCategory: 'customer',
      createdBy: admin._id,
    });

    await PrivacyObligation.create({
      title: 'DSAR Rights Implementation Handler',
      description: 'Ensure data Principal subject request tools permit employees or customers to request deletion, update, or extraction of records.',
      obligationType: 'dsar',
      dpdpSection: 'Section 11 (Right to Correction/Erasure)',
      status: 'in_progress',
      responsibleParty: manager._id,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      dataSubjectCategory: 'customer',
      createdBy: admin._id,
    });

    logger.info('Auto-seeded all SecureComply entity models.');
  } catch (err) {
    logger.error('Failed to run database seeder: ' + err.message);
  }
};

module.exports = seedData;

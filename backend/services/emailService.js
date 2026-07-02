const logger = require('../utils/logger');

// Mock email service - In production integrate with SendGrid/AWS SES/Nodemailer
class EmailService {
  async sendResetPasswordEmail(email, token, name) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    logger.info(`[MOCK EMAIL] Password reset for ${name} <${email}> → ${resetUrl}`);
    // Production: await transporter.sendMail({ to: email, subject: 'Reset Password', html: template })
    return { sent: true, mock: true, resetUrl };
  }

  async sendWelcomeEmail(email, name, role) {
    logger.info(`[MOCK EMAIL] Welcome email to ${name} <${email}> (role: ${role})`);
    return { sent: true, mock: true };
  }

  async sendEvidenceReviewEmail(auditorEmail, evidence, status) {
    logger.info(`[MOCK EMAIL] Evidence "${evidence.title}" ${status} → ${auditorEmail}`);
    return { sent: true, mock: true };
  }

  async sendRiskAlertEmail(ownerEmail, risk) {
    logger.info(`[MOCK EMAIL] High risk alert "${risk.title}" → ${ownerEmail}`);
    return { sent: true, mock: true };
  }
}

module.exports = new EmailService();

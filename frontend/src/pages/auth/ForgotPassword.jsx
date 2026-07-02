import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, Mail, ArrowLeft, Key, CheckCircle } from 'lucide-react';
import authService from '../../services/authService';
import Button from '../../components/ui/Button';
import { FormField, Input } from '../../components/ui/FormComponents';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '' }
  });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const { data } = await authService.forgotPassword(email);
      setSubmitted(true);
      if (data.data?.resetToken) {
        setResetToken(data.data.resetToken);
      }
      toast.success(data.message || 'Reset link triggered successfully.');
    } catch (err) {
      toast.error('Failed to trigger reset. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      {/* Ambient background */}
      <div className="fp-orb fp-orb--1" />
      <div className="fp-orb fp-orb--2" />

      <div className="fp-card scale-in">
        {/* Icon */}
        <div className="fp-icon-wrap">
          <ShieldCheck size={22} color="#fff" />
        </div>

        {!submitted ? (
          <>
            <h1 className="fp-title">Reset Password</h1>
            <p className="fp-sub">Enter your work email and we'll send a reset link.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="fp-form" noValidate>
              <FormField label="Work Email" error={errors.email?.message}>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    className="auth-input-padded-l"
                    error={errors.email}
                    {...register('email', { required: 'Email is required' })}
                  />
                </div>
              </FormField>

              <Button
                type="submit"
                loading={loading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="fp-success">
            <div className="fp-success-icon">
              <CheckCircle size={28} color="var(--color-success)" />
            </div>
            <h2 className="fp-title">Check your inbox</h2>
            <p className="fp-sub">
              If this email is registered, a password reset link has been dispatched.
            </p>

            {resetToken && (
              <div className="fp-token-box">
                <span className="fp-token-label">MVP Demo Token</span>
                <code className="fp-token-code">{resetToken}</code>
              </div>
            )}

            <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 8 }}>
              Demo mode: normally the link goes to your corporate inbox.
            </p>
          </div>
        )}

        <Link to="/login" className="fp-back-link">
          <ArrowLeft size={13} />
          Back to Sign In
        </Link>
      </div>

      <style>{`
        .fp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: var(--bg-page);
          position: relative;
          overflow: hidden;
        }

        .fp-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .fp-orb--1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%);
          top: -100px;
          left: -100px;
        }
        .fp-orb--2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
          bottom: -80px;
          right: -60px;
        }

        .fp-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
          background: var(--bg-surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .fp-icon-wrap {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(99,102,241,0.40);
          margin-bottom: 22px;
        }

        .fp-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.025em;
          margin-bottom: 8px;
        }
        .fp-sub {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 24px;
        }

        .fp-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 8px;
          text-align: left;
        }

        .auth-input-padded-l {
          padding-left: 36px !important;
        }

        .fp-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 100%;
          margin-bottom: 10px;
        }
        .fp-success-icon {
          margin-bottom: 4px;
        }

        .fp-token-box {
          width: 100%;
          background: var(--bg-surface-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          text-align: left;
          margin-top: 4px;
        }
        .fp-token-label {
          display: block;
          font-size: 10.5px;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .fp-token-code {
          font-size: 11.5px;
          color: var(--text-primary);
          word-break: break-all;
          font-family: 'Fira Code', 'Courier New', monospace;
          line-height: 1.5;
        }

        .fp-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 20px;
          font-size: 13px;
          font-weight: 500;
          color: var(--accent);
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .fp-back-link:hover {
          opacity: 0.75;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;

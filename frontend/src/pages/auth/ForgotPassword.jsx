import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
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
      if (data.data?.resetToken) setResetToken(data.data.resetToken);
      toast.success(data.message || 'Reset link triggered successfully.');
    } catch (err) {
      toast.error('Failed to trigger reset. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fp-page">
        {/* Ambient background */}
        <div className="fp-orb fp-orb--1" />
        <div className="fp-orb fp-orb--2" />

        <div className="fp-card scale-in">
          {/* Icon */}
          <div className="fp-icon">
            <ShieldCheck size={22} color="#4f46e5" />
          </div>

          {!submitted ? (
            <>
              <h1 className="fp-title">Reset Password</h1>
              <p className="fp-sub">
                Enter your work email and we'll send a password reset link.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="fp-form" noValidate>
                <FormField label="Work Email" error={errors.email?.message}>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} style={{
                      position: 'absolute', left: 12, top: '50%',
                      transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none',
                    }} />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      style={{ paddingLeft: 36 }}
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
              <div className="fp-success__icon">
                <CheckCircle size={32} color="#10b981" />
              </div>
              <h2 className="fp-title">Check your inbox</h2>
              <p className="fp-sub">
                If this email is registered, a password reset link has been sent to you.
              </p>

              {resetToken && (
                <div className="fp-token">
                  <span className="fp-token__label">MVP Demo Token</span>
                  <code className="fp-token__code">{resetToken}</code>
                </div>
              )}
              <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 6 }}>
                Demo mode — normally this link goes to your corporate email.
              </p>
            </div>
          )}

          <Link to="/login" className="fp-back">
            <ArrowLeft size={13} /> Back to Sign In
          </Link>
        </div>
      </div>

      <style>{`
        .fp-page {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 20px;
          background: #f0f4ff;
          position: relative; overflow: hidden;
          background-image:
            radial-gradient(circle at 15% 25%, rgba(99,102,241,0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(139,92,246,0.06) 0%, transparent 50%);
        }
        .fp-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          animation: fpOrb 9s ease-in-out infinite;
        }
        .fp-orb--1 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 70%);
          top: -100px; left: -80px; animation-delay: 0s;
        }
        .fp-orb--2 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
          bottom: -70px; right: -60px; animation-delay: 4s;
        }
        @keyframes fpOrb {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.10) translate(6px,-6px); }
        }

        .fp-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 400px;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e8edf5;
          box-shadow: 0 20px 60px rgba(15,23,42,0.10), 0 4px 16px rgba(15,23,42,0.05);
          padding: 36px 32px;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
        }

        .fp-icon {
          width: 56px; height: 56px;
          background: #eef2ff;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          border: 1.5px solid #e0e7ff;
          animation: iconBounce 2s ease-in-out infinite;
        }
        @keyframes iconBounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .fp-title {
          font-size: 22px; font-weight: 800; color: #0f172a;
          letter-spacing: -0.025em; margin-bottom: 8px;
        }
        .fp-sub {
          font-size: 13.5px; color: #94a3b8;
          line-height: 1.6; margin-bottom: 24px; max-width: 300px;
        }

        .fp-form {
          width: 100%;
          display: flex; flex-direction: column; gap: 16px;
          margin-bottom: 8px; text-align: left;
        }

        .fp-success { display: flex; flex-direction: column; align-items: center; }
        .fp-success__icon { margin-bottom: 16px; animation: successPop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes successPop {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .fp-token {
          width: 100%;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 14px;
          text-align: left; margin-top: 12px;
        }
        .fp-token__label {
          display: block; font-size: 10.5px; font-weight: 800;
          color: #4f46e5; text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 6px;
        }
        .fp-token__code {
          font-size: 11.5px; color: #0f172a;
          word-break: break-all; font-family: monospace; line-height: 1.5;
        }

        .fp-back {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 22px; font-size: 13px; font-weight: 600;
          color: #4f46e5; transition: opacity 0.15s;
        }
        .fp-back:hover { opacity: 0.75; }
      `}</style>
    </>
  );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { FormField, Input } from '../../components/ui/FormComponents';

const features = [
  'SOC 2 Type II audit tracking',
  'DPDP Act compliance management',
  'Real-time risk heatmaps',
  'Multi-role access control',
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-panel auth-panel--left">
        {/* Background glow orbs */}
        <div className="auth-orb auth-orb--1" />
        <div className="auth-orb auth-orb--2" />

        <div className="auth-brand">
          <div className="auth-logo">
            <ShieldCheck size={22} color="#fff" />
          </div>
          <h1 className="auth-brand__name">SecureComply</h1>
        </div>

        <div className="auth-hero">
          <h2 className="auth-hero__title">
            Your GRC Command<br />Center Awaits
          </h2>
          <p className="auth-hero__subtitle">
            Unified Governance, Risk &amp; Compliance for enterprise security teams.
          </p>
        </div>

        <ul className="auth-features">
          {features.map((f) => (
            <li key={f} className="auth-feature-item">
              <CheckCircle size={15} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrap scale-in">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Sign in</h2>
            <p className="auth-form-sub">Welcome back — enter your credentials below</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
            <FormField label="Email address" error={errors.email?.message}>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={14}
                  style={{
                    position: 'absolute', left: 12, top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  className="auth-input-padded-l"
                  error={errors.email}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={14}
                  style={{
                    position: 'absolute', left: 12, top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="auth-input-padded-lr"
                  error={errors.password}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-eye-btn"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </FormField>

            <div className="auth-form-meta">
              <label className="auth-remember">
                <input type="checkbox" className="auth-checkbox" id="remember-me" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="auth-submit-btn"
              loading={loading}
              iconRight={ArrowRight}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Sign In
            </Button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link auth-link--bold">
              Create account
            </Link>
          </p>
        </div>
      </div>

      <style>{authStyles}</style>
    </div>
  );
};

const authStyles = `
  .auth-page {
    min-height: 100vh;
    display: flex;
    background: var(--bg-page);
  }

  /* ── Left panel ── */
  .auth-panel--left {
    display: none;
    flex-direction: column;
    justify-content: center;
    padding: 60px 56px;
    background: linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%);
    position: relative;
    overflow: hidden;
  }
  @media (min-width: 1024px) {
    .auth-panel--left {
      display: flex;
      flex: 1;
    }
  }

  .auth-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .auth-orb--1 {
    width: 340px;
    height: 340px;
    background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
    top: -80px;
    right: -60px;
  }
  .auth-orb--2 {
    width: 260px;
    height: 260px;
    background: radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 70%);
    bottom: -60px;
    left: -40px;
  }

  .auth-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 64px;
    position: relative;
    z-index: 1;
  }
  .auth-logo {
    width: 42px;
    height: 42px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
  }
  .auth-brand__name {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
  }

  .auth-hero {
    margin-bottom: 40px;
    position: relative;
    z-index: 1;
  }
  .auth-hero__title {
    font-size: 34px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    letter-spacing: -0.03em;
    margin-bottom: 14px;
  }
  .auth-hero__subtitle {
    font-size: 15px;
    color: rgba(255,255,255,0.62);
    line-height: 1.6;
    max-width: 320px;
  }

  .auth-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    z-index: 1;
  }
  .auth-feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255,255,255,0.75);
    font-size: 13.5px;
    font-weight: 500;
  }
  .auth-feature-item svg {
    color: #a5b4fc;
    flex-shrink: 0;
  }

  /* ── Right panel ── */
  .auth-panel--right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    background: var(--bg-page);
  }

  .auth-form-wrap {
    width: 100%;
    max-width: 400px;
  }

  .auth-form-header {
    margin-bottom: 28px;
  }
  .auth-form-title {
    font-size: 26px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    margin-bottom: 6px;
  }
  .auth-form-sub {
    font-size: 13.5px;
    color: var(--text-muted);
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 22px;
  }

  .auth-input-padded-l {
    padding-left: 36px !important;
  }
  .auth-input-padded-lr {
    padding-left: 36px !important;
    padding-right: 40px !important;
  }

  .auth-eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px;
    transition: color 0.15s;
  }
  .auth-eye-btn:hover {
    color: var(--text-primary);
  }

  .auth-form-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -4px;
  }
  .auth-remember {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    color: var(--text-secondary);
    cursor: pointer;
  }
  .auth-checkbox {
    width: 14px;
    height: 14px;
    accent-color: var(--accent);
    cursor: pointer;
  }

  .auth-link {
    font-size: 13px;
    color: var(--accent);
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .auth-link:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
  .auth-link--bold {
    font-weight: 600;
  }

  .auth-switch {
    text-align: center;
    font-size: 13.5px;
    color: var(--text-muted);
  }
`;

export default Login;

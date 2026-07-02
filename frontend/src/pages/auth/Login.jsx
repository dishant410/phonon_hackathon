import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight,
  TrendingUp, Shield, FileCheck, CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ─── Stats shown on the left panel ─── */
const stats = [
  { icon: TrendingUp, value: '98%',    label: 'Compliance Rate',  color: '#10b981', bg: 'rgba(16,185,129,0.18)' },
  { icon: Shield,     value: '2,400+', label: 'Controls Managed', color: '#a5b4fc', bg: 'rgba(165,180,252,0.18)' },
  { icon: FileCheck,  value: '500+',   label: 'Audits Completed', color: '#fcd34d', bg: 'rgba(252,211,77,0.18)'  },
];

const features = [
  'SOC 2 Type II audit tracking',
  'DPDP Act compliance management',
  'Real-time risk heatmaps',
  'Multi-role access control',
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="lp-wrap">
        {/* ══════════ LEFT BRANDING PANEL ══════════ */}
        <div className="lp-left">
          {/* animated bg orbs */}
          <div className="lp-orb lp-orb--a" />
          <div className="lp-orb lp-orb--b" />
          <div className="lp-orb lp-orb--c" />

          {/* Brand */}
          <div className="lp-brand">
            <div className="lp-brand__logo">
              <ShieldCheck size={22} color="#fff" />
            </div>
            <div>
              <p className="lp-brand__name">SecureComply</p>
              <p className="lp-brand__sub">Enterprise GRC Platform</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="lp-hero">
            <h1 className="lp-hero__h1">
              Your Compliance<br />
              <span className="lp-hero__accent">Mission Control</span>
            </h1>
            <p className="lp-hero__p">
              Unified governance, risk & compliance platform built for modern security teams.
            </p>
          </div>

          {/* Stats */}
          <div className="lp-stats">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="lp-stat"
                style={{ animationDelay: `${i * 0.6}s` }}
              >
                <div className="lp-stat__icon" style={{ background: s.bg }}>
                  <s.icon size={17} color={s.color} />
                </div>
                <div>
                  <p className="lp-stat__val" style={{ color: s.color }}>{s.value}</p>
                  <p className="lp-stat__lbl">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <ul className="lp-features">
            {features.map(f => (
              <li key={f} className="lp-feature">
                <CheckCircle size={13} style={{ color: '#86efac', flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* ══════════ RIGHT FORM PANEL ══════════ */}
        <div className="lp-right">
          <div className="lp-card scale-in">
            {/* Card top header */}
            <div className="lp-card__head">
              <div className="lp-card__shield">
                <ShieldCheck size={20} color="#4f46e5" />
              </div>
              <h2 className="lp-card__title">Sign in to SecureComply</h2>
              <p className="lp-card__sub">Enter your credentials to access your workspace</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email */}
              <div className="lp-field">
                <label className="lp-label">Email address</label>
                <div className={`lp-input-wrap ${focused === 'email' ? 'lp-input-wrap--on' : ''} ${errors.email ? 'lp-input-wrap--err' : ''}`}>
                  <Mail size={15} className="lp-input-icon" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="lp-input"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, message: 'Enter a valid email' },
                    })}
                  />
                </div>
                {errors.email && <p className="lp-err-msg">⚠ {errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="lp-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="lp-label" style={{ marginBottom: 0 }}>Password</label>
                  <Link to="/forgot-password" className="lp-forgot">Forgot password?</Link>
                </div>
                <div className={`lp-input-wrap ${focused === 'pw' ? 'lp-input-wrap--on' : ''} ${errors.password ? 'lp-input-wrap--err' : ''}`}>
                  <Lock size={15} className="lp-input-icon" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="lp-input"
                    onFocus={() => setFocused('pw')}
                    onBlur={() => setFocused(null)}
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button type="button" className="lp-eye" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="lp-err-msg">⚠ {errors.password.message}</p>}
              </div>

              {/* Remember me */}
              <label className="lp-remember">
                <input type="checkbox" className="lp-cb" id="remember" />
                <span>Keep me signed in</span>
              </label>

              {/* Submit */}
              <button type="submit" disabled={loading} className="lp-submit press">
                {loading ? (
                  <svg style={{ width: 17, height: 17, animation: 'lpSpin .7s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
                    <path fill="rgba(255,255,255,.85)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <ArrowRight size={16} />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Register link */}
            <div className="lp-switch">
              <span>Don't have an account?</span>
              <Link to="/register" className="lp-switch__link">Create account →</Link>
            </div>

            {/* Trust row */}
            <div className="lp-trust">
              <div className="lp-trust__pill">🔒 SOC 2 Type II</div>
              <div className="lp-trust__pill">🛡️ DPDP Ready</div>
              <div className="lp-trust__pill">✅ ISO 27001</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lpSpin { to { transform: rotate(360deg); } }
        @keyframes lpOrb {
          0%,100% { transform: scale(1) translate(0,0); }
          33%      { transform: scale(1.12) translate(12px,-10px); }
          66%      { transform: scale(0.92) translate(-8px,12px); }
        }
        @keyframes lpFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }

        /* ── Page ── */
        .lp-wrap {
          min-height: 100vh;
          display: flex;
          background: #fff;
        }

        /* ══ LEFT ══ */
        .lp-left {
          display: none;
          flex-direction: column;
          justify-content: center;
          padding: 52px 48px;
          background: linear-gradient(150deg, #1e1b4b 0%, #3730a3 35%, #4f46e5 70%, #6366f1 100%);
          position: relative;
          overflow: hidden;
          flex: 0 0 48%;
        }
        @media (min-width: 1024px) { .lp-left { display: flex; } }

        /* Orbs */
        .lp-orb {
          position: absolute; border-radius: 50%;
          pointer-events: none;
          animation: lpOrb 10s ease-in-out infinite;
        }
        .lp-orb--a {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(255,255,255,.10) 0%, transparent 65%);
          top: -150px; right: -100px;
        }
        .lp-orb--b {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(165,180,252,.14) 0%, transparent 65%);
          bottom: -100px; left: -60px;
          animation-delay: 3.5s;
        }
        .lp-orb--c {
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(196,181,253,.12) 0%, transparent 65%);
          top: 42%; left: 55%;
          animation-delay: 6s;
        }

        /* Brand */
        .lp-brand {
          display: flex; align-items: center; gap: 13px;
          margin-bottom: 52px; position: relative; z-index: 1;
        }
        .lp-brand__logo {
          width: 46px; height: 46px;
          background: rgba(255,255,255,.18);
          border: 1.5px solid rgba(255,255,255,.30);
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(10px);
          transition: transform .3s;
        }
        .lp-brand__logo:hover { transform: scale(1.07) rotate(4deg); }
        .lp-brand__name {
          font-size: 17px; font-weight: 800;
          color: #fff; letter-spacing: -.02em;
          line-height: 1;
        }
        .lp-brand__sub {
          font-size: 10px; font-weight: 600;
          color: rgba(255,255,255,.50);
          text-transform: uppercase; letter-spacing: .10em;
          margin-top: 3px;
        }

        /* Hero */
        .lp-hero { margin-bottom: 36px; position: relative; z-index: 1; }
        .lp-hero__h1 {
          font-size: 38px; font-weight: 800;
          color: #fff; line-height: 1.15;
          letter-spacing: -.035em; margin-bottom: 14px;
        }
        .lp-hero__accent { color: #c7d2fe; }
        .lp-hero__p {
          font-size: 14px; color: rgba(255,255,255,.62);
          line-height: 1.65; max-width: 330px;
        }

        /* Stats */
        .lp-stats {
          display: flex; flex-direction: column; gap: 10px;
          margin-bottom: 26px; position: relative; z-index: 1;
        }
        .lp-stat {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 16px;
          background: rgba(255,255,255,.09);
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 12px;
          backdrop-filter: blur(6px);
          animation: lpFloat 4s ease-in-out infinite;
          transition: background .2s;
        }
        .lp-stat:hover { background: rgba(255,255,255,.15); }
        .lp-stat__icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lp-stat__val {
          font-size: 20px; font-weight: 800;
          letter-spacing: -.02em; line-height: 1;
        }
        .lp-stat__lbl {
          font-size: 11.5px; color: rgba(255,255,255,.55); margin-top: 2px;
        }

        /* Features */
        .lp-features {
          list-style: none;
          display: flex; flex-direction: column; gap: 8px;
          position: relative; z-index: 1;
        }
        .lp-feature {
          display: flex; align-items: center; gap: 9px;
          font-size: 13px; color: rgba(255,255,255,.72); font-weight: 500;
        }

        /* ══ RIGHT ══ */
        .lp-right {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px;
          background: #f5f7ff;
          background-image:
            radial-gradient(circle at 80% 15%, rgba(99,102,241,.07) 0%, transparent 45%),
            radial-gradient(circle at 15% 85%, rgba(139,92,246,.05) 0%, transparent 45%);
        }

        /* Card */
        .lp-card {
          width: 100%; max-width: 430px;
          background: #fff;
          border-radius: 22px;
          box-shadow:
            0 0 0 1px rgba(15,23,42,.06),
            0 8px 24px rgba(15,23,42,.08),
            0 24px 60px rgba(15,23,42,.06);
          padding: 38px 36px 30px;
        }

        .lp-card__head {
          text-align: center;
          margin-bottom: 30px;
        }
        .lp-card__shield {
          width: 54px; height: 54px;
          background: #eef2ff;
          border: 2px solid #e0e7ff;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          transition: transform .3s ease;
        }
        .lp-card__shield:hover { transform: scale(1.1) rotate(5deg); }
        .lp-card__title {
          font-size: 22px; font-weight: 800;
          color: #0f172a; letter-spacing: -.025em;
          margin-bottom: 6px;
        }
        .lp-card__sub {
          font-size: 13.5px; color: #94a3b8;
        }

        /* Fields */
        .lp-field { margin-bottom: 16px; }
        .lp-label {
          display: block;
          font-size: 12.5px; font-weight: 700;
          color: #374151; margin-bottom: 6px;
          letter-spacing: .005em;
        }
        .lp-input-wrap {
          display: flex; align-items: center; gap: 10px;
          height: 48px; padding: 0 14px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          transition: border-color .18s, box-shadow .18s, background .18s;
        }
        .lp-input-wrap--on {
          border-color: #4f46e5;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(79,70,229,.10);
        }
        .lp-input-wrap--err {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 4px rgba(239,68,68,.08) !important;
        }
        .lp-input-icon {
          color: #cbd5e1; flex-shrink: 0;
          transition: color .18s;
        }
        .lp-input-wrap--on .lp-input-icon { color: #4f46e5; }
        .lp-input {
          flex: 1; border: none; background: transparent;
          font-size: 14px; font-family: inherit;
          color: #0f172a; outline: none;
        }
        .lp-input::placeholder { color: #cbd5e1; }
        .lp-eye {
          background: none; border: none;
          color: #94a3b8; cursor: pointer;
          display: flex; align-items: center;
          transition: color .15s; flex-shrink: 0;
          padding: 2px;
        }
        .lp-eye:hover { color: #4f46e5; }
        .lp-err-msg {
          font-size: 11.5px; color: #ef4444;
          margin-top: 5px;
        }
        .lp-forgot {
          font-size: 12.5px; font-weight: 600;
          color: #4f46e5; transition: opacity .15s;
        }
        .lp-forgot:hover { opacity: .75; }

        .lp-remember {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #64748b;
          cursor: pointer; margin-bottom: 22px;
          user-select: none;
        }
        .lp-cb {
          width: 15px; height: 15px;
          accent-color: #4f46e5; cursor: pointer;
          border-radius: 4px;
        }

        /* Submit */
        .lp-submit {
          width: 100%; height: 50px;
          background: linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6366f1 100%);
          color: #fff; border: none; border-radius: 13px;
          font-size: 15px; font-weight: 700; font-family: inherit;
          cursor: pointer; letter-spacing: -.01em;
          display: flex; align-items: center; justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 16px rgba(79,70,229,.40), 0 1px 3px rgba(79,70,229,.25);
          transition: filter .15s, box-shadow .15s, transform .10s;
          margin-bottom: 24px;
        }
        .lp-submit:hover:not(:disabled) {
          filter: brightness(1.08);
          box-shadow: 0 6px 24px rgba(79,70,229,.50);
        }
        .lp-submit:disabled { opacity: .7; cursor: not-allowed; }

        /* Switch */
        .lp-switch {
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
          font-size: 13px; color: #94a3b8;
          padding-top: 4px; padding-bottom: 20px;
          border-top: 1px solid #f1f5f9;
          margin-top: 4px;
        }
        .lp-switch__link {
          font-weight: 700; color: #4f46e5;
          transition: opacity .15s;
        }
        .lp-switch__link:hover { opacity: .75; }

        /* Trust */
        .lp-trust {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; flex-wrap: wrap;
        }
        .lp-trust__pill {
          font-size: 11px; font-weight: 600;
          color: #94a3b8;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 99px;
          padding: 4px 11px;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
};

export default Login;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ShieldCheck, Mail, Lock, User, Briefcase,
  Eye, EyeOff, ArrowRight, CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleOptions = [
  { value: 'admin',            label: '👑  Administrator / Board Rep' },
  { value: 'security_manager', label: '🛡️  Security Manager / GRC Officer' },
  { value: 'auditor',          label: '🔍  Auditor (Internal / External)' },
  { value: 'employee',         label: '👤  Employee / Business Unit Owner' },
];

const highlights = [
  'SOC 2 Type II audit automation',
  'DPDP Act obligation management',
  'Real-time risk heatmaps',
  'Role-based access control',
  'Evidence collection & audit trail',
];

const PwStrength = ({ pw }) => {
  const strong = pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw);
  const medium = pw.length >= 6;
  const level  = strong ? 'strong' : medium ? 'medium' : 'weak';
  if (!pw) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {['weak', 'medium', 'strong'].map((l, i) => (
          <div key={l} style={{
            height: 4, flex: 1, borderRadius: 99,
            background: i <= ['weak','medium','strong'].indexOf(level)
              ? l === 'weak' ? '#fca5a5' : l === 'medium' ? '#fcd34d' : '#6ee7b7'
              : '#e2e8f0',
            transition: 'background .3s',
          }} />
        ))}
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700,
        color: level === 'strong' ? '#10b981' : level === 'medium' ? '#f59e0b' : '#ef4444',
      }}>
        {level === 'strong' ? '✓ Strong' : level === 'medium' ? '~ Medium' : '✗ Weak'}
      </span>
    </div>
  );
};

const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', role: 'employee', department: '' },
  });

  const pwVal = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data);
      toast.success('Account created! Welcome.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const iw = (name, err) =>
    `rp-input-wrap ${focused === name ? 'rp-input-wrap--on' : ''} ${err ? 'rp-input-wrap--err' : ''}`;

  return (
    <>
      <div className="rp-wrap">
        {/* ══ LEFT ══ */}
        <div className="rp-left">
          <div className="rp-orb rp-orb--a" />
          <div className="rp-orb rp-orb--b" />

          {/* Brand */}
          <div className="rp-brand">
            <div className="rp-brand__logo">
              <ShieldCheck size={21} color="#fff" />
            </div>
            <div>
              <p className="rp-brand__name">SecureComply</p>
              <p className="rp-brand__sub">Enterprise GRC Platform</p>
            </div>
          </div>

          {/* Hero */}
          <div className="rp-hero">
            <h1 className="rp-hero__h1">
              Get Started<br />
              <span className="rp-hero__accent">in Minutes</span>
            </h1>
            <p className="rp-hero__p">
              Set up your organization's GRC workspace and start managing compliance today.
            </p>
          </div>

          {/* Feature list */}
          <ul className="rp-features">
            {highlights.map((h, i) => (
              <li
                key={h}
                className="rp-feature"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <CheckCircle size={14} style={{ color: '#86efac', flexShrink: 0 }} />
                {h}
              </li>
            ))}
          </ul>

          {/* Progress card */}
          <div className="rp-prog-card">
            <p className="rp-prog-card__label">Overall Compliance Score</p>
            <div className="rp-prog-track">
              <div className="rp-prog-fill" />
            </div>
            <div className="rp-prog-meta">
              <span className="rp-prog-pct">87%</span>
              <span className="rp-prog-target">Target: 95%</span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="rp-right">
          <div className="rp-card scale-in">
            <div className="rp-card__head">
              <h2 className="rp-card__title">Create your account</h2>
              <p className="rp-card__sub">Join SecureComply and take control of compliance</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Name */}
              <div className="rp-field">
                <label className="rp-label">Full Name</label>
                <div className={iw('name', errors.name)}>
                  <User size={15} className="rp-icon" />
                  <input
                    type="text" placeholder="John Doe" className="rp-input"
                    onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                    {...register('name', { required: 'Name is required' })}
                  />
                </div>
                {errors.name && <p className="rp-err">⚠ {errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="rp-field">
                <label className="rp-label">Email address</label>
                <div className={iw('email', errors.email)}>
                  <Mail size={15} className="rp-icon" />
                  <input
                    type="email" placeholder="john@company.com" className="rp-input"
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, message: 'Enter a valid email' },
                    })}
                  />
                </div>
                {errors.email && <p className="rp-err">⚠ {errors.email.message}</p>}
              </div>

              {/* Role */}
              <div className="rp-field">
                <label className="rp-label">Your Role</label>
                <div className={iw('role', errors.role)}>
                  <select
                    className="rp-input rp-select"
                    onFocus={() => setFocused('role')} onBlur={() => setFocused(null)}
                    {...register('role', { required: 'Role is required' })}
                  >
                    {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                {errors.role && <p className="rp-err">⚠ {errors.role.message}</p>}
              </div>

              {/* Dept + Password: side by side on wider screens */}
              <div className="rp-two-col">
                <div className="rp-field">
                  <label className="rp-label">Department</label>
                  <div className={iw('dept', errors.department)}>
                    <Briefcase size={14} className="rp-icon" />
                    <input
                      type="text" placeholder="IT & Security" className="rp-input"
                      onFocus={() => setFocused('dept')} onBlur={() => setFocused(null)}
                      {...register('department')}
                    />
                  </div>
                </div>

                <div className="rp-field">
                  <label className="rp-label">Password</label>
                  <div className={iw('pw', errors.password)}>
                    <Lock size={14} className="rp-icon" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="Min 8 chars…"
                      className="rp-input"
                      onFocus={() => setFocused('pw')} onBlur={() => setFocused(null)}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Min 8 characters' },
                        validate: {
                          up:  v => /[A-Z]/.test(v) || 'Add an uppercase letter',
                          lo:  v => /[a-z]/.test(v) || 'Add a lowercase letter',
                          num: v => /\d/.test(v)    || 'Add a number',
                        },
                      })}
                    />
                    <button type="button" className="rp-eye" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <PwStrength pw={pwVal} />
                  {errors.password && <p className="rp-err">⚠ {errors.password.message}</p>}
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="rp-submit press">
                {loading ? (
                  <svg style={{ width: 16, height: 16, animation: 'rpSpin .7s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
                    <path fill="rgba(255,255,255,.85)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <ArrowRight size={16} />}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <div className="rp-signin">
              Already have an account?{' '}
              <Link to="/login" className="rp-signin__link">Sign in →</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rpSpin { to { transform: rotate(360deg); } }
        @keyframes rpOrb {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.12) translate(8px,-8px); }
        }
        @keyframes rpFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes fillBar {
          from { width: 0; }
          to   { width: 87%; }
        }

        .rp-wrap {
          min-height: 100vh;
          display: flex;
          background: #fff;
        }

        /* LEFT */
        .rp-left {
          display: none;
          flex-direction: column;
          justify-content: center;
          padding: 48px 44px;
          background: linear-gradient(150deg, #1e1b4b 0%, #3730a3 35%, #4f46e5 70%, #6366f1 100%);
          position: relative; overflow: hidden;
          flex: 0 0 42%;
        }
        @media (min-width: 1024px) { .rp-left { display: flex; } }

        .rp-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          animation: rpOrb 9s ease-in-out infinite;
        }
        .rp-orb--a {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,.10) 0%, transparent 65%);
          top: -120px; right: -80px;
        }
        .rp-orb--b {
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(165,180,252,.13) 0%, transparent 65%);
          bottom: -80px; left: -40px; animation-delay: 4s;
        }

        .rp-brand {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 46px; position: relative; z-index: 1;
        }
        .rp-brand__logo {
          width: 44px; height: 44px;
          background: rgba(255,255,255,.18);
          border: 1.5px solid rgba(255,255,255,.28);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
        }
        .rp-brand__name { font-size: 16px; font-weight: 800; color: #fff; letter-spacing: -.02em; }
        .rp-brand__sub { font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,.48); text-transform: uppercase; letter-spacing: .10em; margin-top: 3px; }

        .rp-hero { margin-bottom: 30px; position: relative; z-index: 1; }
        .rp-hero__h1 { font-size: 34px; font-weight: 800; color: #fff; line-height: 1.15; letter-spacing: -.03em; margin-bottom: 12px; }
        .rp-hero__accent { color: #c7d2fe; }
        .rp-hero__p { font-size: 13.5px; color: rgba(255,255,255,.60); line-height: 1.65; max-width: 290px; }

        .rp-features { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; position: relative; z-index: 1; }
        .rp-feature { display: flex; align-items: center; gap: 9px; font-size: 13px; color: rgba(255,255,255,.72); font-weight: 500; animation: rpFloat 4s ease-in-out infinite; }

        .rp-prog-card {
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 14px; padding: 14px 16px;
          backdrop-filter: blur(8px); position: relative; z-index: 1;
        }
        .rp-prog-card__label { font-size: 10.5px; font-weight: 700; color: rgba(255,255,255,.55); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 10px; }
        .rp-prog-track { height: 8px; background: rgba(255,255,255,.15); border-radius: 99px; overflow: hidden; margin-bottom: 8px; }
        .rp-prog-fill { height: 100%; background: linear-gradient(90deg, #a5b4fc, #818cf8); border-radius: 99px; animation: fillBar 1.5s ease-out forwards; }
        .rp-prog-meta { display: flex; justify-content: space-between; align-items: center; }
        .rp-prog-pct { font-size: 18px; font-weight: 800; color: #c7d2fe; }
        .rp-prog-target { font-size: 11px; color: rgba(255,255,255,.42); }

        /* RIGHT */
        .rp-right {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 32px 20px;
          background: #f5f7ff;
          background-image:
            radial-gradient(circle at 80% 10%, rgba(99,102,241,.07) 0%, transparent 45%),
            radial-gradient(circle at 10% 90%, rgba(139,92,246,.05) 0%, transparent 45%);
          overflow-y: auto;
        }

        .rp-card {
          width: 100%; max-width: 480px;
          background: #fff;
          border-radius: 22px;
          box-shadow:
            0 0 0 1px rgba(15,23,42,.05),
            0 8px 24px rgba(15,23,42,.08),
            0 24px 60px rgba(15,23,42,.05);
          padding: 34px 34px 28px;
        }

        .rp-card__head { margin-bottom: 22px; }
        .rp-card__title { font-size: 21px; font-weight: 800; color: #0f172a; letter-spacing: -.025em; margin-bottom: 5px; }
        .rp-card__sub { font-size: 13px; color: #94a3b8; }

        .rp-field { margin-bottom: 13px; }
        .rp-label { display: block; font-size: 12.5px; font-weight: 700; color: #374151; margin-bottom: 6px; }
        .rp-input-wrap {
          display: flex; align-items: center; gap: 9px;
          height: 46px; padding: 0 12px;
          border-radius: 11px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          transition: border-color .18s, box-shadow .18s, background .18s;
        }
        .rp-input-wrap--on { border-color: #4f46e5; background: #fff; box-shadow: 0 0 0 4px rgba(79,70,229,.09); }
        .rp-input-wrap--err { border-color: #ef4444 !important; box-shadow: 0 0 0 4px rgba(239,68,68,.08) !important; }
        .rp-icon { color: #cbd5e1; flex-shrink: 0; transition: color .18s; }
        .rp-input-wrap--on .rp-icon { color: #4f46e5; }
        .rp-input { flex: 1; border: none; background: transparent; font-size: 13.5px; font-family: inherit; color: #0f172a; outline: none; }
        .rp-input::placeholder { color: #cbd5e1; }
        .rp-select { appearance: none; -webkit-appearance: none; cursor: pointer; }
        .rp-eye { background: none; border: none; color: #94a3b8; cursor: pointer; display: flex; align-items: center; transition: color .15s; flex-shrink: 0; }
        .rp-eye:hover { color: #4f46e5; }
        .rp-err { font-size: 11.5px; color: #ef4444; margin-top: 4px; }

        .rp-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .rp-two-col { grid-template-columns: 1fr; } }

        .rp-submit {
          width: 100%; height: 50px;
          background: linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6366f1 100%);
          color: #fff; border: none; border-radius: 13px;
          font-size: 15px; font-weight: 700; font-family: inherit;
          cursor: pointer; letter-spacing: -.01em;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 4px 16px rgba(79,70,229,.40), 0 1px 3px rgba(79,70,229,.20);
          transition: filter .15s, box-shadow .15s;
          margin-top: 6px; margin-bottom: 20px;
        }
        .rp-submit:hover:not(:disabled) { filter: brightness(1.08); box-shadow: 0 6px 24px rgba(79,70,229,.50); }
        .rp-submit:disabled { opacity: .7; cursor: not-allowed; }

        .rp-signin { text-align: center; font-size: 13px; color: #94a3b8; padding-top: 16px; border-top: 1px solid #f1f5f9; }
        .rp-signin__link { font-weight: 700; color: #4f46e5; margin-left: 4px; transition: opacity .15s; }
        .rp-signin__link:hover { opacity: .75; }
      `}</style>
    </>
  );
};

export default Register;

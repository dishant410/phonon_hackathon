import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, Mail, Lock, User, Briefcase, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { FormField, Input, Select } from '../../components/ui/FormComponents';

const highlights = [
  'Role-based access control',
  'SOC 2 controls management',
  'DPDP Act obligation tracking',
  'Evidence collection & audit trail',
];

const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', role: 'employee', department: '' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data);
      toast.success('Account created! Welcome to SecureComply.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left panel ── */}
      <div className="auth-panel auth-panel--left">
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
            Set Up Your<br />Compliance Workspace
          </h2>
          <p className="auth-hero__subtitle">
            Create your organization account and start managing governance, risk &amp; compliance today.
          </p>
        </div>

        <ul className="auth-features">
          {highlights.map((h) => (
            <li key={h} className="auth-feature-item">
              <CheckCircle size={15} />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrap scale-in">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Create account</h2>
            <p className="auth-form-sub">Fill in the details to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
            {/* Name */}
            <FormField label="Full Name" error={errors.name?.message}>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="auth-input-padded-l"
                  error={errors.name}
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
            </FormField>

            {/* Email */}
            <FormField label="Email address" error={errors.email?.message}>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <Input
                  type="email"
                  placeholder="john@company.com"
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

            {/* Role */}
            <FormField label="Role" error={errors.role?.message}>
              <Select {...register('role', { required: 'Role is required' })} error={errors.role}>
                <option value="admin">Administrator / Board Representative</option>
                <option value="security_manager">Security Manager / GRC Officer</option>
                <option value="auditor">Auditor (Internal / External)</option>
                <option value="employee">Employee / Business Unit Owner</option>
              </Select>
            </FormField>

            {/* Department */}
            <FormField label="Department" error={errors.department?.message}>
              <div style={{ position: 'relative' }}>
                <Briefcase size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <Input
                  type="text"
                  placeholder="Security & IT Compliance"
                  className="auth-input-padded-l"
                  error={errors.department}
                  {...register('department')}
                />
              </div>
            </FormField>

            {/* Password */}
            <FormField label="Password" error={errors.password?.message}>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="auth-input-padded-lr"
                  error={errors.password}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Must be at least 8 characters' },
                    validate: {
                      uppercase: (v) => /[A-Z]/.test(v) || 'Must contain at least 1 uppercase letter',
                      lowercase: (v) => /[a-z]/.test(v) || 'Must contain at least 1 lowercase letter',
                      number: (v) => /\d/.test(v) || 'Must contain at least 1 number',
                    },
                  })}
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

            <Button
              type="submit"
              className="auth-submit-btn"
              loading={loading}
              iconRight={ArrowRight}
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            >
              Create Account
            </Button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link auth-link--bold">
              Sign in
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
    .auth-panel--left { display: flex; flex: 1; }
  }
  .auth-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .auth-orb--1 {
    width: 340px; height: 340px;
    background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
    top: -80px; right: -60px;
  }
  .auth-orb--2 {
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 70%);
    bottom: -60px; left: -40px;
  }
  .auth-brand {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 64px; position: relative; z-index: 1;
  }
  .auth-logo {
    width: 42px; height: 42px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(8px);
  }
  .auth-brand__name {
    font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.02em;
  }
  .auth-hero { margin-bottom: 40px; position: relative; z-index: 1; }
  .auth-hero__title {
    font-size: 34px; font-weight: 700; color: #fff;
    line-height: 1.2; letter-spacing: -0.03em; margin-bottom: 14px;
  }
  .auth-hero__subtitle {
    font-size: 15px; color: rgba(255,255,255,0.62); line-height: 1.6; max-width: 320px;
  }
  .auth-features { list-style: none; display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1; }
  .auth-feature-item {
    display: flex; align-items: center; gap: 10px;
    color: rgba(255,255,255,0.75); font-size: 13.5px; font-weight: 500;
  }
  .auth-feature-item svg { color: #a5b4fc; flex-shrink: 0; }

  .auth-panel--right {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 40px 24px; background: var(--bg-page);
    overflow-y: auto;
  }
  .auth-form-wrap { width: 100%; max-width: 400px; }
  .auth-form-header { margin-bottom: 24px; }
  .auth-form-title {
    font-size: 26px; font-weight: 700; color: var(--text-primary);
    letter-spacing: -0.03em; margin-bottom: 6px;
  }
  .auth-form-sub { font-size: 13.5px; color: var(--text-muted); }
  .auth-form { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
  .auth-input-padded-l { padding-left: 36px !important; }
  .auth-input-padded-lr { padding-left: 36px !important; padding-right: 40px !important; }
  .auth-eye-btn {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    border: none; background: transparent; color: var(--text-muted);
    cursor: pointer; display: flex; align-items: center; padding: 2px; transition: color 0.15s;
  }
  .auth-eye-btn:hover { color: var(--text-primary); }
  .auth-link { font-size: 13px; color: var(--accent); text-decoration: none; transition: opacity 0.15s; }
  .auth-link:hover { opacity: 0.8; text-decoration: underline; }
  .auth-link--bold { font-weight: 600; }
  .auth-switch { text-align: center; font-size: 13.5px; color: var(--text-muted); }
`;

export default Register;

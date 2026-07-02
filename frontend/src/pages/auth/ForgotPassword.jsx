import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, Mail, ArrowLeft, Key } from 'lucide-react';
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
        setResetToken(data.data.resetToken); // Display token in MVP mode
      }
      toast.success(data.message || 'Reset link triggered successfully (Mock).');
    } catch (err) {
      toast.error('Failed to trigger reset flow. Please verify email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck size={24} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Reset password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Enter registered email to receive OTP/reset instruction
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-4 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-md bg-opacity-70">
          
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <FormField label="Work Email Address" error={errors.email?.message}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-slate-400" />
                  </div>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    className="pl-10"
                    error={errors.email}
                    {...register('email', { required: 'Email is required' })}
                  />
                </div>
              </FormField>

              <div>
                <Button
                  type="submit"
                  className="w-full justify-center"
                  loading={loading}
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400">
                <Key size={24} />
              </div>
              <p className="text-sm text-slate-300">
                If the email exists, a password reset link has been dispatched.
              </p>

              {resetToken && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left">
                  <span className="text-xs text-indigo-400 font-semibold block mb-1">MVP DEMO ONLY token:</span>
                  <code className="text-xs text-slate-100 break-all select-all font-mono">{resetToken}</code>
                </div>
              )}

              <p className="text-xs text-slate-400">
                Demo helper: Normally this link goes to corporate email.
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

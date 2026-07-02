import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, Mail, Lock, User, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { FormField, Input, Select } from '../../components/ui/FormComponents';

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
      toast.success('Registration successful! Workspace created.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck size={24} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Register Organization
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Create control owner, administrator or manager account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-4 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-md bg-opacity-70">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            
            <FormField label="Full Name" error={errors.name?.message}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-slate-400" />
                </div>
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  error={errors.name}
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
            </FormField>

            <FormField label="Email address" error={errors.email?.message}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  className="pl-10"
                  error={errors.email}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
                      message: 'Enter a valid email address'
                    }
                  })}
                />
              </div>
            </FormField>

            <FormField label="Role" error={errors.role?.message}>
              <Select {...register('role', { required: 'Role is required' })}>
                <option value="admin">Administrator / Board Representative</option>
                <option value="security_manager">Security Manager / GRC Officer</option>
                <option value="auditor">Auditor (Internal / External)</option>
                <option value="employee">Employee / Business unit owner</option>
              </Select>
            </FormField>

            <FormField label="Department" error={errors.department?.message}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={16} className="text-slate-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Security & IT Compliance"
                  className="pl-10"
                  error={errors.department}
                  {...register('department')}
                />
              </div>
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  error={errors.password}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    validate: {
                      uppercase: (v) => /[A-Z]/.test(v) || 'Must contain at least 1 uppercase letter',
                      lowercase: (v) => /[a-z]/.test(v) || 'Must contain at least 1 lowercase letter',
                      number: (v) => /\d/.test(v) || 'Must contain at least 1 number'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            <div>
              <Button
                type="submit"
                className="w-full justify-center mt-2"
                loading={loading}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

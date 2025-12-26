'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, Loader2, ShoppingBag, ShieldCheck, Lock, ShieldAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../utils/axiosInstance';
import { AxiosError } from 'axios';

type FormData = {
  email: string;
  password: string;
};

const Page = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axiosInstance.post('/admin/api/login', data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      setServerError(null);
      router.push('/dashboard');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid credentials';
      setServerError(errorMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center p-8 bg-brand-primary-600 rounded-3xl shadow-2xl shadow-brand-primary-500/20 text-white h-full min-h-[500px] relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="mb-6 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <ShoppingBag className="text-white w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Doko Mart</h1>
            </div>
            <p className="text-lg text-brand-primary-100 font-medium">Centralized control for the entire marketplace ecosystem</p>
          </div>

          <div className="space-y-5 relative z-10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20">
                <ShieldCheck className="text-white w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5 text-white">System Security</h3>
                <p className="text-brand-primary-100 text-xs">Advanced protection and monitoring for all platform activities</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20">
                <Lock className="text-white w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5 text-white">Access Control</h3>
                <p className="text-brand-primary-100 text-xs">Granular permissions and role-based access management</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20">
                <ShieldAlert className="text-white w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5 text-white">Fraud Prevention</h3>
                <p className="text-brand-primary-100 text-xs">Real-time detection and mitigation of suspicious behavior</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Admin Access</h2>
              <p className="text-slate-500 text-sm">Secure login for platform administrators</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Administrator Email</label>
                <input
                  type="email"
                  placeholder="admin@dokomart.com"
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/20'} outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{String(errors.email.message)}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Security Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/20'} outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{String(errors.password.message)}</p>}
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Authorize Access'
                )}
              </button>

              {serverError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                  {serverError}
                </div>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                Protected by Doko Mart Security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

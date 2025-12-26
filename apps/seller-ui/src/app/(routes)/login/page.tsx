'use client';

import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { AxiosError } from 'axios';
import { Eye, EyeOff, LoaderCircle, ShoppingBag, Sparkles, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post('/api/login-seller', data, {
        withCredentials: true,
      });
      return response.data;
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

  const onSubmit = async (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-brand-primary-500 via-brand-primary-600 to-brand-highlight-500 rounded-3xl shadow-2xl text-white h-full min-h-[500px]">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Doko Mart</h1>
            </div>
            <p className="text-lg text-white/90 font-medium">Empowering local sellers to reach more customers</p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Global Reach</h3>
                <p className="text-white/80 text-xs">Sell your products to customers across the country</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Secure Payments</h3>
                <p className="text-white/80 text-xs">Get paid on time with our secure escrow system</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Powerful Analytics</h3>
                <p className="text-white/80 text-xs">Track your sales and grow your business with ease</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Seller Login</h2>
              <p className="text-gray-600 text-sm">Welcome back! Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/20'} outline-none transition-all duration-200`}
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/20'} outline-none transition-all duration-200`}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{String(errors.password.message)}</p>}
              </div>

              <div className="flex items-center justify-end">
                <Link href="/forgot-password" title="Forgot password" className="text-sm font-semibold text-brand-primary-600 hover:text-brand-primary-700">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-gradient-to-r from-brand-primary-600 to-brand-primary-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-primary-500/25 hover:shadow-brand-primary-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  'Login to Dashboard'
                )}
              </button>

              {serverError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                  {serverError}
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don&apos;t have a seller account?{' '}
                <Link href="/signup" className="font-bold text-brand-primary-600 hover:text-brand-primary-700 underline-offset-4 hover:underline">
                  Register Shop
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

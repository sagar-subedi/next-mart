'use client';

import { useMutation } from '@tanstack/react-query';
import GoogleButton from 'apps/user-ui/src/shared/components/google-button';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { AxiosError } from 'axios';
import { Eye, EyeOff, LoaderCircle, ShoppingBag, Sparkles, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post('/api/login-user', data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      router.push(redirect);
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
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-brand-primary-500 via-brand-primary-600 to-brand-highlight-500 rounded-3xl shadow-2xl text-white h-full">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Doko Mart</h1>
            </div>
            <p className="text-lg text-white/90">Your one-stop shopping destination</p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Personalized Experience</h3>
                <p className="text-white/80 text-xs">Get product recommendations tailored just for you</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Secure Shopping</h3>
                <p className="text-white/80 text-xs">Your data is protected with industry-standard encryption</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Fast Delivery</h3>
                <p className="text-white/80 text-xs">Quick and reliable shipping to your doorstep</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Welcome Back!</h2>
              <p className="text-gray-600 text-sm">Sign in to continue your shopping journey</p>
            </div>

            <GoogleButton />

            <div className="flex items-center my-4 text-gray-400 text-xs">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-3">or continue with email</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-primary-500 transition-colors"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.email.message)}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-primary-500 transition-colors"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {passwordVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label htmlFor="rememberMe" className="flex items-center text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="mr-2 w-4 h-4 text-brand-primary-500 border-gray-300 rounded focus:ring-brand-primary-500"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-sm text-brand-primary-600 hover:text-brand-primary-700 font-medium transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-3.5 bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 hover:from-brand-primary-600 hover:to-brand-highlight-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loginMutation.isPending ? (
                  <>
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link href="/signup" className="text-brand-primary-600 hover:text-brand-primary-700 font-semibold transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

'use client';

import { useMutation } from '@tanstack/react-query';
import GoogleButton from 'apps/user-ui/src/shared/components/google-button';
import { Eye, EyeOff, LoaderCircle, ShoppingBag, Sparkles, Shield, Zap, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignupPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userData, setUserData] = useState<FormData | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post('/register-user', data);
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOTP(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });

  const onSubmit = async (data: FormData) => {
    signupMutation.mutate(data);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTPMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axiosInstance.post('/verify-user', {
        ...userData,
        otp: otp.join(''),
      });
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  const resendOTP = () => {
    if (userData) {
      signupMutation.mutate(userData);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-brand-highlight-500 via-brand-primary-600 to-brand-primary-500 rounded-3xl shadow-2xl text-white h-full">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Doko Mart</h1>
            </div>
            <p className="text-lg text-white/90">Join thousands of happy shoppers</p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Exclusive Deals</h3>
                <p className="text-white/80 text-xs">Access member-only discounts and early sales</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Buyer Protection</h3>
                <p className="text-white/80 text-xs">Shop with confidence with our money-back guarantee</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Quick Checkout</h3>
                <p className="text-white/80 text-xs">Save your preferences for faster shopping</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            {!showOTP ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Create Account</h2>
                  <p className="text-gray-600 text-sm">Start your shopping journey today</p>
                </div>

                <GoogleButton />

                <div className="flex items-center my-6 text-gray-400 text-sm">
                  <div className="flex-1 border-t border-gray-300" />
                  <span className="px-4">or sign up with email</span>
                  <div className="flex-1 border-t border-gray-300" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-primary-500 transition-colors"
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>
                    )}
                  </div>

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
                        placeholder="Create a strong password"
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

                  {signupMutation.isError && signupMutation.error instanceof AxiosError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">
                        {signupMutation.error.response?.data?.message || signupMutation.error.message}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 hover:from-brand-primary-600 hover:to-brand-highlight-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {signupMutation.isPending ? (
                      <>
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-brand-primary-600 hover:text-brand-primary-700 font-semibold transition-colors">
                    Sign In
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-brand-highlight-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                  <p className="text-gray-600">We've sent a 6-digit code to {userData?.email}</p>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                  {otp?.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl outline-none focus:border-brand-primary-500 transition-colors"
                    />
                  ))}
                </div>

                {verifyOTPMutation.isError && verifyOTPMutation.error instanceof AxiosError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="text-red-600 text-sm text-center">
                      {verifyOTPMutation.error.response?.data?.message || verifyOTPMutation.error.message}
                    </p>
                  </div>
                )}

                <button
                  className="w-full py-3.5 bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 hover:from-brand-primary-600 hover:to-brand-highlight-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  disabled={verifyOTPMutation.isPending}
                  onClick={() => verifyOTPMutation.mutate()}
                >
                  {verifyOTPMutation.isPending ? (
                    <>
                      <LoaderCircle className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  {canResend ? (
                    <>
                      Didn't receive the code?{' '}
                      <button
                        onClick={resendOTP}
                        className="text-brand-primary-600 hover:text-brand-primary-700 font-semibold transition-colors"
                      >
                        Resend
                      </button>
                    </>
                  ) : (
                    <span>Resend code in {timer}s</span>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

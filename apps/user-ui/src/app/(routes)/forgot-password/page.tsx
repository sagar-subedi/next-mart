'use client';

import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { AxiosError } from 'axios';
import { Eye, EyeOff, LoaderCircle, ShoppingBag, Mail, Lock, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type EmailFormData = {
  email: string;
};

type PasswordFormData = {
  password: string;
};

const ForgotPasswordPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [isPassword, setIsPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    mode: 'onBlur',
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    mode: 'onBlur',
  });

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

  const requestOTPMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axiosInstance.post('/forgot-password-user', {
        email,
      });
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep('otp');
      setServerError(null);
      setCanResend(false);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid email. Try again';
      setServerError(errorMessage);
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const response = await axiosInstance.post(
        '/verify-forgot-password-user',
        { email: userEmail, otp: otp.join('') }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep('reset');
      setServerError(null);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid OTP. Try again';
      setServerError(errorMessage);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return;
      const response = await axiosInstance.post('/reset-password-user', {
        email: userEmail,
        password,
      });
      return response.data;
    },
    onSuccess: () => {
      setStep('email');
      setServerError(null);
      toast.success(
        `Password reset successfully!\nPlease login with your new password`
      );
      router.push('/login');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Failed to reset password';
      setServerError(errorMessage);
    },
  });

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

  const onSubmitEmail = ({ email }: EmailFormData) => {
    requestOTPMutation.mutate({ email });
  };

  const onSubmitPassword = ({ password }: PasswordFormData) => {
    resetPasswordMutation.mutate({ password });
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-brand-primary-600 via-brand-highlight-500 to-brand-primary-500 rounded-3xl shadow-2xl text-white h-full">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Doko Mart</h1>
            </div>
            <p className="text-lg text-white/90">Secure password recovery</p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Secure Process</h3>
                <p className="text-white/80 text-xs">Your account security is our top priority</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">Email Verification</h3>
                <p className="text-white/80 text-xs">We'll send a verification code to your email</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-0.5">New Password</h3>
                <p className="text-white/80 text-xs">Create a strong password to protect your account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            {step === 'email' && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Forgot Password?</h2>
                  <p className="text-gray-600 text-sm">Enter your email to receive a verification code</p>
                </div>

                <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-primary-500 transition-colors"
                      {...registerEmail('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                    {emailErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{String(emailErrors.email.message)}</p>
                    )}
                  </div>

                  {serverError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{serverError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={requestOTPMutation.isPending}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 hover:from-brand-primary-600 hover:to-brand-highlight-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {requestOTPMutation.isPending ? (
                      <>
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        <span>Sending code...</span>
                      </>
                    ) : (
                      'Send Verification Code'
                    )}
                  </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                  Remember your password?{' '}
                  <Link href="/login" className="text-brand-primary-600 hover:text-brand-primary-700 font-semibold transition-colors">
                    Sign In
                  </Link>
                </p>
              </>
            )}

            {step === 'otp' && (
              <>
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-brand-highlight-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                  <p className="text-gray-600">We've sent a 6-digit code to {userEmail}</p>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                  {otp.map((digit, index) => (
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

                {serverError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="text-red-600 text-sm text-center">{serverError}</p>
                  </div>
                )}

                <button
                  onClick={() => verifyOTPMutation.mutate()}
                  disabled={verifyOTPMutation.isPending}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 hover:from-brand-primary-600 hover:to-brand-highlight-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
                        onClick={() => requestOTPMutation.mutate({ email: userEmail! })}
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

            {step === 'reset' && (
              <>
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-brand-highlight-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h2>
                  <p className="text-gray-600">Choose a strong password for your account</p>
                </div>

                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-5">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={isPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Create a strong password"
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl outline-none focus:border-brand-primary-500 transition-colors"
                        {...registerPassword('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setIsPassword(!isPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {isPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordErrors.password && (
                      <p className="text-red-500 text-sm mt-1">{String(passwordErrors.password.message)}</p>
                    )}
                  </div>

                  {serverError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{serverError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 hover:from-brand-primary-600 hover:to-brand-highlight-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {resetPasswordMutation.isPending ? (
                      <>
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        <span>Resetting password...</span>
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

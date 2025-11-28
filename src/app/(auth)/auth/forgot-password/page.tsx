"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useForgotEmailMutation } from '../../../../features/auth/authApi';

// Define types for the API response
interface ForgotEmailResponse {
  message: string;
  data: {
    forgetToken: string;
  };
}

interface ApiError {
  data: {
    message: string;
  };
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSuccess] = useState<boolean>(false);

  const router = useRouter();
  const [forgotEmail, { isLoading }] = useForgotEmailMutation();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await forgotEmail({ email: email }).unwrap() as ForgotEmailResponse;
      toast.success(response.message || 'Email sent to OTP successfully!');
      router.push(`/auth/verify-email?token=${response.data.forgetToken}`);
    } catch (error) {
      const apiError = error as ApiError;
      console.log(apiError);
      toast.error(apiError.data.message || 'Failed to create package:');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 items-center justify-center p-4">
      {/* Centered Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <Image
              src={"/icons/logo2.png"}
              alt="Herding Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center mb-2">
          <h3 className="text-blue-500 font-semibold text-lg">Herding</h3>
        </div>

        {/* Title */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Forget Your Password</h2>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">Search your account email address</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-200'
                } bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm`}
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* Next Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full bg-[#668CF9] hover:bg-[#668CF9] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : isSuccess ? 'OTP Sent!' : 'Next'}
          </button>

          {/* Back to Login Link */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
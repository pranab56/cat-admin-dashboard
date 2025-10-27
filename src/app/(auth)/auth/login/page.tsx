"use client";

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);



  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (): void => {
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert('Login successful!');
      }, 1500);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        {/* Logo and Title */}
        <div className="flex justify-center">
          <div className="">
            <Image
              src={"/icons/logo.png"}
              alt="Herding Logo"
              width={40}
              height={40}
              className="object-contain w-full h-full"
            />
          </div>
        </div>

        <h1 className="text-3xl pt-2 pb-10 text-center font-semibold text-gray-800">Sign In</h1>

        <div className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-transparent'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="Enter password here..."
                className={`w-full px-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-transparent'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">Remember Me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#668CF9] hover:bg-[#668CF9] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </div>


      </div>
    </div>
  );
}
"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ClipboardEvent, FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { useForgotEmailOTPCheckMutation } from '../../../../features/auth/authApi';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const [matchOTP, { isLoading }] = useForgotEmailOTPCheckMutation();

  // Fixed ref callback - no return value
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(['', '', '', '']).slice(0, 4);
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  // Handle submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError('');

    const otpValue = otp.join('');

    // Validation
    if (otpValue.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    try {
      const reponse = await matchOTP({ otp: otpValue }).unwrap();
      console.log(reponse)
    } catch (error) {
      console.log(error)
    }



  };

  // Handle resend
  const handleResend = (): void => {
    setOtp(['', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    alert('A new verification code has been sent to your email');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 items-center justify-center p-4">
      {/* Centered Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
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


        {/* Title */}
        <div className="text-center mb-3">
          <h2 className="text-xl font-bold text-gray-900">Email Verification Code</h2>
        </div>

        {/* Description */}
        <div className="text-center mb-6">
          <p className="text-gray-600 text-xs leading-relaxed">
            To help keep your account safe, House Finder wants to make sure it&apos;s really you trying to sign in
          </p>
        </div>

        {/* Get Verification Code Section */}
        <div className="text-center mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Get a Verification Code</h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            To get a verification code, first confirm the phone number you added to your account{' '}
            <span className="font-semibold">*---@coredevs.ltd</span>. Standard rates apply
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* OTP Input Fields */}
          <div>
            <div className="flex justify-center gap-3 mb-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={setInputRef(index)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-14 h-14 text-center text-xl font-semibold border ${error ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white`}
                />
              ))}
            </div>
            {error && (
              <p className="text-center text-xs text-red-500">{error}</p>
            )}
          </div>

          {/* Verified Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#668CF9] hover:bg-[#668CF9] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verified'}
          </button>

          {/* Resend Link */}
          <div className="text-center text-sm  text-gray-600">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium"
            >
              Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
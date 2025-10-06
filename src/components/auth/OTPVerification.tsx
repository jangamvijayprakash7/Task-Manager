import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Mail } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface OTPVerificationProps {
  onSwitchToLogin: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ onSwitchToLogin }) => {
  const { verifyOTP, resendOTP } = useAuth();
  const { success, error, info } = useToast();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Email Required', 'Please enter your email address');
      return;
    }
    setIsLoading(true);
    try {
      const result = await resendOTP(email);
      if (result.success) success('OTP Sent', result.message);
      else error('Failed to Send OTP', result.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      error('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }
    setIsLoading(true);
    try {
      const result = await verifyOTP(email, code);
      if (result.success) success('OTP Verified', result.message);
      else error('OTP Verification Failed', result.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await resendOTP(email);
      if (result.success) success('OTP Resent', result.message);
      else error('Failed to Resend OTP', result.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Logo size="md" />
          <span className="font-semibold text-lg text-gray-900">Superpage</span>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => info('Explore Features', 'Browse what you can do in Superpage.')} className="px-4 py-2 text-gray-600 bg-gray-100  hover:bg-gray-200 transition-colors">Explore Features</button>
          <button onClick={() => info('Get Started', 'Create your account to continue.')} className="px-4 py-2 text-white bg-black  hover:bg-gray-800 transition-colors">Get Started</button>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-md">
          <div className="bg-white  shadow-lg p-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-purple-100  flex items-center justify-center">
                <Mail className="w-10 h-10 text-purple-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Verify email address</h1>
            <p className="text-gray-600 text-center mb-8">Enter OTP sent to your email</p>

            <form onSubmit={handleSendOTP} className="space-y-4 mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="flex items-center space-x-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm rounded-md">Send OTP</button>
              </div>
            </form>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    className="w-12 h-12 text-center text-2xl border border-gray-300  focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3  hover:bg-gray-800 transition-colors font-medium"
              >
                {isLoading ? 'Verifying...' : 'Verify Now'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Still not received?{' '}
                  <button type="button" onClick={handleResendOTP} className="text-purple-600 hover:text-purple-700 font-medium">Resend</button>
                </p>
              </div>

              <div className="text-center">
                <button type="button" onClick={() => { info('Back to Login', 'Returning to the login screen.'); onSwitchToLogin(); }} className="text-purple-600 hover:text-purple-700 font-medium text-sm">Back to Login</button>
              </div>
            </form>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">© Superpage team</p>
        </div>
      </div>
    </div>
  );
};






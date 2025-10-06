import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Lock } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface ForgotPasswordProps {
  onSwitchToLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ 
  onSwitchToLogin 
}) => {
  const { forgotPassword } = useAuth();
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        success('Reset Link Sent', result.message);
      } else {
        error('Failed to Send Reset Link', result.message);
      }
    } catch (err) {
      error('Error', 'An unexpected error occurred. Please try again.');
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
          <button className="px-4 py-2 text-gray-600 bg-gray-100  hover:bg-gray-200 transition-colors">
            Explore Features
          </button>
          <button className="px-4 py-2 text-white bg-black  hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white  shadow-2xl border-2 border-gray-200 p-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100  flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#6B40ED]" />
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-900 text-center mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600 text-center mb-6 text-sm">
              We'll send new password link to email
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border  focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-300"
                  placeholder="Enter your email address"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2.5  hover:bg-gray-800 transition-colors font-medium text-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Password Link'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-[#6B40ED] hover:text-[#6B40ED]/80 font-medium text-sm"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">© Superpage team</p>
        </div>
      </div>
    </div>
  );
};






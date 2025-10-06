import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Smile } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface LoginProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
  onSwitchToOTP: () => void; // kept for compatibility, not used in this UI
}

export const Login: React.FC<LoginProps> = ({
  onSwitchToSignup,
  onSwitchToForgotPassword
}) => {
  const { login, socialLogin, continueAsGuest } = useAuth();
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        success('Welcome!', `Signed in as ${email}`);
      } else {
        error('Login failed', result.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocial = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      const result = await socialLogin(provider);
      if (result.success) {
        success('Welcome!', `Signed in with ${provider}`);
      } else {
        error('Login failed', result.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    success('Welcome, Guest!', 'You are now signed in as a guest.');
  };

  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Logo size="md" />
          <span className="font-semibold text-lg text-gray-900">Superpage</span>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {/* navigate to features page */}}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Explore Features
          </button>
          <button 
            onClick={onSwitchToSignup}
            className="px-4 py-2 text-white bg-black hover:bg-gray-800 transition-colors"
          >
            Get Started
          </button>        </div>
      </div>

      <div className="flex items-center justify-center h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white shadow-2xl border-2 border-gray-200 p-4">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
                <Smile className="w-6 h-6 text-[#6B40ED]" />
              </div>
            </div>

            <h1 className="text-lg font-bold text-gray-900 text-center mb-1">
              Sign in to Superpage
            </h1>
            <p className="text-gray-600 text-center mb-4 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-[#6B40ED] hover:text-[#6B40ED]/80 font-medium"
              >
                Sign Up
              </button>
            </p>

            <div className="mb-3">
              <div className="space-y-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleSocial('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-3 py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors text-sm bg-white text-gray-700 font-medium rounded-md"
                >
                  <img src="/images/google-g.svg" alt="Google" className="w-4 h-4 mr-2" aria-label="Sign in with Google" />
                  Sign in with Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocial('facebook')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-3 py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors text-sm bg-white text-gray-700 font-medium rounded-md"
                >
                  <img src="/images/facebook-f.svg" alt="Facebook" className="w-4 h-4 mr-2" />
                  Sign in with Facebook                </button>
              </div>

              <div className="flex items-center my-3">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="px-2 text-gray-500 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B40ED] focus:border-transparent"
                    placeholder="johnwilliamson@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B40ED] focus:border-transparent"
                    placeholder="••••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black hover:bg-gray-800 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? 'Signing in...' : 'Login'}
                </button>
              </form>
            </div>

            <button
              type="button"
              onClick={handleGuest}
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm mt-2"
            >
              Continue as Guest
            </button>
          </div>

          <p className="text-center text-gray-500 text-xs mt-4">© Superpage team</p>
        </div>
      </div>
    </div>
  );
};






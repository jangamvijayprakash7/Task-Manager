import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Smile } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface SignupProps {
  onSwitchToLogin: () => void;
  onSwitchToOTP: () => void; // kept for compatibility, not used in this UI
}

export const Signup: React.FC<SignupProps> = ({ 
  onSwitchToLogin
}) => {
  const { signup } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [receiveTips, setReceiveTips] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      error('Email Required', 'Please enter your email address');
      return;
    }
    if (!acceptTerms) {
      error('Accept Terms', 'Please accept the terms and privacy policy');
      return;
    }
    const trimmedPassword = password.trim();
    const hasLetter = /[A-Za-z]/.test(trimmedPassword);
    const hasNumber = /\d/.test(trimmedPassword);
    if (trimmedPassword.length < 8 || !(hasLetter && hasNumber)) {
      error('Weak Password', 'Use at least 8 characters with letters and numbers.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await signup(username || 'User', email, trimmedPassword, { receiveTips });
      if (result.success) {
        success('Welcome!', `Account created for ${username || email}`);
        // After successful signup, go to onboarding role selection
        navigate('/onboarding/role');
      } else {
        error('Signup failed', result.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Logo size="md" />
          <span className="font-semibold text-lg text-gray-900">Superpage</span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
            Explore Features
          </button>
          <button className="px-4 py-2 text-white bg-black hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </div>
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
              Sign Up to Superpage
            </h1>
            <p className="text-gray-600 text-center mb-4 text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-[#6B40ED] hover:text-[#6B40ED]/80 font-medium"
              >
                Login
              </button>
            </p>

            <div className="space-y-2 mb-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-3 py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors text-sm bg-white text-gray-700 font-medium rounded-md"
              >
                <img src="/images/google-g.svg" alt="Google" className="w-4 h-4 mr-2" />
                Sign up with Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center px-3 py-2.5 border border-gray-300 hover:bg-gray-50 transition-colors text-sm bg-white text-gray-700 font-medium rounded-md"
              >
                <img src="/images/facebook-f.svg" alt="Facebook" className="w-4 h-4 mr-2" />
                Sign up with Facebook
              </button>
            </div>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6B40ED] focus:border-purple-500 border-gray-300"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border focus:ring-2 focus:ring-[#6B40ED] focus:border-purple-500 border-gray-300"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border focus:ring-2 focus:ring-[#6B40ED] focus:border-purple-500 border-gray-300"
                  placeholder="Enter a strong password"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-start space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded-sm border-gray-300 focus:ring-2"
                    style={{ accentColor: '#6B40ED' }}
                  />
                  <span>
                    I accept Superpage's <span className="text-[#6B40ED]">Terms of Service</span> and <span className="text-[#6B40ED]">Privacy Policy</span>. Also I agreed superpage <span className="text-[#6B40ED]">Refund policy</span>.
                  </span>
                </label>

                <label className="flex items-start space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={receiveTips}
                    onChange={(e) => setReceiveTips(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded-sm border-gray-300 focus:ring-2"
                    style={{ accentColor: '#6B40ED' }}
                  />
                  <span>I wish to receive UI tips and offers from Superpage.</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-black text-white hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                {isLoading ? 'Creating...' : 'Register Now'}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-500 text-xs mt-4">© Superpage team</p>
        </div>
      </div>
    </div>
  );
};






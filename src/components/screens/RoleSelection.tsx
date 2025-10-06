import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../contexts/AuthContext';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['UI/UX Designer', 'Founder']);

  const roles = [
    'UI/UX Designer',
    'Developer',
    'Influencer',
    'Manager',
    'Marketer',
    'Founder'
  ];

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleNext = async () => {
    if (selectedRoles.length > 0) {
      const primaryRole = selectedRoles[0];
      try {
        await updateUser({ role: primaryRole });
        navigate('/home');
      } catch (err) {
        console.error('Failed to update user role:', err);
      }
    }
  };

  const handleSkip = async () => {
    try {
      await updateUser({});
      navigate('/home');
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      // TODO: Show error message to user
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
          <button onClick={() => navigate('/features')} aria-label="Explore Features" className="px-4 py-2 text-gray-600 bg-gray-100  hover:bg-gray-200 transition-colors">Explore Features</button>
          <button onClick={() => navigate('/signup')} aria-label="Get Started" className="px-4 py-2 text-white bg-black  hover:bg-gray-800 transition-colors">Get Started</button>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white  shadow-2xl border-2 border-gray-200 p-6">
            <h1 className="text-xl font-bold text-gray-900 text-center mb-2">What is your job title?</h1>
            <p className="text-gray-600 text-center mb-6 text-sm">Select option to customize your dashboard</p>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleToggle(role)}
                  className={`p-3  border-2 transition-all flex items-center space-x-2 text-sm ${
                    selectedRoles.includes(role)
                      ? 'bg-[#6B40ED]/10 border-[#6B40ED] text-[#6B40ED]'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Check className={`w-3 h-3 ${selectedRoles.includes(role) ? 'text-[#6B40ED]' : 'text-gray-400'}`} />
                  <span className="font-medium">{role}</span>
                </button>
              ))}
            </div>

            <button onClick={handleNext} className="w-full bg-black text-white py-2.5  hover:bg-gray-800 transition-colors font-medium text-sm mb-4">Next</button>

            <div className="flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#6B40ED] "></div>
                <div className="w-2 h-2 bg-[#6B40ED] "></div>
                <div className="w-2 h-2 bg-[#6B40ED] "></div>
                <div className="w-2 h-2 bg-gray-300 "></div>
              </div>
            </div>

            <div className="mt-4 text-right">
              <button onClick={handleSkip} className="text-[#6B40ED] hover:text-[#6B40ED]/80 text-sm">Skip Steps</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



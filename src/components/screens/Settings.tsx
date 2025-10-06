import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Camera,
  Settings as SettingsIcon,
  Lock,
  DollarSign,
  ArrowLeftRight,
  UserMinus,
  Upload,
  Eye,
  EyeOff,
  Check,
  Trash2,
  FileText
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { AvatarImage } from '../ui/AvatarImage';
import { useToast } from '../../contexts/ToastContext';
import { ProfilePictureUpload } from '../ui/ProfilePictureUpload';
import { 
  isSubscriptionActive, 
  isInTrial, 
  getDaysUntilNextBilling, 
  formatCurrency, 
  formatDate, 
  getSubscriptionStatusText, 
  getPlanDisplayName 
} from '../../utils/billingService';

export const Settings: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  
  // Check if user is a guest
  const isGuest = currentUser?.id === 'guest';
  const [activeTab, setActiveTab] = useState('general');
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    retypePassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    retype: false
  });

  // Initialize profile data from current user
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        username: currentUser.name?.toLowerCase().replace(/\s+/g, '') || '',
        email: currentUser.email || '',
        phone: '+1234567890' // Default phone, can be extended in User interface
      });
    }
    
    // Initialize original notifications state
    setOriginalNotifications({
      newUserJoining: false,
      uiKitBuying: false,
      newUiKitLaunched: false,
      weeklyReport: false,
      newMessage: false
    });
  }, [currentUser]);

  // Handle profile update
  const handleProfileUpdate = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: profileData.name,
        email: profileData.email
      };
      updateUser(updatedUser);
      // Show success message or handle success
    }
  };

  // Handle notification settings save
  const handleNotificationSave = () => {
    const notificationNames = {
      newUserJoining: 'New User Joining',
      uiKitBuying: 'UI Kit Buying',
      newUiKitLaunched: 'New UI Kit Launched',
      weeklyReport: 'Weekly Report',
      newMessage: 'New Message'
    };

    // Check what changed and show appropriate toast messages
    const changes: string[] = [];
    
    Object.keys(notifications).forEach((key) => {
      const notificationKey = key as keyof typeof notifications;
      const originalValue = originalNotifications[notificationKey];
      const currentValue = notifications[notificationKey];
      
      if (originalValue !== currentValue) {
        if (currentValue) {
          changes.push(`${notificationNames[notificationKey]} enabled`);
        } else {
          changes.push(`${notificationNames[notificationKey]} disabled`);
        }
      }
    });

    if (changes.length > 0) {
      // Update original notifications to current state
      setOriginalNotifications({ ...notifications });
      
      // Show success message with all changes
      success(
        'Notification Settings Updated',
        `Changes saved: ${changes.join(', ')}`
      );
    } else {
      // No changes made
      success(
        'No Changes',
        'Your notification settings are already up to date'
      );
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (file: File) => {
    if (isGuest) {
      error(
        'Login Required',
        'Please login to upload a profile picture. You can login using the login button in the profile dropdown.'
      );
      return;
    }
    
    if (currentUser) {
      // Create a URL for the uploaded file (in a real app, you'd upload to a server)
      const avatarUrl = URL.createObjectURL(file);
      
      const updatedUser = {
        ...currentUser,
        avatarUrl: avatarUrl
      };
      
      // Use the updateUser function from AuthContext to update both localStorage and currentUser state
      updateUser(updatedUser);
    }
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (isGuest) {
      error(
        'Login Required',
        'Please login to change your password. You can login using the login button in the profile dropdown.'
      );
      return;
    }

    // Validate passwords
    if (!passwordData.currentPassword.trim()) {
      error('Validation Error', 'Current password is required');
      return;
    }

    if (!passwordData.newPassword.trim()) {
      error('Validation Error', 'New password is required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      error('Validation Error', 'New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.retypePassword) {
      error('Password Mismatch', 'New password and retype password do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      error('Validation Error', 'New password must be different from current password');
      return;
    }

    // If all validations pass, show success message
    success('Password Updated', 'Your password has been changed successfully!');
    
    // Clear password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      retypePassword: ''
    });
  };

  const [notifications, setNotifications] = useState({
    newUserJoining: false,
    uiKitBuying: false,
    newUiKitLaunched: false,
    weeklyReport: false,
    newMessage: false
  });
  const [originalNotifications, setOriginalNotifications] = useState({
    newUserJoining: false,
    uiKitBuying: false,
    newUiKitLaunched: false,
    weeklyReport: false,
    newMessage: false
  });
  const [planData, setPlanData] = useState({
    currentPlan: 'Free Plan',
    storageUsed: 200,
    storageTotal: 1024,
    subscriptionDate: 'Oct 20, 2022'
  });
  const [integrations, setIntegrations] = useState([
    { name: 'Google Calendar', description: 'For Importing your google calendar', connected: false, icon: 'calendar', color: 'bg-blue-500' },
    { name: 'Zapier', description: 'For Integrating with other tools', connected: false, icon: 'zapier', color: 'bg-orange-500' },
    { name: 'Calendly', description: 'Scheduling meetings', connected: true, icon: 'calendly', color: 'bg-blue-500' },
    { name: 'Stripe', description: 'Payment processing through stripe', connected: false, icon: 'stripe', color: 'bg-purple-500' },
    { name: 'Twitter', description: 'Social media for sharing', connected: false, icon: 'twitter', color: 'bg-blue-400' },
    { name: 'Slack', description: 'Messaging to teams', connected: false, icon: 'slack', color: 'bg-purple-600' },
    { name: 'Zoom', description: 'Video call app', connected: false, icon: 'video', color: 'bg-blue-500' },
    { name: 'Mailchimp', description: 'Marketing, Automation & Email Platform', connected: false, icon: 'mailchimp', color: 'bg-yellow-500' },
    { name: 'Miro', description: 'Visual Collaboration Platform', connected: false, icon: 'miro', color: 'bg-yellow-500' }
  ]);
  const [deactivationData, setDeactivationData] = useState({
    reason: '',
    agreeToTerms: false
  });

  const tabs = [
    { id: 'general', label: 'General Settings', icon: SettingsIcon },
    { id: 'password', label: 'Password Settings', icon: Lock },
    { id: 'notifications', label: 'Notification Settings', icon: Bell },
    { id: 'billing', label: 'Plan & Billings', icon: DollarSign },
    { id: 'integrations', label: 'Integrations', icon: ArrowLeftRight },
    { id: 'deactivation', label: 'Deactivation', icon: UserMinus }
  ];

  const handleSave = () => {
    if (isGuest) {
      error(
        'Login Required',
        'Please login to save settings. You can login using the login button in the profile dropdown.'
      );
      return;
    }
    success('Settings Saved', 'Settings saved successfully!');
  };

  const handleConnectIntegration = (index: number) => {
    if (isGuest) {
      error(
        'Login Required',
        'Please login to connect integrations. You can login using the login button in the profile dropdown.'
      );
      return;
    }
    
    const updatedIntegrations = [...integrations];
    const integration = updatedIntegrations[index];
    const wasConnected = integration.connected;
    
    updatedIntegrations[index].connected = !updatedIntegrations[index].connected;
    setIntegrations(updatedIntegrations);
    
              // Show toast message based on the action
              if (wasConnected) {
                success(
                  'Integration Disconnected',
                  `${integration.name} has been disconnected.`
                );
              } else {
                success(
                  'Integration Connected',
                  `${integration.name} has been connected.`
                );
              }
  };

  const renderIntegrationIcon = (icon: string) => {
    switch (icon) {
      case 'calendar':
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 border border-white rounded-sm">
              <div className="w-full h-1 bg-white"></div>
              <div className="text-white text-xs font-bold leading-none mt-0.5">31</div>
            </div>
          </div>
        );
      case 'zapier':
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 text-white font-bold text-lg">*</div>
          </div>
        );
      case 'calendly':
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 text-white font-bold text-lg">C</div>
          </div>
        );
      case 'stripe':
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 text-white font-bold text-lg">S</div>
          </div>
        );
      case 'twitter':
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 text-white">🐦</div>
          </div>
        );
      case 'slack':
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 text-white font-bold text-lg">#</div>
          </div>
        );
      case 'video':
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 text-white">📹</div>
          </div>
        );
      case 'mailchimp':
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 text-black font-bold text-lg">🐵</div>
          </div>
        );
      case 'miro':
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 text-black font-bold text-lg">M</div>
          </div>
        );
      default:
        return <div className="w-6 h-6 bg-gray-300 rounded-full"></div>;
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar - Settings Navigation */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-2 pb-1">
          {isGuest && (
            <p className="text-sm text-gray-500">
              Login to access all settings and customization options
            </p>
          )}
        </div>

        {/* Settings Navigation */}
        <div className="px-4 pt-2">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left transition-colors rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Right Panel - Settings Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'general' && (
          <div className="p-6">
            <div className="max-w-2xl">
              {/* Personal Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Details</h3>
                
                {/* Profile Image */}
                <div className="mb-6">
                  <ProfilePictureUpload
                    currentAvatarUrl={currentUser?.avatarUrl}
                    userName={currentUser?.name || 'User'}
                    onUpload={handleProfilePictureUpload}
                    size="xl"
                    showUploadButton={!isGuest}
                    disabled={isGuest}
                  />
                  {isGuest && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Login to upload a profile picture
                    </p>
                  )}
                </div>

                {/* Name Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={isGuest}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      isGuest ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                {/* Username Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 ">
                      Superpage/
                    </span>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      disabled={isGuest}
                      className={`flex-1 px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        isGuest ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {isGuest 
                      ? 'Login to edit your username'
                      : 'Note: You can change username 24days once, So check the username before you process.'
                    }
                  </p>
                </div>

                <Button 
                  className={`flex items-center space-x-2 ${
                    isGuest ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                  }`}
                  disabled={isGuest}
                  onClick={handleSave}
                >
                  <Check className="w-4 h-4" />
                  <span>{isGuest ? 'Login to Save' : 'Save Changes'}</span>
                </Button>
              </div>

              {/* Email and Phone Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Email and Phone Details</h3>
                
                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={isGuest}
                      className={`flex-1 px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        isGuest ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <Button 
                      className={`${isGuest ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                      style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}
                      disabled={isGuest}
                    >
                      {isGuest ? 'Login to Update' : 'Update'}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {isGuest 
                      ? 'Login to update your email address'
                      : 'Note: You\'ll get confirmation email within 30mins'
                    }
                  </p>
                </div>

                {/* Phone Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={isGuest}
                      className={`flex-1 px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        isGuest ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <Button 
                      className={`${isGuest ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                      style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}
                      onClick={handleProfileUpdate}
                      disabled={isGuest}
                    >
                      {isGuest ? 'Login to Update' : 'Update'}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {isGuest 
                      ? 'Login to update your phone number'
                      : 'Note: You\'ll get confirmation OTP within 30mins'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="p-6">
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Password Settings</h3>
              
              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300  focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300  focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Re-type Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Re-type Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.retype ? 'text' : 'password'}
                    value={passwordData.retypePassword}
                    onChange={(e) => setPasswordData({ ...passwordData, retypePassword: e.target.value })}
                    className={`w-full px-3 py-2 pr-10 border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      passwordData.retypePassword && passwordData.newPassword && 
                      passwordData.retypePassword !== passwordData.newPassword 
                        ? 'border-red-300' 
                        : 'border-gray-300'
                    }`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, retype: !showPasswords.retype })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.retype ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordData.retypePassword && passwordData.newPassword && 
                 passwordData.retypePassword !== passwordData.newPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              <Button 
                onClick={handlePasswordChange}
                className="flex items-center space-x-2 hover:opacity-80"
              >
                <Check className="w-4 h-4" />
                <span>Change Password</span>
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6">
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Settings</h3>
              <p className="text-sm text-gray-600 mb-6">General email notifications</p>
              
              <div className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {key === 'newUserJoining' && 'Emails for every new user joining in team'}
                        {key === 'uiKitBuying' && 'Emails for UI kit buying from superpage'}
                        {key === 'newUiKitLaunched' && 'Emails for every time new UI kit launched'}
                        {key === 'weeklyReport' && 'Emails for weekly report'}
                        {key === 'newMessage' && 'Emails for every new message'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {key === 'newUserJoining' && 'When someone joined to your team, You\'ll get notified'}
                        {key === 'uiKitBuying' && 'When someone purchase your UI kit, You\'ll get notified'}
                        {key === 'newUiKitLaunched' && 'When new UI kit is launched, You\'ll get notified'}
                        {key === 'weeklyReport' && 'Every week you\'ll get report for your account'}
                        {key === 'newMessage' && 'When person send you message in superpage'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B40ED]"></div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button 
                  onClick={handleNotificationSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#6B40ED] text-white rounded-button hover:opacity-80 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button 
                  onClick={() => setNotifications({ ...originalNotifications })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-button hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="p-6">
            <div className="max-w-2xl space-y-6">
              {/* Current Subscription */}
              <div className="bg-white border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#e3d8ff' }}>
                    <div className="w-4 h-4 bg-white"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getPlanDisplayName(currentUser?.subscription?.plan || 'free')}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isSubscriptionActive(currentUser?.subscription) 
                        ? 'bg-green-100 text-green-800' 
                        : isInTrial(currentUser?.subscription)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getSubscriptionStatusText(currentUser?.subscription)}
                    </span>
                  </div>
                </div>
                
                {currentUser?.subscription ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span className="font-medium capitalize">{currentUser.subscription.billingCycle}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{formatCurrency(currentUser.subscription.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Users:</span>
                      <span className="font-medium">{currentUser.subscription.userCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Billing:</span>
                      <span className="font-medium">{formatDate(currentUser.subscription.nextBillingDate)}</span>
                    </div>
                    {getDaysUntilNextBilling(currentUser.subscription) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Days until renewal:</span>
                        <span className="font-medium">{getDaysUntilNextBilling(currentUser.subscription)} days</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 mb-4">
                    You're on the free plan. Upgrade to unlock premium features and increase your storage limit.
                  </p>
                )}
                
                <div className="flex items-center space-x-4 mt-4">
                  <Button 
                    onClick={() => {
                      console.log('Upgrade Plan button clicked, navigating to /premium');
                      try {
                        navigate('/premium');
                        console.log('Navigation called successfully');
                      } catch (error) {
                        console.error('Navigation error:', error);
                      }
                    }}
                    className="hover:opacity-80"
                  >
                    {currentUser?.subscription ? 'Manage Plan' : 'Upgrade Plan'}
                  </Button>
                  {!currentUser?.subscription && (
                    <span className="text-sm text-gray-600">30-day trial available for all paid plans</span>
                  )}
                </div>
              </div>

              {/* Plan Usage */}
              <div className="bg-white border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getPlanDisplayName(currentUser?.subscription?.plan || 'free')} - Storage Usage
                </h3>
                <p className="text-gray-600 mb-2">
                  {currentUser?.subscription?.plan === 'free' 
                    ? 'You need to subscribe if your storage size is greater than 1GB'
                    : 'Your current storage usage and limits'
                  }
                </p>
                <p className="text-gray-600 mb-4">
                  {planData.storageUsed}MB of {planData.storageTotal}MB storage used
                </p>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      (planData.storageUsed / planData.storageTotal) > 0.8 
                        ? 'bg-red-500' 
                        : (planData.storageUsed / planData.storageTotal) > 0.6 
                        ? 'bg-yellow-500' 
                        : 'bg-[#6B40ED]'
                    }`}
                    style={{ width: `${Math.min((planData.storageUsed / planData.storageTotal) * 100, 100)}%` }}
                  ></div>
                </div>
                {(planData.storageUsed / planData.storageTotal) > 0.8 && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Storage usage is high. Consider upgrading your plan.
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white border border-gray-200  p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions documents</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Privacy Policy</p>
                        <p className="text-sm text-gray-600">Updated on January 2022 with 4 new policies</p>
                      </div>
                    </div>
                    <Button variant="outline" className="text-[#6B40ED] border-[#6B40ED]">Review</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Terms and Conditions</p>
                        <p className="text-sm text-gray-600">Updated on March 2022 with 7 new conditions</p>
                      </div>
                    </div>
                    <Button variant="outline" className="text-[#6B40ED] border-[#6B40ED]">Review</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Refund Policy</p>
                        <p className="text-sm text-gray-600">Updated on June 2022 with 2 new policies</p>
                      </div>
                    </div>
                    <Button variant="outline" className="text-[#6B40ED] border-[#6B40ED]">Review</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="p-6">
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Plugins and Integrations</h3>
              <p className="text-sm text-gray-600 mb-6">We'll add more plugins soon, If you want any particular plugin, Just Request Here</p>
              
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-300 rounded-card">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${integration.color} rounded-full flex items-center justify-center`}>
                        {renderIntegrationIcon(integration.icon)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{integration.name}</p>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <button 
                      className={`px-4 py-2 text-sm font-medium rounded-button ${
                        integration.connected 
                          ? 'bg-gray-500 text-white' 
                          : 'bg-[#6B40ED] text-white hover:opacity-80'
                      }`}
                      onClick={() => handleConnectIntegration(index)}
                    >
                      {integration.connected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deactivation' && (
          <div className="p-6">
            <div className="max-w-2xl">
              <div className="space-y-6">
                {/* Deactivate Account */}
                <div className="bg-white border border-gray-200  p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100  flex items-center justify-center">
                      <span className="text-gray-600 font-medium">E</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Deactivate Account</h3>
                      <p className="text-sm text-gray-600">
                        You can active your account within 30days using your existing login credentials.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delete Account Permanently */}
                <div className="bg-white border border-gray-200  p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100  flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Delete Account Permanently</h3>
                      <p className="text-sm text-gray-600">
                        You can't re-activate your account again, It will delete your account permanantly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What is the reason? (Optional)
                  </label>
                  <textarea
                    value={deactivationData.reason}
                    onChange={(e) => setDeactivationData({ ...deactivationData, reason: e.target.value })}
                    placeholder="Write your reason...."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={4}
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={deactivationData.agreeToTerms}
                    onChange={(e) => setDeactivationData({ ...deactivationData, agreeToTerms: e.target.checked })}
                    className="w-4 h-4 rounded-sm border-gray-300 focus:ring-2"
                    style={{ accentColor: '#6B40ED' }}
                  />
                  <label className="text-sm text-gray-700">
                    I agree with your terms and conditions to delete or deactive my account
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button className="bg-gray-600 text-white hover:bg-gray-700">Deactivate Account</Button>
                  <Button className="bg-red-400 text-white hover:bg-red-500">Delete Account</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

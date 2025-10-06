import React, { useState, useEffect } from 'react';
import { User, Edit3, Save, X, Mail, User as UserIcon, Briefcase, Phone, MapPin, Globe, FileText, Camera, Lock } from 'lucide-react';
import { getUser, setUser } from '../../utils/localStorage';
import { User as UserType } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { ProfilePictureUpload } from '../ui/ProfilePictureUpload';
import { useAuth } from '../../contexts/AuthContext';

export const Profile: React.FC = () => {
  const { success, error } = useToast();
  const { currentUser, updateUser } = useAuth();
  const [user, setUserState] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Check if user is a guest
  const isGuest = currentUser?.id === 'guest';
  const [editData, setEditData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    bio: '',
    phone: '',
    location: '',
    website: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUserState(currentUser);
      setEditData({
        name: currentUser.name || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        role: currentUser.role || '',
        bio: currentUser.bio || '',
        phone: currentUser.phone || '',
        location: currentUser.location || '',
        website: currentUser.website || ''
      });
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEdit = () => {
    if (isGuest) {
      error(
        'Login Required',
        'Please login to edit your profile. You can login using the login button in the profile dropdown.'
      );
      return;
    }
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditData({
        name: user.name || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || ''
      });
    }
    setErrors({});
  };

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!editData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(editData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!editData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && user) {
      const updatedUser: UserType = {
        ...user,
        name: editData.name,
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        role: editData.role,
        bio: editData.bio,
        phone: editData.phone,
        location: editData.location,
        website: editData.website
      };
      
      setUser(updatedUser);
      setUserState(updatedUser);
      setIsEditing(false);
      success('Profile Updated', 'Your profile has been updated successfully!');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProfilePictureUpload = (file: File) => {
    if (isGuest) {
      error(
        'Login Required',
        'Please login to upload a profile picture. You can login using the login button in the profile dropdown.'
      );
      return;
    }
    
    if (user) {
      // Create a URL for the uploaded file (in a real app, you'd upload to a server)
      const avatarUrl = URL.createObjectURL(file);
      
      const updatedUser: UserType = {
        ...user,
        avatarUrl: avatarUrl
      };
      
      // Use the updateUser function from AuthContext to update both localStorage and currentUser state
      updateUser(updatedUser);
      setUserState(updatedUser);
      console.log('Profile: Profile picture uploaded:', avatarUrl);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">No user data found. Please login again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            {isGuest 
              ? 'View your profile information. Login to edit your profile and preferences.'
              : 'Manage your personal information and preferences'
            }
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className={`flex items-center space-x-2 px-6 py-3 transition-colors rounded-lg font-medium ${
              isGuest 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
            disabled={isGuest}
          >
            {isGuest ? <Lock className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
            <span>{isGuest ? 'Login to Edit' : 'Edit Profile'}</span>
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg font-medium"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-700 text-white hover:bg-primary-600 transition-colors rounded-lg font-medium"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
          </CardHeader>
          <CardContent>
            <ProfilePictureUpload
              currentAvatarUrl={user.avatarUrl}
              userName={isEditing ? editData.name : user.name}
              onUpload={handleProfilePictureUpload}
              size="lg"
              showUploadButton={isEditing && !isGuest}
              disabled={isGuest}
            />
            <div className="text-center mt-4">
              <p className="text-gray-600">
                {isEditing ? editData.role : user.role || 'No role assigned'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your first name"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.firstName || 'Not provided'}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your last name"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.lastName || 'Not provided'}</p>
                )}
              </div>

              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 py-2">{user.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 py-2">{user.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your location"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.location || 'Not provided'}</p>
                )}
              </div>

              {/* Website */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your website URL"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.website || 'Not provided'}</p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tell us about yourself"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.bio || 'No bio provided'}</p>
                )}
              </div>

              {/* Role */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Role
                </label>
                {isEditing ? (
                  <div>
                    <select
                      value={editData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.role ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your role</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Developer">Developer</option>
                      <option value="Influencer">Influencer</option>
                      <option value="Manager">Manager</option>
                      <option value="Marketer">Marketer</option>
                      <option value="Founder">Founder</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="QA Engineer">QA Engineer</option>
                      <option value="Designer">Designer</option>
                      <option value="Analyst">Analyst</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 py-2">{user.role || 'No role assigned'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Theme</span>
              <span className="text-sm text-gray-600 capitalize">{user.preferences.theme}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Notifications</span>
              <span className="text-sm text-gray-600">
                {user.preferences.notifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
              <span className="text-sm text-gray-600">
                {user.preferences.emailNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Camera, Upload, User as UserIcon } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '../../contexts/ToastContext';

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string;
  userName?: string;
  onUpload: (file: File) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showUploadButton?: boolean;
  disabled?: boolean;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentAvatarUrl,
  userName = 'User',
  onUpload,
  size = 'lg',
  className = '',
  showUploadButton = true,
  disabled = false
}) => {
  const { error, success } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const cameraIconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5'
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      error('Invalid File Type', 'Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      error('File Too Large', 'Please select an image smaller than 5MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      onUpload(file);
      setIsUploading(false);
      success('Profile Picture Updated', 'Your profile picture has been updated successfully!');
      // Clean up preview URL
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    }, 1000);
  };

  const handleUploadClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };


  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-primary-100 rounded-full flex items-center justify-center overflow-hidden`}>
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={userName}
              className={`${sizeClasses[size]} rounded-full object-cover`}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <UserIcon className={`${iconSizes[size]} text-primary-700`} />
          )}
          
          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Camera button */}
        <button
          onClick={handleUploadClick}
          disabled={isUploading || disabled}
          className={`absolute bottom-0 right-0 p-2 rounded-full transition-colors shadow-lg ${
            disabled 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-primary-700 text-white hover:bg-primary-600'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Camera className={cameraIconSizes[size]} />
        </button>

      </div>

      {/* Upload button (optional) */}
      {showUploadButton && (
        <Button
          variant="outline"
          onClick={handleUploadClick}
          disabled={isUploading || disabled}
          className={`flex items-center space-x-2 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>
            {isUploading ? 'Uploading...' : 
             disabled ? 'Login to Upload' : 
             'Upload Profile Picture'}
          </span>
        </Button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* User info */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {userName}
        </h2>
        {!displayUrl && (
          <p className="text-sm text-gray-500 mt-1">
            {disabled 
              ? 'Login to upload a profile picture'
              : 'Click the camera icon to upload a profile picture'
            }
          </p>
        )}
      </div>
    </div>
  );
};

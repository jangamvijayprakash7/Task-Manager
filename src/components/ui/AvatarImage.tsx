import React from 'react';

interface AvatarImageProps {
  src?: string;
  alt: string;
  fallback?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  fallback,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // If no src provided or image failed to load, use fallback
  if (!src || imageError) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-sm font-medium bg-primary-100 text-primary-700 ${className}`}
      >
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={handleImageError}
    />
  );
};

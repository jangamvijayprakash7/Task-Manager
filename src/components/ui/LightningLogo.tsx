import React from 'react';

interface LightningLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LightningLogo: React.FC<LightningLogoProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B9D" />
            <stop offset="50%" stopColor="#C44569" />
            <stop offset="100%" stopColor="#6C5CE7" />
          </linearGradient>
        </defs>
        <path 
          d="M4 8L12 8L8 12L16 12L6 20L10 16L4 16L4 8Z" 
          fill="url(#lightningGradient)"
          stroke="none"
        />
      </svg>
    </div>
  );
};

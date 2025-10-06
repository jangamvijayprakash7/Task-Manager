import React from 'react';

interface StackedBoardsIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const StackedBoardsIcon: React.FC<StackedBoardsIconProps> = ({ 
  size = 24, 
  color = '#6B40ED',
  className = '',
  style = {}
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      style={style}
    >
      {/* Bottom rectangle (largest) */}
      <rect 
        x="4" 
        y="14" 
        width="16" 
        height="6" 
        rx="1" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
      />
      
      {/* Middle rectangle (medium) */}
      <rect 
        x="6" 
        y="10" 
        width="12" 
        height="4" 
        rx="1" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
      />
      
      {/* Top rectangle (smallest) */}
      <rect 
        x="8" 
        y="6" 
        width="8" 
        height="4" 
        rx="1" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
      />
    </svg>
  );
};
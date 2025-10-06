import React from 'react';

interface StackedBoardsIconWithCircleProps {
  size?: number;
  iconColor?: string;
  circleColor?: string;
  circleFill?: string;
  className?: string;
}

export const StackedBoardsIconWithCircle: React.FC<StackedBoardsIconWithCircleProps> = ({ 
  size = 48, 
  iconColor = '#6B40ED',
  circleColor = '#6B40ED',
  circleFill = 'transparent',
  className = ''
}) => {
  const iconSize = size * 0.6; // Icon takes 60% of the circle size
  const iconOffset = (size - iconSize) / 2; // Center the icon in the circle

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        {/* Outer circle */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={size / 2 - 2} 
          stroke={circleColor} 
          strokeWidth="2" 
          fill={circleFill}
        />
        
        {/* Stacked boards icon */}
        <g transform={`translate(${iconOffset}, ${iconOffset})`}>
          {/* Bottom rectangle (largest) */}
          <rect 
            x="4" 
            y="14" 
            width="16" 
            height="6" 
            rx="1" 
            stroke={iconColor} 
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
            stroke={iconColor} 
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
            stroke={iconColor} 
            strokeWidth="1.5" 
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};


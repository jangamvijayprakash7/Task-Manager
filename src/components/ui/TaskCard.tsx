import React from 'react';
import { Check, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback } from './Avatar';
import { cn } from '../../utils/cn';

interface TaskCardProps {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  assignee: string;
  assigneeAvatar: string;
  onToggleComplete?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  startDate,
  endDate,
  completed,
  assignee,
  assigneeAvatar,
  onToggleComplete,
  className,
  style
}) => {
  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short'
    });
    const endStr = end.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short'
    });
    return `${startStr} to ${endStr}, 2022`;
  };

  const handleToggleComplete = () => {
    if (onToggleComplete) {
      onToggleComplete(id);
    }
  };

  return (
    <div
      className={cn(
        'absolute bg-white border border-gray-200  p-3 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
      style={style}
    >
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleToggleComplete}
          className={cn(
            'w-4 h-4 border-2 flex items-center justify-center transition-colors',
            completed 
              ? 'bg-purple-600 border-purple-600' 
              : 'border-gray-300 hover:border-purple-400'
          )}
        >
          {completed && (
            <Check className="w-3 h-3 text-white" />
          )}
        </button>
        <span className="text-sm font-medium text-gray-900 flex-1 truncate">
          {title}
        </span>
        <Avatar className="w-5 h-5">
          <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
            {assigneeAvatar}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {formatDateRange(startDate, endDate)}
      </div>
    </div>
  );
};

import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyTasksProps {
  onCreateTask: () => void;
}

export const EmptyTasks: React.FC<EmptyTasksProps> = ({ onCreateTask }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 bg-gray-100  flex items-center justify-center mb-6">
        <CheckSquare className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No tasks yet
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Get started by creating your first task. Organize your work and stay on top of your projects.
      </p>
      
      <Button onClick={onCreateTask} className="flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Create New Task</span>
      </Button>
    </div>
  );
};

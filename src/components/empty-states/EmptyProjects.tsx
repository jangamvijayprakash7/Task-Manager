import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyProjectsProps {
  onCreateProject: () => void;
}

export const EmptyProjects: React.FC<EmptyProjectsProps> = ({ onCreateProject }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 bg-gray-100  flex items-center justify-center mb-6">
        <FolderOpen className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No projects found
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Start organizing your work by creating your first project. Group related tasks together and track progress.
      </p>
      
      <Button onClick={onCreateProject} className="flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Add Project</span>
      </Button>
    </div>
  );
};

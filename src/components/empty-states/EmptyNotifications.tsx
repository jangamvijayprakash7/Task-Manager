import React from 'react';
import { Bell } from 'lucide-react';

export const EmptyNotifications: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 bg-gray-100  flex items-center justify-center mb-6">
        <Bell className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No new notifications
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        You're all caught up! We'll notify you when there are updates on your tasks and projects.
      </p>
    </div>
  );
};

import React, { useState } from 'react';
import { TimelinePage } from './TimelinePage';
import { InboxPage } from './InboxPage';
import { PageLayout } from '../layout/PageLayout';
import { User } from '../../types';

export const TimelineInboxDemo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'timeline' | 'inbox'>('timeline');
  const [currentUser] = useState<User | null>({
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'Admin',
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true
    }
  });

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleCreateNew = () => {
    console.log('Create new item');
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  return (
    <div className="w-full h-screen">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentPage('timeline')}
            className={`px-4 py-2  font-medium transition-colors ${
              currentPage === 'timeline'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setCurrentPage('inbox')}
            className={`px-4 py-2  font-medium transition-colors ${
              currentPage === 'inbox'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Inbox View
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        {currentPage === 'timeline' ? (
          <TimelinePage />
        ) : (
          <InboxPage />
        )}
      </div>
    </div>
  );
};

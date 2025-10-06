import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, UserPlus, User, FileText, AtSign } from 'lucide-react';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();

  // Sample notifications data - same as in Header.tsx
  const notifications = [
    {
      id: '1',
      icon: Check,
      message: "Johnson complete **Development team's** all tasks",
      time: "Just now",
      isRead: true
    },
    {
      id: '2',
      icon: UserPlus,
      message: "Willamson requested to join in **Design team**",
      time: "2hrs ago",
      isRead: true
    },
    {
      id: '3',
      icon: User,
      message: "Olivia accepted **UI/UX Team's** request",
      time: "a day ago",
      isRead: true
    },
    {
      id: '4',
      icon: FileText,
      message: "We have shared your monthly activities report in PDF format",
      time: "2days ago",
      isRead: true
    },
    {
      id: '5',
      icon: AtSign,
      message: "Elizabeth mentioned you in **Samantha's** sub task",
      time: "a week ago",
      isRead: true
    },
    {
      id: '6',
      icon: Check,
      message: "You completed **Marketing team's** task",
      time: "3weeks ago",
      isRead: true
    },
    {
      id: '7',
      icon: FileText,
      message: "Johnson complete **Development team's** all tasks",
      time: "a month ago",
      isRead: true
    },
    {
      id: '8',
      icon: AtSign,
      message: "Ryan mentioned you in **Design team's** sub task",
      time: "4months ago",
      isRead: true
    }
  ];


  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Notifications Card */}
        <div className="bg-white rounded-card shadow-sm border border-gray-300">
          {/* Card Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-600 mt-1">You can find all settings here.</p>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}>
                      <Icon className="w-5 h-5" style={{ color: '#6B40ED' }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {notification.message.split('**').map((part, index) => 
                          index % 2 === 1 ? (
                            <span key={index} className="font-medium" style={{ color: '#6B40ED' }}>{part}</span>
                          ) : (
                            part
                          )
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

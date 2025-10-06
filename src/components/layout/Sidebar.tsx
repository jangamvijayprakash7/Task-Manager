import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { getInitials } from '../ui/Avatar';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeItem: string;
  onItemClick: (item: string) => void;
}

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/home' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'teams', label: 'Teams', icon: Users, path: '/teams' },
  { id: 'boards', label: 'Boards', icon: FolderOpen, path: '/boards' },
  { id: 'inbox', label: 'Inbox', icon: MessageSquare, path: '/inbox' },
  { id: 'timeline', label: 'Timeline', icon: Calendar, path: '/timeline' },
  { id: 'more', label: 'More Options', icon: MoreHorizontal, path: '/more' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  activeItem,
  onItemClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const user = currentUser;

  const handleItemClick = (item: { id: string; path: string }) => {
    onItemClick(item.id);
    navigate(item.path);
  };

  return (
    <div className={cn(
      'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center border-b border-gray-200',
        isCollapsed ? 'justify-center p-3 relative' : 'justify-between p-4'
      )}>
        {!isCollapsed ? (
          <>
            <button 
              onClick={() => navigate('/home')}
              className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <Logo size="sm" />
              <span className="font-semibold text-lg text-gray-900">Superpage</span>
            </button>
            <button
              onClick={onToggle}
              className="p-1 rounded-button hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <Logo size="sm" />
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={onToggle}
            className="absolute top-2 right-2 p-1 rounded-button hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id || location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={cn(
                'w-full flex items-center transition-colors rounded-button',
                isCollapsed 
                  ? 'justify-center px-3 py-3' 
                  : 'space-x-3 px-3 py-2 text-left',
                isActive
                  ? 'border-r-2'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              style={isActive ? { 
                backgroundColor: '#e3d8ff', 
                color: '#6B40ED',
                borderRightColor: '#6B40ED'
              } : {}}
            >
              <Icon className={cn(
                'flex-shrink-0',
                isCollapsed ? 'w-6 h-6' : 'w-5 h-5'
              )} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          'flex items-center space-x-3',
          isCollapsed && 'justify-center'
        )}>
          <Avatar className={cn(
            isCollapsed ? 'w-10 h-10' : 'w-8 h-8'
          )}>
            {user?.avatarUrl ? (
              <AvatarImage 
                src={user.avatarUrl} 
                alt={user.name || 'User'} 
                className={cn(
                  isCollapsed ? 'w-10 h-10' : 'w-8 h-8',
                  'object-cover'
                )}
              />
            ) : null}
            <AvatarFallback className={cn(
              'bg-primary-100 text-primary-700',
              isCollapsed ? 'text-base' : 'text-sm'
            )}>
              {user ? getInitials(user.name) : 'AU'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@example.com'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

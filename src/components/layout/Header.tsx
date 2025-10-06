
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, User, ChevronDown, ChevronLeft, Check, UserPlus, FileText, AtSign, HelpCircle, Users, LogOut, Calendar, Grid3X3, Settings, ArrowRight, Crown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { getInitials } from '../ui/Avatar';
import { getUser } from '../../utils/localStorage';
import { User as UserType } from '../../types';
import { CreateTaskModal } from '../modals/CreateTaskModal';
import { CreateTeamModal } from '../modals/CreateTeamModal';
import { CreateBoardModal } from '../modals/CreateBoardModal';
import { CreateTimelineModal } from '../modals/CreateTimelineModal';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

interface HeaderProps {
  onSearch: (query: string) => void;
  onCreateNew: () => void;
  onLogout: () => void;
  currentUser: UserType | null;
  isAuthenticated: boolean;
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onCreateNew, onLogout, currentUser, isAuthenticated, onNavigateToLogin, onNavigateToSignup }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(currentUser || getUser());
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(searchQuery, 500);

  // Update user when currentUser prop changes
  useEffect(() => {
    const newUser = currentUser || getUser();
    setUser(newUser);
    console.log('Header: User updated:', newUser?.avatarUrl ? 'Has avatar' : 'No avatar');
  }, [currentUser]);

  // Update search query when on search results page
  useEffect(() => {
    if (location.pathname === '/search') {
      const urlParams = new URLSearchParams(location.search);
      const query = urlParams.get('q') || '';
      setSearchQuery(query);
    } else if (location.pathname !== '/search') {
      // Clear search query when not on search page
      setSearchQuery('');
    }
  }, [location.pathname, location.search]);

  // Sample notifications data matching the image - only show for authenticated users
  const notifications = isAuthenticated ? [
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
  ] : [];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getPageTitle = () => {
    if (location.pathname.startsWith('/profile/')) {
      return 'User info';
    }
    switch (location.pathname) {
      case '/home':
        return 'Tasks Home';
      case '/dashboard':
        return 'Dashboard';
      case '/teams':
        return 'Teams';
      case '/boards':
        return 'Boards';
      case '/inbox':
        return 'Inbox';
      case '/timeline':
        return 'Timeline';
      case '/more':
        return 'More Options';
      case '/settings':
        return 'Settings';
      case '/profile':
        return 'User info';
      case '/tasks':
        return 'Tasks';
      case '/projects':
        return 'Projects';
      case '/team':
        return 'Team';
      case '/calendar':
        return 'Calendar';
      case '/kanban':
        return 'Kanban Board';
      case '/notifications':
        return 'Notifications';
      case '/search':
        return 'Search Results';
      case '/help-support':
        return 'Help & Support';
      default:
        return 'Superpage';
    }
  };

  const showBackButton = () => {
    // Show back button for all pages except home page
    return location.pathname !== '/home';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Navigate when debounced query changes, only if it matches latest input
  useEffect(() => {
    const normalized = debouncedQuery.trim();
    if (normalized && debouncedQuery === searchQuery) {
      navigate(`/search?q=${encodeURIComponent(normalized)}`);
    } else if (!normalized && location.pathname === '/search') {
      // Keep user on search route with empty query
      navigate('/search');
    }
  }, [debouncedQuery, searchQuery, navigate, location.pathname]);

  // Removed auto-leave behavior to keep user on the same page when query clears

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 h-16 flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Page Title */}
        <div className="flex items-center space-x-4 min-w-0 flex-shrink-0">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center space-x-2 transition-colors w-8 h-8 flex-shrink-0 ${
              showBackButton() 
                ? 'text-gray-600 hover:text-gray-900' 
                : 'text-transparent pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 whitespace-nowrap">{getPageTitle()}</h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="input-search"
            />
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center space-x-2 flex-shrink-0" style={{ gap: '12px' }}>
          {/* Pro Subscription Button */}
          <button 
            onClick={() => navigate('/premium')}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-sm"
            style={{ marginRight: 6 }}
          >
            <Crown className="w-4 h-4" />
            <span className="text-sm font-medium leading-none">Pro</span>
          </button>

          {/* Create New Button with Dropdown */}
          <div className="relative" ref={addMenuRef}>
            <button 
              onClick={() => setShowAddMenu(!showAddMenu)} 
              className="w-10 h-10 rounded-button transition-colors flex items-center justify-center"
              style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Add Menu Dropdown */}
            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-card shadow-lg border border-gray-300 py-2 z-50">
                <CreateTaskModal onModalOpen={() => setShowAddMenu(false)}>
                  <button className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#6B40ED' }}>
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Create Task</p>
                      <p className="text-xs text-gray-500">Create your tasks now</p>
                    </div>
                  </button>
                </CreateTaskModal>
                <CreateTeamModal onModalOpen={() => setShowAddMenu(false)}>
                  <button className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#6B40ED' }}>
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Create Team</p>
                      <p className="text-xs text-gray-500">Create your team now</p>
                    </div>
                  </button>
                </CreateTeamModal>
                <CreateBoardModal onModalOpen={() => setShowAddMenu(false)}>
                  <button className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#6B40ED' }}>
                      <Grid3X3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Create Board</p>
                      <p className="text-xs text-gray-500">Create your board now</p>
                    </div>
                  </button>
                </CreateBoardModal>
                <CreateTimelineModal onModalOpen={() => setShowAddMenu(false)}>
                  <button className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#6B40ED' }}>
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Create Timeline</p>
                      <p className="text-xs text-gray-500">Create your timeline now</p>
                    </div>
                  </button>
                </CreateTimelineModal>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 "></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-card shadow-lg border border-gray-300 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {isAuthenticated ? (
                    notifications.slice(0, 4).map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <div
                          key={notification.id}
                          className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e3d8ff' }}>
                              <Icon className="w-4 h-4" style={{ color: '#6B40ED' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">
                                {notification.message.split('**').map((part, index) => 
                                  index % 2 === 1 ? (
                                    <span key={index} className="text-[#6B40ED] font-medium">{part}</span>
                                  ) : (
                                    part
                                  )
                                )}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a2.5 2.5 0 01-2.5-2.5V6a2.5 2.5 0 012.5-2.5h15a2.5 2.5 0 012.5 2.5v11a2.5 2.5 0 01-2.5 2.5h-15z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg font-medium">No notifications has founded</p>
                      <p className="text-gray-400 text-sm mt-1">You'll get notifications soon</p>
                    </div>
                  )}
                </div>
                {/* See All Button */}
                {isAuthenticated && notifications.length > 0 && (
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/notifications');
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200  transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900">See all</span>
                      <ArrowRight className="w-4 h-4 text-gray-900" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu or Login Button */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1  hover:bg-gray-100 transition-colors"
              >
                <Avatar className="w-8 h-8">
                  {user?.avatarUrl ? (
                    <AvatarImage 
                      src={user.avatarUrl} 
                      alt={user.name || 'User'} 
                      className="w-8 h-8 object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
                    {user ? getInitials(user.name) : 'M'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-card shadow-lg border border-gray-300 py-1 z-50">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-avatar flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-[#6B40ED]" />
                  </div>
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-avatar flex items-center justify-center mr-3">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </div>
                  Settings
                </button>
                <button
                  onClick={() => {
                    navigate('/help-support');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-avatar flex items-center justify-center mr-3">
                    <HelpCircle className="w-4 h-4 text-gray-600" />
                  </div>
                  Help and Support
                </button>
                <button
                  onClick={() => {
                    navigate('/contacts');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-avatar flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  Invite Friends
                </button>
                <button
                  onClick={() => {
                    if (user?.id === 'guest') {
                      setShowUserMenu(false);
                      if (onNavigateToLogin) {
                        onNavigateToLogin();
                      } else {
                        navigate('/login');
                      }
                    } else {
                      onLogout();
                    }
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className={`w-8 h-8 rounded-avatar flex items-center justify-center mr-3 ${
                    user?.id === 'guest' ? 'bg-primary-100' : 'bg-red-100'
                  }`}>
                    {user?.id === 'guest' ? (
                      <User className="w-4 h-4 text-primary-700" />
                    ) : (
                      <LogOut className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  {user?.id === 'guest' ? 'Login' : 'Logout'}
                </button>
              </div>
            )}
          </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={onNavigateToLogin}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-button hover:bg-gray-100 transition-colors"
              >
                Login
              </button>
              <button
                onClick={onNavigateToSignup}
                className="px-4 py-2 rounded-button hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

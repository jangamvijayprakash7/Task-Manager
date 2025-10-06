import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Plus, 
  MoreVertical, 
  Clock, 
  AlertTriangle, 
  Zap,
  User,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  UserPlus,
  Settings,
  Users,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { getInitials } from '../ui/Avatar';
import { AvatarImage } from '../ui/AvatarImage';
import { CreateTaskModal } from '../modals/CreateTaskModal';
import { CreateTeamModal } from '../modals/CreateTeamModal';
import { StackedBoardsIcon } from '../ui/StackedBoardsIcon';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyTasks } from '../empty-states/EmptyTasks';
import { EmptyTeams } from '../empty-states/EmptyTeams';
import { getUserDisplayName } from '../../utils/userDisplay';
import { useToast } from '../../contexts/ToastContext';

export const Home: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { error } = useToast();
  const [activeTab, setActiveTab] = useState('');
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  
  // Check if user is a guest or not authenticated
  const isGuest = currentUser?.id === 'guest';
  const shouldShowData = isAuthenticated && !isGuest;
  
  // Get display name for the user
  const displayName = getUserDisplayName(currentUser);

  const handleGuestRestriction = () => {
    error(
      'Login Required',
      'Please login to access this feature. You can login using the login button in the profile dropdown.'
    );
  };

  const handleSetupAccount = () => {
    if (isGuest) {
      handleGuestRestriction();
    } else {
      navigate('/profile');
    }
  };
  
  // Refs for dropdowns
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key]?.contains(event.target as Node)) {
          setOpenDropdowns(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [tasks, setTasks] = useState(shouldShowData ? [
    {
      id: 1,
      title: "Complete UX for new landing page",
      date: "30 Aug 2022 - 11:30AM",
      tag: "UX",
      completed: false
    },
    {
      id: 2,
      title: "Hire Web3 Developer to finish web3 related functi...",
      date: "25 Aug 2022 - 11:30AM",
      tag: "No Tag",
      completed: false
    },
    {
      id: 3,
      title: "Zoom call with developers team, finalize features fo...",
      date: "25 Aug 2022 - 10AM",
      tag: "Developers",
      completed: false
    },
    {
      id: 4,
      title: "Finalize the mobile app screens with designers",
      date: "25 Aug 2022 - 9:30AM",
      tag: "Design Tag",
      completed: false
    }
  ] : []);

  const announcements = shouldShowData ? [
    {
      id: 1,
      title: "We have fixed our app's bugs based on test res...",
      date: "25 Aug 2022 - 11:30AM",
      author: "Anderson",
      authorAvatar: "A",
      authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
      type: "text"
    },
    {
      id: 2,
      title: "Feature 1: Login and signup screen",
      description: "This screens having some minor issues, which stop u...",
      type: "feature"
    },
    {
      id: 3,
      title: "Feature 2: Payment page not working",
      description: "Our old payment page can't charge users payment in...",
      type: "feature"
    },
    {
      id: 4,
      title: "Welcome New HR to our team",
      date: "24 Aug 2022 - 12:00PM",
      author: "Emily",
      authorAvatar: "E",
      authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
      type: "text"
    },
    {
      id: 5,
      title: "UX research phase 1 is done, UI designers Sta...",
      date: "16 Aug 2022 - 11:30AM",
      author: "Juliana",
      authorAvatar: "J",
      authorImage: "https://randomuser.me/api/portraits/women/68.jpg",
      type: "text"
    }
  ] : [];

  const teams = shouldShowData ? [
    {
      id: 1,
      name: "John's Team",
      members: 2,
      avatar: "J",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      id: 2,
      name: "UX designers",
      members: 45,
      avatar: null
    },
    {
      id: 3,
      name: "Juliana's Team",
      members: 5,
      avatar: "J",
      image: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      id: 4,
      name: "Senior Developers",
      members: 23,
      avatar: null
    },
    {
      id: 5,
      name: "Anderson's Team",
      members: 3,
      avatar: "A",
      image: "https://randomuser.me/api/portraits/men/45.jpg"
    }
  ] : [];

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'UX':
        return 'bg-blue-100 text-blue-800';
      case 'Developers':
        return 'bg-green-100 text-green-800';
      case 'Design Tag':
        return 'bg-[#6B40ED]/10 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gray-100 rounded-card p-6 min-h-[80px]">
        <div className="flex items-center justify-between">
          <div>
            {isGuest ? (
              <>
                <h2 className="text-lg font-semibold text-gray-900">Welcome, Guest User!</h2>
                <p className="text-gray-600">You're exploring the app as a guest. Create an account to save your data.</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900">Hi {displayName}, You are almost done.</h2>
                <p className="text-gray-600">Please complete few steps to setup your account completly.</p>
              </>
            )}
          </div>
          <button 
            onClick={handleSetupAccount}
            className="px-4 py-2 rounded-button transition-colors hover:opacity-80" 
            style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}
          >
            Setup Account &gt;
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{isGuest ? '0' : '10.2K'}</p>
              </div>
              <div className="p-3 border-2 rounded-full" style={{ borderColor: '#6B40ED' }}>
                <CheckCircle className="w-6 h-6" style={{ color: '#6B40ED' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{isGuest ? '0' : '3.4K'}</p>
              </div>
              <div className="p-3 border-2 rounded-full" style={{ borderColor: '#6B40ED' }}>
                <Users className="w-6 h-6" style={{ color: '#6B40ED' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">All Boards</p>
                <p className="text-2xl font-bold text-gray-900">{isGuest ? '0' : '450'}</p>
              </div>
              <div className="p-3 border-2 rounded-full" style={{ borderColor: '#6B40ED' }}>
                <StackedBoardsIcon className="w-6 h-6" style={{ color: '#6B40ED' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{isGuest ? '0' : '23'}</p>
              </div>
              <div className="p-3 border-2 rounded-full" style={{ borderColor: '#6B40ED' }}>
                <Calendar className="w-6 h-6" style={{ color: '#6B40ED' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Priorities Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tasks Priorities</h3>
                <p className="text-sm text-gray-600">Team tasks sorted by priority</p>
              </div>
              <div className="flex items-center space-x-2">
                <CreateTaskModal>
                  <button className="text-white px-3 py-1 text-sm rounded-lg hover:opacity-80 transition-colors" style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}>
                    + Task
                  </button>
                </CreateTaskModal>
                <div className="relative" ref={el => { dropdownRefs.current['tasks-priorities-section'] = el; }}>
                  <button 
                    onClick={() => toggleDropdown('tasks-priorities-section')}
                    className="p-1 hover:bg-gray-100"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {/* Tasks Priorities Section Dropdown */}
                  {openDropdowns['tasks-priorities-section'] && (
                    <div className="absolute right-0 mt-1 w-48 bg-white  shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={() => {
                          // Handle sort by priority
                          setOpenDropdowns(prev => ({ ...prev, 'tasks-priorities-section': false }));
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 text-gray-500 mr-2" />
                        Sort by Priority
                      </button>
                      <button
                        onClick={() => {
                          // Handle filter tasks
                          setOpenDropdowns(prev => ({ ...prev, 'tasks-priorities-section': false }));
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 text-gray-500 mr-2" />
                        Filter Tasks
                      </button>
                      <button
                        onClick={() => {
                          // Handle view settings
                          setOpenDropdowns(prev => ({ ...prev, 'tasks-priorities-section': false }));
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 text-gray-500 mr-2" />
                        View Settings
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveTab('upcoming')}
                    className={`px-3 py-1 text-sm font-medium rounded-lg ${
                  activeTab === 'upcoming'
                    ? 'bg-[#6B40ED]/10 text-[#6B40ED]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isGuest ? '0' : '4'} Upcoming
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`px-3 py-1 text-sm font-medium rounded-lg ${
                  activeTab === 'overdue'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isGuest ? '0' : '2'} Overdue
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1 text-sm font-medium rounded-lg ${
                  activeTab === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                0 Completed
              </button>
            </div>

            {/* Task List */}
            {tasks.length === 0 ? (
              <EmptyTasks onCreateTask={() => {}} />
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 ">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {
                      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                    }}
                    className="w-4 h-4 rounded-sm border-gray-300 focus:ring-2"
                    style={{ accentColor: '#6B40ED' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-lg ${getTagColor(task.tag)}`}>
                    {task.tag}
                  </span>
                  <div className="relative" ref={el => { dropdownRefs.current[`task-${task.id}`] = el; }}>
                    <button 
                      onClick={() => toggleDropdown(`task-${task.id}`)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    {/* Task Dropdown Menu */}
                    {openDropdowns[`task-${task.id}`] && (
                      <div className="absolute right-0 mt-1 w-40 bg-white  shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => {
                            // Handle edit task
                            setOpenDropdowns(prev => ({ ...prev, [`task-${task.id}`]: false }));
                          }}
                          className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4 text-gray-500 mr-2" />
                          Edit Task
                        </button>
                        <button
                          onClick={() => {
                            // Handle delete task
                            setOpenDropdowns(prev => ({ ...prev, [`task-${task.id}`]: false }));
                          }}
                          className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 mr-2" />
                          Delete Task
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Announcements Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
                <p className="text-sm text-gray-600">From personal and team project</p>
              </div>
              <div className="relative" ref={el => { dropdownRefs.current['announcements-section'] = el; }}>
                <button 
                  onClick={() => toggleDropdown('announcements-section')}
                  className="p-1 hover:bg-gray-100"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
                
                {/* Announcements Section Dropdown */}
                {openDropdowns['announcements-section'] && (
                  <div className="absolute right-0 mt-1 w-48 bg-white  shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        // Handle filter announcements
                        setOpenDropdowns(prev => ({ ...prev, 'announcements-section': false }));
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 text-gray-500 mr-2" />
                      Filter Announcements
                    </button>
                    <button
                      onClick={() => {
                        // Handle mark all as read
                        setOpenDropdowns(prev => ({ ...prev, 'announcements-section': false }));
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CheckCircle className="w-4 h-4 text-gray-500 mr-2" />
                      Mark All as Read
                    </button>
                    <button
                      onClick={() => {
                        // Handle view all
                        setOpenDropdowns(prev => ({ ...prev, 'announcements-section': false }));
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 text-gray-500 mr-2" />
                      View All
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {announcements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements</h3>
                <p className="text-gray-600 text-center">You'll see team announcements and updates here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 ">
                  {announcement.type === 'text' ? (
                    <AvatarImage 
                      src={announcement.authorImage || undefined}
                      alt={announcement.author || 'Unknown'}
                      fallback={announcement.authorAvatar || '?'}
                      size="md"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e3d8ff' }}>
                      <Zap className="w-4 h-4" style={{ color: '#6B40ED' }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                    {announcement.description && (
                      <p className="text-xs text-gray-600 mt-1">{announcement.description}</p>
                    )}
                    {announcement.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {announcement.date}
                        {announcement.author && `, From ${announcement.author}`}
                      </p>
                    )}
                  </div>
                  <div className="relative" ref={el => { dropdownRefs.current[`announcement-${announcement.id}`] = el; }}>
                    <button 
                      onClick={() => toggleDropdown(`announcement-${announcement.id}`)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    {/* Announcement Dropdown Menu */}
                    {openDropdowns[`announcement-${announcement.id}`] && (
                      <div className="absolute right-0 mt-1 w-32 bg-white  shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => {
                            // Handle like
                            setOpenDropdowns(prev => ({ ...prev, [`announcement-${announcement.id}`]: false }));
                          }}
                          className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ThumbsUp className="w-4 h-4 text-gray-500 mr-2" />
                          Like
                        </button>
                        <button
                          onClick={() => {
                            // Handle dislike
                            setOpenDropdowns(prev => ({ ...prev, [`announcement-${announcement.id}`]: false }));
                          }}
                          className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ThumbsDown className="w-4 h-4 text-gray-500 mr-2" />
                          Dislike
                        </button>
                        <button
                          onClick={() => {
                            // Handle respond
                            setOpenDropdowns(prev => ({ ...prev, [`announcement-${announcement.id}`]: false }));
                          }}
                          className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <MessageCircle className="w-4 h-4 text-gray-500 mr-2" />
                          Respond
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Teams Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Teams</h3>
              <p className="text-sm text-gray-600">Teams with assigned tasks</p>
            </div>
            <div className="flex items-center space-x-2">
              <CreateTeamModal>
                <button className="text-white px-3 py-1 text-sm rounded-lg hover:opacity-80 transition-colors" style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}>
                  + Team
                </button>
              </CreateTeamModal>
              <div className="relative" ref={el => { dropdownRefs.current['my-teams-section'] = el; }}>
                <button 
                  onClick={() => toggleDropdown('my-teams-section')}
                  className="p-1 hover:bg-gray-100"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
                
                {/* My Teams Section Dropdown */}
                {openDropdowns['my-teams-section'] && (
                  <div className="absolute right-0 mt-1 w-48 bg-white  shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        // Handle view all teams
                        setOpenDropdowns(prev => ({ ...prev, 'my-teams-section': false }));
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 text-gray-500 mr-2" />
                      View All Teams
                    </button>
                    <button
                      onClick={() => {
                        // Handle team settings
                        setOpenDropdowns(prev => ({ ...prev, 'my-teams-section': false }));
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 text-gray-500 mr-2" />
                      Team Settings
                    </button>
                    <button
                      onClick={() => {
                        // Handle manage teams
                        setOpenDropdowns(prev => ({ ...prev, 'my-teams-section': false }));
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 text-gray-500 mr-2" />
                      Manage Teams
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <EmptyTeams />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {teams.map((team) => (
              <div key={team.id} className="relative p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="relative" ref={el => { dropdownRefs.current[`team-${team.id}`] = el; }}>
                  <button 
                    onClick={() => toggleDropdown(`team-${team.id}`)}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {/* Team Dropdown Menu */}
                  {openDropdowns[`team-${team.id}`] && (
                    <div className="absolute top-8 right-2 w-40 bg-white  shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={() => {
                          // Handle invite user
                          setOpenDropdowns(prev => ({ ...prev, [`team-${team.id}`]: false }));
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserPlus className="w-4 h-4 text-gray-500 mr-2" />
                        Invite User
                      </button>
                      <button
                        onClick={() => {
                          // Handle edit team
                          setOpenDropdowns(prev => ({ ...prev, [`team-${team.id}`]: false }));
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4 text-gray-500 mr-2" />
                        Edit Team
                      </button>
                      <button
                        onClick={() => {
                          // Handle delete team
                          setOpenDropdowns(prev => ({ ...prev, [`team-${team.id}`]: false }));
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 mr-2" />
                        Delete Team
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center text-center">
                  {team.avatar ? (
                    <AvatarImage 
                      src={team.image}
                      alt={team.name}
                      fallback={team.avatar}
                      size="xl"
                      className="mb-3"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <h4 className="font-medium text-gray-900 text-sm">{team.name}</h4>
                  <p className="text-xs text-gray-500">{team.members} Members</p>
                </div>
              </div>
            ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
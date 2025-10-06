import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Users, 
  FolderOpen, 
  Calendar,
  Activity
} from 'lucide-react';
import { StackedBoardsIcon } from '../ui/StackedBoardsIcon';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { getInitials } from '../ui/Avatar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getTasks, getProjects, getActivities, getTeamMembers } from '../../utils/localStorage';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyDashboard } from '../empty-states/EmptyDashboard';
import { getUserDisplayName } from '../../utils/userDisplay';
import { useToast } from '../../contexts/ToastContext';

export const Dashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { error } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  
  // Check if user is a guest
  const isGuest = currentUser?.id === 'guest';
  const shouldShowData = isAuthenticated && !isGuest;

  const handleSetupAccount = () => {
    if (isGuest) {
      handleGuestRestriction();
    } else {
      navigate('/profile');
    }
  };

  const handleGuestRestriction = () => {
    error(
      'Login Required',
      'Please login to access this feature. You can login using the login button in the profile dropdown.'
    );
  };

  const handleTeamClick = (teamName: string) => {
    if (isGuest) {
      handleGuestRestriction();
    } else {
      // Handle team selection for authenticated users
      setSelectedTeam(teamName);
      console.log(`Selected team: ${teamName}`);
    }
  };

  // Get display name for the user
  const displayName = getUserDisplayName(currentUser);

  // Team performance data
  const teamPerformanceData = {
    'Development team': [
      { month: 'Jan', performance: 85 },
      { month: 'Feb', performance: 90 },
      { month: 'Mar', performance: 88 },
      { month: 'Apr', performance: 92 },
      { month: 'May', performance: 95 },
      { month: 'Jun', performance: 93 },
      { month: 'Jul', performance: 89 },
      { month: 'Aug', performance: 91 },
      { month: 'Sep', performance: 94 },
      { month: 'Oct', performance: 96 },
      { month: 'Nov', performance: 88 },
      { month: 'Dec', performance: 90 }
    ],
    'Digi Marketing team': [
      { month: 'Jan', performance: 70 },
      { month: 'Feb', performance: 75 },
      { month: 'Mar', performance: 80 },
      { month: 'Apr', performance: 85 },
      { month: 'May', performance: 88 },
      { month: 'Jun', performance: 90 },
      { month: 'Jul', performance: 87 },
      { month: 'Aug', performance: 89 },
      { month: 'Sep', performance: 92 },
      { month: 'Oct', performance: 94 },
      { month: 'Nov', performance: 91 },
      { month: 'Dec', performance: 93 }
    ],
    'Product design team': [
      { month: 'Jan', performance: 60 },
      { month: 'Feb', performance: 65 },
      { month: 'Mar', performance: 70 },
      { month: 'Apr', performance: 75 },
      { month: 'May', performance: 78 },
      { month: 'Jun', performance: 80 },
      { month: 'Jul', performance: 82 },
      { month: 'Aug', performance: 85 },
      { month: 'Sep', performance: 87 },
      { month: 'Oct', performance: 89 },
      { month: 'Nov', performance: 86 },
      { month: 'Dec', performance: 88 }
    ],
    'Growth team': [
      { month: 'Jan', performance: 50 },
      { month: 'Feb', performance: 55 },
      { month: 'Mar', performance: 60 },
      { month: 'Apr', performance: 65 },
      { month: 'May', performance: 70 },
      { month: 'Jun', performance: 75 },
      { month: 'Jul', performance: 78 },
      { month: 'Aug', performance: 80 },
      { month: 'Sep', performance: 82 },
      { month: 'Oct', performance: 85 },
      { month: 'Nov', performance: 83 },
      { month: 'Dec', performance: 87 }
    ]
  };

  // Get current performance data based on selected team
  const currentPerformanceData = selectedTeam 
    ? teamPerformanceData[selectedTeam as keyof typeof teamPerformanceData] 
    : [];
  
  // Only load data for authenticated non-guest users
  const tasks = shouldShowData ? getTasks() : [];
  const projects = shouldShowData ? getProjects() : [];
  const activities = shouldShowData ? getActivities() : [];
  const teamMembers = shouldShowData ? getTeamMembers() : [];

  // Calculate statistics to match the image
  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'Done').length;
    const assigned = tasks.filter(t => t.status !== 'Done').length;
    const boards = projects.length;
    const scheduled = tasks.filter(t => t.status !== 'Done' && new Date(t.dueDate) >= new Date()).length;
    
    return { completed, assigned, boards, scheduled };
  }, [tasks, projects]);

  // Generate task progress data for the last 7 days to match the image
  const taskData = useMemo(() => {
    // Generate data for days 19-25 as shown in the image
    const days = [19, 20, 21, 22, 23, 24, 25];
    
    return days.map((day, index) => {
      // Generate some sample data that matches the image trend
      const completed = Math.floor(Math.random() * 5); // 0-4 range as shown in image
      return { name: day.toString(), completed };
    });
  }, []);

  // Project status data to match the image donut chart
  const projectData = useMemo(() => {
    return [
      { name: 'Tasks', value: 45, color: '#7E57C2' },
      { name: 'Completed', value: 30, color: '#9F7AEA' },
      { name: 'Pending', value: 25, color: '#E5E7EB' },
    ];
  }, []);

  // Recent activities
  const recentActivity = useMemo(() => {
    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
      .map(activity => {
        const member = teamMembers.find(m => m.id === activity.userId);
        const timeAgo = new Date(activity.createdAt);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - timeAgo.getTime()) / (1000 * 60 * 60));
        
        return {
          id: activity.id,
          action: activity.description,
          user: member?.name || 'Unknown User',
          time: diffInHours < 1 ? 'Just now' : `${diffInHours} hours ago`,
          avatar: member ? getInitials(member.name) : 'U'
        };
      });
  }, [activities, teamMembers]);

  // Upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= now && dueDate <= nextWeek && task.status !== 'Done';
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3)
      .map(task => {
        const project = projects.find(p => p.id === task.projectId);
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const diffInDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let dueDateText = '';
        if (diffInDays === 0) dueDateText = 'Today';
        else if (diffInDays === 1) dueDateText = 'Tomorrow';
        else dueDateText = dueDate.toLocaleDateString();
        
        return {
          id: task.id,
          title: task.title,
          project: project?.name || 'No Project',
          dueDate: dueDateText,
          priority: task.priority.toLowerCase()
        };
      });
  }, [tasks, projects]);

  // Show empty state for guest users or unauthenticated users
  if (!isAuthenticated || isGuest) {
    return <EmptyDashboard />;
  }

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
            className="px-4 py-2 rounded-button bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
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
                <p className="text-2xl font-bold text-gray-900">10.2K</p>
              </div>
              <div className="p-3 border-2 border-primary-700 rounded-full">
                <CheckCircle className="w-6 h-6 text-primary-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Tasks</p>
                <p className="text-2xl font-bold text-gray-900">3.4K</p>
              </div>
              <div className="p-3 border-2 border-primary-700 rounded-full">
                <Users className="w-6 h-6 text-primary-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">All Boards</p>
                <p className="text-2xl font-bold text-gray-900">450</p>
              </div>
              <div className="p-3 border-2 border-primary-700 rounded-full">
                <StackedBoardsIcon className="w-6 h-6 text-primary-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled Tasks</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <div className="p-3 border-2 border-primary-700 rounded-full">
                <Calendar className="w-6 h-6 text-primary-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Progress Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Total Tasks done</h3>
            <p className="text-sm text-gray-600">Tasks Completed in last 7 days</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 4]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#7E57C2" 
                    strokeWidth={2}
                    dot={{ fill: '#7E57C2' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Status Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Total Tasks done</h3>
            <p className="text-sm text-gray-600">Tasks Completed in last 7 days Bar Chart</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {projectData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 " 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Teams Performance Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">My Teams Performance</h3>
          <p className="text-sm text-gray-600">Teams with tasks graph analysis</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team List */}
            <div className="space-y-2">
              <div 
                className={`p-3 cursor-pointer transition-colors ${
                  selectedTeam === 'Development team' 
                    ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleTeamClick('Development team')}
              >
                <span className="font-medium">Development team</span>
              </div>
              <div 
                className={`p-3 cursor-pointer transition-colors ${
                  selectedTeam === 'Digi Marketing team' 
                    ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleTeamClick('Digi Marketing team')}
              >
                <span className="font-medium">Digi Marketing team</span>
              </div>
              <div 
                className={`p-3 cursor-pointer transition-colors ${
                  selectedTeam === 'Product design team' 
                    ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleTeamClick('Product design team')}
              >
                <span className="font-medium">Product design team</span>
              </div>
              <div 
                className={`p-3 cursor-pointer transition-colors ${
                  selectedTeam === 'Growth team' 
                    ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleTeamClick('Growth team')}
              >
                <span className="font-medium">Growth team</span>
              </div>
            </div>
            
            {/* Performance Chart */}
            <div className="h-64">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700">
                  {selectedTeam ? `${selectedTeam} Performance` : 'Team Performance'}
                </h4>
                <p className="text-xs text-gray-500">
                  {selectedTeam ? 'Monthly performance metrics' : 'Select a team to view performance data'}
                </p>
              </div>
              {selectedTeam ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Performance']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#7E57C2" 
                      strokeWidth={2}
                      dot={{ fill: '#7E57C2', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#7E57C2', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">No team selected</p>
                    <p className="text-xs text-gray-400 mt-1">Click on a team to view its performance</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Check,
  MoreHorizontal,
  ArrowLeft,
  Search,
  Bell,
  Home,
  BarChart3,
  Users,
  FolderOpen,
  MessageSquare,
  Grid3X3
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { CreateTimelineModal } from '../modals/CreateTimelineModal';
import { useToast } from '../../contexts/ToastContext';

export const TimelinePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2022, 9, 21)); // October 2022
  const { success } = useToast();

  const handleTimelineCreated = (timeline: any) => {
    console.log('Timeline created:', timeline);
    success(
      'Timeline Created',
      `${timeline.name} has been added to your timelines.`
    );
  };

  const teamMembers = [
    {
      id: 1,
      name: 'Henry Lucas',
      avatar: 'HL',
      tasks: [
        {
          id: 1,
          title: 'Design UX research for landing page',
          startDate: new Date(2022, 9, 21),
          endDate: new Date(2022, 9, 24),
          completed: true,
          assignee: 'Henry Lucas',
          assigneeAvatar: 'HL'
        },
        {
          id: 2,
          title: 'Start UI design once UX is done',
          startDate: new Date(2022, 9, 24),
          endDate: new Date(2022, 9, 26),
          completed: false,
          assignee: 'Henry Lucas',
          assigneeAvatar: 'HL'
        }
      ]
    },
    {
      id: 2,
      name: 'Johnson Williamson',
      avatar: 'JW',
      tasks: [
        {
          id: 3,
          title: 'Workon Instagram marketing',
          startDate: new Date(2022, 9, 21),
          endDate: new Date(2022, 9, 24),
          completed: false,
          assignee: 'Johnson Williamson',
          assigneeAvatar: 'JW'
        },
        {
          id: 4,
          title: 'Facebook and instagram ads for new mobile app',
          startDate: new Date(2022, 9, 24),
          endDate: new Date(2022, 9, 26),
          completed: false,
          assignee: 'Johnson Williamson',
          assigneeAvatar: 'JW'
        }
      ]
    },
    {
      id: 3,
      name: 'Charlotte Amelia',
      avatar: 'CA',
      tasks: [
        {
          id: 5,
          title: 'Design Marketing Graphics',
          startDate: new Date(2022, 9, 24),
          endDate: new Date(2022, 9, 26),
          completed: false,
          assignee: 'Charlotte Amelia',
          assigneeAvatar: 'CA'
        }
      ]
    },
    {
      id: 4,
      name: 'Olivia Thomas',
      avatar: 'OT',
      tasks: [
        {
          id: 6,
          title: 'Develope Mobile app V1',
          startDate: new Date(2022, 9, 21),
          endDate: new Date(2022, 9, 24),
          completed: false,
          assignee: 'Olivia Thomas',
          assigneeAvatar: 'OT'
        },
        {
          id: 7,
          title: 'Test mobile app with our customers',
          startDate: new Date(2022, 9, 24),
          endDate: new Date(2022, 9, 26),
          completed: false,
          assignee: 'Olivia Thomas',
          assigneeAvatar: 'OT'
        }
      ]
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short'
    });
  };

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} to ${end}, 2022`;
  };

  const getDaysInRange = () => {
    const days = [];
    for (let day = 21; day <= 26; day++) {
      days.push(day);
    }
    return days;
  };

  const getTaskPosition = (task: any) => {
    const startDay = task.startDate.getDate();
    const endDay = task.endDate.getDate();
    const startIndex = startDay - 21; // 21 is the first day
    const span = endDay - startDay + 1;
    return { startIndex, span };
  };

  const hasConnection = (task: any, memberIndex: number) => {
    // Check if this task should have a connection line
    if (task.id === 1) return true; // Henry's first task connects to second
    if (task.id === 3) return true; // Johnson's first task connects to both subsequent tasks
    if (task.id === 6) return true; // Olivia's first task connects to second
    return false;
  };

  const getConnectionTarget = (task: any) => {
    if (task.id === 1) return { memberIndex: 0, taskIndex: 1 }; // Henry's first to second
    if (task.id === 3) return { memberIndex: 1, taskIndex: 1 }; // Johnson's first to second task
    if (task.id === 6) return { memberIndex: 3, taskIndex: 1 }; // Olivia's first to second
    return null;
  };

  const getConnectionPath = (task: any) => {
    if (task.id === 1) return "M0 16 Q16 8 32 16"; // Straight line for Henry
    if (task.id === 3) return "M0 16 Q16 8 32 16"; // Curved line for Johnson
    if (task.id === 6) return "M0 16 Q16 8 32 16"; // Straight line for Olivia
    return "M0 16 Q16 8 32 16";
  };

  return (
    <div className="w-full h-screen bg-white overflow-hidden" style={{ width: '1440px', height: '929px' }}>
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back arrow and Timeline */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-lg font-medium">Timeline</span>
            </button>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300  focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Right: Plus, Bell, Avatar */}
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 bg-purple-600 text-white  hover:bg-purple-700 transition-colors flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </button>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-purple-100 text-purple-700 text-sm">
                M
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Timeline</h1>
            <p className="text-gray-600">Create and complete tasks using boards</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Date Selector */}
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300  hover:bg-gray-50">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Nov, 2022</span>
            </button>

            {/* Action Buttons */}
            <button className="bg-purple-50 text-purple-600 px-4 py-2  hover:bg-purple-100 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Invite</span>
            </button>
            
            <CreateTimelineModal onTimelineCreated={handleTimelineCreated}>
              <button className="bg-black text-white px-4 py-2  hover:bg-gray-800 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Timeline</span>
              </button>
            </CreateTimelineModal>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="bg-white  border border-gray-200 overflow-hidden">
          {/* Date Headers */}
          <div className="grid grid-cols-6 border-b border-gray-200">
            <div className="p-4 border-r border-gray-200"></div> {/* Empty cell for member names */}
            {getDaysInRange().map((day) => (
              <div key={day} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                <div className="text-lg font-semibold text-gray-900">{day}</div>
                <div className="w-full h-px bg-gray-300 mt-2"></div>
              </div>
            ))}
          </div>

          {/* Team Member Rows */}
          {teamMembers.map((member, memberIndex) => (
            <div key={member.id} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0 min-h-[120px]">
              {/* Member Info */}
              <div className="p-4 border-r border-gray-200 flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-sm">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-900">{member.name}</span>
                <button className="ml-auto">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Task Timeline */}
              <div className="col-span-5 relative p-2">
                <div className="grid grid-cols-5 h-full relative">
                  {/* Grid lines */}
                  {getDaysInRange().slice(0, -1).map((_, index) => (
                    <div key={index} className="border-r border-gray-200"></div>
                  ))}
                  
                  {/* Tasks */}
                  {member.tasks.map((task, taskIndex) => {
                    const { startIndex, span } = getTaskPosition(task);
                    const connectionTarget = getConnectionTarget(task);
                    
                    // Calculate vertical position for multiple tasks - match the exact design
                    let topPosition = 8;
                    if (memberIndex === 1 && taskIndex === 2) { // Johnson's third task (Design Marketing Graphics)
                      topPosition = 68; // Position it below the second task
                    } else if (taskIndex > 0) {
                      topPosition = taskIndex * 60 + 8;
                    }
                    
                    return (
                      <div key={task.id} className="relative">
                        {/* Task Card */}
                        <div
                          className="absolute bg-white border border-gray-200  p-3 shadow-sm hover:shadow-md transition-shadow"
                          style={{
                            left: `${(startIndex * 100) / 5}%`,
                            width: `calc(${(span * 100) / 5}% - 8px)`,
                            top: `${topPosition}px`,
                            marginLeft: '4px',
                            marginRight: '4px'
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <button className={`w-4 h-4 border-2 flex items-center justify-center ${
                              task.completed 
                                ? 'bg-purple-600 border-purple-600' 
                                : 'border-gray-300'
                            }`}>
                              {task.completed && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </button>
                            <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                              {task.title}
                            </span>
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                                {task.assigneeAvatar}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDateRange(task.startDate, task.endDate)}
                          </div>
                        </div>

                        {/* Connection Line */}
                        {hasConnection(task, memberIndex) && connectionTarget && (
                          <div 
                            className="absolute left-full w-8 h-8 pointer-events-none"
                            style={{ top: `${topPosition + 20}px` }}
                          >
                            <svg className="w-full h-full" viewBox="0 0 32 32">
                              <path
                                d={getConnectionPath(task)}
                                stroke="#8B5CF6"
                                strokeWidth="2"
                                fill="none"
                                className="opacity-60"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center text-gray-600">
          <span>Add more members by </span>
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            +Inviting
          </button>
          <span> and assign task to anyone.</span>
        </div>
      </div>
    </div>
  );
};

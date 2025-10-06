import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  MoreVertical, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  User,
  Users,
  Calendar,
  LayoutGrid
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { StackedBoardsIcon } from '../ui/StackedBoardsIcon';

export const EmptyHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gray-100  p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Hi Guest User!, You are almost done.</h2>
            <p className="text-gray-600">Please complete few steps to setup your account completly.</p>
          </div>
          <button className="px-4 py-2  hover:opacity-80 transition-opacity" style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}>
            Setup Account &gt;
          </button>
        </div>
      </div>

      {/* Stats Cards - All showing 0 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 border-2 border-[#6B40ED] rounded-full">
                <CheckCircle className="w-6 h-6 text-[#6B40ED]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Tasks</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 border-2 border-[#6B40ED] rounded-full">
                <Users className="w-6 h-6 text-[#6B40ED]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">All Boards</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 border-2 border-[#6B40ED] rounded-full">
                <LayoutGrid className="w-6 h-6 text-[#6B40ED]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled Tasks</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 border-2 border-[#6B40ED] rounded-full">
                <Calendar className="w-6 h-6 text-[#6B40ED]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Priorities Section - Empty */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tasks Priorities</h3>
                <p className="text-sm text-gray-600">Team tasks sorted by priority</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1  text-sm hover:opacity-80 transition-opacity" style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}>
                  + Task
                </button>
                <button className="p-1 hover:bg-gray-100">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-1  text-sm font-medium ${
                  activeTab === 'upcoming'
                    ? 'bg-[#6B40ED]/10 text-[#6B40ED]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                0 Upcoming
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`px-3 py-1  text-sm font-medium ${
                  activeTab === 'overdue'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                0 Overdue
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1  text-sm font-medium ${
                  activeTab === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                0 Completed
              </button>
            </div>

            {/* Empty Task List */}
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100  flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No tasks has founded</p>
              <p className="text-gray-400 text-sm mt-1">
                Click to add <span className="underline cursor-pointer" style={{ color: '#6B40ED' }}>New task</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Section - Empty */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
                <p className="text-sm text-gray-600">From personal and team project</p>
              </div>
              <button className="p-1 hover:bg-gray-100">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100  flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No tasks has founded</p>
              <p className="text-gray-400 text-sm mt-1">
                Click to add <span className="underline cursor-pointer" style={{ color: '#6B40ED' }}>New task</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Teams Section - Empty */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Teams</h3>
              <p className="text-sm text-gray-600">Teams with assigned tasks</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1  text-sm hover:opacity-80 transition-opacity" style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}>
                + Team
              </button>
              <button className="p-1 hover:bg-gray-100">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            {/* Team placeholder cards */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-24 h-32 bg-gray-100  border-2 border-gray-200 flex flex-col items-center justify-center p-4">
                <Avatar className="w-12 h-12 mb-2">
                  <AvatarFallback className="bg-gray-300 text-gray-600">F</AvatarFallback>
                </Avatar>
                <div className="w-full h-2 bg-gray-300 mb-2"></div>
              </div>
              
              <div className="w-24 h-32 bg-white  border-2 border-[#6B40ED] flex flex-col items-center justify-center p-4 relative">
                <Avatar className="w-12 h-12 mb-2">
                  <AvatarFallback className="bg-gray-300 text-gray-600">F</AvatarFallback>
                </Avatar>
                <div className="w-full h-2 bg-gray-300 mb-2"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#6B40ED]  flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <div className="w-24 h-32 bg-gray-100  border-2 border-gray-200 flex flex-col items-center justify-center p-4">
                <Avatar className="w-12 h-12 mb-2">
                  <AvatarFallback className="bg-gray-300 text-gray-600">M</AvatarFallback>
                </Avatar>
                <div className="w-full h-2 bg-gray-300 mb-2"></div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams has created</h3>
            <p className="text-gray-600">
              Click to add <span className="underline cursor-pointer" style={{ color: '#6B40ED' }}>New team</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

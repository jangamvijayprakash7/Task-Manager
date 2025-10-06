import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { CheckCircle, Users, FolderOpen, Calendar, LayoutGrid } from 'lucide-react';
import { StackedBoardsIcon } from '../ui/StackedBoardsIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const EmptyDashboard: React.FC = () => {
  // Empty data for charts
  const emptyTaskData = [
    { name: '19', completed: 0 },
    { name: '20', completed: 0 },
    { name: '21', completed: 0 },
    { name: '22', completed: 0 },
    { name: '23', completed: 0 },
    { name: '24', completed: 0 },
    { name: '25', completed: 0 }
  ];

  const emptyProjectData = [
    { name: 'Tasks', value: 0, color: '#7E57C2' },
    { name: 'Completed', value: 0, color: '#9F7AEA' },
    { name: 'Pending', value: 100, color: '#E5E7EB' },
  ];

  const emptyPerformanceData = [
    { month: 'Jan', performance: 0 },
    { month: 'Feb', performance: 0 },
    { month: 'Mar', performance: 0 },
    { month: 'Apr', performance: 0 },
    { month: 'May', performance: 0 },
    { month: 'Jun', performance: 0 },
    { month: 'Jul', performance: 0 },
    { month: 'Aug', performance: 0 },
    { month: 'Sep', performance: 0 },
    { month: 'Oct', performance: 0 },
    { month: 'Nov', performance: 0 },
    { month: 'Dec', performance: 0 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gray-100 rounded-card p-6 min-h-[80px]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Hi Guest User!, You are almost done.</h2>
            <p className="text-gray-600">Please complete few steps to setup your account completly.</p>
          </div>
          <button className="px-4 py-2 rounded-button transition-colors hover:opacity-80" style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}>
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

      {/* Charts Row - Empty data */}
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
                <LineChart data={emptyTaskData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 4]} />
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
                    data={emptyProjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {emptyProjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {emptyProjectData.map((item) => (
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
              <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <span className="font-medium text-gray-900">Development team</span>
              </div>
              <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <span className="font-medium text-gray-900">Digi Marketing team</span>
              </div>
              <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <span className="font-medium text-gray-900">Product design team</span>
              </div>
              <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <span className="font-medium text-gray-900">Growth team</span>
              </div>
            </div>
            
            {/* Performance Chart - Empty */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emptyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="#7E57C2" 
                    strokeWidth={2}
                    dot={{ fill: '#7E57C2' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

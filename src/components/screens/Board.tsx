import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Rocket,
  Monitor,
  CheckCircle,
  FolderOpen,
  Check,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { CreateBoardTaskModal } from '../modals/CreateBoardTaskModal';

interface Task {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  assigneeAvatar: string;
  dueDate: string;
  isCompleted: boolean;
  status: 'new' | 'working' | 'completed' | 'outdated';
}

export const Board: React.FC = () => {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Create Wireframes',
      description: 'Design 12 screens for first 2days...',
      assignee: 'John Doe',
      assigneeAvatar: 'JD',
      dueDate: '20 Oct, 2022',
      isCompleted: false,
      status: 'new'
    },
    {
      id: '2',
      title: 'Design Marketing Graphics',
      description: 'Instagram graphics need for now',
      assignee: 'Jane Smith',
      assigneeAvatar: 'JS',
      dueDate: '20 Oct, 2022',
      isCompleted: false,
      status: 'new'
    },
    {
      id: '3',
      title: 'Facebook and instagram ads fo...',
      description: 'Start running ads once graphics...',
      assignee: 'Mike Johnson',
      assigneeAvatar: 'MJ',
      dueDate: '20 Oct, 2022',
      isCompleted: false,
      status: 'new'
    },
    {
      id: '4',
      title: 'Develope Mobile app V1',
      description: 'Develope V1 in flutter',
      assignee: 'Alex Brown',
      assigneeAvatar: 'AB',
      dueDate: '20 Oct, 2022',
      isCompleted: false,
      status: 'working'
    },
    {
      id: '5',
      title: 'UX research for new landing page',
      description: 'one page with full content is ne...',
      assignee: 'Sarah Wilson',
      assigneeAvatar: 'SW',
      dueDate: '20 Oct, 2022',
      isCompleted: true,
      status: 'completed'
    },
    {
      id: '6',
      title: 'UI Design for landing page',
      description: 'Design landing page based on w...',
      assignee: 'Tom Davis',
      assigneeAvatar: 'TD',
      dueDate: '20 Oct, 2022',
      isCompleted: true,
      status: 'completed'
    },
    {
      id: '7',
      title: 'User testing for new p',
      description: 'Do user testing for 5 use',
      assignee: 'Chris Lee',
      assigneeAvatar: 'CL',
      dueDate: '20 Oct, 2022',
      isCompleted: false,
      status: 'outdated'
    }
  ]);

  const columns = [
    { 
      id: 'new', 
      title: 'New Tasks', 
      count: 5, 
      icon: Rocket,
      color: 'bg-gray-50'
    },
    { 
      id: 'working', 
      title: 'Working On', 
      count: 1, 
      icon: Monitor,
      color: 'bg-gray-50'
    },
    { 
      id: 'completed', 
      title: 'Completed', 
      count: 2, 
      icon: CheckCircle,
      color: 'bg-gray-50'
    },
    { 
      id: 'outdated', 
      title: 'Outdated', 
      count: 1, 
      icon: FolderOpen,
      color: 'bg-gray-50'
    }
  ];

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDeleteColumn = (columnId: string) => {
    // Delete all tasks in this column
    setTasks(prevTasks => prevTasks.filter(task => task.status !== columnId));
    setSelectedColumn(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks Board</h1>
          <p className="text-gray-600 mt-1">Create and complete tasks using boards</p>
        </div>
        
        <CreateBoardTaskModal>
          <button className="px-6 py-3 rounded-button transition-colors flex items-center space-x-2 hover:opacity-80" style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}>
            <Plus className="w-4 h-4" />
            <span>Add Board</span>
          </button>
        </CreateBoardTaskModal>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const IconComponent = column.icon;
          
          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="bg-white rounded-card border border-gray-300">
                {/* Column Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">{column.title}</h3>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 text-sm font-medium">
                        {columnTasks.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded-button">
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setSelectedColumn(selectedColumn === column.id ? null : column.id)}
                          className="p-1 hover:bg-gray-100 rounded-button"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        {selectedColumn === column.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-card shadow-lg border border-gray-300 py-1 z-50">
                            <button
                              onClick={() => handleDeleteColumn(column.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="p-4 space-y-3 min-h-[500px]">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border border-gray-300 rounded-button p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      {/* Checkbox and Title */}
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => toggleTaskCompletion(task.id)}
                            className="w-4 h-4 rounded-sm border-gray-300 focus:ring-2"
                            style={{ accentColor: '#6B40ED' }}
                          />
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1">
                          {task.title}
                        </h4>
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs text-gray-600 mb-3 ml-7">
                          {task.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between ml-7">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                              {task.assigneeAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-600">{task.dueDate}</span>
                        </div>
                        
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs font-medium">
                          Urgent
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

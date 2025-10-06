import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Calendar,
  MessageSquare,
  Paperclip
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Avatar, AvatarFallback } from '../ui/Avatar';

interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  comments: number;
  attachments: number;
  tags: string[];
}

const mockTasks: KanbanTask[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern and responsive landing page for the new product launch',
    status: 'todo',
    priority: 'high',
    assignee: { name: 'Sarah Johnson', avatar: 'SJ' },
    dueDate: '2024-01-15',
    comments: 3,
    attachments: 2,
    tags: ['Design', 'Frontend']
  },
  {
    id: '2',
    title: 'Fix navigation bug',
    description: 'Resolve the issue with mobile navigation menu not opening properly',
    status: 'in-progress',
    priority: 'medium',
    assignee: { name: 'Mike Chen', avatar: 'MC' },
    dueDate: '2024-01-12',
    comments: 1,
    attachments: 0,
    tags: ['Bug Fix', 'Mobile']
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples and error codes',
    status: 'review',
    priority: 'low',
    assignee: { name: 'Emily Davis', avatar: 'ED' },
    dueDate: '2024-01-10',
    comments: 5,
    attachments: 1,
    tags: ['Documentation', 'API']
  },
  {
    id: '4',
    title: 'User research interviews',
    description: 'Conduct 10 user interviews to gather feedback on the new feature',
    status: 'done',
    priority: 'high',
    assignee: { name: 'Alex Rodriguez', avatar: 'AR' },
    dueDate: '2024-01-08',
    comments: 2,
    attachments: 3,
    tags: ['Research', 'UX']
  },
  {
    id: '5',
    title: 'Database optimization',
    description: 'Optimize database queries to improve application performance',
    status: 'in-progress',
    priority: 'medium',
    assignee: { name: 'David Kim', avatar: 'DK' },
    dueDate: '2024-01-20',
    comments: 0,
    attachments: 0,
    tags: ['Backend', 'Performance']
  }
];

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' }
];

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>(mockTasks);

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const moveTask = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus as any } : task
    ));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, newStatus);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600">Organize tasks by status and priority</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="bg-white  border border-gray-200">
              {/* Column Header */}
              <div className={`p-4  ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-white bg-opacity-50 px-2 py-1  text-sm font-medium">
                      {getTasksByStatus(column.id).length}
                    </span>
                    <button className="p-1 hover:bg-white hover:bg-opacity-50">
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div 
                className="p-4 space-y-3 min-h-[400px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {getTasksByStatus(column.id).map(task => (
                  <div
                    key={task.id}
                    className="cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e: React.DragEvent) => handleDragStart(e, task.id)}
                  >
                    <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Task Header */}
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight">
                            {task.title}
                          </h4>
                          <button className="p-1 hover:bg-gray-100">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {task.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map(tag => (
                            <span 
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs "
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Task Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                                {task.assignee.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">
                              {task.assignee.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium  ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>

                        {/* Task Meta */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            {task.comments > 0 && (
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{task.comments}</span>
                              </div>
                            )}
                            {task.attachments > 0 && (
                              <div className="flex items-center space-x-1">
                                <Paperclip className="w-3 h-3" />
                                <span>{task.attachments}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    </Card>
                  </div>
                ))}

                {/* Empty State */}
                {getTasksByStatus(column.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-12 h-12 bg-gray-100  flex items-center justify-center mx-auto mb-2">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

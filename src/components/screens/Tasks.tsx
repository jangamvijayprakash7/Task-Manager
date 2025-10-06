import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Filter, 
  Search, 
  MoreVertical,
  Calendar,
  User,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Edit,
  Trash2,
  List,
  Kanban
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { getInitials } from '../ui/Avatar';
import { CreateTaskModal } from '../modals/CreateTaskModal';
import { EditTaskModal } from '../modals/EditTaskModal';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';
import { CommentsModal } from '../modals/CommentsModal';
import { FileUploadModal } from '../modals/FileUploadModal';
import { Task, TeamMember } from '../../types';
import { getTasks, getTeamMembers, getProjects, setTasks } from '../../utils/localStorage';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyTasks } from '../empty-states/EmptyTasks';
import { useToast } from '../../contexts/ToastContext';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

const statusColors = {
  'To Do': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Done': 'bg-green-100 text-green-800'
};

const priorityColors = {
  'Low': 'bg-green-100 text-green-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-red-100 text-red-800'
};

export const Tasks: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { success } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Check if user is a guest
  const isGuest = currentUser?.id === 'guest';
  const shouldShowData = isAuthenticated && !isGuest;
  
  const [tasks, setTasksState] = useState<Task[]>(shouldShowData ? getTasks() : []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const debouncedSearch = useDebouncedValue(searchQuery, 400);

  const teamMembers = shouldShowData ? getTeamMembers() : [];
  const projects = shouldShowData ? getProjects() : [];

  // Check if we should show create modal from URL params
  React.useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           task.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, debouncedSearch, statusFilter, priorityFilter]);

  const getStatusCount = (status: string) => {
    return tasks.filter(task => task.status === status).length;
  };

  const getMemberName = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member?.name || 'Unknown';
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'No Project';
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasksState([...tasks, newTask]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasksState(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasksState(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newStatus: 'To Do' | 'In Progress' | 'Done' = task.status === 'Done' ? 'To Do' : 'Done';
        return {
          ...task,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    });
    setTasksState(updatedTasks);
    setTasks(updatedTasks);
  };

  const showEmpty = !isAuthenticated || isGuest || tasks.length === 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage and track your tasks</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-button p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-3 py-1 rounded-button text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-2 px-3 py-1 rounded-button text-sm font-medium transition-colors ${
                viewMode === 'kanban' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban</span>
            </button>
          </div>
          
          <CreateTaskModal onTaskCreated={handleTaskCreated}>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </Button>
          </CreateTaskModal>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <CheckSquare className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">To Do</p>
                <p className="text-xl font-bold text-gray-900">{getStatusCount('To Do')}</p>
              </div>
              <div className="w-6 h-6 bg-gray-200"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-xl font-bold text-gray-900">{getStatusCount('In Progress')}</p>
              </div>
              <div className="w-6 h-6 bg-blue-200"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">{getStatusCount('Done')}</p>
              </div>
              <div className="w-6 h-6 bg-green-200"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300  focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilterModal(true)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Radio Filters */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Status:</span>
          {['all','To Do','In Progress','Done'].map(opt => (
            <label key={opt} className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="statusFilter"
                value={opt}
                checked={statusFilter === opt}
                onChange={() => setStatusFilter(opt)}
                className="w-4 h-4"
                style={{ accentColor: '#6B40ED' }}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Priority:</span>
          {['all','Low','Medium','High'].map(opt => (
            <label key={opt} className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="priorityFilter"
                value={opt}
                checked={priorityFilter === opt}
                onChange={() => setPriorityFilter(opt as 'all' | 'Low' | 'Medium' | 'High')}
                className="w-4 h-4"
                style={{ accentColor: '#6B40ED' }}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Task List */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {showEmpty ? (
            <EmptyTasks onCreateTask={() => setShowCreateModal(true)} />
          ) : filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first task'
                  }
                </p>
                {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && (
                  <CreateTaskModal onTaskCreated={handleTaskCreated}>
                    <Button>Create Task</Button>
                  </CreateTaskModal>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-1 w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                        task.status === 'Done'
                          ? 'bg-primary-700 border-primary-700 text-white'
                          : 'border-gray-300 hover:border-primary-500'
                      }`}
                    >
                      {task.status === 'Done' && (
                        <CheckSquare className="w-3 h-3" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-medium ${
                            task.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{task.description}</p>
                          
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <User className="w-4 h-4" />
                              <span>{task.assignees.map(getMemberName).join(', ') || 'Unassigned'}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <span>{getProjectName(task.projectId)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-2 py-1 text-xs font-medium  ${statusColors[task.status]}`}>
                            {task.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium  ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <button 
                            onClick={() => {
                              setSelectedTask(task);
                              setShowCommentsModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Comments"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedTask(task);
                              setShowFileUploadModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Attach Files"
                          >
                            <Paperclip className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button 
                              onClick={() => setSelectedTask(task)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {selectedTask?.id === task.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white  shadow-lg border border-gray-200 py-1 z-50">
                                <button
                                  onClick={() => {
                                    setShowEditModal(true);
                                    setSelectedTask(task);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setShowDeleteModal(true);
                                    setSelectedTask(task);
                                  }}
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
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{status}</h3>
                <span className="text-sm text-gray-500">
                  {filteredTasks.filter(task => task.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {filteredTasks
                  .filter(task => task.status === status)
                  .map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs font-medium  ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <div className="flex items-center space-x-1">
                            {task.assignees.slice(0, 2).map((memberId) => {
                              const member = teamMembers.find(m => m.id === memberId);
                              return (
                                <Avatar key={memberId} className="w-6 h-6">
                                  <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                                    {member ? getInitials(member.name) : 'U'}
                                  </AvatarFallback>
                                </Avatar>
                              );
                            })}
                            {task.assignees.length > 2 && (
                              <span className="text-xs text-gray-500">+{task.assignees.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        task={selectedTask}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onTaskUpdated={handleTaskUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={() => {
          if (selectedTask) {
            handleTaskDeleted(selectedTask.id);
            setTasks(tasks.filter(task => task.id !== selectedTask.id));
          }
        }}
        title="Delete Task"
        description="This action cannot be undone. This will permanently delete the task."
        itemName={selectedTask?.title || ''}
      />

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        taskTitle={selectedTask?.title || ''}
      />

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
        onUpload={(files) => {
          console.log('Files uploaded:', files);
          success('Files Uploaded', `${files.length} files uploaded successfully!`);
        }}
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  Users, 
  TrendingUp,
  FolderOpen,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { getInitials } from '../ui/Avatar';
import { Input } from '../ui/Input';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { EditProjectModal } from '../modals/EditProjectModal';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';
import { Project, TeamMember, Task } from '../../types';
import { getProjects, getTeamMembers, getTasks, setProjects } from '../../utils/localStorage';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyProjects } from '../empty-states/EmptyProjects';

const statusColors = {
  'Planning': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'On Hold': 'bg-gray-100 text-gray-800'
};

export const Projects: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Check if user is a guest
  const isGuest = currentUser?.id === 'guest';
  const shouldShowData = isAuthenticated && !isGuest;
  
  const [projects, setProjectsState] = useState<Project[]>(shouldShowData ? getProjects() : []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  const teamMembers = shouldShowData ? getTeamMembers() : [];
  const tasks = shouldShowData ? getTasks() : [];

  const getStatusCount = (status: string) => {
    return projects.filter(project => project.status === status).length;
  };

  const getTotalProgress = () => {
    if (projects.length === 0) return 0;
    const totalProgress = projects.reduce((sum, project) => {
      const projectTasks = tasks.filter(task => task.projectId === project.id);
      const completedTasks = projectTasks.filter(task => task.status === 'Done').length;
      const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
      return sum + progress;
    }, 0);
    return Math.round(totalProgress / projects.length);
  };

  const getProjectProgress = (project: Project) => {
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const completedTasks = projectTasks.filter(task => task.status === 'Done').length;
    return projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
  };

  const getProjectTasks = (project: Project) => {
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const completedTasks = projectTasks.filter(task => task.status === 'Done').length;
    return { total: projectTasks.length, completed: completedTasks };
  };

  const getTeamMembersForProject = (project: Project) => {
    // For now, we'll use all team members since we don't have memberIds in the Project interface
    // In a real app, you'd have a proper team assignment system
    return teamMembers.slice(0, 3); // Show first 3 members as example
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjectsState([...projects, newProject]);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjectsState(projects.map(project => project.id === updatedProject.id ? updatedProject : project));
  };

  const handleProjectDeleted = (projectId: string) => {
    setProjectsState(projects.filter(project => project.id !== projectId));
  };

  const handleViewTasks = (project: Project) => {
    navigate(`/tasks?project=${project.id}`);
  };

  // Show empty state for guest users or when no projects
  if (!isAuthenticated || isGuest || projects.length === 0) {
    return <EmptyProjects onCreateProject={() => setShowCreateModal(true)} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your projects and track progress</p>
        </div>
        <CreateProjectModal onProjectCreated={handleProjectCreated}>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </Button>
        </CreateProjectModal>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <FolderOpen className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planning</p>
                <p className="text-xl font-bold text-gray-900">{getStatusCount('Planning')}</p>
              </div>
              <div className="w-6 h-6 bg-yellow-200"></div>
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
                <p className="text-xl font-bold text-gray-900">{getStatusCount('Completed')}</p>
              </div>
              <div className="w-6 h-6 bg-green-200"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-xl font-bold text-gray-900">{getTotalProgress()}%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first project</p>
            <CreateProjectModal onProjectCreated={handleProjectCreated}>
              <Button>Create Project</Button>
            </CreateProjectModal>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const projectTasks = getProjectTasks(project);
            const projectProgress = getProjectProgress(project);
            const teamMembers = getTeamMembersForProject(project);
            
            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {selectedProject?.id === project.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white  shadow-lg border border-gray-200 py-1 z-50">
                          <button
                            onClick={() => handleViewTasks(project)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Tasks
                          </button>
                          <button
                            onClick={() => {
                              setShowEditModal(true);
                              setSelectedProject(project);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteModal(true);
                              setSelectedProject(project);
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{projectProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200  h-2">
                        <div
                          className="bg-primary-700 h-2  transition-all duration-300"
                          style={{ width: `${projectProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status and Due Date */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium  ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tasks</span>
                      <span className="font-medium text-gray-900">
                        {projectTasks.completed}/{projectTasks.total}
                      </span>
                    </div>

                    {/* Team */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Team</span>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{teamMembers.length}</span>
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {teamMembers.slice(0, 3).map((member) => (
                          <Avatar
                            key={member.id}
                            className="w-6 h-6 border-2 border-white"
                          >
                            <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {teamMembers.length > 3 && (
                          <div className="w-6 h-6 bg-gray-100 border-2 border-white  flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{teamMembers.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Project Modal */}
      <EditProjectModal
        project={selectedProject}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onProjectUpdated={handleProjectUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={() => {
          if (selectedProject) {
            handleProjectDeleted(selectedProject.id);
            setProjects(projects.filter(project => project.id !== selectedProject.id));
          }
        }}
        title="Delete Project"
        description="This action cannot be undone. This will permanently delete the project and all its tasks."
        itemName={selectedProject?.name || ''}
      />
    </div>
  );
};

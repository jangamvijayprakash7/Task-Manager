import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  MoreVertical, 
  UserPlus,
  Shield,
  User,
  Clock,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { getInitials } from '../ui/Avatar';
import { Input } from '../ui/Input';
import { CreateTeamMemberModal } from '../modals/CreateTeamMemberModal';
import { EditTeamMemberModal } from '../modals/EditTeamMemberModal';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';
import { TeamMember, Task } from '../../types';
import { getTeamMembers, getTasks, setTeamMembers } from '../../utils/localStorage';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyTeams } from '../empty-states/EmptyTeams';

const roleColors = {
  'Project Manager': 'bg-red-100 text-red-800',
  'Developer': 'bg-blue-100 text-blue-800',
  'Designer': 'bg-purple-100 text-purple-800',
  'QA Engineer': 'bg-green-100 text-green-800',
  'Other': 'bg-gray-100 text-gray-800'
};

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400'
};

export const Team: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Check if user is a guest
  const isGuest = currentUser?.id === 'guest';
  const shouldShowData = isAuthenticated && !isGuest;
  
  const [teamMembers, setTeamMembersState] = useState<TeamMember[]>(shouldShowData ? getTeamMembers() : []);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const tasks = shouldShowData ? getTasks() : [];

  const getRoleCount = (role: string) => {
    return teamMembers.filter(member => member.role === role).length;
  };

  const getOnlineCount = () => {
    // For demo purposes, we'll simulate online status
    return Math.floor(teamMembers.length * 0.6);
  };

  const getMemberTasks = (memberId: string) => {
    const assignedTasks = tasks.filter(task => task.assignees.includes(memberId));
    const completedTasks = assignedTasks.filter(task => task.status === 'Done');
    return {
      assigned: assignedTasks.length,
      completed: completedTasks.length
    };
  };

  const handleMemberCreated = (newMember: TeamMember) => {
    setTeamMembersState([...teamMembers, newMember]);
  };

  const handleMemberUpdated = (updatedMember: TeamMember) => {
    setTeamMembersState(teamMembers.map(member => member.id === updatedMember.id ? updatedMember : member));
  };

  const handleMemberDeleted = (memberId: string) => {
    setTeamMembersState(teamMembers.filter(member => member.id !== memberId));
  };

  // Show empty state for guest users or when no team members
  if (!isAuthenticated || isGuest || teamMembers.length === 0) {
    return <EmptyTeams />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600">Manage your team members and their roles</p>
        </div>
        <CreateTeamMemberModal onMemberCreated={handleMemberCreated}>
          <Button className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </Button>
        </CreateTeamMemberModal>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
              <User className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online</p>
                <p className="text-xl font-bold text-gray-900">{getOnlineCount()}</p>
              </div>
              <div className="w-6 h-6 bg-green-200 "></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Developers</p>
                <p className="text-xl font-bold text-gray-900">{getRoleCount('Developer')}</p>
              </div>
              <Shield className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Designers</p>
                <p className="text-xl font-bold text-gray-900">{getRoleCount('Designer')}</p>
              </div>
              <User className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      {teamMembers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first team member</p>
            <CreateTeamMemberModal onMemberCreated={handleMemberCreated}>
              <Button>Add Member</Button>
            </CreateTeamMemberModal>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => {
                const memberTasks = getMemberTasks(member.id);
                const completionRate = memberTasks.assigned > 0 ? Math.round((memberTasks.completed / memberTasks.assigned) * 100) : 0;
                
                return (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200  hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary-100 text-primary-700">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4  border-2 border-white ${statusColors.online}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium  ${roleColors[member.role as keyof typeof roleColors] || roleColors['Other']}`}>
                            {member.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>Joined: {new Date(member.joinedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Status: {member.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {memberTasks.completed}/{memberTasks.assigned} tasks
                        </div>
                        <div className="text-xs text-gray-500">
                          {completionRate}% completion
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setSelectedMember(member)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {selectedMember?.id === member.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white  shadow-lg border border-gray-200 py-1 z-50">
                              <button
                                onClick={() => {
                                  setShowEditModal(true);
                                  setSelectedMember(member);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setShowDeleteModal(true);
                                  setSelectedMember(member);
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
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Team Member Modal */}
      <EditTeamMemberModal
        member={selectedMember}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onMemberUpdated={handleMemberUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={() => {
          if (selectedMember) {
            handleMemberDeleted(selectedMember.id);
            setTeamMembers(teamMembers.filter(member => member.id !== selectedMember.id));
          }
        }}
        title="Delete Team Member"
        description="This action cannot be undone. This will permanently remove the team member."
        itemName={selectedMember?.name || ''}
      />
    </div>
  );
};

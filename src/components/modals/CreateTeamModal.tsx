import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { X, Plus } from 'lucide-react';
import { useModalManager } from '../ModalManager';
import { useToast } from '../../contexts/ToastContext';

interface CreateTeamModalProps {
  children: React.ReactNode;
  onTeamCreated?: (team: any) => void;
  onModalOpen?: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ children, onTeamCreated, onModalOpen }) => {
  const { openModal, closeModal } = useModalManager();
  const { success } = useToast();
  const [teamName, setTeamName] = useState('Design new draft');
  const [description, setDescription] = useState('');
  const [invitedMembers, setInvitedMembers] = useState(['@Johnsonwils', 'Anderson123@gmail.com']);
  const [newMember, setNewMember] = useState('');

  const handleRemoveMember = (memberToRemove: string) => {
    setInvitedMembers(members => members.filter(member => member !== memberToRemove));
  };

  const handleAddMember = () => {
    if (newMember.trim() && !invitedMembers.includes(newMember.trim())) {
      setInvitedMembers([...invitedMembers, newMember.trim()]);
      setNewMember('');
      success('Member Added!', `Member "${newMember.trim()}" has been added to the team.`);
    }
  };

  const handleCreateTeam = () => {
    const team = {
      id: Date.now().toString(),
      name: teamName,
      description,
      members: invitedMembers,
      createdAt: new Date().toISOString()
    };

    onTeamCreated?.(team);
    closeModal();
    
    // Show success toast
    success('Team Created!', `Team "${teamName}" has been successfully created.`);
    
    // Reset form
    setTeamName('Design new draft');
    setDescription('');
    setInvitedMembers(['@Johnsonwils', 'Anderson123@gmail.com']);
  };

  const handleOpenModal = () => {
    if (onModalOpen) {
      onModalOpen();
    }
    
    const modalContent = (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Create Team</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Design new draft"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write about this task..."
              className="w-full px-3 py-2 border border-gray-300 rounded-input focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Invite Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite Members
            </label>
            <div className="border border-gray-300 rounded-input p-3 min-h-[60px]">
              <div className="flex flex-wrap gap-2 mb-2">
                {invitedMembers.map((member, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {member}
                    <button
                      onClick={() => handleRemoveMember(member)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Add member email or username..."
                  className="flex-1 border-0 p-0 focus:ring-0"
                />
                <button
                  onClick={handleAddMember}
                  className="px-3 py-2 rounded-button hover:opacity-80"
                  style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-button hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTeam}
            className="px-4 py-2 text-sm font-medium rounded-button hover:opacity-80"
            style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}
          >
            Create
          </button>
        </div>
      </>
    );

    openModal(modalContent, closeModal);
  };

  return (
    <div onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      handleOpenModal();
    }}>
      {children}
    </div>
  );
};
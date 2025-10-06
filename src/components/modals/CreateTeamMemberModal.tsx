import React, { useState } from 'react';
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TeamMember } from '../../types';
import { setTeamMembers, getTeamMembers } from '../../utils/localStorage';
import { useToast } from '../../contexts/ToastContext';

interface CreateTeamMemberModalProps {
  children: React.ReactNode;
  onMemberCreated?: (member: TeamMember) => void;
}

export const CreateTeamMemberModal: React.FC<CreateTeamMemberModalProps> = ({ children, onMemberCreated }) => {
  const { success } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      avatarUrl: undefined,
      isActive: true,
      joinedAt: new Date().toISOString(),
    };

    const members = getTeamMembers();
    const updatedMembers = [...members, newMember];
    setTeamMembers(updatedMembers);

    // Reset form
    setFormData({
      name: '',
      email: '',
      role: 'Developer',
    });

    setOpen(false);
    onMemberCreated?.(newMember);
    
    // Show success toast
    success('Team Member Added!', `Team member "${formData.name}" has been successfully added.`);
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        {children}
      </ModalTrigger>
      <ModalContent className="sm:max-w-lg">
        <ModalHeader>
          <ModalTitle>Add Team Member</ModalTitle>
          <ModalDescription>
            Add a new team member to your organization.
          </ModalDescription>
        </ModalHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />

          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="Project Manager">Project Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Cancel</Button>
            </ModalClose>
            <Button type="submit">Add Member</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};


import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TeamMember } from '../../types';
import { setTeamMembers, getTeamMembers } from '../../utils/localStorage';

interface EditTeamMemberModalProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberUpdated?: (member: TeamMember) => void;
}

export const EditTeamMemberModal: React.FC<EditTeamMemberModalProps> = ({ member, open, onOpenChange, onMemberUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!member || !formData.name.trim() || !formData.email.trim()) return;

    const updatedMember: TeamMember = {
      ...member,
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    const members = getTeamMembers();
    const updatedMembers = members.map(m => m.id === member.id ? updatedMember : m);
    setTeamMembers(updatedMembers);

    onOpenChange(false);
    onMemberUpdated?.(updatedMember);
  };

  if (!member) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="sm:max-w-lg">
        <ModalHeader>
          <ModalTitle>Edit Team Member</ModalTitle>
          <ModalDescription>
            Update the team member details below.
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
              className="mt-1 w-full  border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <Button type="submit">Update Member</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};


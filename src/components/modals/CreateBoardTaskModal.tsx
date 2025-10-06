import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Calendar, Clock, X } from 'lucide-react';
import { useModalManager } from '../ModalManager';
import { useToast } from '../../contexts/ToastContext';

interface CreateBoardTaskModalProps {
  children: React.ReactNode;
  onTaskCreated?: (task: any) => void;
  onModalOpen?: () => void;
}

export const CreateBoardTaskModal: React.FC<CreateBoardTaskModalProps> = ({ children, onTaskCreated, onModalOpen }) => {
  const { openModal, closeModal } = useModalManager();
  const { success } = useToast();
  const [taskName, setTaskName] = useState('Design new draft');
  const [description, setDescription] = useState("It's a new task");
  const [dueDate, setDueDate] = useState('20-10-2022');
  const [dueTime, setDueTime] = useState('11:30 AM');

  const handleCreateTask = () => {
    const task = {
      id: Date.now().toString(),
      taskName,
      description,
      dueDate,
      dueTime,
      createdAt: new Date().toISOString()
    };

    onTaskCreated?.(task);
    closeModal();
    
    // Show success toast
    success('Board Task Created!', `Board task "${taskName}" has been successfully created.`);
    
    // Reset form
    setTaskName('Design new draft');
    setDescription("It's a new task");
    setDueDate('20-10-2022');
    setDueTime('11:30 AM');
  };

  const handleOpenModal = () => {
    if (onModalOpen) {
      onModalOpen();
    }
    
    const modalContent = (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Create Board Task</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Separator */}
        <div className="border-t border-gray-200 mb-6"></div>
        
        <div className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name
            </label>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Design new draft"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="It's a new task"
              className="w-full"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due date
            </label>
            <div className="relative">
              <Input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="20-10-2022"
                className="w-full pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Due Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Time
            </label>
            <div className="relative">
              <Input
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="11:30 AM"
                className="w-full pr-10"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6">
          <button
            onClick={handleCreateTask}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
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

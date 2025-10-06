import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import { useModalManager } from '../ModalManager';
import { useToast } from '../../contexts/ToastContext';

interface CreateTimelineModalProps {
  children: React.ReactNode;
  onTimelineCreated?: (timeline: any) => void;
  onModalOpen?: () => void;
}

export const CreateTimelineModal: React.FC<CreateTimelineModalProps> = ({ children, onTimelineCreated, onModalOpen }) => {
  const { openModal, closeModal } = useModalManager();
  const { clearAllToasts, success } = useToast();
  const [timelineName, setTimelineName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTimeline = () => {
    const timeline = {
      id: Date.now().toString(),
      name: timelineName,
      description,
      startDate,
      endDate,
      createdAt: new Date().toISOString()
    };

    onTimelineCreated?.(timeline);
    closeModal();
    setIsModalOpen(false);
    
    // Show success toast
    success('Timeline Created!', `Timeline "${timelineName}" has been successfully created.`);
    
    // Reset form
    setTimelineName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
  };

  const handleCloseModal = () => {
    closeModal();
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    // Clear any existing toasts
    clearAllToasts();
    
    // Reset all fields to empty when opening modal
    setTimelineName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    
    setIsModalOpen(true);
    if (onModalOpen) {
      onModalOpen();
    }
    
    const modalContent = (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Create Timeline</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        
        <div className="space-y-4">
          {/* Timeline Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline Name
            </label>
            <input
              type="text"
              value={timelineName}
              onChange={(e) => setTimelineName(e.target.value)}
              placeholder="Enter timeline name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              placeholder="Enter timeline description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              rows={3}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-button hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTimeline}
            className="px-4 py-2 text-sm font-medium rounded-button hover:opacity-80"
            style={{ backgroundColor: '#e3d8ff', color: '#6B40ED' }}
          >
            Create
          </button>
        </div>
      </>
    );

    openModal(modalContent, handleCloseModal);
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
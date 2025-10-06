import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Upload, X } from 'lucide-react';
import { useModalManager } from '../ModalManager';
import { useToast } from '../../contexts/ToastContext';

interface CreateBoardModalProps {
  children: React.ReactNode;
  onBoardCreated?: (board: any) => void;
  onModalOpen?: () => void;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ children, onBoardCreated, onModalOpen }) => {
  const { openModal, closeModal } = useModalManager();
  const { success } = useToast();
  const [boardName, setBoardName] = useState('Design new draft');
  const [uploadedIcon, setUploadedIcon] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedIcon(file);
    }
  };

  const handleCreateBoard = () => {
    const board = {
      id: Date.now().toString(),
      name: boardName,
      icon: uploadedIcon,
      createdAt: new Date().toISOString()
    };

    onBoardCreated?.(board);
    closeModal();
    
    // Show success toast
    success('Board Created!', `Board "${boardName}" has been successfully created.`);
    
    // Reset form
    setBoardName('Design new draft');
    setUploadedIcon(null);
  };

  const handleOpenModal = () => {
    if (onModalOpen) {
      onModalOpen();
    }
    
    const modalContent = (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Create Board</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Upload Icon Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Icon
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     style={{ borderColor: '#6B40ED' }}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2" style={{ color: '#6B40ED' }} />
                  <p className="text-sm font-medium" style={{ color: '#6B40ED' }}>
                    Upload Icon
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </label>
            </div>
            {uploadedIcon && (
              <p className="mt-2 text-sm text-green-600">
                File uploaded: {uploadedIcon.name}
              </p>
            )}
          </div>

          {/* Board Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Board Name
            </label>
            <Input
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Design new draft"
              className="w-full"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6">
          <button
            onClick={handleCreateBoard}
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
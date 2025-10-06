import React, { useState } from 'react';
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, UserPlus, Search } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface CreateConversationModalProps {
  children: React.ReactNode;
  onConversationCreated?: (conversation: any) => void;
}

export const CreateConversationModal: React.FC<CreateConversationModalProps> = ({ children, onConversationCreated }) => {
  const { success } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    participants: [] as string[],
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || formData.participants.length === 0) return;

    const newConversation = {
      id: Date.now().toString(),
      title: formData.title,
      participants: formData.participants,
      lastMessage: formData.message,
      createdAt: new Date().toISOString(),
    };

    // Reset form
    setFormData({
      title: '',
      participants: [],
      message: '',
    });

    setOpen(false);
    onConversationCreated?.(newConversation);
    
    // Show success toast
    success('Conversation Started!', `Conversation "${formData.title}" has been successfully created.`);
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        {children}
      </ModalTrigger>
      <ModalContent className="sm:max-w-lg">
        <ModalHeader className="flex flex-row items-center justify-between">
          <ModalTitle>Start New Conversation</ModalTitle>
          <ModalClose asChild>
            <button className="p-1 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </ModalClose>
        </ModalHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Conversation Title</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter conversation title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Add Participants</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.participants.map((participant, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1  text-xs font-medium bg-purple-100 text-purple-800">
                  {participant}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, participants: prev.participants.filter((_, i) => i !== index) }))}
                    className="ml-2 hover:bg-purple-200  p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                className="w-full  border border-gray-300 px-3 py-2 pr-10 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="@username or email..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim() && !formData.participants.includes(input.value.trim())) {
                      setFormData(prev => ({ ...prev, participants: [...prev.participants, input.value.trim()] }));
                      input.value = '';
                    }
                  }
                }}
              />
              <UserPlus className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Initial Message</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Type your message..."
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </div>

          <ModalFooter className="pt-4">
            <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-purple-700">
              Start Conversation
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalClose } from '../ui/Modal';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastSeen: string;
}

interface StartConversationModalProps {
  children: React.ReactNode;
  onConversationStarted?: (contact: Contact) => void;
}

export const StartConversationModal: React.FC<StartConversationModalProps> = ({ 
  children, 
  onConversationStarted 
}) => {
  const { success } = useToast();
  const [open, setOpen] = useState(false);

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Johnson Williamson',
      role: 'UX Designer',
      avatar: 'JW',
      lastSeen: '3hrs ago'
    },
    {
      id: '2',
      name: 'Lila Juliana',
      role: 'Graphics designer',
      avatar: 'LJ',
      lastSeen: '3hrs ago'
    },
    {
      id: '3',
      name: 'Olivia Thomas',
      role: 'Senior Developer',
      avatar: 'OT',
      lastSeen: '3hrs ago'
    },
    {
      id: '4',
      name: 'Liam Benjamin',
      role: 'Senior Developer',
      avatar: 'LB',
      lastSeen: '3hrs ago'
    },
    {
      id: '5',
      name: 'Henry Lucas',
      role: 'Senior Developer',
      avatar: 'HL',
      lastSeen: '3hrs ago'
    },
    {
      id: '6',
      name: 'Kane Martin',
      role: 'Senior Developer',
      avatar: 'KM',
      lastSeen: '3hrs ago'
    }
  ];

  const handleContactSelect = (contact: Contact) => {
    onConversationStarted?.(contact);
    setOpen(false);
    
    // Show success toast
    success('Conversation Started!', `Conversation with ${contact.name} has been started.`);
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        {children}
      </ModalTrigger>
      <ModalContent className="sm:max-w-md">
        <ModalHeader>
          <ModalTitle>Start Conversation</ModalTitle>
        </ModalHeader>
        
        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 cursor-pointer rounded-button transition-colors"
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {contact.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {contact.role}
                  </p>
                </div>
                
                <span className="text-xs text-gray-500">
                  {contact.lastSeen}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

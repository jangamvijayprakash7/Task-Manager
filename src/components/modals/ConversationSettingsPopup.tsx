import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, Ban, Trash2 } from 'lucide-react';

interface ConversationSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteToTeam?: () => void;
  onBlockUser?: () => void;
  onDeleteChat?: () => void;
}

export const ConversationSettingsPopup: React.FC<ConversationSettingsPopupProps> = ({
  isOpen,
  onClose,
  onInviteToTeam,
  onBlockUser,
  onDeleteChat
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 right-4 z-50">
      <div
        ref={popupRef}
        className="bg-white  shadow-lg border border-gray-200 py-2 min-w-[180px]"
      >
        <button
          onClick={() => {
            onInviteToTeam?.();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-3" />
          Invite to team
        </button>
        
        <button
          onClick={() => {
            onBlockUser?.();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Ban className="w-4 h-4 mr-3" />
          Block User
        </button>
        
        <button
          onClick={() => {
            onDeleteChat?.();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-3" />
          Delete Chat
        </button>
      </div>
    </div>
  );
};

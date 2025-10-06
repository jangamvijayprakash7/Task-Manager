import React from 'react';
import { FileText, File, Image, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback } from './Avatar';
import { cn } from '../../utils/cn';
import { MessageAttachment } from '../../types';

interface MessageItemProps {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  attachments?: MessageAttachment[];
  className?: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  id,
  sender,
  senderAvatar,
  content,
  timestamp,
  isOutgoing,
  attachments = [],
  className
}) => {
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'doc':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'pdf':
        return <File className="w-5 h-5 text-red-600" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-600" />;
      default:
        return <Paperclip className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderAttachments = () => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        {attachments.map((attachment, index) => (
          <div 
            key={index}
            className="bg-white p-3  border border-gray-200 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {getAttachmentIcon(attachment.type)}
            <div>
              <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
              <p className="text-xs text-gray-500">{attachment.size}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    // Handle @mentions and links in content
    const parts = content.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-purple-600 font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  if (isOutgoing) {
    return (
      <div className={cn('flex justify-end', className)}>
        <div className="max-w-xs lg:max-w-md">
          <div className="px-4 py-2  bg-gray-200 text-gray-900">
            <p className="text-sm">{renderContent()}</p>
            {renderAttachments()}
          </div>
          <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex justify-start', className)}>
      <div className="max-w-xs lg:max-w-md">
        <div className="flex items-center space-x-2 mb-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
              {senderAvatar}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="px-4 py-2  bg-gray-100 text-gray-900">
          <p className="text-sm">{renderContent()}</p>
          {renderAttachments()}
        </div>
        <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
      </div>
    </div>
  );
};

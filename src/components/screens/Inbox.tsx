import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, Settings, Paperclip, Smile, Send, X, UserPlus, Ban, Trash2, ChevronDown, User, BellOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModalManager } from '../ModalManager';
import { AvatarImage } from '../ui/AvatarImage';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../ui/Avatar';

export const Inbox: React.FC = () => {
  const { openModal, closeModal } = useModalManager();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState('Juliana Wills');
  const [newMessage, setNewMessage] = useState('');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const headerMenuRef = useRef<HTMLDivElement>(null);
  const bottomMenuRef = useRef<HTMLDivElement>(null);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  // Sample conversations data
  const conversations = [
    {
      id: 'robert',
      name: 'Robert Anderson',
      avatar: 'RA',
      image: 'https://randomuser.me/api/portraits/men/8.jpg',
      lastMessage: "I'll do that task now, you can...",
      time: 'Just now',
      unread: 0,
      isOnline: true
    },
    {
      id: 'henry',
      name: 'Henry Kane',
      avatar: 'HK',
      image: 'https://randomuser.me/api/portraits/men/19.jpg',
      lastMessage: 'Here is UX research Documen...',
      time: '30mins ago',
      unread: 3,
      isOnline: false
    },
    {
      id: 'juliana',
      name: 'Juliana Wills',
      avatar: 'JW',
      image: 'https://randomuser.me/api/portraits/women/25.jpg',
      lastMessage: 'If you complete Webdesign Ta...',
      time: '3h ago',
      unread: 0,
      isOnline: false
    },
    {
      id: 'emma',
      name: 'Emma Olivia',
      avatar: 'EO',
      image: 'https://randomuser.me/api/portraits/women/37.jpg',
      lastMessage: 'Are you there?',
      time: 'a day ago',
      unread: 0,
      isOnline: false
    },
    {
      id: 'benjamin',
      name: 'Benjamin Jack',
      avatar: 'BJ',
      image: 'https://randomuser.me/api/portraits/men/41.jpg',
      lastMessage: 'Hi 👋',
      time: '2d ago',
      unread: 2,
      isOnline: false
    }
  ];

  // Sample contacts for Start Conversation modal
  const contacts = [
    { id: 'johnson', name: 'Johnson Williamson', role: 'UX Designer', avatar: 'JW', image: 'https://randomuser.me/api/portraits/men/35.jpg', lastActive: '3hrs ago' },
    { id: 'lila', name: 'Lila Juliana', role: 'Graphics designer', avatar: 'LJ', image: 'https://randomuser.me/api/portraits/women/48.jpg', lastActive: '3hrs ago' },
    { id: 'olivia', name: 'Olivia Thomas', role: 'Senior Developer', avatar: 'OT', image: 'https://randomuser.me/api/portraits/women/61.jpg', lastActive: '3hrs ago' },
    { id: 'liam', name: 'Liam Benjamin', role: 'Senior Developer', avatar: 'LB', image: 'https://randomuser.me/api/portraits/men/67.jpg', lastActive: '3hrs ago' },
    { id: 'henry', name: 'Henry Lucas', role: 'Senior Developer', avatar: 'HL', image: 'https://randomuser.me/api/portraits/men/73.jpg', lastActive: '3hrs ago' },
    { id: 'kane', name: 'Kane Martin', role: 'Senior Developer', avatar: 'KM', image: 'https://randomuser.me/api/portraits/men/81.jpg', lastActive: '3hrs ago' }
  ];

  // Sample messages for active conversation
  const messages = [
    {
      id: 1,
      sender: 'Juliana Wills',
      content: "Hi 👋 I'll do that task now, you can start working on another task!",
      time: '25/10/2022 • 10:00AM',
      isOwn: false,
      avatar: 'JW'
    },
    {
      id: 2,
      sender: 'Juliana Wills',
      content: "If you complete Webdesign Task, You can can start another task with @john, Here is few documents, check this before satarting your tasks",
      time: '25/10/2022 • 10:00AM',
      isOwn: false,
      avatar: 'JW',
      attachments: [
        { name: 'Webdesign.doc', size: '3.4MB', type: 'doc' },
        { name: 'Branding.PDF', size: '10.5MB', type: 'pdf' }
      ]
    },
    {
      id: 3,
      sender: 'You',
      content: "Hello @Juliana, I'll completed the task you send ✔",
      time: 'Today • 2hrs ago',
      isOwn: true
    }
  ];

  const handleStartConversation = () => {
    const modalContent = (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Start Conversation</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Contacts List */}
        <div className="max-h-96 overflow-y-auto border border-gray-200 ">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => {
                // Handle starting conversation with contact
                closeModal();
              }}
            >
              <AvatarImage 
                src={contact.image}
                alt={contact.name}
                fallback={contact.avatar}
                size="lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{contact.name}</h3>
                <p className="text-sm text-gray-500">{contact.role}</p>
              </div>
              <span className="text-xs text-gray-400">{contact.lastActive}</span>
            </div>
          ))}
        </div>
      </>
    );

    openModal(modalContent, closeModal);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage('');
    }
  };

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setShowHeaderMenu(false);
      }
      if (bottomMenuRef.current && !bottomMenuRef.current.contains(event.target as Node)) {
        setShowBottomMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettingsAction = (action: string) => {
    setShowSettingsMenu(false);
    // Handle the action
    console.log(`Settings action: ${action}`);
  };

  const getCurrentChatId = () => currentConversation?.id || '';

  const handleMuteNotifications = async (chatId: string) => {
    try {
      setIsActionLoading('mute');
      // TODO: call API to mute notifications for chatId
      await new Promise(r => setTimeout(r, 400));
    } catch (e) {
      console.error('Mute failed', e);
    } finally {
      setIsActionLoading(null);
      setShowHeaderMenu(false);
    }
  };

  const handleBlockUser = async (chatId: string) => {
    try {
      setIsActionLoading('block');
      // TODO: call API to block user for chatId
      await new Promise(r => setTimeout(r, 400));
    } catch (e) {
      console.error('Block failed', e);
    } finally {
      setIsActionLoading(null);
      setShowHeaderMenu(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      setIsActionLoading('delete');
      // TODO: call API to delete chatId and optimistically update UI
      await new Promise(r => setTimeout(r, 400));
    } catch (e) {
      console.error('Delete failed', e);
    } finally {
      setIsActionLoading(null);
      setShowHeaderMenu(false);
    }
  };

  const currentConversation = conversations.find(c => c.name === activeConversation);

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar - Conversations */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600">Direct and team messages.</p>
        </div>

        {/* Create Conversation Button */}
        <div className="p-4">
          <button
            onClick={handleStartConversation}
            className="w-full px-4 py-3 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Conversation</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                activeConversation === conversation.name ? 'bg-gray-50' : ''
              }`}
              onClick={() => setActiveConversation(conversation.name)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${conversation.id}`, {
                        state: { user: { id: conversation.id, name: conversation.name, image: conversation.image, avatar: conversation.avatar } }
                      });
                    }}
                    className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label={`Open ${conversation.name}'s profile`}
                  >
                    <AvatarImage 
                      src={conversation.image}
                      alt={conversation.name}
                      fallback={conversation.avatar}
                      size="lg"
                    />
                  </button>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <div className="w-5 h-5 bg-primary-100 text-primary-700 text-xs rounded-full flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (currentConversation) {
                  navigate(`/profile/${currentConversation.id}`, { state: { user: { id: currentConversation.id, name: currentConversation.name, image: currentConversation.image, avatar: currentConversation.avatar } } });
                }
              }}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Open user info"
            >
              <AvatarImage 
                src={currentConversation?.image}
                alt={currentConversation?.name || 'User'}
                fallback={currentConversation?.avatar}
                size="lg"
              />
            </button>
            <div>
              <h2 className="font-medium text-gray-900">{activeConversation}</h2>
              <p className="text-sm text-gray-500">2hrs ago</p>
            </div>
          </div>
          <div className="relative" ref={headerMenuRef}>
            <button
              onClick={() => setShowHeaderMenu(!showHeaderMenu)}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showHeaderMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200  shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    setShowHeaderMenu(false);
                    if (currentConversation) {
                      navigate(`/profile/${currentConversation.id}`, { state: { user: { id: currentConversation.id, name: currentConversation.name, image: currentConversation.image, avatar: currentConversation.avatar } } });
                    }
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  View Profile
                </button>
                <button
                  onClick={() => handleMuteNotifications(getCurrentChatId())}
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  aria-busy={isActionLoading==='mute'}
                >
                  <BellOff className="w-4 h-4 text-gray-500 mr-2" />
                  Mute Notifications
                </button>
                <button
                  onClick={() => handleBlockUser(getCurrentChatId())}
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  aria-busy={isActionLoading==='block'}
                >
                  <Ban className="w-4 h-4 text-gray-500 mr-2" />
                  Block User
                </button>
                <button
                  onClick={() => handleDeleteChat(getCurrentChatId())}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  aria-busy={isActionLoading==='delete'}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!message.isOwn && (
                  <button
                    onClick={() => {
                      if (currentConversation) {
                        navigate(`/profile/${currentConversation.id}`, { state: { user: { id: currentConversation.id, name: currentConversation.name, image: currentConversation.image, avatar: currentConversation.avatar } } });
                      }
                    }}
                    className="flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Open sender profile"
                  >
                    <AvatarImage 
                      src={currentConversation?.image}
                      alt={message.sender}
                      fallback={message.avatar}
                      size="md"
                    />
                  </button>
                )}
                <div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.attachments && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-white border rounded-lg">
                            <div className="w-8 h-8 bg-red-100 flex items-center justify-center">
                              {attachment.type === 'pdf' ? '📄' : '📝'}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900">{attachment.name}</p>
                              <p className="text-xs text-gray-500">{attachment.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <AvatarImage 
                src="https://randomuser.me/api/portraits/women/25.jpg"
                alt="Juliana Wills"
                fallback="JW"
                size="md"
              />
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">Typing •••</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <AvatarImage 
              src={currentUser?.avatarUrl || ""}
              alt={currentUser?.name || "Me"}
              fallback={currentUser ? getInitials(currentUser.name) : "M"}
              size="md"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type Message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-700 transition-colors"
              >
                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
              </button>
            </div>
            
            {/* Settings Button with Dropdown */}
            <div className="relative" ref={settingsMenuRef}>
              <button 
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-3 text-gray-400 hover:text-gray-600"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Settings Dropdown Menu */}
              {showSettingsMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white  shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => handleSettingsAction('invite')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50"
                  >
                    <UserPlus className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">Invite to team</span>
                  </button>
                  <button
                    onClick={() => handleSettingsAction('block')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50"
                  >
                    <Ban className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">Block User</span>
                  </button>
                  <button
                    onClick={() => handleSettingsAction('delete')}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">Delete Chat</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="relative" ref={bottomMenuRef}>
              <button
                onClick={() => setShowBottomMenu(!showBottomMenu)}
                className="p-3 text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {showBottomMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-200  shadow-lg py-2 z-50">
                  <button
                    onClick={() => { setShowBottomMenu(false); }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <Paperclip className="w-4 h-4 text-gray-500 mr-2" />
                    Attach File
                  </button>
                  <button
                    onClick={() => { setShowBottomMenu(false); }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <Smile className="w-4 h-4 text-gray-500 mr-2" />
                    Insert Emoji
                  </button>
                  <button
                    onClick={() => { setShowBottomMenu(false); }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
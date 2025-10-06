import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Filter, 
  MoreVertical, 
  Star, 
  Archive,
  Trash2,
  Reply,
  Forward,
  Clock,
  User,
  Paperclip,
  Plus,
  Bell,
  Settings,
  MoreHorizontal,
  FileText,
  File,
  UserPlus,
  Ban,
  MessageCircle,
  Home,
  BarChart3,
  Users,
  Grid3X3,
  Calendar,
  MoreHorizontal as MoreOptions,
  Check,
  Send,
  Smile,
  ChevronDown,
  VolumeX,
  Image,
  Video,
  Mic,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { getInitials } from '../ui/Avatar';
import { AvatarImage } from '../ui/AvatarImage';
import { StartConversationModal } from '../modals/StartConversationModal';
import { ConversationSettingsPopup } from '../modals/ConversationSettingsPopup';
import { Conversation, ConversationMessage, MessageAttachment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const InboxPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('3');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showTopDropdown, setShowTopDropdown] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [showMessageDropdown, setShowMessageDropdown] = useState(false);
  const [showTopMessagesDropdown, setShowTopMessagesDropdown] = useState(false);
  const [showChatHeaderDropdown, setShowChatHeaderDropdown] = useState(false);
  const [showConversationDropdown, setShowConversationDropdown] = useState<string | null>(null);
  const topDropdownRef = useRef<HTMLDivElement>(null);
  const uploadDropdownRef = useRef<HTMLDivElement>(null);
  const messageDropdownRef = useRef<HTMLDivElement>(null);
  const topMessagesDropdownRef = useRef<HTMLDivElement>(null);
  const chatHeaderDropdownRef = useRef<HTMLDivElement>(null);
  const conversationDropdownRef = useRef<HTMLDivElement>(null);

  const conversations: Conversation[] = [
    {
      id: '1',
      sender: 'Robert Anderson',
      senderAvatar: 'RA',
      lastMessage: "I'll do that task now, you can start working on another task!",
      timestamp: 'Just now',
      isRead: true,
      unreadCount: 0,
      messages: []
    },
    {
      id: '2',
      sender: 'Henry Kane',
      senderAvatar: 'HK',
      lastMessage: "Here is UX research Document, check this before starting your tasks",
      timestamp: '30mins ago',
      isRead: false,
      unreadCount: 3,
      messages: []
    },
    {
      id: '3',
      sender: 'Juliana Wills',
      senderAvatar: 'JW',
      lastMessage: "If you complete Webdesign Task, You can start another task with @john, Here is few documents, check this before satarting your tasks",
      timestamp: '3h ago',
      isRead: true,
      unreadCount: 0,
      messages: [
        {
          id: '1',
          sender: 'Juliana Wills',
          senderAvatar: 'JW',
          content: "Hi 👋 I'll do that task now, you can start working on another task!",
          timestamp: '2hrs ago',
          isOutgoing: false
        },
        {
          id: '2',
          sender: 'Juliana Wills',
          senderAvatar: 'JW',
          content: "If you complete Webdesign Task, You can start another task with @john, Here is few documents, check this before satarting your tasks",
          timestamp: '25/10/2022 • 10:00AM',
          isOutgoing: false,
          attachments: [
            { name: 'Webdesign.doc', size: '3.4MB', type: 'doc' },
            { name: 'Branding.PDF', size: '10.5MB', type: 'pdf' }
          ]
        },
        {
          id: '3',
          sender: 'You',
          senderAvatar: 'M',
          content: "Hello @Juliana, I'll completed the task you send ✅",
          timestamp: 'Today • 2hrs ago',
          isOutgoing: true
        }
      ]
    },
    {
      id: '4',
      sender: 'Emma Olivia',
      senderAvatar: 'EO',
      lastMessage: "Are you there?",
      timestamp: 'a day ago',
      isRead: true,
      unreadCount: 0,
      messages: []
    },
    {
      id: '5',
      sender: 'Benjamin Jack',
      senderAvatar: 'BJ',
      lastMessage: "Hi",
      timestamp: '2d ago',
      isRead: false,
      unreadCount: 2,
      messages: []
    }
  ];

  const filteredConversations = conversations.filter(conversation =>
    conversation.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (topDropdownRef.current && !topDropdownRef.current.contains(event.target as Node)) {
        setShowTopDropdown(false);
      }
      if (uploadDropdownRef.current && !uploadDropdownRef.current.contains(event.target as Node)) {
        setShowUploadDropdown(false);
      }
      if (messageDropdownRef.current && !messageDropdownRef.current.contains(event.target as Node)) {
        setShowMessageDropdown(false);
      }
      if (topMessagesDropdownRef.current && !topMessagesDropdownRef.current.contains(event.target as Node)) {
        setShowTopMessagesDropdown(false);
      }
      if (chatHeaderDropdownRef.current && !chatHeaderDropdownRef.current.contains(event.target as Node)) {
        setShowChatHeaderDropdown(false);
      }
      if (conversationDropdownRef.current && !conversationDropdownRef.current.contains(event.target as Node)) {
        setShowConversationDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex bg-white" style={{ width: '1440px', height: '816px' }}>
      {/* Left Sidebar - Navigation */}
      <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4" style={{ flex: 'none', order: 0, flexGrow: 0 }}>
        {/* Logo */}
        <div className="mb-8">
          <div className="w-8 h-8 bg-primary-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚡</span>
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex flex-col space-y-4">
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 ">
            <Home className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 ">
            <BarChart3 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 ">
            <Users className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 ">
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-600 bg-gray-100 ">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 ">
            <Calendar className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 ">
            <MoreOptions className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Middle Column - Messages */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col" style={{ flex: 'none', order: 1, flexGrow: 0 }}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-xs">⚡</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Superpage</span>
            </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </button>
              {/* Debug indicator */}
              <span className="text-xs text-red-500">{showTopDropdown ? 'OPEN' : 'CLOSED'}</span>
              <button 
                onClick={() => {
                  console.log('Test button clicked');
                  setShowMessageDropdown(!showMessageDropdown);
                }}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded"
              >
                Test Dropdown
              </button>
              <div className="relative" ref={topDropdownRef}>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Top dropdown clicked, current state:', showTopDropdown);
                    setShowTopDropdown(prev => {
                      console.log('Setting top dropdown to:', !prev);
                      return !prev;
                    });
                  }}
                  className={`w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center rounded ${showTopDropdown ? 'bg-gray-200' : ''}`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showTopDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-300 py-1" style={{ zIndex: 9999 }}>
                    <button 
                      onClick={() => {
                        console.log('Mute notifications clicked');
                        setShowTopDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <VolumeX className="w-4 h-4 mr-2" />
                      Mute Notifications
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Block clicked');
                        setShowTopDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Block
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Chat settings clicked');
                        setShowTopDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Chat Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Messages Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-600">Direct and team messages</p>
            </div>
            <div className="relative" ref={topMessagesDropdownRef}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Top Messages dropdown clicked');
                  setShowTopMessagesDropdown(!showTopMessagesDropdown);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
              {showTopMessagesDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-300 py-1" style={{ zIndex: 9999 }}>
                  <button 
                    onClick={() => {
                      console.log('Mark all as read clicked');
                      setShowTopMessagesDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark All as Read
                  </button>
                  <button 
                    onClick={() => {
                      console.log('Archive all clicked');
                      setShowTopMessagesDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive All
                  </button>
                  <button 
                    onClick={() => {
                      console.log('Delete all clicked');
                      setShowTopMessagesDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <StartConversationModal>
            <button className="w-full bg-primary-100 text-primary-700 py-2 px-4 flex items-center justify-center space-x-2 hover:bg-primary-200 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Conversation</span>
            </button>
          </StartConversationModal>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversationId(conversation.id)}
              className={`p-4 m-2 cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-200 rounded-lg relative ${
                selectedConversationId === conversation.id ? 'bg-gray-100 shadow-md' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {conversation.senderAvatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {conversation.sender}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary-100 text-primary-700 text-xs w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
              
              {/* 3 Dots Button - always visible */}
              <div className="absolute top-2 right-2" ref={conversationDropdownRef}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Conversation dropdown clicked for:', conversation.sender);
                    setShowConversationDropdown(showConversationDropdown === conversation.id ? null : conversation.id);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                {showConversationDropdown === conversation.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-300 py-1" style={{ zIndex: 9999 }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Mark as read clicked for:', conversation.sender);
                        setShowConversationDropdown(null);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Check className="w-3 h-3 mr-2" />
                      Mark as Read
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Archive clicked for:', conversation.sender);
                        setShowConversationDropdown(null);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Archive className="w-3 h-3 mr-2" />
                      Archive
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Delete clicked for:', conversation.sender);
                        setShowConversationDropdown(null);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col bg-white" style={{ flex: 'none', order: 2, flexGrow: 0 }}>
        {selectedConversationId ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AvatarImage 
                    src="https://randomuser.me/api/portraits/women/25.jpg"
                    alt={selectedConversation?.sender || "User"}
                    fallback={selectedConversation?.senderAvatar || "U"}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversation?.sender}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedConversation?.timestamp}
                    </p>
                  </div>
                </div>
                <div className="relative" ref={chatHeaderDropdownRef}>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Chat header dropdown clicked');
                      setShowChatHeaderDropdown(!showChatHeaderDropdown);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showChatHeaderDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-300 py-1" style={{ zIndex: 9999 }}>
                      <button 
                        onClick={() => {
                          console.log('Mute notifications clicked');
                          setShowChatHeaderDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <VolumeX className="w-4 h-4 mr-2" />
                        Mute Notifications
                      </button>
                      <button 
                        onClick={() => {
                          console.log('Block user clicked');
                          setShowChatHeaderDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Block User
                      </button>
                      <button 
                        onClick={() => {
                          console.log('Chat settings clicked');
                          setShowChatHeaderDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Chat Settings
                      </button>
                      <button 
                        onClick={() => {
                          console.log('Delete chat clicked');
                          setShowChatHeaderDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 bg-white overflow-y-auto">
              <div className="space-y-4">
                {/* Juliana's first message */}
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="flex items-center justify-between mb-2">
                      <AvatarImage 
                        src="https://randomuser.me/api/portraits/women/25.jpg"
                        alt="Juliana Wills"
                        fallback="JW"
                        size="sm"
                      />
                      <div className="relative" ref={messageDropdownRef}>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Juliana message dropdown clicked, current state:', showMessageDropdown);
                            setShowMessageDropdown(prev => {
                              console.log('Setting message dropdown to:', !prev);
                              return !prev;
                            });
                          }}
                          className={`p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded border ${showMessageDropdown ? 'bg-blue-100 border-blue-300' : 'border-gray-300'}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {/* Debug indicator */}
                        <span className="absolute -top-6 left-0 text-xs text-red-500 bg-yellow-100 px-1 rounded">
                          {showMessageDropdown ? 'OPEN' : 'CLOSED'}
                        </span>
                        {showMessageDropdown && (
                          <div className="absolute right-0 top-full mt-2 w-40 bg-yellow-100 rounded-lg shadow-xl border-2 border-red-500 py-1" style={{ zIndex: 9999 }}>
                            <button 
                              onClick={() => {
                                console.log('Edit Juliana message clicked');
                                setShowMessageDropdown(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="w-3 h-3 mr-2" />
                              Edit
                            </button>
                            <button 
                              onClick={() => {
                                console.log('Delete Juliana message clicked');
                                setShowMessageDropdown(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </button>
                            <button 
                              onClick={() => {
                                console.log('Copy Juliana message clicked');
                                setShowMessageDropdown(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FileText className="w-3 h-3 mr-2" />
                              Copy
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-4 py-2  bg-gray-100 text-gray-900">
                      <p className="text-sm">Hi 👋 I'll do that task now, you can start working on another task!</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">2hrs ago</p>
                  </div>
                </div>

                {/* Juliana's second message with attachments */}
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="px-4 py-2  bg-gray-100 text-gray-900">
                      <p className="text-sm">If you complete Webdesign Task, You can start another task with @john, Here is few documents, check this before satarting your tasks</p>
                      
                      {/* Attachments */}
                      <div className="mt-3 space-y-2">
                        <div className="bg-white p-3  border border-gray-200 flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Webdesign.doc</p>
                            <p className="text-xs text-gray-500">3.4MB</p>
                          </div>
                        </div>
                        <div className="bg-white p-3  border border-gray-200 flex items-center space-x-3">
                          <File className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Branding.PDF</p>
                            <p className="text-xs text-gray-500">10.5MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">25/10/2022 • 10:00AM</p>
                  </div>
                </div>
                
                {/* Date Separator */}
                <div className="flex justify-center my-4">
                  <div className="flex items-center w-full">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-xs text-gray-500 bg-white">TODAY</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                </div>

                {/* Your message */}
                <div className="flex justify-end">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="px-4 py-2 bg-gray-200 text-gray-900">
                      <p className="text-sm">Hello @Juliana, I'll completed the task you send ✅</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Today • 2hrs ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200 relative">
              <div className="flex items-center space-x-3">
                <AvatarImage 
                  src={currentUser?.avatarUrl || ""}
                  alt={currentUser?.name || "Me"}
                  fallback={currentUser ? getInitials(currentUser.name) : "M"}
                  size="md"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type Message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-2 pr-20 border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {/* Image Upload Button */}
                  <button
                    onClick={() => {
                      console.log('Image upload clicked');
                      // TODO: Implement image upload functionality
                    }}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-700 transition-colors"
                    title="Upload Image"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-700 transition-colors"
                  >
                    <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                  </button>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="relative" ref={uploadDropdownRef}>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Upload dropdown clicked, current state:', showUploadDropdown);
                      setShowUploadDropdown(prev => {
                        console.log('Setting upload dropdown to:', !prev);
                        return !prev;
                      });
                    }}
                    className={`p-2 text-gray-400 hover:text-gray-600 transition-colors rounded ${showUploadDropdown ? 'bg-gray-200' : ''}`}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {showUploadDropdown && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-xl border border-gray-300 py-1" style={{ zIndex: 9999 }}>
                      <button 
                        onClick={() => {
                          console.log('Upload image clicked');
                          setShowUploadDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Image className="w-4 h-4 mr-2" />
                        Upload Image
                      </button>
                      <button 
                        onClick={() => {
                          console.log('Upload video clicked');
                          setShowUploadDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Upload Video
                      </button>
                      <button 
                        onClick={() => {
                          console.log('Upload audio clicked');
                          setShowUploadDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Upload Audio
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Settings Popup */}
              <ConversationSettingsPopup
                isOpen={showSettingsPopup}
                onClose={() => setShowSettingsPopup(false)}
                onInviteToTeam={() => console.log('Invite to team')}
                onBlockUser={() => console.log('Block user')}
                onDeleteChat={() => console.log('Delete chat')}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

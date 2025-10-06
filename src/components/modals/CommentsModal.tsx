import React, { useState } from 'react';
import { 
  Send, 
  MoreVertical, 
  ThumbsUp, 
  Reply,
  Paperclip,
  Smile
} from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback } from '../ui/Avatar';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Designer'
    },
    content: 'I\'ve completed the initial design mockups. Please review and let me know if you need any changes.',
    timestamp: '2 hours ago',
    likes: 3,
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Mike Chen',
          avatar: 'MC',
          role: 'Developer'
        },
        content: 'Looks great! The layout is exactly what we need.',
        timestamp: '1 hour ago',
        likes: 1,
        replies: []
      }
    ]
  },
  {
    id: '2',
    author: {
      name: 'Emily Davis',
      avatar: 'ED',
      role: 'Product Manager'
    },
    content: 'Can we add a dark mode option to the design? This would be a great feature for our users.',
    timestamp: '3 hours ago',
    likes: 5,
    replies: []
  },
  {
    id: '3',
    author: {
      name: 'Alex Rodriguez',
      avatar: 'AR',
      role: 'QA Engineer'
    },
    content: 'I\'ve tested the current implementation and found a few minor issues. Will create tickets for them.',
    timestamp: '4 hours ago',
    likes: 2,
    replies: []
  }
];

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  taskTitle
}) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        author: {
          name: 'John Doe',
          avatar: 'JD',
          role: 'Current User'
        },
        content: newComment,
        timestamp: 'Just now',
        likes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleAddReply = (parentId: string) => {
    if (replyText.trim()) {
      const reply: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        author: {
          name: 'John Doe',
          avatar: 'JD',
          role: 'Current User'
        },
        content: replyText,
        timestamp: 'Just now',
        likes: 0,
        replies: []
      };

      setComments(comments.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ));
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <ModalContent className="max-w-4xl">
        <ModalHeader>
          <ModalTitle>{`Comments - ${taskTitle}`}</ModalTitle>
        </ModalHeader>
      <div className="space-y-6">
        {/* Comments List */}
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {comments.map(comment => (
            <div key={comment.id} className="space-y-4">
              {/* Main Comment */}
              <div className="flex space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {comment.author.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50  p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">
                          {comment.author.name}
                        </h4>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 ">
                          {comment.author.role}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(comment.timestamp)}
                        </span>
                        <button className="p-1 hover:bg-gray-200">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-primary-600"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{comment.likes}</span>
                      </button>
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-primary-600"
                      >
                        <Reply className="w-4 h-4" />
                        <span className="text-sm">Reply</span>
                      </button>
                    </div>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="ml-8 mt-3">
                      <div className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
                            JD
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full p-3 border border-gray-300  focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                            rows={2}
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddReply(comment.id)}
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-8 mt-3 space-y-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
                              {reply.author.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-white border border-gray-200  p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium text-gray-900 text-sm">
                                    {reply.author.name}
                                  </h5>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 ">
                                    {reply.author.role}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatTime(reply.timestamp)}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-600">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span className="text-xs">{reply.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-600">
                                  <Reply className="w-3 h-3" />
                                  <span className="text-xs">Reply</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary-100 text-primary-700">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300  focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 ">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 ">
                    <Smile className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <Button onClick={handleAddComment}>
                  <Send className="w-4 h-4 mr-2" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </ModalContent>
    </Modal>
  );
};

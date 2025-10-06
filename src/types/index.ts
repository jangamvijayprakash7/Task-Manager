export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assignees: string[]; // array of team member IDs
  projectId?: string; // optional, for filtering by project
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string for recent feed
  tags?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  teamId: string; // which team is assigned
  taskIds: string[]; // tasks under this project
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string; // or use initials if not provided
  isActive: boolean;
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
  avatarUrl?: string;
  provider?: string; // 'Google', 'Facebook', 'email', etc.
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    emailNotifications: boolean;
  };
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  plan: 'free' | 'starter' | 'premium';
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  amount: number;
  userCount: number;
  paymentMethod?: PaymentMethod;
  autoRenew: boolean;
  trialEndDate?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'netbanking' | 'upi';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  upiId?: string;
  bankName?: string;
}

export interface BillingHistory {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'failed' | 'pending' | 'refunded';
  paymentMethod: string;
  billingDate: string;
  description: string;
  invoiceUrl?: string;
}

export interface Activity {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_completed' | 'project_created' | 'member_added';
  userId: string;
  targetId: string; // task or project ID
  description: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface InboxMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  unreadCount: number;
  type: 'direct' | 'team' | 'notification';
}

export interface ConversationMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  name: string;
  size: string;
  type: 'doc' | 'pdf' | 'image' | 'other';
}

export interface Conversation {
  id: string;
  sender: string;
  senderAvatar: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  unreadCount: number;
  messages: ConversationMessage[];
}

export type ViewMode = 'list' | 'kanban' | 'calendar';
export type Theme = 'light' | 'dark';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';


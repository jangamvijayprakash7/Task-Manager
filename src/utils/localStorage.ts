import { Task, Project, TeamMember, Team, User, Activity, Notification } from '../types';

const STORAGE_KEYS = {
  TASKS: 'task-manager-tasks',
  PROJECTS: 'task-manager-projects',
  TEAM_MEMBERS: 'task-manager-team-members',
  TEAMS: 'task-manager-teams',
  USER: 'task-manager-user',
  ACTIVITIES: 'task-manager-activities',
  NOTIFICATIONS: 'task-manager-notifications',
  THEME: 'task-manager-theme',
} as const;

// Generic functions
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

// Specific data functions
export const getTasks = (): Task[] => getFromStorage(STORAGE_KEYS.TASKS, []);
export const setTasks = (tasks: Task[]): void => setToStorage(STORAGE_KEYS.TASKS, tasks);

export const getProjects = (): Project[] => getFromStorage(STORAGE_KEYS.PROJECTS, []);
export const setProjects = (projects: Project[]): void => setToStorage(STORAGE_KEYS.PROJECTS, projects);

export const getTeamMembers = (): TeamMember[] => getFromStorage(STORAGE_KEYS.TEAM_MEMBERS, []);
export const setTeamMembers = (members: TeamMember[]): void => setToStorage(STORAGE_KEYS.TEAM_MEMBERS, members);

export const getTeams = (): Team[] => getFromStorage(STORAGE_KEYS.TEAMS, []);
export const setTeams = (teams: Team[]): void => setToStorage(STORAGE_KEYS.TEAMS, teams);

export const getUser = (): User | null => getFromStorage(STORAGE_KEYS.USER, null);
export const setUser = (user: User): void => setToStorage(STORAGE_KEYS.USER, user);

export const getActivities = (): Activity[] => getFromStorage(STORAGE_KEYS.ACTIVITIES, []);
export const setActivities = (activities: Activity[]): void => setToStorage(STORAGE_KEYS.ACTIVITIES, activities);

export const getNotifications = (): Notification[] => getFromStorage(STORAGE_KEYS.NOTIFICATIONS, []);
export const setNotifications = (notifications: Notification[]): void => setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);

export const getTheme = (): 'light' | 'dark' => getFromStorage(STORAGE_KEYS.THEME, 'light');
export const setTheme = (theme: 'light' | 'dark'): void => setToStorage(STORAGE_KEYS.THEME, theme);

// Clear user data (for logout)
export const clearUser = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error clearing user from localStorage:', error);
  }
};

// Clear all data (for guest users)
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.TEAM_MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.TEAMS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    // Keep theme preference
  } catch (error) {
    console.error('Error clearing all data from localStorage:', error);
  }
};

// Initialize dummy data
export const initializeDummyData = () => {
  // Check if data already exists
  if (getTasks().length > 0) return;

  const dummyTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Project Manager',
      avatarUrl: undefined,
      isActive: true,
      joinedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Developer',
      avatarUrl: undefined,
      isActive: true,
      joinedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Designer',
      avatarUrl: undefined,
      isActive: true,
      joinedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'QA Engineer',
      avatarUrl: undefined,
      isActive: true,
      joinedAt: new Date().toISOString(),
    },
  ];

  const dummyTeams: Team[] = [
    {
      id: '1',
      name: 'Development Team',
      description: 'Main development team for web applications',
      memberIds: ['1', '2', '3'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'QA Team',
      description: 'Quality assurance and testing team',
      memberIds: ['4'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const dummyProjects: Project[] = [
    {
      id: '1',
      name: 'Task Manager App',
      description: 'A comprehensive task management application',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      teamId: '1',
      taskIds: ['1', '2', '3', '4'],
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Mobile App Redesign',
      description: 'Redesign of the mobile application interface',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      teamId: '1',
      taskIds: ['5', '6'],
      status: 'Planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const dummyTasks: Task[] = [
    {
      id: '1',
      title: 'Design user interface',
      description: 'Create wireframes and mockups for the main dashboard',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'In Progress',
      priority: 'High',
      assignees: ['3'],
      projectId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['design', 'ui'],
    },
    {
      id: '2',
      title: 'Implement authentication',
      description: 'Set up user authentication and authorization',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'To Do',
      priority: 'High',
      assignees: ['2'],
      projectId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['backend', 'auth'],
    },
    {
      id: '3',
      title: 'Create task management features',
      description: 'Implement CRUD operations for tasks',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'To Do',
      priority: 'Medium',
      assignees: ['2'],
      projectId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['frontend', 'crud'],
    },
    {
      id: '4',
      title: 'Write unit tests',
      description: 'Create comprehensive test suite for the application',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'To Do',
      priority: 'Medium',
      assignees: ['4'],
      projectId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['testing', 'quality'],
    },
    {
      id: '5',
      title: 'Research mobile design patterns',
      description: 'Study current mobile app design trends and patterns',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Done',
      priority: 'Low',
      assignees: ['3'],
      projectId: '2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['research', 'mobile'],
    },
    {
      id: '6',
      title: 'Create mobile wireframes',
      description: 'Design wireframes for mobile app screens',
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'In Progress',
      priority: 'Medium',
      assignees: ['3'],
      projectId: '2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['design', 'mobile', 'wireframes'],
    },
  ];

  const dummyUser: User = {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    avatarUrl: undefined,
    preferences: {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
    },
  };

  const dummyActivities: Activity[] = [
    {
      id: '1',
      type: 'task_completed',
      userId: '3',
      targetId: '5',
      description: 'Mike Johnson completed "Research mobile design patterns"',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      type: 'task_created',
      userId: '1',
      targetId: '6',
      description: 'John Doe created "Create mobile wireframes"',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      type: 'project_created',
      userId: '1',
      targetId: '2',
      description: 'John Doe created project "Mobile App Redesign"',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const dummyNotifications: Notification[] = [
    {
      id: '1',
      title: 'Task Due Soon',
      message: 'Design user interface is due in 2 days',
      type: 'warning',
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Task Completed',
      message: 'Research mobile design patterns has been completed',
      type: 'success',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Set all dummy data (except user - let user login manually)
  setTeamMembers(dummyTeamMembers);
  setTeams(dummyTeams);
  setProjects(dummyProjects);
  setTasks(dummyTasks);
  // setUser(dummyUser); // Don't auto-login dummy user
  setActivities(dummyActivities);
  setNotifications(dummyNotifications);
};


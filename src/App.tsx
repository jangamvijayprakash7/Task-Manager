import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ModalProvider } from './components/ModalManager';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ToastContainer } from './components/ui/Toast';
import { Layout } from './components/layout/Layout';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { OTPVerification } from './components/auth/OTPVerification';
import { Home } from './components/screens/Home';
import { Dashboard } from './components/screens/Dashboard';
import { Inbox } from './components/screens/Inbox';
import { Timeline } from './components/screens/Timeline';
import TeamTimeline from './components/screens/TeamTimeline';
import { Board } from './components/screens/Board';
import { Teams } from './components/screens/Teams';
import { Tasks } from './components/screens/Tasks';
import { Projects } from './components/screens/Projects';
import { Team } from './components/screens/Team';
import { Settings } from './components/screens/Settings';
import { MoreOptions } from './components/screens/MoreOptions';
import { Profile } from './components/screens/Profile';
import { Calendar } from './components/screens/Calendar';
import { KanbanBoard } from './components/screens/KanbanBoard';
import { Notifications } from './components/screens/Notifications';
import { SearchResults } from './components/screens/SearchResults';
import { PremiumPlan } from './components/screens/PremiumPlan';
import { RoleSelection } from './components/screens/RoleSelection';
import { MyContacts } from './components/screens/MyContacts';
import { HelpSupport } from './components/screens/HelpSupport';
import { UserProfile } from './components/screens/UserProfile';
import InviteUsers from './components/screens/InviteUsers';
import { initializeDummyData } from './utils/localStorage';

function AppRouter() {
  const [activeItem, setActiveItem] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const location = useLocation();

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleLogout = () => {
    logout();
    setActiveItem('home');
  };

  const handleLogin = async (email: string, password: string) => {
    // This will be handled by the Login component
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    // This will be handled by the Signup component
  };

  const handleContinueAsGuest = () => {
    // This will be handled by the Login component
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    // This will be handled by the Login component
  };

  // Navigate from in-app UI (e.g., header) to auth screens
  const handleNavigateToLogin = () => {
    // Ensure we exit guest/auth state so unauthenticated branch renders the Login screen
    logout();
    setAuthMode('login');
  };

  const handleNavigateToSignup = () => {
    logout();
    setAuthMode('signup');
  };

  // Initialize dummy data on app start
  useEffect(() => {
    initializeDummyData();
  }, []);

  // Show welcome toast when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser && location.pathname === '/') {
      success('Welcome!', `Welcome back, ${currentUser.name}!`);
    }
  }, [isAuthenticated, currentUser, location.pathname, success]);

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-gray-50">
        {authMode === 'login' && (
            <Login
            onSwitchToSignup={() => setAuthMode('signup')}
            onSwitchToForgotPassword={() => setAuthMode('forgot')}
            onSwitchToOTP={() => setAuthMode('otp')}
          />
        )}
        {authMode === 'signup' && (
          <Signup
            onSwitchToLogin={() => setAuthMode('login')}
            onSwitchToOTP={() => setAuthMode('otp')}
          />
        )}
        {authMode === 'forgot' && (
          <ForgotPassword
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
        {authMode === 'otp' && (
          <OTPVerification
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
        </div>
      );
    }
    
    return (
    <Layout 
      activeItem={activeItem}
      onItemClick={handleItemClick}
      onLogout={handleLogout}
      currentUser={currentUser!}
      isAuthenticated={isAuthenticated}
      onNavigateToLogin={handleNavigateToLogin}
      onNavigateToSignup={handleNavigateToSignup}
    >
      <Routes>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="team-timeline" element={<TeamTimeline />} />
        <Route path="boards" element={<Board />} />
        <Route path="teams" element={<Teams />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="projects" element={<Projects />} />
        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} />
        <Route path="more" element={<MoreOptions />} />
        <Route path="profile" element={<Profile />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="kanban" element={<KanbanBoard />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="premium" element={<PremiumPlan />} />
        <Route path="onboarding/role" element={<RoleSelection />} />
        <Route path="contacts" element={<MyContacts />} />
        <Route path="help-support" element={<HelpSupport />} />
        <Route path="invite-users" element={<InviteUsers />} />
        <Route path="profile/:id" element={<UserProfile />} />
      </Routes>
    </Layout>
  );
}

// Toast Container Component
const ToastContainerWrapper: React.FC = () => {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onRemove={removeToast} />;
};

// Main App component with providers
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ModalProvider>
          <Router>
            <AppRouter />
            <ToastContainerWrapper />
          </Router>
        </ModalProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
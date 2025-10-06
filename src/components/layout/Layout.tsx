import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { initializeDummyData } from '../../utils/localStorage';
import { User } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  activeItem: string;
  onItemClick: (item: string) => void;
  onLogout: () => void;
  currentUser: User | null;
  isAuthenticated: boolean;
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeItem,
  onItemClick,
  onLogout,
  currentUser,
  isAuthenticated,
  onNavigateToLogin,
  onNavigateToSignup
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize dummy data on first load
  useEffect(() => {
    initializeDummyData();
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Navigate to tasks page with search query
      navigate(`/tasks?search=${encodeURIComponent(query)}`);
    }
  };

  const handleCreateNew = () => {
    // Navigate to create task modal
    navigate('/tasks?create=true');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeItem={activeItem}
        onItemClick={onItemClick}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onSearch={handleSearch} 
          onCreateNew={handleCreateNew} 
          onLogout={onLogout}
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
          onNavigateToLogin={onNavigateToLogin}
          onNavigateToSignup={onNavigateToSignup}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

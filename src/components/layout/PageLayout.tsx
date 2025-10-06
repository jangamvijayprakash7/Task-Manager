import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { User } from '../../types';

interface PageLayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
  isAuthenticated: boolean;
  onSearch: (query: string) => void;
  onCreateNew: () => void;
  onLogout: () => void;
  showSidebar?: boolean;
  showHeader?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  currentUser,
  isAuthenticated,
  onSearch,
  onCreateNew,
  onLogout,
  showSidebar = true,
  showHeader = true
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('');

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {showSidebar && (
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={handleToggleSidebar}
          activeItem={activeItem}
          onItemClick={handleItemClick}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showHeader && (
          <Header
            onSearch={onSearch}
            onCreateNew={onCreateNew}
            onLogout={onLogout}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
          />
        )}
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

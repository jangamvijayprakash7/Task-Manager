import React, { useState, createContext, useContext, ReactNode } from 'react';

interface ModalState {
  isOpen: boolean;
  content: ReactNode | null;
  onClose: () => void;
}

interface ModalContextType {
  openModal: (content: ReactNode, onClose: () => void) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    content: null,
    onClose: () => {}
  });

  const openModal = (content: ReactNode, onClose: () => void) => {
    setModalState({
      isOpen: true,
      content,
      onClose
    });
  };

  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {/* Render modal at root level */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={modalState.onClose}
          />
          {/* Modal Content */}
          <div 
            className="relative bg-white  shadow-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {modalState.content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModalManager = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalManager must be used within a ModalProvider');
  }
  return context;
};

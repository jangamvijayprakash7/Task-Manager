import React from 'react';

interface InviteMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const members = [
  { id: 1, name: "Johnson Williamson", role: "UX Designer", avatar: "https://i.pravatar.cc/40?img=5", timeAgo: "3hrs ago" },
  { id: 2, name: "Lila Juliana", role: "Graphics designer", avatar: "https://i.pravatar.cc/40?img=2", timeAgo: "3hrs ago" },
  { id: 3, name: "Olivia Thomas", role: "Senior Developer", avatar: "https://i.pravatar.cc/40?img=8", timeAgo: "3hrs ago" },
  { id: 4, name: "Liam Benjamin", role: "Senior Developer", avatar: "https://i.pravatar.cc/40?img=3", timeAgo: "3hrs ago" },
  { id: 5, name: "Henry Lucas", role: "Senior Developer", avatar: "https://i.pravatar.cc/40?img=1", timeAgo: "3hrs ago" },
  { id: 6, name: "Kane Martin", role: "Senior Developer", avatar: "https://i.pravatar.cc/40?img=4", timeAgo: "3hrs ago" },
];

const InviteMembersModal: React.FC<InviteMembersModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Invite memebrs to timeline</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="flex items-center space-x-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-base">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400 font-medium">{member.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMembersModal;

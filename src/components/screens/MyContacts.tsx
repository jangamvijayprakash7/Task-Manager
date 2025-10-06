import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export const MyContacts: React.FC = () => {
  const { success, info } = useToast();
  const [invitedContacts, setInvitedContacts] = useState<Set<string>>(new Set());

  const contacts = [
    {
      id: '1',
      name: 'Johnson Williamson',
      role: 'UX Designer',
      location: 'Newyork, USA',
      avatar: 'JW',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Olivia Thomas',
      role: 'Senior Developer',
      location: 'California, USA',
      avatar: 'OT',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Kane Martin',
      role: 'Senior Developer',
      location: 'Newyork, USA',
      avatar: 'KM',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '4',
      name: 'Lila Juliana',
      role: 'Graphics designer',
      location: 'Sydney, Australia',
      avatar: 'LJ',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '5',
      name: 'Charlotte Amelia',
      role: 'Senior Developer',
      location: 'Newyork, USA',
      avatar: 'CA',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '6',
      name: 'Liam Benjamin',
      role: 'Senior Developer',
      location: 'Newyork, USA',
      avatar: 'LB',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '7',
      name: 'Henry Lucas',
      role: 'Senior Developer',
      location: 'Newyork, USA',
      avatar: 'HL',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const handleInvite = (contactId: string) => {
    setInvitedContacts(prev => new Set(prev).add(contactId));
    // Simulate invite sent
    setTimeout(() => {
      success('Invite Sent', 'Invite sent successfully!');
    }, 500);
  };

  const handleImport = () => {
    info('Import Contacts', 'Import contacts functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Contacts</h1>
            <p className="text-gray-600 mt-1">230 Contacts are available</p>
          </div>
          
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Import</span>
          </button>
        </div>

        {/* Contacts List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={contact.image}
                      alt={contact.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-sm font-medium text-gray-700">${contact.avatar}</span>`;
                        }
                      }}
                    />
                  </div>
                  
                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">
                      {contact.role} • {contact.location}
                    </p>
                  </div>
                </div>
                
                {/* Invite Button */}
                <button
                  onClick={() => handleInvite(contact.id)}
                  disabled={invitedContacts.has(contact.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    invitedContacts.has(contact.id)
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {invitedContacts.has(contact.id) ? 'Invited' : '+ Invite'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {invitedContacts.size} of {contacts.length} contacts invited
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AvatarImage } from '../ui/AvatarImage';
import { MoreHorizontal, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '../ui/Modal';
import { useToast } from '../../contexts/ToastContext';
import { getInitials } from '../ui/Avatar';

interface NavStateUser {
  id?: string;
  name?: string;
  image?: string;
  avatar?: string;
}

export const UserProfile: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = (location.state || {}) as { user?: NavStateUser };

  const fallbackById: Record<string, NavStateUser> = {
    robert: { id: 'robert', name: 'Robert Anderson', image: 'https://randomuser.me/api/portraits/men/8.jpg', avatar: 'RA' },
    henry: { id: 'henry', name: 'Henry Kane', image: 'https://randomuser.me/api/portraits/men/19.jpg', avatar: 'HK' },
    juliana: { id: 'juliana', name: 'Juliana Wills', image: 'https://randomuser.me/api/portraits/women/25.jpg', avatar: 'JW' },
    emma: { id: 'emma', name: 'Emma Olivia', image: 'https://randomuser.me/api/portraits/women/37.jpg', avatar: 'EO' },
    benjamin: { id: 'benjamin', name: 'Benjamin Jack', image: 'https://randomuser.me/api/portraits/men/41.jpg', avatar: 'BJ' }
  };

  const user = state.user || (id ? fallbackById[id] : undefined) || { name: 'Member', avatar: 'M' };

  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Complete all pages in mobile app design based on Super OS Components', date: '25 Aug 2022 - 11:30AM', tag: 'Design Tag', done: false },
    { id: 't2', title: 'Meet with front end developers to discuss about new features', date: '25 Aug 2022 - 11:30AM', tag: 'Design Tag', done: false },
    { id: 't3', title: 'Complete User testing with at least 5 users', date: '25 Aug 2022 - 11:30AM', tag: 'Design Tag', done: false }
  ]);

  // Local modals: Assign Task and Invite
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [taskName, setTaskName] = useState('Design new draft');
  const [dueDate, setDueDate] = useState('2022-10-20');
  const [dueTime, setDueTime] = useState('11:30');
  const [taskTags] = useState<string[]>(['User Experience Design', 'UI Design']);
  const [selectedTag, setSelectedTag] = useState(taskTags[0]);
  const { success } = useToast();

  return (<>
    <div className="pt-4 pb-6 px-6 flex justify-center h-full overflow-hidden">
      <div className="w-full max-w-3xl h-full overflow-hidden">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AvatarImage
                src={user.image || ''}
                alt={user.name || 'Member'}
                fallback={user.avatar || 'M'}
                size="xl"
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-500">@{(user.name || 'member').toLowerCase().replace(/\s+/g, '')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setShowAssignTask(true)} className="px-3 py-2 text-xs rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200">Assign Task</button>
              <button onClick={() => setShowInvite(true)} className="px-3 py-2 text-xs rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Invite</button>
            </div>
          </div>

          {/* About */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Today Tasks */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Today Tasks ({tasks.length})</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {tasks.map(t => (
                <div key={t.id} className="flex items-start">
                  <div className="flex items-start space-x-2 flex-1">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => setTasks(prev => prev.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                      className="mt-1 w-4 h-4"
                      style={{ accentColor: '#6B40ED' }}
                    />
                    <div>
                      <p className={`text-sm ${t.done ? 'line-through text-gray-500' : 'text-gray-900'}`}>{t.title}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center space-x-1"><CalendarIcon className="w-3 h-3" /><span>{t.date}</span></span>
                        <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6B40ED' }}></span><span>{t.tag}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Joined Teams */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Joined Teams (2)</h3>
            <div className="space-y-3">
              {[1,2].map(i => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AvatarImage src={i === 1 ? 'https://randomuser.me/api/portraits/men/45.jpg' : ''} alt="Team" fallback="D" size="md" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Development Team</p>
                      <p className="text-xs text-gray-500">36 Members</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Card */}
          <div className="mt-6 p-4 border border-gray-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">✉️</div>
              <div>
                <p className="text-sm font-medium text-gray-900">Invite others to earn money</p>
                <p className="text-xs text-gray-500">You'll get instant money for each signups</p>
              </div>
            </div>
            <button className="px-3 py-2 bg-black text-white text-xs rounded-lg">+ Invite Now</button>
          </div>
        </div>
      </div>
    </div>

    {/* Assign Task Modal */}
    <Modal open={showAssignTask} onOpenChange={setShowAssignTask}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Assign Task</ModalTitle>
        </ModalHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Task Name</label>
            <input value={taskName} onChange={(e) => setTaskName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Due date</label>
              <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Due Time</label>
              <input value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Task Tag</label>
            <div className="flex flex-wrap gap-2">
              {taskTags.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedTag === tag ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              setTasks(prev => [{ id: `t${Date.now()}`, title: taskName, date: `${dueDate} - ${dueTime}`, tag: selectedTag || taskTags[0], done: false }, ...prev]);
              setShowAssignTask(false);
              success('Task Created', 'The task was created successfully.');
            }}
            className="w-full py-2 bg-black text-white rounded-lg"
          >
            Create
          </button>
        </div>
      </ModalContent>
    </Modal>

    {/* Invite Modal */}
    <Modal open={showInvite} onOpenChange={setShowInvite}>
      <ModalContent className="max-w-sm">
        <ModalHeader>
          <ModalTitle>Invite to team</ModalTitle>
        </ModalHeader>
        <div className="max-h-80 overflow-y-auto divide-y">
          {[
            { id: 'john', name: "John's Team", members: '30 Members', image: 'https://randomuser.me/api/portraits/men/12.jpg' },
            { id: 'ux', name: 'UX designers', members: '45 Members', image: 'https://randomuser.me/api/portraits/women/22.jpg' },
            { id: 'juliana', name: "Juliana's Team", members: '5 Members', image: 'https://randomuser.me/api/portraits/women/25.jpg' },
            { id: 'senior', name: 'Senior Developers', members: '23 Members', image: 'https://randomuser.me/api/portraits/men/28.jpg' },
            { id: 'anderson', name: "Anderson's Team", members: '3 Members', image: 'https://randomuser.me/api/portraits/men/31.jpg' }
          ].map(team => (
            <div key={team.id} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <AvatarImage src={team.image} alt={team.name} fallback={getInitials(team.name)} size="sm" />
                <div>
                  <p className="text-sm text-gray-900">{team.name}</p>
                  <p className="text-xs text-gray-500">{team.members}</p>
                </div>
              </div>
              <button
                onClick={() => success('Invite Sent', `Invitation sent to ${team.name}`)}
                className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          ))}
        </div>
      </ModalContent>
    </Modal>
  </>);
};



import React, { useMemo, useState } from 'react';
import { CheckCircle2, FileText } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

// Simple email validator for client-side UX only
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

interface InviteUsersProps {
  totalInvites?: number;
  acceptedInvites?: number;
}

const InviteUsers: React.FC<InviteUsersProps> = ({ totalInvites = 0, acceptedInvites = 0 }) => {
  const { success, error, info } = useToast();
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const inviteCountText = useMemo(() => `${emails.length} email address${emails.length === 1 ? '' : 'es'} added to invite`, [emails.length]);

  const handleRemove = (address: string) => {
    setEmails(prev => prev.filter(e => e !== address));
    info('Email Removed', `${address} removed from invite list.`);
  };

  const handleSubmit = async () => {
    if (submitting || emails.length === 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      success(
        'Invites Sent',
        `Successfully sent invites to ${emails.length} email address${emails.length === 1 ? '' : 'es'}.`
      );
      setEmails([]);
    }, 800);
  };

  const addFromInput = () => {
    const raw = emailInput.trim();
    if (!raw) return;
    const entries = raw.split(/[\s,;]+/).filter(Boolean);
    const unique = entries.filter((e) => !emails.includes(e));
    const validNew = unique.filter(isValidEmail);
    if (validNew.length > 0) {
      setEmails(prev => [...prev, ...validNew]);
      setEmailInput('');
      const msg = validNew.length === 1 ? `${validNew[0]} added to invite list.` : `${validNew.length} emails added to invite list.`;
      success('Email Added', msg);
    } else {
      error('Could not add', 'Please enter valid, non-duplicate email addresses.');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Invite Users</h2>
          <p className="text-sm text-gray-500 mt-1">You can invite multiple users at once</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Invites Sent</p>
                <p className="text-base font-semibold text-gray-900">{(totalInvites / 1000).toFixed(1)}K</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Accepted Invites</p>
                <p className="text-base font-semibold text-gray-900">{(acceptedInvites / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter emails and press Add"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFromInput(); } }}
              />
              <Button onClick={addFromInput}>Add</Button>
            </div>
          </div>

          <div className="space-y-2">
            {emails.map(email => (
              <div key={email} className="flex items-center justify-between py-2 px-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100" />
                  <span className="text-sm text-gray-800">{email}</span>
                </div>
                <button onClick={() => handleRemove(email)} className="text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50">Remove</button>
              </div>
            ))}
          </div>

          <p className="text-sm text-purple-600">{inviteCountText}, Click invite to send Invite</p>

          <div>
            <Button disabled={submitting || emails.length === 0} onClick={handleSubmit} className="bg-black text-white hover:opacity-90">
              {submitting ? 'Sending…' : 'Invite Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUsers;



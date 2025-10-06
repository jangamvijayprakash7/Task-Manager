import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar, Plus, UserPlus } from 'lucide-react';
import { CreateTimelineModal } from '../modals/CreateTimelineModal';
import { useToast } from '../../contexts/ToastContext';

export const EmptyTimeline: React.FC = () => {
  const { success } = useToast();

  const handleTimelineCreated = (timeline: any) => {
    console.log('Timeline created:', timeline);
    success(
      'Timeline Created',
      `${timeline.name} has been added to your timelines.`
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
          <p className="text-gray-600">Create and complete tasks using boards</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Nov, 2022</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Invite</span>
          </Button>
          <CreateTimelineModal onTimelineCreated={handleTimelineCreated}>
            <Button className="bg-black text-white flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Timeline</span>
            </Button>
          </CreateTimelineModal>
        </div>
      </div>

      {/* Timeline header */}
      <div className="mb-6">
        <div className="flex space-x-8 text-sm font-medium text-gray-600">
          {[21, 22, 23, 24, 25, 26].map((day) => (
            <div key={day} className="text-center">
              <div className="w-8 h-8 flex items-center justify-center  hover:bg-gray-100 cursor-pointer">
                {day}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            {/* Timeline placeholder illustration */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-32 h-20 bg-gray-100  border-2 border-gray-200 flex items-center justify-center relative">
                <div className="w-8 h-8  flex items-center justify-center" style={{ backgroundColor: '#e3d8ff' }}>
                  <svg className="w-5 h-5" style={{ color: '#6B40ED' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                  <svg className="w-8 h-8" style={{ color: '#6B40ED' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeDasharray="5,5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
              <div className="w-32 h-20 bg-gray-100  border-2 border-gray-200 flex items-center justify-center">
                <div className="w-8 h-8  flex items-center justify-center" style={{ backgroundColor: '#e3d8ff' }}>
                  <svg className="w-5 h-5" style={{ color: '#6B40ED' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">No boards has created</h3>
            <p className="text-gray-600">
              Create board using <span className="underline cursor-pointer" style={{ color: '#6B40ED' }}>+Create Board</span> button
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

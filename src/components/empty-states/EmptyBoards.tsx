import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

export const EmptyBoards: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks Board</h1>
          <p className="text-gray-600">Create and complete tasks using boards</p>
        </div>
        <Button className="bg-purple-600 text-white px-4 py-2  hover:bg-purple-700 transition-colors">
          Create Board
        </Button>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            {/* Board placeholder illustration */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-32 h-20 bg-gray-100  border-2 border-gray-200 flex items-center justify-center relative">
                <div className="w-8 h-8 bg-purple-600  flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeDasharray="5,5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
              <div className="w-32 h-20 bg-gray-100  border-2 border-gray-200 flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-600  flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">No boards has created</h3>
            <p className="text-gray-600">
              Create board using <span className="text-purple-600 underline cursor-pointer">+Create Board</span> button
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

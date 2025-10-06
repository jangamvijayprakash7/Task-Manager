import React, { useState } from 'react';
import { 
  ArrowLeftRight,
  DollarSign,
  FolderOpen,
  Users,
  Clock,
  Shield,
  Calendar,
  Search,
  FileText,
  Megaphone,
  Trash2,
  Download,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '../ui/Button';

export const MoreOptions: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTag, setSelectedTag] = useState('Design');
  const [selectedDate, setSelectedDate] = useState('Nov 2022');

  const options = [
    {
      id: 'integrations',
      label: 'Intergrations',
      icon: ArrowLeftRight
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: DollarSign
    },
    {
      id: 'board-manager',
      label: 'Board manager',
      icon: FolderOpen
    },
    {
      id: 'team-manager',
      label: 'Team manager',
      icon: Users
    },
    {
      id: 'time-tracker',
      label: 'Time Tracker',
      icon: Clock
    },
    {
      id: 'privacy-policy',
      label: 'Privacy Policy',
      icon: DollarSign
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar
    },
    {
      id: 'advance-search',
      label: 'Advance Search',
      icon: Search
    },
    {
      id: 'billing-history',
      label: 'Billing History',
      icon: FileText
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: Trash2
    },
    {
      id: 'importer',
      label: 'Importer',
      icon: Download
    }
  ];

  const handleOptionClick = (optionId: string) => {
    console.log(`Clicked on ${optionId}`);
    setSelectedOption(optionId);
    // Handle option clicks here - you can add navigation logic later
  };

  return (
    <div className="h-full bg-white overflow-hidden">
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">More options</h1>
            <p className="text-base text-gray-600">Extra options for fast working.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filters Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-button hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Filters</span>
              {showFilters ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative min-h-0">
          {/* Options Grid */}
          <div className="h-full overflow-hidden">
            <div className="grid grid-cols-2 gap-3 h-full">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option.id)}
                    className={`p-3 text-left border rounded-card transition-colors ${
                      selectedOption === option.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedOption === option.id ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          selectedOption === option.id ? 'text-[#6B40ED]' : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className={`font-semibold text-sm ${
                        selectedOption === option.id ? 'text-purple-900' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters Panel - Overlay */}
          {showFilters && (
            <div className="absolute top-0 right-0 w-48 bg-white border-l border-gray-200 shadow-lg p-3 z-10">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Filters</h3>
              
              <div className="space-y-3">
                {/* Categories */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Categories
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                {/* Select Tag */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Select Tag
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                </div>

                {/* Select Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Select Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-2 py-1 pr-8 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                    />
                    <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

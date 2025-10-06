import React, { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  Rocket, 
  CreditCard, 
  FileText, 
  ArrowRightLeft, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Eye,
  X,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export const HelpSupport: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(1); // Open 2nd section by default
  const [email, setEmail] = useState('Johnsonwillamson@gmail.com');
  const [showAskQuestionModal, setShowAskQuestionModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const { success, error } = useToast();

  const topics = [
    {
      id: 1,
      title: 'Getting Started',
      subtitle: '30+ Blog Posts',
      icon: Rocket,
      color: '#6B40ED'
    },
    {
      id: 2,
      title: 'Payment',
      subtitle: '23+ Blog Posts',
      icon: CreditCard,
      color: '#6B40ED'
    },
    {
      id: 3,
      title: 'How to use',
      subtitle: '46+ Blog Posts',
      icon: FileText,
      color: '#6B40ED'
    },
    {
      id: 4,
      title: 'Integrations',
      subtitle: '14+ Blog Posts',
      icon: ArrowRightLeft,
      color: '#6B40ED'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How to use superpage?',
      answer: 'Superpage is a comprehensive project management tool. To get started, create an account, set up your workspace, and invite team members. You can create boards, assign tasks, track progress, and collaborate with your team in real-time.'
    },
    {
      id: 2,
      question: 'How to download superpage UI kits?',
      answer: 'To download our UI kits, go to the Resources section in your dashboard, select the UI kit you need, and click the download button. The kit will be available in multiple formats including Figma, Sketch, and Adobe XD.'
    },
    {
      id: 3,
      question: 'How to change Superpage UI kit colors?',
      answer: 'You can customize colors by accessing the Design System in your project settings. Go to Settings > Design System > Colors, and modify the color palette. Changes will be applied across all components automatically.'
    },
    {
      id: 4,
      question: 'How to customize master components in Figma?',
      answer: 'In Figma, select the master component, right-click and choose "Edit Component". Make your changes and they will be applied to all instances. Use the Instance panel to override specific properties without affecting the master component.'
    },
    {
      id: 5,
      question: 'How to buy Superpage SaaS UI kits?',
      answer: 'Visit our pricing page, choose the plan that fits your needs, and click "Get Started". You can pay with credit card, PayPal, or bank transfer. All plans include access to our complete UI kit library and regular updates.'
    }
  ];

  const handleFAQToggle = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSubscribe = () => {
    // Validate email
    if (!email || !email.includes('@')) {
      error('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Handle newsletter subscription
    console.log('Subscribing with email:', email);
    
    // Show success toast
    success(
      'Newsletter Subscription',
      `Successfully subscribed ${email} to our newsletter!`
    );

    // Clear the input after successful subscription
    setEmail('');
  };

  const handleAskQuestion = () => {
    setShowAskQuestionModal(true);
  };

  const handleCloseModal = () => {
    setShowAskQuestionModal(false);
    setQuestionText('');
  };

  const handleSubmitQuestion = () => {
    // Validate question text
    if (!questionText.trim()) {
      error('Empty Question', 'Please enter your question before submitting.');
      return;
    }

    if (questionText.trim().length < 10) {
      error('Question Too Short', 'Please provide more details in your question (at least 10 characters).');
      return;
    }

    // Handle question submission
    console.log('Submitting question:', questionText);
    
    // Show success toast
    success(
      'Question Submitted',
      'Your question has been submitted successfully! We\'ll get back to you soon.'
    );

    // Close modal and clear text
    handleCloseModal();
  };

  return (
    <div className="h-full bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Help and Support</h1>
              <p className="text-gray-600">You can find answers and get direct support here.</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:opacity-80 transition-opacity">
                <MessageCircle className="w-4 h-4" />
                <span>Chat Support</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border-2 rounded-lg hover:opacity-80 transition-opacity" style={{ borderColor: '#6B40ED', color: '#6B40ED' }}>
                <Mail className="w-4 h-4" />
                <span>Email Support</span>
              </button>
            </div>
          </div>
        </div>

        {/* Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#e3d8ff' }}>
                <topic.icon className="w-5 h-5" style={{ color: topic.color }} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{topic.title}</h3>
              <p className="text-sm text-gray-600">{topic.subtitle}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <button 
              onClick={handleAskQuestion}
              className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:opacity-80 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Ask Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleFAQToggle(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-900 pr-4">{faq.question}</h3>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e3d8ff' }}>
                <Mail className="w-6 h-6" style={{ color: '#6B40ED' }} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Subscribe to our newsletter</h3>
              <p className="text-gray-600 mb-4">We'll notify you for new updates on superpage</p>
              <div className="flex space-x-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                />
                <button 
                  onClick={handleSubscribe}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-80 transition-opacity"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 pb-4">
          <p>© Superpage team</p>
        </div>
      </div>

      {/* Ask Question Modal */}
      {showAskQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Ask a Question</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Please describe your question in detail. The more information you provide, the better we can help you."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white resize-none"
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {questionText.length}/500 characters
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll use this to send you a response if needed
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuestion}
                className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-80 transition-opacity"
              >
                Submit Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

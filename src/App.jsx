import React, { useState } from 'react';
import { Lightbulb, Target, DollarSign, Users, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import IdeaGenerator from './components/IdeaGenerator';
import ValidationTools from './components/ValidationTools';
import MonetizationPlanner from './components/MonetizationPlanner';
import AcquisitionPlanner from './components/AcquisitionPlanner';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ email: 'founder@example.com', subscription: 'free' });
  const [ideas, setIdeas] = useState([]);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Target },
    { id: 'discover', name: 'Problem Discovery', icon: Lightbulb },
    { id: 'validate', name: 'Rapid Validation', icon: Target },
    { id: 'monetize', name: 'Monetization', icon: DollarSign },
    { id: 'acquire', name: 'Acquisition', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard ideas={ideas} user={user} />;
      case 'discover':
        return <IdeaGenerator ideas={ideas} setIdeas={setIdeas} user={user} />;
      case 'validate':
        return <ValidationTools ideas={ideas} setIdeas={setIdeas} />;
      case 'monetize':
        return <MonetizationPlanner ideas={ideas} setIdeas={setIdeas} />;
      case 'acquire':
        return <AcquisitionPlanner ideas={ideas} setIdeas={setIdeas} />;
      default:
        return <Dashboard ideas={ideas} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface shadow-card transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Niche Navigator</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-text-primary">{user.email}</div>
            <div className="text-xs text-text-secondary capitalize">{user.subscription} Plan</div>
            {user.subscription === 'free' && (
              <button className="mt-2 w-full bg-accent text-white text-sm py-2 rounded-md hover:bg-opacity-90 transition-colors">
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="h-16 bg-surface shadow-sm flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1 lg:flex-none">
            <h2 className="text-lg font-semibold text-text-primary">
              {navigationItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
            </h2>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 lg:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
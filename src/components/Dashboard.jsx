import React from 'react';
import { TrendingUp, Target, DollarSign, Users, ArrowRight, Plus } from 'lucide-react';

const Dashboard = ({ ideas, user }) => {
  const stats = [
    {
      title: 'Active Ideas',
      value: ideas.length,
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Validated Ideas',
      value: ideas.filter(idea => idea.validation_stage === 'validated').length,
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Revenue Potential',
      value: ideas.reduce((sum, idea) => sum + (idea.revenue_potential || 0), 0),
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      prefix: '$',
      suffix: '/mo',
    },
    {
      title: 'Target Users',
      value: ideas.reduce((sum, idea) => sum + (idea.target_users || 0), 0),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const recentIdeas = ideas.slice(-3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-6 gradient-bg text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Founder!</h1>
        <p className="text-blue-100 mb-4">
          Ready to discover your next micro-SaaS opportunity? Let's validate some ideas.
        </p>
        <button className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Discover New Problems
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">
                    {stat.prefix || ''}{stat.value}{stat.suffix || ''}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Ideas */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-primary">Recent Ideas</h3>
          <button className="text-primary hover:text-primary/80 transition-colors flex items-center text-sm font-medium">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {recentIdeas.length > 0 ? (
          <div className="space-y-4">
            {recentIdeas.map((idea, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">{idea.name}</h4>
                  <p className="text-text-secondary text-sm mt-1">{idea.description}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      idea.validation_stage === 'validated' 
                        ? 'bg-green-100 text-green-800'
                        : idea.validation_stage === 'testing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {idea.validation_stage || 'Initial'}
                    </span>
                    <span className="text-text-secondary text-xs">{idea.problem_category}</span>
                  </div>
                </div>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-text-primary mb-2">No ideas yet</h4>
            <p className="text-text-secondary mb-4">Start by discovering problems in your industry</p>
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="bg-blue-50 p-3 rounded-lg w-fit mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-text-primary mb-2">Problem Discovery</h4>
          <p className="text-text-secondary text-sm">Find underserved problems in your industry</p>
        </div>

        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="bg-green-50 p-3 rounded-lg w-fit mb-4">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
          <h4 className="font-semibold text-text-primary mb-2">Rapid Validation</h4>
          <p className="text-text-secondary text-sm">Test your ideas with targeted surveys</p>
        </div>

        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="bg-yellow-50 p-3 rounded-lg w-fit mb-4">
            <DollarSign className="w-6 h-6 text-yellow-600" />
          </div>
          <h4 className="font-semibold text-text-primary mb-2">Monetization Planning</h4>
          <p className="text-text-secondary text-sm">Build pricing strategies that convert</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
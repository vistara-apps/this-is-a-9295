import React, { useState } from 'react';
import { Users, Target, MessageCircle, Zap, ExternalLink } from 'lucide-react';
import { generateAcquisitionStrategy } from '../utils/openaiService';

const AcquisitionPlanner = ({ ideas, setIdeas }) => {
  const [selectedIdea, setSelectedIdea] = useState('');
  const [acquisitionStrategy, setAcquisitionStrategy] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStrategy = async () => {
    if (!selectedIdea) return;

    const idea = ideas.find(i => i.id === selectedIdea);
    if (!idea) return;

    setIsGenerating(true);
    try {
      const strategy = await generateAcquisitionStrategy(idea);
      setAcquisitionStrategy(strategy);
    } catch (error) {
      console.error('Error generating acquisition strategy:', error);
      // Fallback with sample data
      setAcquisitionStrategy({
        target_customers: {
          primary: 'Independent developers and small dev teams',
          secondary: 'DevOps engineers at startups',
          tertiary: 'Technical founders building APIs'
        },
        channels: [
          {
            name: 'Developer Communities',
            platforms: ['Reddit (r/webdev, r/programming)', 'Dev.to', 'Hacker News'],
            approach: 'Share helpful content about API monitoring best practices',
            effort: 'Low',
            timeline: '1-2 weeks',
            expected_reach: '500-1000 developers'
          },
          {
            name: 'Direct Outreach',
            platforms: ['LinkedIn', 'Twitter', 'Email'],
            approach: 'Reach out to developers who mention API issues',
            effort: 'Medium',
            timeline: '2-4 weeks',
            expected_reach: '100-200 targeted prospects'
          },
          {
            name: 'Content Marketing',
            platforms: ['Technical blog', 'YouTube tutorials'],
            approach: 'Create guides on API monitoring and reliability',
            effort: 'High',
            timeline: '4-8 weeks',
            expected_reach: '1000-5000 developers'
          }
        ],
        tactics: [
          {
            title: 'Problem-First Approach',
            description: 'Start conversations about API reliability problems, not your solution',
            implementation: 'Comment on relevant posts sharing insights about API monitoring challenges'
          },
          {
            title: 'Free Value First',
            description: 'Provide free tools or resources before pitching paid solution',
            implementation: 'Create a simple API uptime checker as a lead magnet'
          },
          {
            title: 'Community Building',
            description: 'Build relationships before selling',
            implementation: 'Participate in developer communities regularly, helping others first'
          }
        ],
        timeline: {
          week_1: 'Set up social media presence and identify target communities',
          week_2: 'Start engaging in communities and creating helpful content',
          week_3: 'Begin direct outreach to warm prospects',
          week_4: 'Launch content marketing and gather feedback',
          week_5_8: 'Scale successful channels and optimize messaging'
        },
        success_metrics: [
          'Website traffic from organic sources',
          'Community engagement (likes, comments, shares)',
          'Email signups and trial conversions',
          'Direct messages and inbound inquiries'
        ]
      });
    }
    setIsGenerating(false);
  };

  const applyStrategyToIdea = () => {
    if (!selectedIdea || !acquisitionStrategy) return;

    setIdeas(prev => prev.map(idea => 
      idea.id === selectedIdea 
        ? { ...idea, acquisition_strategy: acquisitionStrategy }
        : idea
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-purple-50 p-3 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Guerilla Acquisition Planner</h2>
            <p className="text-text-secondary">
              Get targeted strategies to find and acquire your first 10-50 paying customers using underutilized channels.
            </p>
          </div>
        </div>
      </div>

      {/* Idea Selection */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Select Idea for Acquisition Planning</h3>
        
        {ideas.length > 0 ? (
          <div className="space-y-4">
            <select
              value={selectedIdea}
              onChange={(e) => setSelectedIdea(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Choose an idea...</option>
              {ideas.map((idea) => (
                <option key={idea.id} value={idea.id}>
                  {idea.name} - {idea.problem_category}
                </option>
              ))}
            </select>

            {selectedIdea && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                {(() => {
                  const idea = ideas.find(i => i.id === selectedIdea);
                  return idea ? (
                    <div>
                      <h4 className="font-medium text-text-primary mb-2">{idea.name}</h4>
                      <p className="text-text-secondary text-sm mb-3">{idea.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <Target className="w-4 h-4 mr-1 text-purple-500" />
                          {idea.target_users} potential users
                        </span>
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                          {idea.problem_category}
                        </span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <button
              onClick={handleGenerateStrategy}
              disabled={!selectedIdea || isGenerating}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Generating Acquisition Plan...' : 'Generate Acquisition Strategy'}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-text-primary mb-2">No ideas to plan acquisition for</h4>
            <p className="text-text-secondary">Go to Problem Discovery to generate some ideas first</p>
          </div>
        )}
      </div>

      {/* Acquisition Strategy */}
      {acquisitionStrategy && (
        <>
          {/* Target Customers */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Target Customer Segments</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-2 flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2" />
                  Primary
                </h4>
                <p className="text-text-secondary text-sm">{acquisitionStrategy.target_customers.primary}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-2 flex items-center">
                  <div className="w-3 h-3 bg-accent rounded-full mr-2" />
                  Secondary
                </h4>
                <p className="text-text-secondary text-sm">{acquisitionStrategy.target_customers.secondary}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-2 flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                  Tertiary
                </h4>
                <p className="text-text-secondary text-sm">{acquisitionStrategy.target_customers.tertiary}</p>
              </div>
            </div>
          </div>

          {/* Acquisition Channels */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Recommended Channels</h3>
            <div className="space-y-4">
              {acquisitionStrategy.channels.map((channel, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary mb-1">{channel.name}</h4>
                      <p className="text-text-secondary text-sm">{channel.approach}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        channel.effort === 'Low' 
                          ? 'bg-green-100 text-green-800'
                          : channel.effort === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {channel.effort} Effort
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">Platforms:</span>
                      <ul className="mt-1 space-y-1">
                        {channel.platforms.map((platform, i) => (
                          <li key={i} className="text-text-primary flex items-center">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {platform}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-text-secondary">Timeline:</span>
                      <p className="text-text-primary mt-1">{channel.timeline}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Expected Reach:</span>
                      <p className="text-text-primary mt-1">{channel.expected_reach}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guerilla Tactics */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Guerilla Tactics</h3>
            <div className="space-y-4">
              {acquisitionStrategy.tactics.map((tactic, index) => (
                <div key={index} className="border-l-4 border-accent pl-4">
                  <h4 className="font-medium text-text-primary mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-accent" />
                    {tactic.title}
                  </h4>
                  <p className="text-text-secondary text-sm mb-2">{tactic.description}</p>
                  <div className="bg-gray-50 rounded p-3">
                    <span className="text-xs font-medium text-text-secondary">Implementation:</span>
                    <p className="text-sm text-text-primary mt-1">{tactic.implementation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">8-Week Action Plan</h3>
            <div className="space-y-3">
              {Object.entries(acquisitionStrategy.timeline).map(([week, action], index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-20 text-sm font-medium text-primary">
                    {week.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="flex-1 text-sm text-text-primary">{action}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Success Metrics */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Success Metrics to Track</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {acquisitionStrategy.success_metrics.map((metric, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <MessageCircle className="w-4 h-4 text-accent" />
                  <span className="text-sm text-text-primary">{metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Strategy */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Apply This Strategy</h3>
                <p className="text-text-secondary">Save this acquisition plan to your selected idea</p>
              </div>
              <button
                onClick={applyStrategyToIdea}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Apply Strategy
              </button>
            </div>
          </div>
        </>
      )}

      {/* General Acquisition Tips */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Guerilla Acquisition Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-primary mb-2">Focus on Value</h4>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• Solve problems before selling solutions</li>
              <li>• Share knowledge and insights freely</li>
              <li>• Build trust through helpfulness</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-2">Go Where They Are</h4>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• Find your customers' online hangouts</li>
              <li>• Participate authentically in communities</li>
              <li>• Avoid being salesy or promotional</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-2">Start Small & Personal</h4>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• One-on-one conversations matter</li>
              <li>• Build relationships, not just leads</li>
              <li>• Quality over quantity always</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-2">Iterate Quickly</h4>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• Test messaging and channels fast</li>
              <li>• Double down on what works</li>
              <li>• Don't be afraid to pivot approach</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcquisitionPlanner;
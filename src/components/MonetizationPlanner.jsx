import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react';
import { generateMonetizationStrategy } from '../utils/openaiService';

const MonetizationPlanner = ({ ideas, setIdeas }) => {
  const [selectedIdea, setSelectedIdea] = useState('');
  const [pricingStrategy, setPricingStrategy] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStrategy = async () => {
    if (!selectedIdea) return;

    const idea = ideas.find(i => i.id === selectedIdea);
    if (!idea) return;

    setIsGenerating(true);
    try {
      const strategy = await generateMonetizationStrategy(idea);
      setPricingStrategy(strategy);
    } catch (error) {
      console.error('Error generating monetization strategy:', error);
      // Fallback with sample data
      setPricingStrategy({
        pricing_model: 'subscription',
        tiers: [
          {
            name: 'Starter',
            price: 19,
            period: 'month',
            features: ['Basic monitoring', 'Email alerts', '5 APIs'],
            target_segment: 'Solo developers and small teams'
          },
          {
            name: 'Professional',
            price: 49,
            period: 'month',
            features: ['Advanced monitoring', 'SMS + Email alerts', '25 APIs', 'Custom dashboards'],
            target_segment: 'Growing startups and agencies'
          },
          {
            name: 'Enterprise',
            price: 149,
            period: 'month',
            features: ['White-label solution', 'Unlimited APIs', 'Priority support', 'Custom integrations'],
            target_segment: 'Large companies and enterprises'
          }
        ],
        value_metrics: [
          'Number of APIs monitored',
          'Alert frequency and channels',
          'Data retention period',
          'Team collaboration features'
        ],
        pricing_psychology: [
          'Anchor with enterprise tier to make pro seem reasonable',
          'Offer annual discount to improve cash flow',
          'Free trial to reduce friction',
          'Usage-based add-ons for scaling'
        ],
        revenue_projections: {
          month_1: 500,
          month_6: 2400,
          month_12: 8900
        }
      });
    }
    setIsGenerating(false);
  };

  const applyPricingToIdea = () => {
    if (!selectedIdea || !pricingStrategy) return;

    setIdeas(prev => prev.map(idea => 
      idea.id === selectedIdea 
        ? { 
            ...idea, 
            pricing_strategy: pricingStrategy,
            revenue_potential: pricingStrategy.revenue_projections?.month_12 || idea.revenue_potential
          }
        : idea
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-yellow-50 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Monetization Strategy Builder</h2>
            <p className="text-text-secondary">
              Create lean pricing and packaging strategies that align with customer value and willingness to pay.
            </p>
          </div>
        </div>
      </div>

      {/* Idea Selection */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Select Idea for Monetization</h3>
        
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
                          <Users className="w-4 h-4 mr-1 text-blue-500" />
                          {idea.target_users} potential users
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1 text-accent" />
                          ${idea.revenue_potential}/mo potential
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
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Generating Pricing Strategy...' : 'Generate Monetization Plan'}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-text-primary mb-2">No ideas to monetize</h4>
            <p className="text-text-secondary">Go to Problem Discovery to generate some ideas first</p>
          </div>
        )}
      </div>

      {/* Pricing Strategy */}
      {pricingStrategy && (
        <>
          {/* Pricing Tiers */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Recommended Pricing Tiers</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {pricingStrategy.pricing_model.toUpperCase()} MODEL
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingStrategy.tiers.map((tier, index) => (
                <div 
                  key={index} 
                  className={`border-2 rounded-lg p-6 ${
                    index === 1 ? 'border-primary bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-text-primary mb-2">{tier.name}</h4>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-text-primary">${tier.price}</span>
                      <span className="text-text-secondary">/{tier.period}</span>
                    </div>
                    <p className="text-text-secondary text-sm">{tier.target_segment}</p>
                  </div>
                  
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {index === 1 && (
                    <div className="mt-4 text-center">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Value Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Value Metrics</h3>
              <p className="text-text-secondary text-sm mb-4">
                Price based on value delivered, not just features:
              </p>
              <ul className="space-y-2">
                {pricingStrategy.value_metrics.map((metric, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-primary mr-2" />
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Pricing Psychology</h3>
              <p className="text-text-secondary text-sm mb-4">
                Psychological tactics to optimize conversions:
              </p>
              <ul className="space-y-2">
                {pricingStrategy.pricing_psychology.map((tip, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-2" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Revenue Projections */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Revenue Projections</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">${pricingStrategy.revenue_projections.month_1}</div>
                <div className="text-text-secondary text-sm">Month 1</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-accent">${pricingStrategy.revenue_projections.month_6}</div>
                <div className="text-text-secondary text-sm">Month 6</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">${pricingStrategy.revenue_projections.month_12}</div>
                <div className="text-text-secondary text-sm">Month 12</div>
              </div>
            </div>
          </div>

          {/* Apply Strategy */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Apply This Strategy</h3>
                <p className="text-text-secondary">Save this pricing strategy to your selected idea</p>
              </div>
              <button
                onClick={applyPricingToIdea}
                className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Apply Strategy
              </button>
            </div>
          </div>
        </>
      )}

      {/* Pricing Tips */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Pricing Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-primary mb-2">Start Simple</h4>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• Begin with 2-3 clear tiers</li>
              <li>• Focus on core value proposition</li>
              <li>• Avoid feature bloat in early versions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-2">Test & Iterate</h4>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• A/B testing pricing pages</li>
              <li>• Monitor conversion rates by tier</li>
              <li>• Adjust based on customer feedback</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-2">Value-Based Pricing</h4>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• Price on outcome, not input</li>
              <li>• Understand customer ROI</li>
              <li>• Align pricing with value delivered</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-2">Reduce Friction</h4>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>• Offer free trials or freemium tiers</li>
              <li>• Clear upgrade paths</li>
              <li>• Transparent pricing with no hidden fees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonetizationPlanner;
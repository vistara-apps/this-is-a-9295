import React, { useState } from 'react';
import { Check, X, Crown, Zap, Star } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';

const PricingPage = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const { upgradeToPro, isPro, getPricingInfo } = useSubscription();
  const { isAuthenticated } = useAuth();
  const pricing = getPricingInfo();

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      // Show auth modal or redirect to login
      return;
    }

    try {
      setLoading(true);
      await upgradeToPro();
    } catch (error) {
      console.error('Error upgrading:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      name: 'Ideas',
      free: '3 ideas',
      pro: 'Unlimited ideas',
      icon: Zap
    },
    {
      name: 'Validation Tools',
      free: 'Basic surveys',
      pro: 'Advanced validation suite',
      icon: Star
    },
    {
      name: 'Analytics',
      free: 'Basic insights',
      pro: 'Advanced analytics & reports',
      icon: Star
    },
    {
      name: 'Data Export',
      free: false,
      pro: 'CSV & JSON export',
      icon: Star
    },
    {
      name: 'Curated Lists',
      free: false,
      pro: 'Niche opportunity lists',
      icon: Crown
    },
    {
      name: 'Support',
      free: 'Community support',
      pro: 'Priority email support',
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Start for free and upgrade when you're ready to unlock advanced validation tools and unlimited ideas.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="card p-8 relative">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-text-primary mb-2">Free</h3>
              <div className="text-4xl font-bold text-text-primary mb-2">
                $0
                <span className="text-lg font-normal text-text-secondary">/forever</span>
              </div>
              <p className="text-text-secondary">Perfect for getting started</p>
            </div>

            <ul className="space-y-3 mb-8">
              {pricing.free.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                  <span className="text-text-primary">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={true}
              className="w-full py-3 px-6 border border-gray-300 rounded-lg text-text-secondary cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="card p-8 relative border-2 border-primary">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-text-primary mb-2 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary mr-2" />
                Pro
              </h3>
              <div className="text-4xl font-bold text-text-primary mb-2">
                $19
                <span className="text-lg font-normal text-text-secondary">/month</span>
              </div>
              <p className="text-text-secondary">For serious founders</p>
            </div>

            <ul className="space-y-3 mb-8">
              {pricing.pro.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                  <span className="text-text-primary">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={loading || isPro}
              className="w-full py-3 px-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPro ? (
                'Current Plan'
              ) : (
                'Upgrade to Pro'
              )}
            </button>

            {!isPro && (
              <p className="text-center text-sm text-text-secondary mt-3">
                Cancel anytime. No questions asked.
              </p>
            )}
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="card p-8">
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Feature Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-text-primary">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-text-primary">Free</th>
                  <th className="text-center py-3 px-4 font-semibold text-text-primary">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-4 flex items-center">
                        <Icon className="w-4 h-4 text-text-secondary mr-2" />
                        <span className="text-text-primary">{feature.name}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {feature.free === false ? (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        ) : (
                          <span className="text-text-secondary">{feature.free}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-accent font-medium">{feature.pro}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h4 className="font-semibold text-text-primary mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-text-secondary text-sm">
                Yes, you can cancel your subscription at any time. You'll continue to have Pro access until the end of your billing period.
              </p>
            </div>

            <div className="card p-6">
              <h4 className="font-semibold text-text-primary mb-2">
                What happens to my data if I cancel?
              </h4>
              <p className="text-text-secondary text-sm">
                Your data remains safe. You'll be moved to the Free plan with access to your first 3 ideas. You can export your data anytime.
              </p>
            </div>

            <div className="card p-6">
              <h4 className="font-semibold text-text-primary mb-2">
                Do you offer refunds?
              </h4>
              <p className="text-text-secondary text-sm">
                We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
              </p>
            </div>

            <div className="card p-6">
              <h4 className="font-semibold text-text-primary mb-2">
                Is there a free trial?
              </h4>
              <p className="text-text-secondary text-sm">
                The Free plan is your trial! Start validating ideas immediately, then upgrade when you need more features.
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <div className="text-center mt-8">
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPage;

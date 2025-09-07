import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { createStripeCheckout, createPortalSession } from '../services/stripeService';

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, profile, updateProfile } = useAuth();

  // Check if user has pro subscription
  const isPro = profile?.subscription_status === 'pro';
  const isFree = profile?.subscription_status === 'free' || !profile?.subscription_status;

  // Get subscription features based on plan
  const getFeatures = () => {
    if (isPro) {
      return {
        maxIdeas: -1, // unlimited
        maxValidations: -1, // unlimited
        advancedAnalytics: true,
        exportData: true,
        prioritySupport: true,
        curatedNicheLists: true,
        advancedValidationTools: true
      };
    }

    return {
      maxIdeas: 3,
      maxValidations: 5,
      advancedAnalytics: false,
      exportData: false,
      prioritySupport: false,
      curatedNicheLists: false,
      advancedValidationTools: false
    };
  };

  // Check if user can perform an action based on their plan
  const canPerformAction = (action, currentCount = 0) => {
    const features = getFeatures();

    switch (action) {
      case 'create_idea':
        return features.maxIdeas === -1 || currentCount < features.maxIdeas;
      case 'create_validation':
        return features.maxValidations === -1 || currentCount < features.maxValidations;
      case 'export_data':
        return features.exportData;
      case 'advanced_analytics':
        return features.advancedAnalytics;
      case 'curated_lists':
        return features.curatedNicheLists;
      case 'advanced_validation':
        return features.advancedValidationTools;
      default:
        return true;
    }
  };

  // Get usage limits and current usage
  const getUsageLimits = () => {
    const features = getFeatures();
    return {
      ideas: {
        limit: features.maxIdeas,
        unlimited: features.maxIdeas === -1
      },
      validations: {
        limit: features.maxValidations,
        unlimited: features.maxValidations === -1
      }
    };
  };

  // Upgrade to Pro
  const upgradeToPro = async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const { url } = await createStripeCheckout({
        userId: user.id,
        email: user.email,
        priceId: 'price_pro_monthly', // This would be your actual Stripe price ID
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/cancel`
      });

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Manage subscription (billing portal)
  const manageSubscription = async () => {
    if (!user || !profile?.stripe_customer_id) {
      throw new Error('No subscription to manage');
    }

    try {
      setLoading(true);
      setError(null);

      const { url } = await createPortalSession({
        customerId: profile.stripe_customer_id,
        returnUrl: `${window.location.origin}/dashboard`
      });

      // Redirect to Stripe Customer Portal
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    // This would typically be handled through the Stripe Customer Portal
    // or via a webhook when the subscription is cancelled
    try {
      setLoading(true);
      setError(null);

      // Update user profile to reflect cancellation
      await updateProfile({
        subscription_status: 'free'
      });

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle successful subscription
  const handleSubscriptionSuccess = async () => {
    try {
      setLoading(true);
      setError(null);

      // Update user profile to pro status
      await updateProfile({
        subscription_status: 'pro'
      });

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get subscription status display
  const getSubscriptionStatus = () => {
    if (isPro) {
      return {
        status: 'pro',
        label: 'Pro Plan',
        color: 'text-accent',
        bgColor: 'bg-green-50',
        description: 'Full access to all features'
      };
    }

    return {
      status: 'free',
      label: 'Free Plan',
      color: 'text-text-secondary',
      bgColor: 'bg-gray-50',
      description: 'Limited access to basic features'
    };
  };

  // Get pricing information
  const getPricingInfo = () => {
    return {
      free: {
        name: 'Free',
        price: 0,
        period: 'forever',
        features: [
          'Up to 3 ideas',
          'Basic validation tools',
          'Community support',
          'Basic analytics'
        ]
      },
      pro: {
        name: 'Pro',
        price: 19,
        period: 'month',
        features: [
          'Unlimited ideas',
          'Advanced validation tools',
          'Curated niche lists',
          'Data export',
          'Advanced analytics',
          'Priority support'
        ]
      }
    };
  };

  return {
    isPro,
    isFree,
    loading,
    error,
    features: getFeatures(),
    canPerformAction,
    getUsageLimits,
    upgradeToPro,
    manageSubscription,
    cancelSubscription,
    handleSubscriptionSuccess,
    getSubscriptionStatus,
    getPricingInfo
  };
};

import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Create Stripe Checkout Session
export const createStripeCheckout = async ({ userId, email, priceId, successUrl, cancelUrl }) => {
  try {
    // In a real application, this would call your backend API
    // which would create the Stripe Checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
        priceId,
        successUrl,
        cancelUrl
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // For demo purposes, return a mock URL
    // In production, remove this and implement proper backend integration
    return {
      url: `https://checkout.stripe.com/pay/demo#${priceId}`
    };
  }
};

// Create Stripe Customer Portal Session
export const createPortalSession = async ({ customerId, returnUrl }) => {
  try {
    // In a real application, this would call your backend API
    // which would create the Stripe Customer Portal session
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    return { url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    
    // For demo purposes, return a mock URL
    // In production, remove this and implement proper backend integration
    return {
      url: `https://billing.stripe.com/p/login/demo`
    };
  }
};

// Verify payment success (called after successful checkout)
export const verifyPaymentSuccess = async (sessionId) => {
  try {
    const response = await fetch(`/api/verify-payment/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Get subscription status
export const getSubscriptionStatus = async (customerId) => {
  try {
    const response = await fetch(`/api/subscription-status/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get subscription status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
};

// Handle webhook events (this would be implemented on your backend)
export const handleStripeWebhook = async (event) => {
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful payment
      console.log('Payment successful:', event.data.object);
      break;
    
    case 'customer.subscription.created':
      // Handle new subscription
      console.log('Subscription created:', event.data.object);
      break;
    
    case 'customer.subscription.updated':
      // Handle subscription changes
      console.log('Subscription updated:', event.data.object);
      break;
    
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      console.log('Subscription cancelled:', event.data.object);
      break;
    
    case 'invoice.payment_succeeded':
      // Handle successful recurring payment
      console.log('Payment succeeded:', event.data.object);
      break;
    
    case 'invoice.payment_failed':
      // Handle failed payment
      console.log('Payment failed:', event.data.object);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

// Format price for display
export const formatPrice = (amount, currency = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

// Get Stripe pricing configuration
export const getStripePricing = () => {
  return {
    free: {
      priceId: null,
      amount: 0,
      currency: 'usd',
      interval: null
    },
    pro: {
      priceId: 'price_pro_monthly', // Replace with your actual Stripe price ID
      amount: 1900, // $19.00 in cents
      currency: 'usd',
      interval: 'month'
    }
  };
};

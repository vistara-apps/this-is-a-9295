import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './auth/AuthModal';

const ProtectedRoute = ({ children, requiresPro = false }) => {
  const { isAuthenticated, isPro, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth modal
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Welcome to Niche Navigator
            </h1>
            <p className="text-text-secondary mb-6">
              Discover and validate your next micro-SaaS idea with market demand.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="signup"
        />
      </>
    );
  }

  // If requires Pro but user is not Pro, show upgrade prompt
  if (requiresPro && !isPro) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Pro Feature
            </h2>
            <p className="text-yellow-700 mb-4">
              This feature requires a Pro subscription to access advanced validation tools and curated niche lists.
            </p>
            <button className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors">
              Upgrade to Pro - $19/month
            </button>
          </div>
          <button
            onClick={() => window.history.back()}
            className="text-primary hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute;

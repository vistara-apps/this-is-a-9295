import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode); // 'signin', 'signup', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { signIn, signUp, resetPassword } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMessage({ type: '', text: '' });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Passwords do not match' });
          return;
        }
        if (password.length < 6) {
          setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
          return;
        }

        const { error } = await signUp(email, password);
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Check your email for the confirmation link!' 
          });
        }
      } else if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          handleClose();
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Check your email for the password reset link!' 
          });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-card w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-text-primary">
            {mode === 'signin' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg flex items-center ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 text-center text-sm">
            {mode === 'signin' && (
              <>
                <p className="text-text-secondary">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </p>
                <button
                  onClick={() => setMode('reset')}
                  className="text-primary hover:underline mt-2 block mx-auto"
                >
                  Forgot password?
                </button>
              </>
            )}
            {mode === 'signup' && (
              <p className="text-text-secondary">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <p className="text-text-secondary">
                Remember your password?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

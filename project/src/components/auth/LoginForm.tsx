import React, { useState } from 'react';
import { LogIn, UserPlus, User, Mail, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { DatabaseService } from '../../utils/database';
import { User as UserType } from '../../types';

interface LoginFormProps {
  onLogin: (user: UserType) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (isSignUp) {
      if (!formData.email) {
        setError('Email is required for sign up');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    return true;
  };

  const handleSignIn = async () => {
    try {
      const user = await DatabaseService.authenticateUser(formData.username, formData.password);
      
      if (!user) {
        const exists = await DatabaseService.userExists(formData.username);
        if (exists) {
          setError('Incorrect username or password');
        } else {
          setError('User not found. Please sign up first.');
        }
        return;
      }
      
      await onLogin(user);
    } catch (error) {
      setError('Sign in failed. Please try again.');
      console.error('Sign in error:', error);
    }
  };

  const handleSignUp = async () => {
    try {
      // Use DatabaseService.registerUser which handles both Supabase Auth and user profile creation
      const user = await DatabaseService.registerUser(formData.username, formData.email, formData.password);
      
      // Call onLogin with the created user
      await onLogin(user);
    } catch (error: any) {
      if (error.message === 'Username already exists') {
        setError('This username is already taken. Please choose another.');
      } else if (error.message === 'Email already exists') {
        setError('This email is already registered. Please use a different email or sign in.');
      } else {
        setError(error.message || 'Sign up failed. Please try again.');
      }
      console.error('Sign up error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await handleSignUp();
      } else {
        await handleSignIn();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BudgetTracker</h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account to start tracking finances' : 'Sign in to manage your finances'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Enter your username"
            required
            disabled={isLoading}
          />

          {isSignUp && (
            <Input
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          )}

          <Input
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
            required
            disabled={isLoading}
          />

          {isSignUp && (
            <Input
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            icon={isSignUp ? UserPlus : LogIn}
            fullWidth
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            disabled={isLoading}
          >
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"
            }
          </button>
        </div>

        {!isSignUp && (
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>New users can sign up to create an account</p>
          </div>
        )}
      </Card>
    </div>
  );
};
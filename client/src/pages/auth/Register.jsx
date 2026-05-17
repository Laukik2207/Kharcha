import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { registerWithEmail, loginWithGoogle, user, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return { score: 0, label: '', color: 'bg-gray-800' };
    
    if (password.length >= 6) score += 1;
    if (password.length >= 8 && (/[A-Z]/.test(password) || /[a-z]/.test(password)) && /\d/.test(password)) score += 1; // Two character types
    if (password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 2;

    switch (score) {
      case 0:
      case 1: return { score: 1, label: 'Weak', color: 'bg-red-500' };
      case 2: return { score: 2, label: 'Fair', color: 'bg-orange-500' };
      case 3: return { score: 3, label: 'Good', color: 'bg-yellow-500' };
      case 4: return { score: 4, label: 'Strong', color: 'bg-green-500' };
      default: return { score: 0, label: '', color: 'bg-gray-800' };
    }
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await registerWithEmail(formData.name, formData.email, formData.password);
      // Navigation handled by context's onAuthStateChanged updating `user` state
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      // Navigation handled by context
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-md my-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Kharcha
          </h1>
          <p className="text-gray-400 mt-2">Create a new account</p>
        </div>
        
        <Card>
          {authError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start justify-between text-red-400">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm">{authError}</span>
              </div>
              <button onClick={clearError} className="hover:text-red-300">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isSubmitting ? 'Connecting...' : 'Continue with Google'}
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">or continue with email</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleEmailSubmit} noValidate>
            <Input 
              label="Full Name" 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe" 
              error={errors.name}
              disabled={isSubmitting}
              required
            />

            <Input 
              label="Email address" 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com" 
              error={errors.email}
              disabled={isSubmitting}
              required
            />

            <div>
              <Input 
                label="Password" 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                error={errors.password}
                disabled={isSubmitting}
                required
                rightIcon={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-200 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className={`flex-1 ${level <= strength.score ? strength.color : 'bg-gray-800'} transition-colors duration-300`} 
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${strength.color.replace('bg-', 'text-')}`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            <Input 
              label="Confirm Password" 
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••" 
              error={errors.confirmPassword}
              disabled={isSubmitting}
              required
              rightIcon={
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-200 focus:outline-none"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            <Button 
              className="w-full mt-2" 
              type="submit"
              loading={isSubmitting}
            >
              Create Account
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <a href="/login" className="text-primary-500 font-medium hover:text-primary-400 transition-colors">Sign in</a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;

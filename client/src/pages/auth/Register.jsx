import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './Login';

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
    if (!password) return { score: 0, label: '', color: 'bg-surface-800' };
    
    if (password.length >= 6) score += 1;
    if (password.length >= 8 && (/[A-Z]/.test(password) || /[a-z]/.test(password)) && /\d/.test(password)) score += 1;
    if (password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 2;

    switch (score) {
      case 0:
      case 1: return { score: 1, label: 'Weak', color: 'bg-red-500' };
      case 2: return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3: return { score: 3, label: 'Good', color: 'bg-green-400' };
      case 4: return { score: 4, label: 'Strong', color: 'bg-green-500' };
      default: return { score: 0, label: '', color: 'bg-surface-800' };
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
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Start tracking your expenses intelligently">
      <Card variant="glass" className="w-full">
        {authError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start justify-between text-red-400"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">{authError}</span>
            </div>
            <button onClick={clearError} className="hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        <div className="mb-6">
          <motion.button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-surface-600 rounded-xl bg-surface-800 text-sm font-medium text-white hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors shadow-sm hover:shadow-glow-primary/20"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isSubmitting ? 'Connecting...' : 'Continue with Google'}
          </motion.button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-surface-900 text-surface-400">or continue with email</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleEmailSubmit} noValidate>
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
            prefix={
              <svg className="w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
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
            prefix={
              <svg className="w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />

          <div>
            <div className="relative">
              <label className="input-label">Password</label>
              <div className="absolute left-3 top-[34px] flex items-center justify-center text-surface-400 pointer-events-none z-10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full rounded-xl border border-surface-700 bg-surface-800/60 pl-10 pr-12 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-surface-400 hover:text-white focus:outline-none transition-colors p-1"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 overflow-hidden">
                <div className="flex gap-1 h-1.5 w-full bg-surface-800 rounded-full overflow-hidden">
                  {[1, 2, 3, 4].map((level) => (
                    <motion.div 
                      key={level} 
                      className={`h-full ${level <= strength.score ? strength.color : 'bg-transparent'}`} 
                      initial={false}
                      animate={{ width: level <= strength.score ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                      style={{ flex: 1 }}
                    />
                  ))}
                </div>
                <p className={`text-xs mt-1 font-medium ${strength.color.replace('bg-', 'text-')}`}>
                  {strength.label}
                </p>
              </motion.div>
            )}
            {errors.password && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1">
                {errors.password}
              </motion.p>
            )}
          </div>

          <div className="relative">
            <label className="input-label">Confirm Password</label>
            <div className="absolute left-3 top-[34px] flex items-center justify-center text-surface-400 pointer-events-none z-10">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`w-full rounded-xl border border-surface-700 bg-surface-800/60 pl-10 pr-12 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[34px] text-surface-400 hover:text-white focus:outline-none transition-colors p-1"
              disabled={isSubmitting}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.confirmPassword && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1">
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>

          <Button 
            className="w-full mt-4" 
            type="submit"
            loading={isSubmitting}
            size="lg"
          >
            Create Account
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-surface-400">Already have an account? </span>
          <Link to="/login" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">Sign in</Link>
        </div>
      </Card>
    </AuthLayout>
  );
};

export default Register;

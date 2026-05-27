import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, X, Eye, EyeOff } from 'lucide-react';
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
    <AuthLayout title="Create Your Account">
      <div className="flex flex-col gap-4">
        {authError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start justify-between text-red-400 text-sm">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{authError}</span>
            </div>
            <button onClick={clearError} className="hover:text-red-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <button 
          onClick={handleGoogleLogin} 
          disabled={isSubmitting}
          className="group w-full bg-white text-black py-2.5 px-6 rounded-lg font-sans text-sm font-semibold flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <svg className="w-5 h-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 font-mono text-xs text-surface-200 uppercase">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <form className="space-y-3" onSubmit={handleEmailSubmit}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="space-y-1 flex-1">
              <label className="font-mono text-[10px] text-surface-200 uppercase tracking-wider pl-1">Full Name</label>
              <input 
                className={`w-full bg-white/[0.03] border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg py-2.5 px-4 text-sm text-white placeholder:text-white/20 focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all outline-none`} 
                placeholder="Enter your name" 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1 pl-1">{errors.name}</p>}
            </div>
            
            <div className="space-y-1 flex-1">
              <label className="font-mono text-[10px] text-surface-200 uppercase tracking-wider pl-1">Email Address</label>
              <input 
                className={`w-full bg-white/[0.03] border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg py-2.5 px-4 text-sm text-white placeholder:text-white/20 focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all outline-none`} 
                placeholder="name@domain.com" 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1 pl-1">{errors.email}</p>}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="space-y-1 relative flex-1">
              <label className="font-mono text-[10px] text-surface-200 uppercase tracking-wider pl-1">Password</label>
              <div className="relative">
                <input 
                  className={`w-full bg-white/[0.03] border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-lg py-2.5 pl-4 pr-10 text-sm text-white placeholder:text-white/20 focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all outline-none`} 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition-colors p-1"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-1.5 pl-1 pr-1 overflow-hidden transition-all duration-300">
                  <div className="flex gap-1 h-1 w-full bg-surface-800 rounded-full overflow-hidden">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className={`h-full transition-all duration-300 ${level <= strength.score ? strength.color : 'bg-transparent'}`} 
                        style={{ flex: 1 }}
                      />
                    ))}
                  </div>
                  <p className={`text-[9px] mt-0.5 font-mono uppercase tracking-wider ${strength.color.replace('bg-', 'text-')}`}>
                    {strength.label}
                  </p>
                </div>
              )}
              
              {errors.password && <p className="text-xs text-red-400 mt-1 pl-1">{errors.password}</p>}
            </div>

            <div className="space-y-1 relative flex-1">
              <label className="font-mono text-[10px] text-surface-200 uppercase tracking-wider pl-1">Confirm Password</label>
              <div className="relative">
                <input 
                  className={`w-full bg-white/[0.03] border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-lg py-2.5 pl-4 pr-10 text-sm text-white placeholder:text-white/20 focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all outline-none`} 
                  placeholder="••••••••" 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition-colors p-1"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1 pl-1">{errors.confirmPassword}</p>}
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-white text-black py-2.5 px-6 rounded-lg font-sans text-sm font-semibold mt-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="text-center pt-2">
          <p className="font-sans text-sm text-surface-200 opacity-80">
            Already have an account? <Link to="/login" className="text-white hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;

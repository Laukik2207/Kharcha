import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center luxury-gradient selection:bg-white selection:text-black bg-black">
      {/* Subtle Ambient Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-white opacity-[0.02] blur-[120px] rounded-full"></div>
      </div>
      
      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-[440px] px-5 md:px-0 flex flex-col items-center">
        {/* Branding Anchor */}
        <header className="flex flex-col items-center mb-4 animate-fade-in">
          <h1 className="font-display text-4xl text-white tracking-tighter font-bold">KHA<span className="text-white">₹</span>CHA</h1>
        </header>

        {/* Card */}
        <section className="glass-panel rounded-xl p-5 md:p-6 space-y-4 w-full animate-fade-up">
          {(title || subtitle) && (
            <div className="space-y-1 text-center mb-2">
              {title && <h2 className="font-display text-xl text-white font-medium">{title}</h2>}
              {subtitle && <p className="font-sans text-xs text-surface-200">{subtitle}</p>}
            </div>
          )}
          
          {children}
        </section>

        {/* Trust Badges Footer */}
        <footer className="mt-6 pb-4 space-y-4 animate-fade-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="flex justify-center items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-surface-200" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="font-mono text-[12px] text-surface-200 uppercase tracking-wider">Privacy First</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-sans text-[12px] text-surface-200 opacity-40">
              Made by Laukik Deshmukh
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { loginWithEmail, loginWithGoogle, user, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await loginWithEmail(formData.email, formData.password);
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
    <AuthLayout title="Welcome Back" subtitle="Enter your details to access your account">
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
          <div className="space-y-1">
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
          <div className="space-y-1 relative">
            <div className="flex justify-between">
              <label className="font-mono text-[10px] text-surface-200 uppercase tracking-wider pl-1">Password</label>
              <a href="#" className="font-mono text-[10px] text-white hover:text-surface-200 uppercase tracking-wider">Forgot?</a>
            </div>
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
            {errors.password && <p className="text-xs text-red-400 mt-1 pl-1">{errors.password}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-white text-black py-2.5 px-6 rounded-lg font-sans text-sm font-semibold mt-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="font-sans text-sm text-surface-200 opacity-80">
            Don't have an account? <Link to="/register" className="text-white hover:underline underline-offset-4">Sign Up</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
export { AuthLayout };

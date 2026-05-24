import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const FloatingCard = ({ delay, amount, merchant, category, top, left, right }) => (
  <motion.div
    className="absolute glass-card p-3 flex items-center gap-3 w-48 z-10"
    style={{ top, left, right }}
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <div>
      <p className="text-xs text-surface-400 font-medium">{merchant}</p>
      <p className="text-sm text-white font-bold font-mono">₹{amount}</p>
    </div>
  </motion.div>
);

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex bg-surface-950 overflow-hidden">
    {/* Left Panel - Hidden on Mobile */}
    <div className="hidden lg:flex lg:w-[40%] relative flex-col items-center justify-center bg-gradient-to-br from-surface-950 via-primary-950 to-surface-950 overflow-hidden border-r border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"></div>
      
      <div className="relative z-20 flex flex-col items-center text-center">
        <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow-primary">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Kharcha</h1>
        <p className="text-primary-200/80 max-w-[280px] text-lg font-medium text-balance">
          AI Powered Expense Intelligence Platform
        </p>
      </div>

      <FloatingCard delay={0} amount="4,500" merchant="Amazon" top="15%" left="10%" />
      <FloatingCard delay={1.5} amount="1,200" merchant="Swiggy" top="45%" right="5%" />
      <FloatingCard delay={2.5} amount="12,400" merchant="Flight Tickets" top="75%" left="15%" />
    </div>

    {/* Right Panel - Form */}
    <div className="w-full lg:w-[60%] flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/5 via-transparent to-transparent lg:hidden"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 lg:text-left">
          <div className="lg:hidden w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow-primary">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-surface-400">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  </div>
);

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
    <AuthLayout title="Welcome back" subtitle="Enter your details to access your account">
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

        <form className="space-y-5" onSubmit={handleEmailSubmit} noValidate>
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-surface-300">Password</label>
              <a href="#" className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-surface-400 pointer-events-none z-10">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white focus:outline-none transition-colors p-1"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1">
                {errors.password}
              </motion.p>
            )}
          </div>

          <Button 
            className="w-full mt-2" 
            type="submit"
            loading={isSubmitting}
            size="lg"
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-surface-400">Don't have an account? </span>
          <Link to="/register" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">Sign up</Link>
        </div>
      </Card>
    </AuthLayout>
  );
};

export default Login;
export { AuthLayout, FloatingCard };

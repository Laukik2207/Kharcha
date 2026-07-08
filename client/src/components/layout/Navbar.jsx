import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ isOpen, onMenuClick, onMenuMouseEnter, onMenuMouseLeave }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/expenses') return 'Expenses';
    if (path === '/upload') return 'Upload Data';
    if (path === '/analytics') return 'Analytics';
    if (path === '/insights') return 'AI Insights';
    if (path === '/categories') return 'Categories';
    if (path === '/unknown-merchants') return 'Unknown Merchants';
    return '';
  };

  return (
    <header className="h-16 bg-surface-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-6 z-[105] sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          onMouseEnter={onMenuMouseEnter}
          onMouseLeave={onMenuMouseLeave}
          className="p-2 -ml-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-xl transition-colors relative z-50 flex items-center justify-center w-10 h-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <motion.path 
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              animate={isOpen ? { d: "M6 18L18 6" } : { d: "M4 6h16" }}
              transition={{ duration: 0.3, type: "spring" }}
            />
            <motion.path 
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 12h16"
              animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.path 
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              animate={isOpen ? { d: "M6 6l12 12" } : { d: "M4 18h16" }}
              transition={{ duration: 0.3, type: "spring" }}
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-white tracking-tight hidden lg:block">{getPageTitle()}</h1>
        <div className="lg:hidden">
          <span className="text-lg font-bold text-white tracking-tight">KHA<span className="text-white">₹</span>CHA</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">


        <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-xl relative transition-colors">
          <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-glow-primary"></div>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md hover:ring-2 hover:ring-primary-500/50 transition-all focus:outline-none"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 glass-card border border-surface-700 p-2 shadow-glass-lg z-50 origin-top-right"
                >
                  <div className="px-3 py-2 border-b border-surface-700/50 mb-1">
                    <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-surface-400 truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

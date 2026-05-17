import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/expenses': return 'Expenses';
      case '/upload': return 'Upload CSV';
      case '/analytics': return 'Analytics';
      case '/insights': return 'AI Insights';
      default: return 'Kharcha';
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-100">{getPageTitle()}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-200">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

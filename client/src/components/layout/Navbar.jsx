import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Menu, User as UserIcon, LogOut } from 'lucide-react';

const Navbar = ({ setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

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
    <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center justify-between px-4 lg:px-8 z-10 relative">
      <div className="flex items-center">
        <button 
          onClick={() => setIsOpen(true)}
          className="mr-4 lg:hidden text-gray-400 hover:text-gray-100 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-100">{getPageTitle()}</h2>
      </div>
      
      <div className="flex items-center">
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="flex items-center focus:outline-none"
          >
            <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shadow-md hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 hover:ring-offset-gray-900 transition-all">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-700 lg:hidden">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Profile
              </button>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

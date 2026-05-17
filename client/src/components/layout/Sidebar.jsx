import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, UploadCloud, BarChart2, Lightbulb, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <Receipt size={20} /> },
    { name: 'Upload', path: '/upload', icon: <UploadCloud size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Insights', path: '/insights', icon: <Lightbulb size={20} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center">
          <Wallet className="text-primary-500 w-8 h-8 mr-3" />
          <h1 className="text-2xl font-bold text-gray-100">
            Kharcha
          </h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100 border-l-2 border-transparent'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-200 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

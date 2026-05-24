import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  onClick,
  type = 'button',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = `btn btn-${variant} btn-${size} ${fullWidth ? 'w-full' : ''} ${className}`;

  const renderContent = () => {
    if (loading) {
      return (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    
    return (
      <>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </>
    );
  };

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
};

export default Button;

import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  onClick,
  ...props
}) => {
  const variants = {
    default: 'card',
    glass: 'glass-card',
    'gradient-border': 'card-gradient-border',
    hover: 'card-hover',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardClasses = `${variants[variant]} ${variant !== 'gradient-border' ? paddings[padding] : ''} ${className}`;

  const renderContent = () => {
    if (variant === 'gradient-border') {
      return <div className={paddings[padding]}>{children}</div>;
    }
    return children;
  };

  if (onClick) {
    return (
      <motion.div
        className={`cursor-pointer ${cardClasses}`}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {renderContent()}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {renderContent()}
    </motion.div>
  );
};

export default Card;

import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, subtitle, action }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 border border-surface-700 shadow-glass">
        {typeof icon === 'string' ? (
          <span className="text-4xl">{icon}</span>
        ) : (
          <div className="text-primary-400 w-10 h-10">{icon}</div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-surface-400 max-w-md text-balance mb-6">
        {subtitle}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;

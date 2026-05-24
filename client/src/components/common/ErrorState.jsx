import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const ErrorState = ({ title = 'Something went wrong', message, onRetry }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-surface-400 max-w-md text-balance mb-6">
        {message || 'An unexpected error occurred. Please try again later.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;

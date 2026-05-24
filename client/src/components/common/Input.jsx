import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({
  label,
  error,
  prefix,
  suffix,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 flex items-center justify-center text-surface-400 pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-12' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 flex items-center justify-center text-surface-400 pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          className="input-error"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

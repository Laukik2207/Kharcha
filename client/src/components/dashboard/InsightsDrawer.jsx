import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntelligentInsights from './IntelligentInsights';

const InsightsDrawer = ({ isOpen, onClose, data, loading, onRefresh }) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface-container border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-surface-container/90 backdrop-blur-md p-6 border-b border-white/5 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                <h2 className="font-headline-sm text-headline-sm text-white">AI Insights</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-secondary hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="p-6">
              <IntelligentInsights 
                data={data} 
                loading={loading} 
                onRefresh={onRefresh} 
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InsightsDrawer;

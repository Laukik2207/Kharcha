import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';

const CATEGORIES = ['Food', 'Shopping', 'Groceries', 'Petrol', 'Entertainment', 'Bills', 'Travel', 'Health', 'Others'];
const METHODS = ['UPI', 'Card', 'Cash', 'Net Banking', 'Other'];

const ExpenseFormModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    amount: '',
    merchant: '',
    category: 'Others',
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          amount: initialData.amount || '',
          merchant: initialData.merchant || '',
          category: initialData.category || 'Others',
          paymentMethod: initialData.paymentMethod || 'UPI',
          date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          note: initialData.note || ''
        });
      } else {
        setFormData({
          amount: '',
          merchant: '',
          category: 'Others',
          paymentMethod: 'UPI',
          date: new Date().toISOString().split('T')[0],
          note: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.merchant || !formData.merchant.trim()) {
      newErrors.merchant = 'Merchant is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, amount: Number(formData.amount) });
    }
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-surface w-full max-w-md rounded-2xl shadow-xl border border-gray-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-100">
            {initialData ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Amount *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full pl-7 pr-3 py-2 bg-gray-900 border ${errors.amount ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200 text-sm`}
                  placeholder="0.00"
                  autoFocus
                />
              </div>
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Merchant *</label>
            <input
              type="text"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
              className={`w-full px-3 py-2 bg-gray-900 border ${errors.merchant ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200 text-sm`}
              placeholder="e.g. Swiggy, Amazon, Shell"
            />
            {errors.merchant && <p className="mt-1 text-xs text-red-500">{errors.merchant}</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 bg-gray-900 border ${errors.category ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200 text-sm`}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200 text-sm"
              >
                {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Note <span className="text-gray-500">(Optional)</span></label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200 text-sm resize-none"
              placeholder="Any extra details..."
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-800">
            <Button type="button" onClick={onClose} variant="secondary" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {initialData ? 'Update Expense' : 'Save Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseFormModal;

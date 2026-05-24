import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense' : 'Add Expense'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <Input
            label="Amount *"
            type="number"
            name="amount"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            placeholder="0.00"
            prefix={<span className="font-mono font-bold">₹</span>}
            autoFocus
          />

          <Input
            label="Date *"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Merchant *"
          type="text"
          name="merchant"
          value={formData.merchant}
          onChange={handleChange}
          error={errors.merchant}
          placeholder="e.g. Swiggy, Amazon, Shell"
        />

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-full">
            <label className="input-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input-field ${errors.category ? 'border-red-500' : ''}`}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="input-error">{errors.category}</p>}
          </div>

          <div className="w-full">
            <label className="input-label">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="input-field"
            >
              {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="input-label">Note <span className="text-surface-500 font-normal">(Optional)</span></label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="Any extra details..."
          />
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-surface-700/50">
          <Button type="button" onClick={onClose} variant="secondary" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Update Expense' : 'Save Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseFormModal;

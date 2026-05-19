import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import FilterBar from '../components/expenses/FilterBar';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseFormModal from '../components/expenses/ExpenseFormModal';
import DeleteConfirmModal from '../components/expenses/DeleteConfirmModal';
import Button from '../components/common/Button';
import { AlertCircle } from 'lucide-react';

const Expenses = () => {
  const {
    expenses,
    loading,
    error,
    totalCount,
    totalPages,
    currentPage,
    filters,
    setFilter,
    resetFilters,
    addExpense,
    editExpense,
    removeExpense
  } = useExpenses();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const handleAddSubmit = async (data) => {
    setActionLoading(true);
    setActionError(null);
    const result = await addExpense(data);
    setActionLoading(false);
    
    if (result.success) {
      setShowAddModal(false);
    } else {
      setActionError(result.message);
    }
  };

  const handleEditSubmit = async (data) => {
    setActionLoading(true);
    setActionError(null);
    const result = await editExpense(editingExpense._id, data);
    setActionLoading(false);
    
    if (result.success) {
      setEditingExpense(null);
    } else {
      setActionError(result.message);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    setActionError(null);
    const result = await removeExpense(deletingExpenseId);
    setActionLoading(false);
    
    if (result.success) {
      setDeletingExpenseId(null);
    } else {
      setActionError(result.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Expenses</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage and track your transactions</p>
        </div>
        <Button onClick={() => { setActionError(null); setShowAddModal(true); }}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </Button>
      </div>

      {/* Global Action Errors */}
      {actionError && (
        <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start text-red-400">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{actionError}</span>
        </div>
      )}

      {/* Main Content */}
      <FilterBar 
        filters={filters} 
        setFilter={setFilter} 
        resetFilters={resetFilters} 
      />

      <ExpenseTable 
        expenses={expenses}
        loading={loading && !actionLoading}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
        setFilter={setFilter}
        onEdit={(exp) => { setActionError(null); setEditingExpense(exp); }}
        onDelete={(id) => { setActionError(null); setDeletingExpenseId(id); }}
      />

      {/* Modals */}
      <ExpenseFormModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSubmit={handleAddSubmit}
        loading={actionLoading}
      />

      <ExpenseFormModal 
        isOpen={!!editingExpense} 
        initialData={editingExpense}
        onClose={() => setEditingExpense(null)} 
        onSubmit={handleEditSubmit}
        loading={actionLoading}
      />

      <DeleteConfirmModal 
        isOpen={!!deletingExpenseId}
        onClose={() => setDeletingExpenseId(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );
};

export default Expenses;

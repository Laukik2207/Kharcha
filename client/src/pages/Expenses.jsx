import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useExpenses } from '../hooks/useExpenses';
import FilterBar from '../components/expenses/FilterBar';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseFormModal from '../components/expenses/ExpenseFormModal';
import DeleteConfirmModal from '../components/expenses/DeleteConfirmModal';
import Button from '../components/common/Button';
import { Plus } from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
import PageLoader from '../components/common/PageLoader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const Expenses = () => {
  const {
    expenses,
    loading,
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

  const handleAddSubmit = async (data) => {
    setActionLoading(true);
    const result = await addExpense(data);
    setActionLoading(false);
    
    if (result.success) {
      showSuccess('Expense added successfully');
      setShowAddModal(false);
    } else {
      showError(result.message || 'Failed to add expense');
    }
  };

  const handleEditSubmit = async (data) => {
    setActionLoading(true);
    const result = await editExpense(editingExpense._id, data);
    setActionLoading(false);
    
    if (result.success) {
      showSuccess('Expense updated successfully');
      setEditingExpense(null);
    } else {
      showError(result.message || 'Failed to update expense');
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    const result = await removeExpense(deletingExpenseId);
    setActionLoading(false);
    
    if (result.success) {
      showSuccess('Expense deleted successfully');
      setDeletingExpenseId(null);
    } else {
      showError(result.message || 'Failed to delete expense');
    }
  };

  if (loading && expenses.length === 0) {
    return <PageLoader />;
  }

  return (
    <motion.div 
      className="space-y-6 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Manage and track your transactions</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Expense
        </Button>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <FilterBar 
          filters={filters} 
          setFilter={setFilter} 
          resetFilters={resetFilters} 
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ExpenseTable 
          expenses={expenses}
          loading={loading && !actionLoading}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          setFilter={setFilter}
          onEdit={(exp) => setEditingExpense(exp)}
          onDelete={(id) => setDeletingExpenseId(id)}
        />
      </motion.div>

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
    </motion.div>
  );
};

export default Expenses;

import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import CategoryBadge, { CATEGORY_COLORS } from '../components/categories/CategoryBadge';
import UserRulesTable from '../components/categories/UserRulesTable';
import RuleFormModal from '../components/categories/RuleFormModal';

const Categories = () => {
  const {
    categories,
    userRules,
    systemRules,
    loading,
    saving,
    addRule,
    editRule,
    removeRule,
    previewRule,
    runRecategorize
  } = useCategories();

  const [activeTab, setActiveTab] = useState('user');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [systemSearch, setSystemSearch] = useState('');
  const [recategorizeStatus, setRecategorizeStatus] = useState(null);

  const handleOpenAdd = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (ruleOrId, updateData) => {
    if (updateData) {
      // Toggle active status directly
      editRule(ruleOrId, updateData);
    } else {
      // Open modal to edit
      setEditingRule(ruleOrId);
      setIsModalOpen(true);
    }
  };

  const handleSaveRule = async (data) => {
    let res;
    if (editingRule) {
      res = await editRule(editingRule._id, data);
    } else {
      res = await addRule(data);
    }
    if (res.success) setIsModalOpen(false);
    else alert(res.error);
  };

  const handleDeleteRule = async (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      await removeRule(id);
    }
  };

  const handleRecategorize = async () => {
    if (window.confirm('This will evaluate all your past expenses against your current rules and update their categories. This action cannot be undone. Proceed?')) {
      const res = await runRecategorize();
      if (res.success) {
        setRecategorizeStatus(`Successfully updated ${res.updated} out of ${res.total} expenses.`);
        setTimeout(() => setRecategorizeStatus(null), 5000);
      } else {
        alert(res.error);
      }
    }
  };

  const filteredSystemRules = systemRules.filter(r => 
    r.pattern.toLowerCase().includes(systemSearch.toLowerCase()) || 
    r.category.toLowerCase().includes(systemSearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Category Rules</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Manage how merchants are automatically assigned to categories.
          </p>
        </div>
        <button 
          onClick={handleRecategorize}
          disabled={saving}
          className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-gray-700 disabled:opacity-50"
        >
          {saving ? (
            <svg className="w-5 h-5 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          <span>Re-categorize All Expenses</span>
        </button>
      </div>

      {recategorizeStatus && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm font-medium animate-fade-in">
          ✅ {recategorizeStatus}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'user', label: 'My Custom Rules' },
            { id: 'system', label: 'System Rules' },
            { id: 'overview', label: 'Category Overview' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id 
                  ? 'border-primary-500 text-primary-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'}
              `}
            >
              {tab.label}
              {tab.id === 'user' && userRules.length > 0 && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-primary-500/20 text-primary-300' : 'bg-gray-800 text-gray-400'}`}>
                  {userRules.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content: User Rules */}
      {activeTab === 'user' && (
        <div className="animate-fade-in">
          <div className="flex justify-end mb-4">
            <button 
              onClick={handleOpenAdd}
              className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 transition-all flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Custom Rule</span>
            </button>
          </div>
          <UserRulesTable 
            rules={userRules} 
            loading={loading} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteRule} 
          />
        </div>
      )}

      {/* Tab Content: System Rules */}
      {activeTab === 'system' && (
        <div className="animate-fade-in space-y-4">
          <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-800 flex items-center text-sm text-gray-400">
            <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            System rules serve as the default fallback. Your custom rules always take priority over these.
          </div>

          <input
            type="text"
            placeholder="Search system rules..."
            value={systemSearch}
            onChange={(e) => setSystemSearch(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-gray-800 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-200 text-sm mb-4"
          />

          <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-900/50 border-b border-gray-800 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Match Pattern</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Assigns To Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredSystemRules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/30">
                    <td className="px-6 py-3 font-mono text-gray-300">{rule.pattern}</td>
                    <td className="px-6 py-3">
                      <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                        {rule.type}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <CategoryBadge category={rule.category} />
                    </td>
                  </tr>
                ))}
                {filteredSystemRules.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No system rules matched your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Category Overview */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const ruleCount = userRules.filter(r => r.category === cat.name).length;
            const style = CATEGORY_COLORS[cat.name] || CATEGORY_COLORS.Others;
            // Extract just the text colors from the style
            const borderStyle = style.split(' ').find(c => c.startsWith('border-'));
            const bgStyle = style.split(' ').find(c => c.startsWith('bg-'));

            return (
              <div key={cat._id} className={`bg-surface rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors flex items-start space-x-4`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border ${bgStyle} ${borderStyle} flex-shrink-0`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-200">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{ruleCount} custom rules</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <RuleFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveRule}
        initialData={editingRule}
        loading={saving}
        onTestPreview={previewRule}
      />

    </div>
  );
};

export default Categories;

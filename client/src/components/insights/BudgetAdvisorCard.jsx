import React, { useState } from 'react';
import InsightCard from './InsightCard';
import { formatINR } from '../../utils/formatCurrency';
import { Target, ArrowRight, CheckCircle2 } from 'lucide-react';

const BudgetAdvisorCard = ({ data, loading, error, onFetchAdvice }) => {
  const [budgetInput, setBudgetInput] = useState('');

  const handleGetAdvice = () => {
    const goal = parseFloat(budgetInput);
    if (goal > 0) {
      onFetchAdvice(goal);
    }
  };

  const feasibilityColors = {
    Achievable: 'bg-green-500 text-white',
    Challenging: 'bg-amber-500 text-white',
    'Very Difficult': 'bg-red-500 text-white'
  };

  // If we have data, show the result. Otherwise show the input form.
  if (data && !data.empty && !loading && !error) {
    return (
      <InsightCard title="Budget Advisor" icon="🎯" accentColor="border-blue-500">
        <div className="space-y-5 animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Required reduction</p>
              <h3 className="text-xl font-bold text-gray-100">{formatINR(data.requiredReduction)}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${feasibilityColors[data.feasibility] || feasibilityColors.Challenging}`}>
              {data.feasibility}
            </span>
          </div>

          {/* Table */}
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800 uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium text-right">Current</th>
                  <th className="px-3 py-2 font-medium text-right">Target</th>
                  <th className="px-3 py-2 font-medium text-right">Cut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {data.categoryBudgets?.map((cat, idx) => (
                  <tr key={idx} className="bg-gray-900/30 hover:bg-gray-900/60 transition-colors">
                    <td className="px-3 py-2 text-gray-200 font-medium">{cat.category}</td>
                    <td className="px-3 py-2 text-gray-400 text-right">{formatINR(cat.currentSpend)}</td>
                    <td className="px-3 py-2 text-gray-200 text-right">{formatINR(cat.suggestedBudget)}</td>
                    <td className={`px-3 py-2 text-right font-bold ${cat.reduction > 0 ? 'text-red-400' : 'text-gray-500'}`}>
                      {cat.reduction > 0 ? `-${formatINR(cat.reduction)}` : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300">Strategy:</h4>
            <ul className="space-y-2">
              {data.tips?.map((tip, idx) => (
                <li key={idx} className="flex items-start text-xs text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setBudgetInput('')}
            className="w-full py-2 text-sm text-gray-400 hover:text-white border border-gray-800 hover:bg-gray-800 rounded-lg transition-colors"
          >
            Try a different budget
          </button>
        </div>
      </InsightCard>
    );
  }

  // Input Form State
  return (
    <InsightCard title="Budget Advisor" icon="🎯" loading={loading} error={error} onRefresh={null} accentColor="border-blue-500">
      <div className="flex flex-col h-full justify-center space-y-6 py-4">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
            <Target size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-100">Set Next Month's Budget</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Tell AI your spending goal for next month, and get a customized category-by-category plan to achieve it.
          </p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 font-medium">₹</span>
            <input
              type="number"
              placeholder="e.g. 25000"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGetAdvice(); }}
              className="w-full bg-gray-900 border border-gray-700 text-white text-lg rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            onClick={handleGetAdvice}
            disabled={!budgetInput || loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium rounded-xl py-3 transition-colors shadow-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Get Budget Plan <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </InsightCard>
  );
};

export default BudgetAdvisorCard;

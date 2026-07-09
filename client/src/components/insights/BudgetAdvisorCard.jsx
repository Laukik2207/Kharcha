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
    Achievable: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    Challenging: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    'Very Difficult': 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
  };

  // If we have data, show the result. Otherwise show the input form.
  if (data && !data.empty && !loading && !error) {
    return (
      <InsightCard title="Budget Advisor" icon="🎯" accentColor="border-blue-500">
        <div className="space-y-5 animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <div>
              <p className="text-xs text-surface-400 font-medium tracking-wide uppercase">Required reduction</p>
              <h3 className="text-2xl font-display font-semibold text-white mt-1">{formatINR(data.requiredReduction)}</h3>
            </div>
            <span className={`px-3 py-1.5 rounded-md text-xs font-semibold ${feasibilityColors[data.feasibility] || feasibilityColors.Challenging}`}>
              {data.feasibility}
            </span>
          </div>

          {/* Table */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-[#050505]">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-surface-400 border-b border-white/10 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Current</th>
                  <th className="px-4 py-3 text-right">Target</th>
                  <th className="px-4 py-3 text-right">Cut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.categoryBudgets?.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-surface-200 font-medium">{cat.category}</td>
                    <td className="px-4 py-3 text-surface-400 text-right font-mono">{formatINR(cat.currentSpend)}</td>
                    <td className="px-4 py-3 text-surface-200 text-right font-mono">{formatINR(cat.suggestedBudget)}</td>
                    <td className={`px-4 py-3 text-right font-bold font-mono ${cat.reduction > 0 ? 'text-rose-400' : 'text-surface-500'}`}>
                      {cat.reduction > 0 ? `-${formatINR(cat.reduction)}` : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tips */}
          <div className="space-y-3 bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
            <h4 className="text-sm font-semibold text-surface-200">Strategy</h4>
            <ul className="space-y-2.5">
              {data.tips?.map((tip, idx) => (
                <li key={idx} className="flex items-start text-sm text-surface-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-3 mt-0.5 shrink-0" />
                  <span className="leading-relaxed font-medium">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setBudgetInput('')}
            className="w-full py-3 text-sm font-medium text-surface-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/[0.02] rounded-xl transition-all duration-300"
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
      <div className="flex flex-col h-full justify-center space-y-8 py-6 px-2">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.05] to-transparent"></div>
            <Target size={36} className="group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h3 className="text-xl font-display font-semibold text-white tracking-wide">Set Next Month's Budget</h3>
            <p className="text-sm text-surface-400 max-w-[280px] mx-auto mt-2 font-medium leading-relaxed">
              Tell AI your spending goal for next month, and get a customized plan to achieve it.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-surface-400 font-medium text-lg">₹</span>
            <input
              type="number"
              placeholder="e.g. 25000"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGetAdvice(); }}
              className="w-full bg-[#050505] border border-white/10 text-white text-xl rounded-xl pl-10 pr-4 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all group-hover:border-white/20 shadow-inner font-mono"
            />
          </div>
          <button
            onClick={handleGetAdvice}
            disabled={!budgetInput || loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600/90 hover:bg-blue-500 disabled:bg-surface-800 disabled:text-surface-500 disabled:border-white/5 text-white font-semibold tracking-wide rounded-xl py-4 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-500/50 disabled:shadow-none"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Get Budget Plan <ArrowRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </InsightCard>
  );
};

export default BudgetAdvisorCard;

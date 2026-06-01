import React, { useState } from 'react';
import { useUnknownMerchants } from '../hooks/useUnknownMerchants';
import UnknownMerchantList from '../components/unknownMerchants/UnknownMerchantList';
import BulkAssignModal from '../components/unknownMerchants/BulkAssignModal';
import { CheckCircle2, ListChecks } from 'lucide-react';

const UnknownMerchants = () => {
  const { unknownMerchants, loading, totalCount, assigning, assign, assignAll, dismiss } = useUnknownMerchants();
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-100">Unknown Merchants</h1>
            {!loading && totalCount > 0 && (
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {totalCount} Pending
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Assign categories to unknown merchants to automatically categorize them in the future.
          </p>
        </div>

        {!loading && unknownMerchants.length > 0 && (
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <ListChecks size={18} />
            Assign All
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-gray-800 h-64 animate-pulse"></div>
          ))}
        </div>
      ) : unknownMerchants.length === 0 ? (
        <div className="bg-surface border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center animate-fade-in min-h-[400px]">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">All merchants categorized!</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Great job! Every transaction has been assigned a category. Future uploads will use your custom rules automatically.
          </p>
        </div>
      ) : (
        <UnknownMerchantList 
          merchants={unknownMerchants} 
          onAssign={assign}
          onDismiss={dismiss}
          assigning={assigning}
        />
      )}

      {/* Bulk Assign Modal */}
      <BulkAssignModal 
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        merchants={unknownMerchants}
        onAssignAll={assignAll}
        assigning={assigning}
      />
    </div>
  );
};

export default UnknownMerchants;

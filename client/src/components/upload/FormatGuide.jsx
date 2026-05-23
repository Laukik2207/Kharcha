import React, { useState } from 'react';

const FormatGuide = ({ onDownloadSample }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 bg-surface rounded-xl border border-gray-800 overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors focus:outline-none"
      >
        <h3 className="text-lg font-bold text-gray-200">Supported CSV Formats</h3>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 border-t border-gray-800 bg-gray-900/20">
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Format</th>
                  <th className="px-4 py-3">Bank / App</th>
                  <th className="px-4 py-3">Required Columns</th>
                  <th className="px-4 py-3 rounded-tr-lg">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                <tr className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium text-purple-400">Kharcha</td>
                  <td className="px-4 py-3 text-gray-300">Generic Template</td>
                  <td className="px-4 py-3"><code className="text-xs bg-gray-900 px-1 py-0.5 rounded">date, amount, merchant, category, note, paymentMethod</code></td>
                  <td className="px-4 py-3">Standard format for best results. Auto-categorization will try to match merchant names if category is left blank.</td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium text-blue-400">HDFC</td>
                  <td className="px-4 py-3 text-gray-300">HDFC Bank Statement</td>
                  <td className="px-4 py-3"><code className="text-xs bg-gray-900 px-1 py-0.5 rounded">Date, Narration, Withdrawal Amt.</code></td>
                  <td className="px-4 py-3">Only withdrawals are imported. Deposits are automatically skipped.</td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium text-orange-400">SBI</td>
                  <td className="px-4 py-3 text-gray-300">State Bank of India</td>
                  <td className="px-4 py-3"><code className="text-xs bg-gray-900 px-1 py-0.5 rounded">Txn Date, Description, Debit, Credit</code></td>
                  <td className="px-4 py-3">Only debit transactions are imported. Description is parsed to identify merchant.</td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium text-green-400">ICICI</td>
                  <td className="px-4 py-3 text-gray-300">ICICI Bank</td>
                  <td className="px-4 py-3"><code className="text-xs bg-gray-900 px-1 py-0.5 rounded">Transaction Date, Transaction Remarks, Withdrawal Amount (INR )</code></td>
                  <td className="px-4 py-3">Extracts merchant details from the remarks column. Skips all deposits.</td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium text-teal-400">UPI</td>
                  <td className="px-4 py-3 text-gray-300">Paytm, PhonePe, Generic UPI</td>
                  <td className="px-4 py-3"><code className="text-xs bg-gray-900 px-1 py-0.5 rounded">Date, Description, Amount, Type</code></td>
                  <td className="px-4 py-3">Ensures only "Debit" types are recorded. Descriptions usually map directly to merchants.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
            <div className="mb-3 sm:mb-0">
              <h4 className="text-sm font-bold text-gray-200">Need a starting point?</h4>
              <p className="text-xs text-gray-400 mt-0.5">Download our sample template with all the recommended headers.</p>
            </div>
            <button 
              onClick={onDownloadSample}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Sample CSV</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FormatGuide;

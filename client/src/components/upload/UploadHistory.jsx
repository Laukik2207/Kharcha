import React from 'react';
import { formatDate } from '../../utils/formatCurrency';

const FormatBadge = ({ format }) => {
  const styles = {
    kharcha: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    hdfc: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    sbi: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    icici: 'bg-green-500/10 text-green-400 border-green-500/20',
    upi: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    unknown: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  };
  
  const style = styles[format?.toLowerCase()] || styles.unknown;
  
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style}`}>
      {format || 'Unknown'}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
        <span>Processing</span>
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
        Completed
      </span>
    );
  }
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
      Failed
    </span>
  );
};

const UploadHistory = ({ history, loading, onDelete, onDownload, downloadingId }) => {
  const [deletingId, setDeletingId] = React.useState(null);

  const handleDelete = (id) => {
    onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="mt-8 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-100 mb-6">Upload History</h2>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-surface rounded-xl border border-gray-800 animate-pulse"></div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="bg-surface rounded-xl border border-gray-800 p-8 text-center">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400 font-medium">No uploads yet</p>
          <p className="text-xs text-gray-500 mt-1">Your statement upload history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div key={record._id} className="bg-surface rounded-xl border border-gray-800 p-5 shadow-sm hover:border-gray-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1.5">
                  <h3 className="text-sm font-bold text-gray-200 truncate" title={record.originalFileName}>
                    {record.originalFileName}
                  </h3>
                  <FormatBadge format={record.format} />
                </div>
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <span>{formatDate(record.createdAt)}</span>
                  <span>{(record.fileSize / 1024).toFixed(1)} KB</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-6">
                
                <div className="text-right">
                  <StatusBadge status={record.status} />
                  {record.status === 'completed' && (
                    <p className="text-[10px] text-gray-500 mt-1.5 font-medium">
                      <span className="text-green-400">{record.parsedRows}</span> IMP • 
                      <span className="text-gray-400 ml-1">{record.skippedRows}</span> SKP
                    </p>
                  )}
                  {record.status === 'failed' && (
                    <p className="text-[10px] text-red-500 mt-1.5 truncate max-w-[150px]" title={record.errorMessage}>
                      {record.errorMessage}
                    </p>
                  )}
                </div>

                {deletingId === record._id ? (
                  <div className="flex items-center space-x-2 bg-red-500/10 p-1.5 rounded-lg border border-red-500/20">
                    <span className="text-xs text-red-400 font-medium px-1">Delete?</span>
                    <button 
                      onClick={() => handleDelete(record._id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded transition-colors"
                    >
                      Yes
                    </button>
                    <button 
                      onClick={() => setDeletingId(null)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium rounded transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    {record.status === 'completed' && record.s3Key && (
                      <button 
                        onClick={() => onDownload(record._id, record.originalFileName)}
                        disabled={downloadingId === record._id}
                        className="p-2 text-gray-500 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors group disabled:opacity-50"
                        title="Download original CSV"
                      >
                        {downloadingId === record._id ? (
                          <svg className="animate-spin h-5 w-5 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        )}
                      </button>
                    )}
                    <button 
                      onClick={() => setDeletingId(record._id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
                      title="Delete upload and associated expenses"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadHistory;

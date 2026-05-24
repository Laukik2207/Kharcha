import React from 'react';

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

const FilePreviewCard = ({ statement, onDownload, onDelete, downloading }) => {
  if (!statement) return null;

  return (
    <div className="bg-surface rounded-xl border border-gray-800 p-5 mt-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-primary-500/10 rounded-lg text-primary-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h3 className="text-sm font-bold text-gray-200 truncate" title={statement.originalFileName}>
              {statement.originalFileName}
            </h3>
            <FormatBadge format={statement.format} />
          </div>
          <div className="flex items-center text-xs text-gray-500 space-x-3 mb-2">
            <span>{(statement.fileSize / 1024).toFixed(1)} KB</span>
            <span>•</span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              <span className="text-[10px] font-medium">Stored in S3 ☁</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {statement.s3Key && (
          <button
            onClick={onDownload}
            disabled={downloading}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-gray-700 flex items-center space-x-2 disabled:opacity-50"
          >
            {downloading ? (
              <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            <span>Download Original</span>
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
          title="Delete statement"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FilePreviewCard;

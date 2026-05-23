import React from 'react';
import { Link } from 'react-router-dom';

const UploadProgress = ({ uploadResult, uploading, uploadProgress }) => {
  if (!uploading && !uploadResult) return null;

  const isCompleted = uploadResult?.status === 'completed';
  const isFailed = uploadResult?.status === 'failed';
  const isProcessing = uploadResult?.status === 'processing';

  return (
    <div className="mt-6 animate-fade-in">
      {/* Uploading Phase */}
      {uploading && !uploadResult && (
        <div className="bg-surface rounded-xl border border-gray-800 p-5 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-sm font-medium text-gray-200">Uploading file to server...</h3>
            <span className="text-sm font-bold text-primary-400">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300 ease-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Processing Phase (Polling) */}
      {isProcessing && !uploading && (
        <div className="bg-surface rounded-xl border border-primary-500/30 p-5 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-500/5 animate-pulse"></div>
          <div className="relative flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 border border-primary-500/30">
              <svg className="w-4 h-4 text-primary-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary-400 mb-0.5">Processing Data</h3>
              <p className="text-xs text-gray-400">Parsing and categorizing transactions. This might take a moment...</p>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {isCompleted && (
        <div className="bg-green-500/10 rounded-xl border border-green-500/20 p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold text-green-400">Processing Complete!</h3>
            </div>
            <p className="text-sm text-green-500/80 mb-4">
              Detected format: <span className="font-bold uppercase">{uploadResult.format}</span>
            </p>
            <Link to="/expenses" className="text-sm font-medium text-white bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg transition-colors inline-block">
              View your expenses →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-shrink-0">
            <div className="bg-gray-900/50 rounded-lg p-3 border border-green-500/10 text-center">
              <span className="block text-2xl font-bold text-gray-200">{uploadResult.parsedRows}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500">Imported</span>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 border border-green-500/10 text-center">
              <span className="block text-2xl font-bold text-gray-200">{uploadResult.skippedRows}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500">Skipped</span>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isFailed && (
        <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-5 shadow-sm flex items-start space-x-3">
          <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-base font-bold text-red-400 mb-1">Processing Failed</h3>
            <p className="text-sm text-red-500/80">{uploadResult.errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadProgress;

import React from 'react';
import { useUpload } from '../hooks/useUpload';
import DropZone from '../components/upload/DropZone';
import UploadProgress from '../components/upload/UploadProgress';
import UploadHistory from '../components/upload/UploadHistory';
import FormatGuide from '../components/upload/FormatGuide';

const Upload = () => {
  const {
    uploading,
    uploadProgress,
    uploadError,
    uploadResult,
    uploadFile,
    history,
    historyLoading,
    deleteRecord,
    downloadSampleCSV
  } = useUpload();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Upload Statement</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Import your bank and UPI statements to automatically generate expenses.
          </p>
        </div>
        <button 
          onClick={downloadSampleCSV}
          className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors flex items-center space-x-1 bg-primary-500/10 px-3 py-1.5 rounded-lg border border-primary-500/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Sample CSV</span>
        </button>
      </div>

      {/* Main Upload Area */}
      <div className="relative">
        <DropZone 
          onFileSelect={uploadFile} 
          uploading={uploading} 
          disabled={uploadResult?.status === 'processing'} 
        />

        {/* Floating Error Message on Top of DropZone */}
        {uploadError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 z-10 animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium truncate">{uploadError}</p>
          </div>
        )}
      </div>

      {/* Progress & Results */}
      <UploadProgress 
        uploadResult={uploadResult} 
        uploading={uploading} 
        uploadProgress={uploadProgress} 
      />

      {/* Help Guide */}
      <FormatGuide onDownloadSample={downloadSampleCSV} />

      {/* Historical Uploads */}
      <UploadHistory 
        history={history} 
        loading={historyLoading} 
        onDelete={deleteRecord} 
      />

    </div>
  );
};

export default Upload;

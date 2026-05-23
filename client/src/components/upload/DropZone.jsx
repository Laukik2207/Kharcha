import React, { useRef, useState } from 'react';

const DropZone = ({ onFileSelect, uploading, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled || uploading) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;
    
    const file = e.dataTransfer.files[0];
    if (file) validateAndSelect(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) validateAndSelect(file);
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateAndSelect = (file) => {
    // Basic validation before passing up
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a valid CSV file.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div 
      className={`
        w-full min-h-[220px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all cursor-pointer relative overflow-hidden
        ${disabled || uploading ? 'opacity-75 cursor-not-allowed border-gray-700 bg-gray-900/50' : 
          isDragging ? 'border-primary-500 bg-primary-500/10 scale-[1.01]' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/30 bg-surface'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        accept=".csv" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      
      {uploading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-200">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-3 pointer-events-none">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-primary-500/20 text-primary-400' : 'bg-gray-800/50 text-gray-400'} transition-colors`}>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-100 mb-1">Drag & drop your CSV statement here</h3>
            <p className="text-gray-400 font-medium">or click to browse</p>
          </div>
          <div className="pt-2 flex flex-col items-center text-xs text-gray-500 space-y-1">
            <p>Supports: CSV files up to 5MB</p>
            <p>Supported formats: Kharcha, HDFC, SBI, ICICI, Paytm UPI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;

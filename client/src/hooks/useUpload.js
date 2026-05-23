import { useState, useEffect, useRef, useCallback } from 'react';
import uploadService from '../services/uploadService';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  
  const pollingIntervalRef = useRef(null);

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const data = await uploadService.getUploadHistory();
      setHistory(data);
      setHistoryError(null);
    } catch (err) {
      setHistoryError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, []);

  const startPolling = (statementId) => {
    clearPolling(); // Ensure no existing poll is running
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const statusData = await uploadService.getUploadStatus(statementId);
        setUploadResult(statusData);

        if (statusData.status === 'completed' || statusData.status === 'failed') {
          clearPolling();
          fetchHistory(); // Refresh history table when done
        }
      } catch (err) {
        console.error('Polling error', err);
        clearPolling();
      }
    }, 2000);
  };

  const uploadFile = async (file) => {
    if (!file) return;
    
    // Client-side validation
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      setUploadError('Only CSV files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB limit');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadResult(null);

    try {
      const result = await uploadService.uploadCSV(file, setUploadProgress);
      // Backend returned 202 Accepted, start polling status
      setUploadResult({ status: 'processing', _id: result.statementId });
      startPolling(result.statementId);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload file');
      setUploading(false);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await uploadService.deleteUpload(id);
      await fetchHistory();
    } catch (err) {
      console.error('Failed to delete upload record', err);
    }
  };

  return {
    uploading,
    uploadProgress,
    uploadError,
    uploadResult,
    uploadFile,
    history,
    historyLoading,
    historyError,
    deleteRecord,
    downloadSampleCSV: uploadService.downloadSampleCSV
  };
};

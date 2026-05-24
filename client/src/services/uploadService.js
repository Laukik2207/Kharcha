import api from './api';

const uploadService = {
  uploadCSV: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('statement', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data.data;
  },

  getUploadHistory: async () => {
    const response = await api.get('/upload/history');
    return response.data.data;
  },

  getUploadStatus: async (id) => {
    const response = await api.get(`/upload/status/${id}`);
    return response.data.data;
  },

  deleteUpload: async (id) => {
    const response = await api.delete(`/upload/${id}`);
    return response.data.data;
  },

  getSignedUrl: async (statementId) => {
    const response = await api.get(`/upload/signed-url/${statementId}`);
    return response.data.data.url;
  },

  downloadFile: async (statementId, fileName) => {
    try {
      const url = await uploadService.getSignedUrl(statementId);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Failed to download file', err);
      throw err;
    }
  },

  downloadSampleCSV: () => {
    const csvContent = `date,amount,merchant,category,note,paymentMethod
2026-05-01,450,Swiggy,Food,Dinner order,UPI
2026-05-02,1200,Amazon,Shopping,Book purchase,Card
2026-05-03,800,BigBasket,Groceries,Weekly groceries,UPI
2026-05-04,500,Indian Oil,Petrol,Fuel refill,Cash
2026-05-05,299,Netflix,Entertainment,Monthly subscription,Card
2026-05-06,150,Uber,Travel,Office cab,UPI
2026-05-07,2500,Apollo Pharmacy,Health,Medicines,UPI
2026-05-08,999,Airtel,Bills,Monthly recharge,UPI`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'kharcha_sample.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default uploadService;

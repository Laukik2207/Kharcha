import toast from 'react-hot-toast';

export const showSuccess = (msg) => toast.success(msg);
export const showError = (msg) => toast.error(msg);
export const showLoading = (msg) => toast.loading(msg);
export const showInfo = (msg) => toast(msg, { icon: 'ℹ️' });
export const dismissToast = (id) => toast.dismiss(id);
export const promiseToast = (promise, msgs) =>
  toast.promise(promise, {
    loading: msgs.loading || 'Loading...',
    success: msgs.success || 'Done!',
    error: msgs.error || 'Something went wrong',
  });

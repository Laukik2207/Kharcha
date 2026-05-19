export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', 
    month: 'short', 
    year: 'numeric'
  }).format(new Date(date));

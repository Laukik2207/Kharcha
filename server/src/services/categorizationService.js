const categoryMap = {
  'Swiggy': 'Food',
  'Zomato': 'Food',
  'Amazon': 'Shopping',
  'Flipkart': 'Shopping',
  'Uber': 'Transport',
  'Ola': 'Transport',
  'Indian Oil': 'Petrol',
  'Bharat Petroleum': 'Petrol',
  'Netflix': 'Entertainment',
  'Spotify': 'Entertainment',
  'Apollo': 'Health',
  'Pharmeasy': 'Health'
};

export const categorize = (merchant) => {
  if (!merchant) return 'Others';
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (merchant.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return 'Others';
};

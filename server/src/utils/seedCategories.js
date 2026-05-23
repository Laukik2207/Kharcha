import Category from '../models/Category.js';

export const seedCategories = async () => {
  const defaultCategories = [
    { name: 'Food', icon: '🍔', color: '#f97316' },
    { name: 'Shopping', icon: '🛍️', color: '#a855f7' },
    { name: 'Groceries', icon: '🛒', color: '#22c55e' },
    { name: 'Petrol', icon: '⛽', color: '#eab308' },
    { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
    { name: 'Bills', icon: '📄', color: '#ef4444' },
    { name: 'Travel', icon: '✈️', color: '#3b82f6' },
    { name: 'Health', icon: '💊', color: '#14b8a6' },
    { name: 'Others', icon: '📦', color: '#6b7280' }
  ];

  try {
    for (const cat of defaultCategories) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        { $setOnInsert: { ...cat, isDefault: true } },
        { upsert: true, new: true }
      );
    }
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

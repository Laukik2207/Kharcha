import 'dotenv/config';
import { generateInsight } from './src/services/geminiService.js';

const mockExpenseData = {
  month: 5,
  year: 2026,
  totalSpent: 15000,
  byCategory: [
    { category: 'Food', totalAmount: 5000, count: 10 },
    { category: 'Shopping', totalAmount: 10000, count: 5 }
  ],
  transactionCount: 15,
  dailyAverage: 500,
  previousMonthTotal: 12000,
  topMerchants: [{ _id: 'Amazon', totalAmount: 8000 }],
  paymentMethods: [{ _id: 'UPI', count: 15 }]
};

async function test() {
  try {
    console.log('Testing allInsights...');
    const all = await generateInsight('allInsights', mockExpenseData);
    console.log('All Insights OK:', Object.keys(all));
  } catch (err) {
    console.error('FAILED:', err);
  }
}

test();

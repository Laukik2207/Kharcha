import { GoogleGenerativeAI } from '@google/generative-ai';
import ApiError from '../utils/ApiError.js';

// Verify API key is available
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not defined in the environment variables.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export const PROMPT_TEMPLATES = {
  monthlySummary: (context) => `
You are a friendly personal finance advisor for Indian users. Analyze this spending data and provide a concise monthly financial summary.

${context}

Provide a JSON response with exactly this structure:
{
  "headline": "One punchy sentence summarizing this month (max 12 words)",
  "summary": "2-3 sentence overview of the month's spending pattern",
  "highlights": [
    "Key observation 1 (one sentence, specific with numbers)",
    "Key observation 2",
    "Key observation 3"
  ],
  "score": <financial health score 1-100 based on spending balance>,
  "scoreLabel": "Excellent|Good|Fair|Needs Attention"
}
Return ONLY the JSON object. No markdown, no explanation.`,

  savingsRecommendations: (context) => `
You are a personal finance advisor for Indian users. Based on this spending data, provide actionable savings recommendations.

${context}

Provide a JSON response with exactly this structure:
{
  "potentialMonthlySavings": <estimated rupee amount the user could save>,
  "recommendations": [
    {
      "title": "Short recommendation title",
      "description": "1-2 sentences explaining the recommendation with specific numbers",
      "estimatedSaving": <monthly rupee saving if followed>,
      "category": "<affected category>",
      "difficulty": "Easy|Medium|Hard",
      "impact": "Low|Medium|High"
    }
  ]
}
Provide 3-5 recommendations. Be specific to Indian spending context (mention UPI, Swiggy, etc where relevant).
Return ONLY the JSON object. No markdown, no explanation.`,

  unusualSpending: (context) => `
You are a financial anomaly detector for Indian users. Analyze this spending data and identify unusual patterns.

${context}

Provide a JSON response with exactly this structure:
{
  "hasAnomalies": <true|false>,
  "anomalies": [
    {
      "type": "overspend|frequency|new_category|spike",
      "title": "Short anomaly title",
      "description": "What is unusual and why it matters (1-2 sentences with numbers)",
      "category": "<affected category or 'General'>",
      "severity": "Low|Medium|High"
    }
  ],
  "overallRisk": "Low|Medium|High",
  "riskReason": "One sentence explaining the overall risk level"
}
Return ONLY the JSON object. No markdown, no explanation.`,

  weeklyPattern: (context) => `
You are a behavioral finance analyst for Indian users. Analyze spending patterns in this data.

${context}

Provide a JSON response with exactly this structure:
{
  "patterns": [
    {
      "title": "Pattern title",
      "description": "Specific pattern observed with numbers (1-2 sentences)",
      "type": "timing|category|merchant|payment",
      "actionable": true|false
    }
  ],
  "behaviorSummary": "1-2 sentences about the user's overall spending behavior",
  "topHabit": "The single most notable spending habit in one sentence"
}
Provide 3-4 patterns. Return ONLY the JSON object. No markdown, no explanation.`,

  budgetAdvice: (context, budgetGoal) => `
You are a budget planning advisor for Indian users. The user wants to spend ₹${budgetGoal} next month.

Current spending: ${context}

Provide a JSON response with exactly this structure:
{
  "feasibility": "Achievable|Challenging|Very Difficult",
  "requiredReduction": <rupee amount they need to cut>,
  "categoryBudgets": [
    {
      "category": "<category name>",
      "currentSpend": <current monthly spend>,
      "suggestedBudget": <suggested budget>,
      "reduction": <amount to cut>
    }
  ],
  "tips": [
    "Specific actionable tip 1",
    "Specific actionable tip 2",
    "Specific actionable tip 3"
  ]
}
Return ONLY the JSON object. No markdown, no explanation.`
};

export const buildFinancialContext = (expenseData) => {
  const { month, year, totalSpent, byCategory, transactionCount, dailyAverage, previousMonthTotal, topMerchants, paymentMethods } = expenseData;
  
  let context = `FINANCIAL DATA - ${month}/${year}\n`;
  context += `Total Spent: ₹${Math.round(totalSpent)} | Transactions: ${transactionCount} | Daily Avg: ₹${Math.round(dailyAverage)}\n`;
  
  if (previousMonthTotal !== undefined) {
    const diff = totalSpent - previousMonthTotal;
    const diffPct = previousMonthTotal > 0 ? (diff / previousMonthTotal) * 100 : 0;
    const sign = diff >= 0 ? '+' : '';
    context += `vs Last Month: ₹${Math.round(previousMonthTotal)} (${sign}${Math.round(diffPct)}% change)\n`;
  }

  context += `\nBY CATEGORY:\n`;
  byCategory.filter(c => c.totalAmount > 0).forEach(c => {
    const pct = totalSpent > 0 ? Math.round((c.totalAmount / totalSpent) * 100) : 0;
    context += `- ${c.category}: ₹${Math.round(c.totalAmount)} (${pct}%) - ${c.count} txns\n`;
  });

  if (topMerchants && topMerchants.length > 0) {
    context += `\nTOP MERCHANTS: `;
    const merchantsList = topMerchants.slice(0, 5).map(m => {
      const name = m._id.length > 20 ? m._id.substring(0, 20) : m._id;
      return `${name}(₹${Math.round(m.totalAmount)})`;
    }).join(', ');
    context += merchantsList + `\n`;
  }

  if (paymentMethods && paymentMethods.length > 0) {
    context += `PAYMENT METHODS: `;
    const totalPayments = paymentMethods.reduce((sum, p) => sum + p.count, 0);
    const pmList = paymentMethods.map(p => {
      const pct = totalPayments > 0 ? Math.round((p.count / totalPayments) * 100) : 0;
      return `${p._id}(${pct}%)`;
    }).join(', ');
    context += pmList + `\n`;
  }

  return context;
};

const callGemini = async (prompt, options = {}) => {
  const { maxRetries = 3, retryDelay = 1000, maxOutputTokens = 1024 } = options;
  let attempt = 0;
  let currentPrompt = prompt;

  while (attempt <= maxRetries) {
    try {
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: currentPrompt }] }],
        generationConfig: { maxOutputTokens }
      });
      return response.response.text();
    } catch (error) {
      if ((error.status === 429 || error.status >= 500) && attempt < maxRetries) {
        attempt++;
        const delay = retryDelay * Math.pow(2, attempt);
        console.warn(`Gemini API error (${error.status}). Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Gemini API unavailable after retries');
};

const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
};

export const generateInsight = async (type, expenseData, extra = {}) => {
  try {
    const context = buildFinancialContext(expenseData);
    let prompt;
    
    if (type === 'budgetAdvice') {
      prompt = PROMPT_TEMPLATES[type](context, extra.budgetGoal);
    } else {
      if (!PROMPT_TEMPLATES[type]) throw new Error(`Unknown insight type: ${type}`);
      prompt = PROMPT_TEMPLATES[type](context);
    }

    let responseText;
    try {
      responseText = await callGemini(prompt);
      return JSON.parse(cleanJsonResponse(responseText));
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.warn('Failed to parse Gemini response as JSON. Retrying once with explicit JSON instruction...');
        const retryPrompt = prompt + `\n\nCRITICAL: Return ONLY valid JSON. Do not wrap it in markdown code blocks (\`\`\`). No text before or after.`;
        responseText = await callGemini(retryPrompt, { maxRetries: 1 });
        return JSON.parse(cleanJsonResponse(responseText));
      }
      throw error;
    }
  } catch (error) {
    console.error(`Error generating insight (${type}):`, error);
    const apiError = new ApiError(503, 'AI service temporarily unavailable. Please try again later.');
    throw apiError;
  }
};

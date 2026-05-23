import CategoryRule from '../models/CategoryRule.js';

export const SYSTEM_RULES = [
  // Food
  { type: 'keyword', pattern: 'swiggy', category: 'Food' },
  { type: 'keyword', pattern: 'zomato', category: 'Food' },
  { type: 'keyword', pattern: 'blinkit', category: 'Food' },
  { type: 'keyword', pattern: 'zepto', category: 'Groceries' },
  { type: 'keyword', pattern: 'dunzo', category: 'Food' },
  { type: 'keyword', pattern: 'dominos', category: 'Food' },
  { type: 'keyword', pattern: 'pizza hut', category: 'Food' },
  { type: 'keyword', pattern: 'kfc', category: 'Food' },
  { type: 'keyword', pattern: 'mcdonalds', category: 'Food' },
  { type: 'keyword', pattern: 'burger king', category: 'Food' },
  { type: 'keyword', pattern: 'starbucks', category: 'Food' },
  { type: 'keyword', pattern: 'cafe coffee day', category: 'Food' },
  { type: 'keyword', pattern: 'haldiram', category: 'Food' },
  // Groceries
  { type: 'keyword', pattern: 'bigbasket', category: 'Groceries' },
  { type: 'keyword', pattern: 'grofers', category: 'Groceries' },
  { type: 'keyword', pattern: 'dmart', category: 'Groceries' },
  { type: 'keyword', pattern: 'reliance fresh', category: 'Groceries' },
  { type: 'keyword', pattern: 'more supermarket', category: 'Groceries' },
  { type: 'keyword', pattern: 'nature basket', category: 'Groceries' },
  // Shopping
  { type: 'keyword', pattern: 'amazon', category: 'Shopping' },
  { type: 'keyword', pattern: 'flipkart', category: 'Shopping' },
  { type: 'keyword', pattern: 'myntra', category: 'Shopping' },
  { type: 'keyword', pattern: 'ajio', category: 'Shopping' },
  { type: 'keyword', pattern: 'meesho', category: 'Shopping' },
  { type: 'keyword', pattern: 'nykaa', category: 'Shopping' },
  { type: 'keyword', pattern: 'snapdeal', category: 'Shopping' },
  { type: 'keyword', pattern: 'tatacliq', category: 'Shopping' },
  { type: 'keyword', pattern: 'croma', category: 'Shopping' },
  { type: 'keyword', pattern: 'reliance digital', category: 'Shopping' },
  // Petrol
  { type: 'keyword', pattern: 'indian oil', category: 'Petrol' },
  { type: 'keyword', pattern: 'iocl', category: 'Petrol' },
  { type: 'keyword', pattern: 'hp petrol', category: 'Petrol' },
  { type: 'keyword', pattern: 'hindustan petroleum', category: 'Petrol' },
  { type: 'keyword', pattern: 'bharat petroleum', category: 'Petrol' },
  { type: 'keyword', pattern: 'bpcl', category: 'Petrol' },
  { type: 'keyword', pattern: 'shell', category: 'Petrol' },
  { type: 'keyword', pattern: 'essar oil', category: 'Petrol' },
  // Travel
  { type: 'keyword', pattern: 'uber', category: 'Travel' },
  { type: 'keyword', pattern: 'ola', category: 'Travel' },
  { type: 'keyword', pattern: 'rapido', category: 'Travel' },
  { type: 'keyword', pattern: 'redbus', category: 'Travel' },
  { type: 'keyword', pattern: 'irctc', category: 'Travel' },
  { type: 'keyword', pattern: 'makemytrip', category: 'Travel' },
  { type: 'keyword', pattern: 'goibibo', category: 'Travel' },
  { type: 'keyword', pattern: 'indigo', category: 'Travel' },
  { type: 'keyword', pattern: 'air india', category: 'Travel' },
  { type: 'keyword', pattern: 'spicejet', category: 'Travel' },
  { type: 'keyword', pattern: 'yatra', category: 'Travel' },
  // Entertainment
  { type: 'keyword', pattern: 'netflix', category: 'Entertainment' },
  { type: 'keyword', pattern: 'spotify', category: 'Entertainment' },
  { type: 'keyword', pattern: 'amazon prime', category: 'Entertainment' },
  { type: 'keyword', pattern: 'hotstar', category: 'Entertainment' },
  { type: 'keyword', pattern: 'disney', category: 'Entertainment' },
  { type: 'keyword', pattern: 'youtube premium', category: 'Entertainment' },
  { type: 'keyword', pattern: 'zee5', category: 'Entertainment' },
  { type: 'keyword', pattern: 'sonyliv', category: 'Entertainment' },
  { type: 'keyword', pattern: 'bookmyshow', category: 'Entertainment' },
  { type: 'keyword', pattern: 'pvr', category: 'Entertainment' },
  { type: 'keyword', pattern: 'inox', category: 'Entertainment' },
  // Bills
  { type: 'keyword', pattern: 'airtel', category: 'Bills' },
  { type: 'keyword', pattern: 'jio', category: 'Bills' },
  { type: 'keyword', pattern: 'vodafone', category: 'Bills' },
  { type: 'keyword', pattern: 'bsnl', category: 'Bills' },
  { type: 'keyword', pattern: 'electricity', category: 'Bills' },
  { type: 'keyword', pattern: 'water bill', category: 'Bills' },
  { type: 'keyword', pattern: 'gas bill', category: 'Bills' },
  { type: 'keyword', pattern: 'broadband', category: 'Bills' },
  { type: 'keyword', pattern: 'recharge', category: 'Bills' },
  { type: 'keyword', pattern: 'bescom', category: 'Bills' },
  { type: 'keyword', pattern: 'msedcl', category: 'Bills' },
  // Health
  { type: 'keyword', pattern: 'apollo', category: 'Health' },
  { type: 'keyword', pattern: 'medplus', category: 'Health' },
  { type: 'keyword', pattern: 'netmeds', category: 'Health' },
  { type: 'keyword', pattern: '1mg', category: 'Health' },
  { type: 'keyword', pattern: 'pharmeasy', category: 'Health' },
  { type: 'keyword', pattern: 'practo', category: 'Health' },
  { type: 'keyword', pattern: 'cult.fit', category: 'Health' },
  { type: 'keyword', pattern: 'gym', category: 'Health' },
  { type: 'keyword', pattern: 'hospital', category: 'Health' },
  { type: 'keyword', pattern: 'clinic', category: 'Health' },
  { type: 'keyword', pattern: 'pharmacy', category: 'Health' },
  // Regex examples
  { type: 'regex', pattern: '^(swiggy|zomato|food)', category: 'Food' },
  { type: 'regex', pattern: 'petrol|diesel|fuel', category: 'Petrol' },
  { type: 'regex', pattern: 'emi|loan|insurance', category: 'Bills' },
  { type: 'regex', pattern: 'salary|credited by', category: 'Others' },
].map(r => ({ ...r, priority: 0 }));

export const applyRule = (rule, merchantLower) => {
  if (!merchantLower) return false;

  switch (rule.type) {
    case 'exact':
      return merchantLower === rule.pattern.toLowerCase();
    case 'keyword':
      return merchantLower.includes(rule.pattern.toLowerCase());
    case 'regex':
      try {
        const regex = new RegExp(rule.pattern, 'i');
        return regex.test(merchantLower);
      } catch (err) {
        return false;
      }
    default:
      return false;
  }
};

export const categorize = (merchant, userRules = []) => {
  const defaultResult = { category: 'Others', matched: false, matchedRule: null };
  if (!merchant) return defaultResult;
  
  const merchantLower = merchant.toLowerCase().trim();
  const combinedRules = [...userRules, ...SYSTEM_RULES].sort((a, b) => b.priority - a.priority);

  for (const rule of combinedRules) {
    if (applyRule(rule, merchantLower)) {
      return {
        category: rule.category,
        matched: true,
        matchedRule: rule
      };
    }
  }

  return defaultResult;
};

export const categorizeAll = (normalizedRows, userRules = []) => {
  return normalizedRows.map(row => {
    const result = categorize(row.merchant, userRules);
    return {
      ...row,
      category: result.category,
      isUncategorized: !result.matched
    };
  });
};

export const loadUserRules = async (userId) => {
  try {
    const rules = await CategoryRule.find({
      $or: [{ userId }, { userId: null }],
      isActive: true
    }).sort({ priority: -1 });
    return rules;
  } catch (error) {
    console.error("Error loading user rules:", error);
    return [];
  }
};

export const testRule = (pattern, type, merchantList) => {
  const mockRule = { pattern, type };
  return merchantList.map(merchant => ({
    merchant,
    matches: applyRule(mockRule, merchant.toLowerCase().trim())
  }));
};

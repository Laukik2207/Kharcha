import CategoryRule from '../models/CategoryRule.js';

/**
 * Pre-defined system rules for categorizing common Indian merchants.
 * These rules act as a baseline fallback when the user has no custom rules.
 * Order of execution is controlled by the 'priority' property.
 */
export const SYSTEM_RULES = [
  // Food
  { type: 'keyword', pattern: 'swiggy', category: 'Food' },
  { type: 'keyword', pattern: 'zomato', category: 'Food' },
  { type: 'keyword', pattern: 'blinkit', category: 'Food' },
  { type: 'keyword', pattern: 'nk food', category: 'Food' },
  { type: 'keyword', pattern: 'kitchene', category: 'Food' },
  { type: 'keyword', pattern: 'le broc', category: 'Food' },
  { type: 'keyword', pattern: 'kkc food', category: 'Food' },
  { type: 'keyword', pattern: 'hangouts', category: 'Food' },
  { type: 'keyword', pattern: 'f b vent', category: 'Food' },
  { type: 'keyword', pattern: 'makers s', category: 'Food' },
  { type: 'keyword', pattern: 'nand jui', category: 'Food' },
  { type: 'keyword', pattern: 'ratika d', category: 'Food' },
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
  { type: 'keyword', pattern: 'money en', category: 'Entertainment' },
  { type: 'keyword', pattern: 's d ente', category: 'Entertainment' },
  { type: 'keyword', pattern: 'aurigans', category: 'Entertainment' },
  // Bills
  { type: 'keyword', pattern: 'airtel', category: 'Bills' },
  { type: 'keyword', pattern: 'jio', category: 'Bills' },
  { type: 'keyword', pattern: 'vodafone', category: 'Bills' },
  { type: 'keyword', pattern: 'bsnl', category: 'Bills' },
  { type: 'keyword', pattern: 'policyba', category: 'Bills' },
  { type: 'keyword', pattern: 'aws india', category: 'Bills' },
  { type: 'keyword', pattern: 'apple me', category: 'Bills' },
  { type: 'keyword', pattern: 'airtel p', category: 'Bills' },
  { type: 'keyword', pattern: 'bank charge', category: 'Bills' },
  { type: 'keyword', pattern: 'cdm charge', category: 'Bills' },
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
  { type: 'regex', pattern: '^(swiggy|zomato)', category: 'Food' },
  { type: 'regex', pattern: 'food|kitchen|cafe|dhaba|hotel|restaurant|bhojan', category: 'Food' },
  { type: 'regex', pattern: 'petrol|diesel|fuel|pump|iocl|bpcl|hpcl', category: 'Petrol' },
  { type: 'regex', pattern: 'emi|loan', category: 'Bills' },
  { type: 'regex', pattern: 'airtel|jio|bsnl|vi |vodafone|prepai|recharge', category: 'Bills' },
  { type: 'regex', pattern: 'insurance|policy|premium', category: 'Bills' },
  { type: 'regex', pattern: 'amazon|flipkart|myntra|shop|store|market', category: 'Shopping' },
  { type: 'regex', pattern: 'uber|ola|rapido|cab|auto|taxi|travel|bus|train|irctc', category: 'Travel' },
  { type: 'regex', pattern: 'hospital|doctor|clinic|pharma|medical|health|apollo|medplus', category: 'Health' },
  { type: 'regex', pattern: 'netflix|spotify|prime|hotstar|bookmyshow|pvr|cinema|inox|entertainment|ente', category: 'Entertainment' },
  { type: 'regex', pattern: 'salary|credited by', category: 'Others' },
  { type: 'regex', pattern: 'neft transfer|paypal|wire transfer', category: 'Others' },
  { type: 'keyword', pattern: 'rohit bh', category: 'Others' },
].map(r => ({ ...r, priority: 0 }));

/**
 * Evaluates a single rule against a merchant name.
 * 
 * @param {Object} rule - The rule object containing type and pattern
 * @param {string} merchantLower - The lowercased merchant name
 * @returns {boolean} True if the rule matches, false otherwise
 */
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

/**
 * Determines the category for a specific merchant by testing against both
 * user-defined rules and system fallback rules. User rules take precedence
 * based on their priority score.
 * 
 * @param {string} merchant - The raw merchant string from the transaction
 * @param {Array} userRules - List of custom rules defined by the user
 * @returns {Object} An object containing the resolved category and match status
 */
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

/**
 * Bulk categorizes an array of normalized transaction rows.
 * 
 * @param {Array} normalizedRows - The parsed transactions ready for categorization
 * @param {Array} userRules - The user's active categorization rules
 * @returns {Array} The rows updated with their determined category and flag
 */
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

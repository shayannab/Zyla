// FREE AI Service - No external APIs needed!
// Smart rule-based transaction categorization and insights

interface TransactionData {
  description: string;
  merchantName?: string;
  amount: number;
  category?: string[];
}

interface CategoryResult {
  category: string;
  confidence: number;
  reasoning: string;
}

interface SpendingInsight {
  type: 'overspending' | 'trend' | 'recommendation' | 'alert';
  title: string;
  message: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
}

export class AIService {
  
  // Comprehensive category mapping
  private static categoryMap = {
    'Food & Dining': [
      'starbucks', 'mcdonalds', 'restaurant', 'cafe', 'pizza', 'burger', 'taco',
      'subway', 'kfc', 'dominos', 'chipotle', 'panera', 'dunkin', 'food',
      'dining', 'kitchen', 'bistro', 'deli', 'bakery', 'doordash', 'ubereats',
      'grubhub', 'seamless', 'postmates'
    ],
    'Transportation': [
      'uber', 'lyft', 'taxi', 'gas', 'shell', 'exxon', 'chevron', 'bp',
      'mobil', 'metro', 'bus', 'train', 'parking', 'toll', 'car wash',
      'auto', 'vehicle', 'mechanic', 'repair', 'oil change'
    ],
    'Shopping': [
      'amazon', 'target', 'walmart', 'ebay', 'costco', 'best buy',
      'macys', 'nordstrom', 'home depot', 'lowes', 'cvs', 'walgreens',
      'grocery', 'store', 'retail', 'mall', 'shop'
    ],
    'Bills & Utilities': [
      'electric', 'electricity', 'water', 'gas bill', 'internet', 'phone',
      'verizon', 'att', 'tmobile', 'comcast', 'xfinity', 'spectrum',
      'rent', 'mortgage', 'insurance', 'utility', 'cable'
    ],
    'Entertainment': [
      'netflix', 'spotify', 'hulu', 'disney', 'amazon prime', 'youtube',
      'movie', 'theater', 'cinema', 'concert', 'game', 'xbox', 'playstation',
      'entertainment', 'streaming', 'music', 'gym', 'fitness'
    ],
    'Healthcare': [
      'doctor', 'hospital', 'pharmacy', 'medical', 'dentist', 'clinic',
      'health', 'prescription', 'cvs pharmacy', 'walgreens pharmacy'
    ],
    'Travel': [
      'hotel', 'motel', 'airbnb', 'airline', 'flight', 'airport',
      'travel', 'vacation', 'booking', 'expedia', 'kayak'
    ],
    'Banking & Finance': [
      'bank', 'atm', 'fee', 'transfer', 'interest', 'credit card',
      'loan', 'mortgage payment', 'investment'
    ]
  };

  /**
   * FREE AI Transaction Categorization
   * Uses smart keyword matching and amount analysis
   */
  static categorizeTransaction(transaction: TransactionData): CategoryResult {
    const { description, merchantName, amount } = transaction;
    const text = `${description} ${merchantName || ''}`.toLowerCase();
    
    // Check each category for keyword matches
    for (const [category, keywords] of Object.entries(this.categoryMap)) {
      const matches = keywords.filter(keyword => text.includes(keyword));
      
      if (matches.length > 0) {
        // Calculate confidence based on matches and amount patterns
        let confidence = Math.min(0.9, 0.6 + (matches.length * 0.1));
        
        // Boost confidence for exact merchant matches
        if (merchantName && keywords.includes(merchantName.toLowerCase())) {
          confidence = Math.min(0.95, confidence + 0.2);
        }
        
        // Amount-based confidence adjustments
        if (category === 'Bills & Utilities' && amount > 50) confidence += 0.1;
        if (category === 'Food & Dining' && amount < 50) confidence += 0.1;
        if (category === 'Shopping' && amount > 20) confidence += 0.1;
        
        return {
          category,
          confidence: Math.min(0.95, confidence),
          reasoning: `Matched keywords: ${matches.slice(0, 2).join(', ')}`
        };
      }
    }
    
    // Default categorization based on amount patterns
    if (amount > 500) {
      return {
        category: 'Large Purchase',
        confidence: 0.6,
        reasoning: 'High amount transaction'
      };
    }
    
    return {
      category: 'Other',
      confidence: 0.4,
      reasoning: 'No clear category match found'
    };
  }

  /**
   * Generate spending insights from transaction data
   */
  static generateSpendingInsights(
    transactions: any[],
    previousMonthTransactions: any[] = []
  ): SpendingInsight[] {
    const insights: SpendingInsight[] = [];
    
    // Group transactions by category
    const currentSpending = this.groupTransactionsByCategory(transactions);
    const previousSpending = this.groupTransactionsByCategory(previousMonthTransactions);
    
    // 1. Overspending Detection
    for (const [category, amount] of Object.entries(currentSpending)) {
      const previousAmount = previousSpending[category] || 0;
      const increase = amount - previousAmount;
      const percentIncrease = previousAmount > 0 ? (increase / previousAmount) * 100 : 0;
      
      if (percentIncrease > 30 && increase > 50) {
        insights.push({
          type: 'overspending',
          title: `${category} Overspend Alert`,
          message: `You've spent ${percentIncrease.toFixed(0)}% more on ${category} this month ($${increase.toFixed(2)} increase)`,
          confidence: 0.85,
          priority: percentIncrease > 50 ? 'high' : 'medium'
        });
      }
    }
    
    // 2. Spending Trends
    const totalCurrent = Object.values(currentSpending).reduce((sum, amount) => sum + amount, 0);
    const totalPrevious = Object.values(previousSpending).reduce((sum, amount) => sum + amount, 0);
    
    if (totalCurrent > totalPrevious + 100) {
      insights.push({
        type: 'trend',
        title: 'Increased Spending Trend',
        message: `Your overall spending increased by $${(totalCurrent - totalPrevious).toFixed(2)} this month`,
        confidence: 0.9,
        priority: 'medium'
      });
    }
    
    // 3. Smart Recommendations
    const foodSpending = currentSpending['Food & Dining'] || 0;
    if (foodSpending > 400) {
      insights.push({
        type: 'recommendation',
        title: 'Dining Savings Opportunity',
        message: `Consider meal prepping to reduce your $${foodSpending.toFixed(2)} monthly dining spend by 30%`,
        confidence: 0.8,
        priority: 'low'
      });
    }
    
    // 4. Unusual Transaction Alerts
    const largeTransactions = transactions.filter(t => t.amount > 200);
    if (largeTransactions.length > 0) {
      insights.push({
        type: 'alert',
        title: 'Large Transactions Detected',
        message: `${largeTransactions.length} transactions over $200 this month`,
        confidence: 0.95,
        priority: 'medium'
      });
    }
    
    return insights.slice(0, 5); // Return top 5 insights
  }

  /**
   * Helper: Group transactions by category
   */
  private static groupTransactionsByCategory(transactions: any[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      const category = transaction.aiCategory || 'Other';
      grouped[category] = (grouped[category] || 0) + Math.abs(transaction.amount);
    });
    
    return grouped;
  }

  /**
   * Detect subscription services
   */
  static detectSubscriptions(transactions: any[]): any[] {
    const subscriptionKeywords = [
      'netflix', 'spotify', 'hulu', 'disney', 'amazon prime', 'youtube premium',
      'apple music', 'gym', 'fitness', 'subscription', 'monthly', 'recurring'
    ];
    
    return transactions.filter(transaction => {
      const desc = transaction.description.toLowerCase();
      return subscriptionKeywords.some(keyword => desc.includes(keyword)) &&
             Math.abs(transaction.amount) < 50; // Typical subscription range
    });
  }

  /**
   * Budget analysis
   */
  static analyzeBudget(spent: number, budget: number): {
    status: 'under' | 'approaching' | 'over';
    percentage: number;
    message: string;
  } {
    const percentage = (spent / budget) * 100;
    
    if (percentage < 80) {
      return {
        status: 'under',
        percentage,
        message: `You're doing great! ${(100 - percentage).toFixed(0)}% of budget remaining`
      };
    } else if (percentage < 100) {
      return {
        status: 'approaching',
        percentage,
        message: `Approaching budget limit. ${(100 - percentage).toFixed(0)}% remaining`
      };
    } else {
      return {
        status: 'over',
        percentage,
        message: `Budget exceeded by ${(percentage - 100).toFixed(0)}%`
      };
    }
  }
}

export default AIService;
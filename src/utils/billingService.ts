import { Subscription, PaymentMethod, BillingHistory, User } from '../types';

// Pricing configuration
export const PRICING_CONFIG = {
  starter: {
    basePrice: 49,
    userMultiplier: 5, // Additional cost per 10 users
    yearlyDiscount: 0.5, // 50% off for yearly
  },
  premium: {
    basePrice: 99,
    userMultiplier: 5,
    yearlyDiscount: 0.5,
  },
  free: {
    basePrice: 0,
    userMultiplier: 0,
    yearlyDiscount: 0,
  }
};

export interface PricingCalculation {
  monthlyPrice: number;
  yearlyPrice: number;
  yearlySavings: number;
  displayPrice: string;
  actualPrice: number;
}

/**
 * Calculate pricing based on plan, user count, and billing cycle
 */
export const calculatePricing = (
  plan: 'starter' | 'premium',
  userCount: number,
  billingCycle: 'monthly' | 'yearly'
): PricingCalculation => {
  const config = PRICING_CONFIG[plan];
  const userMultiplier = Math.ceil(userCount / 10);
  const basePrice = config.basePrice + (userMultiplier * config.userMultiplier);
  
  const monthlyPrice = basePrice;
  const yearlyPrice = basePrice * 12 * (1 - config.yearlyDiscount);
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice;
  
  const actualPrice = billingCycle === 'yearly' ? yearlyPrice : monthlyPrice;
  const displayPrice = billingCycle === 'yearly' 
    ? `$${Math.round(yearlyPrice)}` 
    : `$${monthlyPrice}`;
  
  return {
    monthlyPrice,
    yearlyPrice,
    yearlySavings,
    displayPrice,
    actualPrice
  };
};

/**
 * Create a new subscription
 */
export const createSubscription = (
  plan: 'starter' | 'premium',
  billingCycle: 'monthly' | 'yearly',
  userCount: number,
  paymentMethod: PaymentMethod,
  userId: string
): Subscription => {
  const pricing = calculatePricing(plan, userCount, billingCycle);
  const now = new Date();
  const startDate = now.toISOString();
  
  // Calculate end date based on billing cycle
  const endDate = new Date(now);
  if (billingCycle === 'yearly') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }
  
  // Calculate next billing date
  const nextBillingDate = new Date(endDate);
  
  return {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    plan,
    billingCycle,
    status: 'active',
    startDate,
    endDate: endDate.toISOString(),
    nextBillingDate: nextBillingDate.toISOString(),
    amount: pricing.actualPrice,
    userCount,
    paymentMethod,
    autoRenew: true,
    trialEndDate: undefined
  };
};

/**
 * Process payment for subscription
 */
export const processPayment = async (
  subscription: Subscription,
  paymentMethod: PaymentMethod
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate payment success (in real app, integrate with payment gateway)
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate 5% failure rate for testing
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: 'Payment failed. Please try again or use a different payment method.'
      };
    }
    
    return {
      success: true,
      transactionId
    };
  } catch (error) {
    return {
      success: false,
      error: 'Payment processing failed. Please try again.'
    };
  }
};

/**
 * Create billing history entry
 */
export const createBillingHistory = (
  subscription: Subscription,
  transactionId: string,
  status: 'paid' | 'failed' | 'pending' | 'refunded'
): BillingHistory => {
  return {
    id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    subscriptionId: subscription.id,
    amount: subscription.amount,
    currency: 'USD',
    status,
    paymentMethod: subscription.paymentMethod?.type || 'unknown',
    billingDate: new Date().toISOString(),
    description: `${subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan - ${subscription.billingCycle} billing`,
    invoiceUrl: status === 'paid' ? `https://invoice.example.com/${transactionId}` : undefined
  };
};

/**
 * Check if subscription is active and not expired
 */
export const isSubscriptionActive = (subscription?: Subscription): boolean => {
  if (!subscription) return false;
  
  const now = new Date();
  const endDate = new Date(subscription.endDate);
  
  return subscription.status === 'active' && endDate > now;
};

/**
 * Check if subscription is in trial period
 */
export const isInTrial = (subscription?: Subscription): boolean => {
  if (!subscription || !subscription.trialEndDate) return false;
  
  const now = new Date();
  const trialEndDate = new Date(subscription.trialEndDate);
  
  return subscription.status === 'trial' && trialEndDate > now;
};

/**
 * Get days until next billing
 */
export const getDaysUntilNextBilling = (subscription?: Subscription): number => {
  if (!subscription) return 0;
  
  const now = new Date();
  const nextBillingDate = new Date(subscription.nextBillingDate);
  const diffTime = nextBillingDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get subscription status display text
 */
export const getSubscriptionStatusText = (subscription?: Subscription): string => {
  if (!subscription) return 'No subscription';
  
  if (isInTrial(subscription)) {
    return 'Trial';
  }
  
  if (isSubscriptionActive(subscription)) {
    return 'Active';
  }
  
  switch (subscription.status) {
    case 'cancelled':
      return 'Cancelled';
    case 'expired':
      return 'Expired';
    default:
      return 'Inactive';
  }
};

/**
 * Get plan display name
 */
export const getPlanDisplayName = (plan: string): string => {
  switch (plan) {
    case 'free':
      return 'Free Plan';
    case 'starter':
      return 'Starter Plan';
    case 'premium':
      return 'Premium Plan';
    default:
      return 'Unknown Plan';
  }
};

/**
 * Update user subscription
 */
export const updateUserSubscription = (user: User, subscription: Subscription): User => {
  return {
    ...user,
    subscription
  };
};

/**
 * Cancel subscription
 */
export const cancelSubscription = (subscription: Subscription): Subscription => {
  return {
    ...subscription,
    status: 'cancelled',
    autoRenew: false
  };
};

/**
 * Start trial subscription
 */
export const startTrialSubscription = (
  plan: 'starter' | 'premium',
  userCount: number,
  userId: string
): Subscription => {
  const now = new Date();
  const trialEndDate = new Date(now);
  trialEndDate.setDate(trialEndDate.getDate() + 30); // 30-day trial
  
  return {
    id: `trial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    plan,
    billingCycle: 'monthly', // Default to monthly for trial
    status: 'trial',
    startDate: now.toISOString(),
    endDate: trialEndDate.toISOString(),
    nextBillingDate: trialEndDate.toISOString(),
    amount: 0, // Free trial
    userCount,
    autoRenew: false,
    trialEndDate: trialEndDate.toISOString()
  };
};

// ============================================
// GymFoodie — All TypeScript Types & Interfaces
// ============================================

export type UserRole = 'user' | 'gym_admin' | 'restaurant_admin' | 'super_admin';

export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'clean_eating';
export type DietType = 'non_veg' | 'veg' | 'eggetarian';
export type MealStatus = 'scheduled' | 'delivered' | 'swapped' | 'locked';
export type PlanType = 'fitness' | 'transformation' | 'premium';
export type PlanBilling = 'monthly' | 'quarterly';
export type MacroType = 'protein' | 'carbs' | 'fats';

// ─── User ────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  fitnessGoal: FitnessGoal;
  dietType: DietType;
  partnerGymId: string;
  deliveryAddresses: DeliveryAddress[];
  joinedAt: string;
}

export interface DeliveryAddress {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

// ─── Subscription ─────────────────────────────
export interface Subscription {
  plan: PlanType;
  billing: PlanBilling;
  totalCredits: number;
  remainingCredits: number;
  renewalDate: string;
  partnerGym: PartnerGym;
  isActive: boolean;
  deliveriesRemaining: number;
}

export interface PartnerGym {
  id: string;
  name: string;
  location: string;
  city: string;
  distance: string;
  openHours: string;
  currentOccupancy: number; // percentage
  peakHours: string;
  assignedCoach: Coach;
}

export interface Coach {
  id: string;
  name: string;
  specialization: string;
  macrosSynced: boolean;
}

// ─── Macros ──────────────────────────────────
export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MacroConsumed {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyMacros {
  targets: MacroTargets;
  consumed: MacroConsumed;
  date: string;
}

// ─── Meals ──────────────────────────────────
export interface Meal {
  id: string;
  name: string;
  description: string;
  emoji: string;
  kitchen: string;
  kitchenRating: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  tags: string[];
  allergens: string[];
  creditCost: number;
  isGlutenFree: boolean;
  isHighProtein: boolean;
}

export interface DailyMeal {
  date: string; // YYYY-MM-DD
  meal: Meal;
  status: MealStatus;
  deliveryTime: string;
  deliveryType: 'home' | 'pickup';
  courierName?: string;
  distanceKm?: number;
}

// ─── Gym Check-ins & Visitors ─────────────────
export interface CheckIn {
  id: string;
  date: string;
  gymId: string;
  gymName: string;
  timeIn: string;
  timeOut?: string;
}

export interface GymVisitor {
  id: string;
  memberName: string;
  passId: string;
  planName: string;
  timeIn: string;
  status: 'admitted' | 'flagged';
  avatarLetter: string;
}

// ─── Kitchen / Restaurant Orders ──────────────
export type KitchenOrderStatus = 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';

export interface KitchenOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  mealName: string;
  mealEmoji: string;
  calories: number;
  protein: number;
  status: KitchenOrderStatus;
  deliveryAddress: string;
  deliverySlot: string;
  courierName: string;
  specialNotes?: string;
}

// ─── Partner Payouts & Finance ────────────────
export interface PayoutTransaction {
  id: string;
  date: string;
  amount: number;
  status: 'settled' | 'processing' | 'pending';
  destinationAccount: string;
  description: string;
  unitsCount: number;
  ratePerUnit: number;
}

export interface PartnerEarnings {
  totalEarnedThisMonth: number;
  pendingSettlement: number;
  settledThisMonth: number;
  lifetimeEarnings: number;
  bankAccount: {
    bankName: string;
    accountMasked: string;
    ifsc: string;
  };
  transactions: PayoutTransaction[];
}

// ─── Super Admin Support & Privacy Audit ──────
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'investigating' | 'resolved';

export interface SupportTicket {
  id: string;
  memberCode: string; // Anonymized (e.g. #GF-8921)
  category: 'delivery' | 'turnstile' | 'dietary' | 'billing';
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  resolutionNote?: string;
}

export interface SubscriberAudit {
  id: string;
  memberCode: string; // #SUB-8921
  planTier: string; // Transformation
  billingCycle: 'Monthly' | 'Quarterly';
  grossPaid: number; // ₹8,999
  paymentGateway: 'Razorpay UPI' | 'GPay' | 'Card';
  creditsTotal: number;
  creditsUsed: number;
  registeredGym: string;
  renewalDate: string;
  status: 'active' | 'expiring_soon' | 'paused';
}

export interface PlatformTreasury {
  grossPlatformRevenue: number;
  totalSettledToGyms: number;
  pendingGymLiability: number;
  totalSettledToKitchens: number;
  pendingKitchenLiability: number;
  logisticsCost: number;
  netPlatformProfit: number;
}

export interface FinancialMetrics {
  periodLabel: string;
  grossRevenue: number;
  cogsFood: number;
  cogsGym: number;
  totalCogs: number;
  grossProfit: number;
  grossMarginPercent: number;
  logisticsCost: number;
  marketingSpend: number;
  paymentGatewayFees: number;
  cloudInfraCost: number;
  packagingCost: number;
  totalOpex: number;
  lossLeakageRefunds: number;
  netProfit: number;
  netMarginPercent: number;
  // Unit Economics & Marketing
  adSpend: number;
  attributedRevenue: number;
  roas: number;
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  arpu: number;
  churnRate: number;
  activeSubscribers: number;
}

// ─── Plans ──────────────────────────────────
export interface Plan {
  id: PlanType;
  tierLabel: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  credits: number;
  deliveries: number | 'unlimited';
  features: string[];
  isPopular: boolean;
  accentColor: string;
}

// ─── Add-On Credits ─────────────────────────
export interface CreditPack {
  id: string;
  credits: number;
  price: number;
  label: string;
}

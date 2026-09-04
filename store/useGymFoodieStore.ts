import { create } from 'zustand';
import type {
  User, Subscription, DailyMacros, DailyMeal,
  CheckIn, MacroTargets, PlanType, PlanBilling,
  UserRole, GymVisitor, KitchenOrder, KitchenOrderStatus,
  SupportTicket, SubscriberAudit, PlatformTreasury,
} from '@/types';
import {
  MOCK_USER, MOCK_SUBSCRIPTION, MOCK_DAILY_MACROS,
  MOCK_MEAL_SCHEDULE, MOCK_CHECK_INS,
} from '@/constants/mockData';

// Initial Gym Visitors (Today's check-in log)
const INITIAL_VISITORS: GymVisitor[] = [
  {
    id: 'vis_1',
    memberName: 'Abhishek TK',
    passId: '#GF-8921',
    planName: 'Transformation VIP',
    timeIn: '07:15 AM',
    status: 'admitted',
    avatarLetter: 'A',
  },
  {
    id: 'vis_2',
    memberName: 'Vikram Hegde',
    passId: '#GF-4102',
    planName: 'Premium Concierge',
    timeIn: '06:45 AM',
    status: 'admitted',
    avatarLetter: 'V',
  },
  {
    id: 'vis_3',
    memberName: 'Rohan Shetty',
    passId: '#GF-9932',
    planName: 'Starter Fitness',
    timeIn: '06:20 AM',
    status: 'admitted',
    avatarLetter: 'R',
  },
  {
    id: 'vis_4',
    memberName: 'Ananya Rao',
    passId: '#GF-1123',
    planName: 'Transformation VIP',
    timeIn: '06:05 AM',
    status: 'admitted',
    avatarLetter: 'A',
  },
];

// Initial Kitchen Dispatch Orders
const INITIAL_KITCHEN_ORDERS: KitchenOrder[] = [
  {
    id: 'GF-ORD-101',
    customerName: 'Abhishek TK',
    customerPhone: '+91 98765 43210',
    mealName: 'Grilled Herb Chicken & Quinoa',
    mealEmoji: '🍗',
    calories: 620,
    protein: 48,
    status: 'out_for_delivery',
    deliveryAddress: 'Flat 4B, Green Valley Apts, Pumpwell',
    deliverySlot: '1:00 PM Slot',
    courierName: 'Courier Karan (Bike)',
    specialNotes: 'No dairy, extra citrus kale',
  },
  {
    id: 'GF-ORD-102',
    customerName: 'Divya Naik',
    customerPhone: '+91 98450 11223',
    mealName: 'Teriyaki Paneer & Brown Rice Bowl',
    mealEmoji: '🧆',
    calories: 580,
    protein: 38,
    status: 'ready',
    deliveryAddress: 'Prestige Valley, Kadri, Mangaluru',
    deliverySlot: '1:15 PM Slot',
    courierName: 'Courier Sachin (EV Scooter)',
    specialNotes: 'Gluten-Free certified',
  },
  {
    id: 'GF-ORD-103',
    customerName: 'Karthik Shenoy',
    customerPhone: '+91 98110 33445',
    mealName: 'Egg White Burrito Bowl',
    mealEmoji: '🌯',
    calories: 540,
    protein: 42,
    status: 'preparing',
    deliveryAddress: 'Infosys Campus, Kottara',
    deliverySlot: '1:30 PM Slot',
    courierName: 'Courier Karan (Bike)',
    specialNotes: 'Extra roasted corn',
  },
  {
    id: 'GF-ORD-104',
    customerName: 'Sneha Alva',
    customerPhone: '+91 97400 55667',
    mealName: 'Salmon Avocado Power Bowl',
    mealEmoji: '🐟',
    calories: 650,
    protein: 45,
    status: 'preparing',
    deliveryAddress: 'Bunder Port Road, Mangaluru',
    deliverySlot: '1:45 PM Slot',
    courierName: 'Courier Sachin (EV Scooter)',
    specialNotes: 'Keep dressing on the side',
  },
  {
    id: 'GF-ORD-105',
    customerName: 'Manoj Prabhu',
    customerPhone: '+91 94480 77889',
    mealName: 'Soya Tikka & Cauliflower Mash',
    mealEmoji: '🥣',
    calories: 560,
    protein: 40,
    status: 'delivered',
    deliveryAddress: 'Bejai New Road, Mangaluru',
    deliverySlot: '12:30 PM Slot',
    courierName: 'Courier Karan (Bike)',
    specialNotes: 'Delivered to security desk',
  },
];

// Initial Support & Member Escalation Tickets (Anonymized privacy mode)
const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-401',
    memberCode: '#GF-8921',
    category: 'delivery',
    subject: 'Courier Karan delayed by 15 mins at Kadri',
    description: 'Meal arrived at 1:15 PM instead of 1:00 PM due to Pumpwell road works.',
    priority: 'high',
    status: 'open',
    createdAt: '1:20 PM Today',
  },
  {
    id: 'TCK-398',
    memberCode: '#GF-4102',
    category: 'turnstile',
    subject: 'RFID NFC tag needed second wave at Gate 1',
    description: 'Turnstile gate sensor had 2 second latency. Scanner reboot recommended.',
    priority: 'medium',
    status: 'investigating',
    createdAt: '07:10 AM Today',
  },
  {
    id: 'TCK-395',
    memberCode: '#GF-1123',
    category: 'dietary',
    subject: 'Ensure complete peanut exclusion in evening snack',
    description: 'Severe allergy warning logged in profile. Kitchen partner flagged.',
    priority: 'urgent',
    status: 'resolved',
    createdAt: 'Yesterday',
    resolutionNote: 'Kitchen master allergy sheet updated. Chef briefed.',
  },
  {
    id: 'TCK-390',
    memberCode: '#GF-9932',
    category: 'billing',
    subject: 'Invoice GST credit note query for Corporate Plan',
    description: 'Requested input tax credit breakdown for company fitness allowance.',
    priority: 'low',
    status: 'resolved',
    createdAt: '01 Sep 2024',
    resolutionNote: 'GST B2B Tax invoice dispatched via email.',
  },
];

// Privacy-compliant Anonymized Subscribers Audit
const INITIAL_SUBSCRIBERS_AUDIT: SubscriberAudit[] = [
  {
    id: 'SUB-01',
    memberCode: '#GF-8921',
    planTier: 'Transformation VIP',
    billingCycle: 'Monthly',
    grossPaid: 8999,
    paymentGateway: 'Razorpay UPI',
    creditsTotal: 40,
    creditsUsed: 28,
    registeredGym: 'Iron House Gym (Kankanady)',
    renewalDate: '31 Oct 2024',
    status: 'active',
  },
  {
    id: 'SUB-02',
    memberCode: '#GF-4102',
    planTier: 'Premium Concierge',
    billingCycle: 'Quarterly',
    grossPaid: 30597,
    paymentGateway: 'Card',
    creditsTotal: 180,
    creditsUsed: 52,
    registeredGym: 'Iron House Gym (Kankanady)',
    renewalDate: '15 Dec 2024',
    status: 'active',
  },
  {
    id: 'SUB-03',
    memberCode: '#GF-9932',
    planTier: 'Starter Fitness',
    billingCycle: 'Monthly',
    grossPaid: 5999,
    paymentGateway: 'GPay',
    creditsTotal: 20,
    creditsUsed: 18,
    registeredGym: "Gold's Gym (Falnir)",
    renewalDate: '10 Sep 2024',
    status: 'expiring_soon',
  },
  {
    id: 'SUB-04',
    memberCode: '#GF-1123',
    planTier: 'Transformation VIP',
    billingCycle: 'Monthly',
    grossPaid: 8999,
    paymentGateway: 'Razorpay UPI',
    creditsTotal: 40,
    creditsUsed: 14,
    registeredGym: 'PowerZone (Attavar)',
    renewalDate: '28 Oct 2024',
    status: 'active',
  },
  {
    id: 'SUB-05',
    memberCode: '#GF-7741',
    planTier: 'Transformation VIP',
    billingCycle: 'Quarterly',
    grossPaid: 22947,
    paymentGateway: 'Razorpay UPI',
    creditsTotal: 120,
    creditsUsed: 36,
    registeredGym: 'Iron House Gym (Kankanady)',
    renewalDate: '01 Nov 2024',
    status: 'active',
  },
];

// ─── Store Interface ───────────────────────────
interface GymFoodieStore {
  // ─ Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;

  // ─ Role Management
  currentRole: UserRole;
  setRole: (role: UserRole) => void;

  // ─ Auth
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: () => void;
  logout: () => void;
  completeOnboarding: () => void;

  // ─ User
  user: User;
  updateUser: (updates: Partial<User>) => void;

  // ─ Subscription
  subscription: Subscription;
  useCredit: () => void;
  upgradePlan: (plan: PlanType, billing: PlanBilling) => void;
  addCredits: (count: number) => void;

  // ─ Daily Macros
  dailyMacros: DailyMacros;
  logFood: (calories: number, protein: number, carbs: number, fats: number) => void;
  updateTargets: (targets: Partial<MacroTargets>) => void;
  resetDailyMacros: () => void;

  // ─ Meal Schedule
  mealSchedule: DailyMeal[];
  swapDailyMeal: (date: string, newMealId: string) => void;
  getMealByDate: (date: string) => DailyMeal | undefined;
  confirmMeal: (date: string) => void;

  // ─ Gym Check-ins (User side)
  gymCheckIns: CheckIn[];
  checkInGym: () => void;
  hasCheckedInToday: () => boolean;

  // ─ Gym Partner State & Financials
  gymVisitors: GymVisitor[];
  gymOccupancy: number;
  adjustOccupancy: (delta: number) => void;
  admitMember: (passId: string, memberName: string) => boolean;
  gymPendingPayout: number; // e.g. ₹28,400
  gymSettledPayout: number; // e.g. ₹1,17,000

  // ─ Restaurant Partner State & Financials
  kitchenOrders: KitchenOrder[];
  advanceOrderStatus: (orderId: string) => void;
  kitchenPendingPayout: number; // e.g. ₹34,200
  kitchenSettledPayout: number; // e.g. ₹1,47,400

  // ─ Super Admin (GymFoodie HQ Central Treasury & Operations)
  supportTickets: SupportTicket[];
  subscribersAudit: SubscriberAudit[];
  platformTreasury: PlatformTreasury;
  releaseGymWeeklyPayout: () => void;
  releaseKitchenWeeklyPayout: () => void;
  resolveTicket: (ticketId: string, resolutionNote?: string) => void;
  compensateMemberCredit: (memberCode: string) => void;

  // ─ UI State
  activeSwapDate: string | null;
  setActiveSwapDate: (date: string | null) => void;
  selectedPlan: PlanType;
  setSelectedPlan: (plan: PlanType) => void;
}

// ─── Store Implementation ──────────────────────
export const useGymFoodieStore = create<GymFoodieStore>((set, get) => ({
  // ─ Theme
  isDarkMode: true,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setTheme: (dark) => set({ isDarkMode: dark }),

  // ─ Role Management (Defaults to 'user')
  currentRole: 'user',
  setRole: (role) => set({ currentRole: role }),

  // ─ Auth
  isAuthenticated: true,
  hasCompletedOnboarding: true,

  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, hasCompletedOnboarding: false }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  // ─ User
  user: MOCK_USER,
  updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),

  // ─ Subscription
  subscription: MOCK_SUBSCRIPTION,

  useCredit: () =>
    set((state) => ({
      subscription: {
        ...state.subscription,
        remainingCredits: Math.max(0, state.subscription.remainingCredits - 1),
      },
    })),

  upgradePlan: (plan, billing) =>
    set((state) => ({
      subscription: {
        ...state.subscription,
        plan,
        billing,
        totalCredits: plan === 'fitness' ? 20 : plan === 'transformation' ? 40 : 60,
        remainingCredits: plan === 'fitness' ? 20 : plan === 'transformation' ? 40 : 60,
      },
    })),

  addCredits: (count) =>
    set((state) => ({
      subscription: {
        ...state.subscription,
        remainingCredits: state.subscription.remainingCredits + count,
        totalCredits: state.subscription.totalCredits + count,
      },
    })),

  // ─ Daily Macros
  dailyMacros: MOCK_DAILY_MACROS,

  logFood: (calories, protein, carbs, fats) =>
    set((state) => ({
      dailyMacros: {
        ...state.dailyMacros,
        consumed: {
          calories: state.dailyMacros.consumed.calories + calories,
          protein: state.dailyMacros.consumed.protein + protein,
          carbs: state.dailyMacros.consumed.carbs + carbs,
          fats: state.dailyMacros.consumed.fats + fats,
        },
      },
    })),

  updateTargets: (targets) =>
    set((state) => ({
      dailyMacros: {
        ...state.dailyMacros,
        targets: { ...state.dailyMacros.targets, ...targets },
      },
    })),

  resetDailyMacros: () =>
    set((state) => ({
      dailyMacros: {
        ...state.dailyMacros,
        consumed: { calories: 0, protein: 0, carbs: 0, fats: 0 },
        date: new Date().toISOString().split('T')[0],
      },
    })),

  // ─ Meal Schedule
  mealSchedule: MOCK_MEAL_SCHEDULE,

  swapDailyMeal: (date, newMealId) => {
    const { mealSchedule } = get();
    const { MEALS_LIBRARY } = require('@/constants/mockData');
    const newMeal = MEALS_LIBRARY.find((m: any) => m.id === newMealId);
    if (!newMeal) return;

    set({
      mealSchedule: mealSchedule.map((entry) =>
        entry.date === date
          ? { ...entry, meal: newMeal, status: 'swapped' as const }
          : entry
      ),
    });
  },

  getMealByDate: (date) => get().mealSchedule.find((entry) => entry.date === date),

  confirmMeal: (date) =>
    set((state) => ({
      mealSchedule: state.mealSchedule.map((entry) =>
        entry.date === date
          ? { ...entry, status: 'delivered' as const }
          : entry
      ),
    })),

  // ─ Gym Check-ins (User side)
  gymCheckIns: MOCK_CHECK_INS,

  checkInGym: () => {
    const today = new Date().toISOString().split('T')[0];
    const { gymCheckIns, hasCheckedInToday, gymVisitors } = get();
    if (hasCheckedInToday()) return;

    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const newCheckIn: CheckIn = {
      id: `checkin_${Date.now()}`,
      date: today,
      gymId: 'gym_001',
      gymName: 'Iron House Gym',
      timeIn: timeStr,
    };

    const newVisitor: GymVisitor = {
      id: `vis_${Date.now()}`,
      memberName: get().user.name,
      passId: '#GF-8921',
      planName: 'Transformation VIP',
      timeIn: timeStr,
      status: 'admitted',
      avatarLetter: 'A',
    };

    set({
      gymCheckIns: [newCheckIn, ...gymCheckIns],
      gymVisitors: [newVisitor, ...gymVisitors],
      gymOccupancy: get().gymOccupancy + 1,
      gymPendingPayout: get().gymPendingPayout + 120, // +₹120 turnstile fee
    });
  },

  hasCheckedInToday: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().gymCheckIns.some((c) => c.date === today);
  },

  // ─ Gym Partner Operations & Financials
  gymVisitors: INITIAL_VISITORS,
  gymOccupancy: 35,
  gymPendingPayout: 28400,
  gymSettledPayout: 117000,

  adjustOccupancy: (delta) =>
    set((state) => ({
      gymOccupancy: Math.max(0, Math.min(100, state.gymOccupancy + delta)),
    })),

  admitMember: (passId, memberName) => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const newVisitor: GymVisitor = {
      id: `vis_${Date.now()}`,
      memberName: memberName || 'Member (Walk-in)',
      passId: passId.toUpperCase().startsWith('#') ? passId.toUpperCase() : `#${passId.toUpperCase()}`,
      planName: 'All-Access Pass',
      timeIn: timeStr,
      status: 'admitted',
      avatarLetter: memberName ? memberName.charAt(0).toUpperCase() : 'M',
    };

    set((state) => ({
      gymVisitors: [newVisitor, ...state.gymVisitors],
      gymOccupancy: Math.min(100, state.gymOccupancy + 1),
      gymPendingPayout: state.gymPendingPayout + 120, // +₹120 check-in fee
    }));
    return true;
  },

  // ─ Restaurant Partner Operations & Financials
  kitchenOrders: INITIAL_KITCHEN_ORDERS,
  kitchenPendingPayout: 34200,
  kitchenSettledPayout: 147400,

  advanceOrderStatus: (orderId) => {
    const sequence: KitchenOrderStatus[] = ['preparing', 'ready', 'out_for_delivery', 'delivered'];
    const currentOrder = get().kitchenOrders.find((o) => o.id === orderId);
    if (!currentOrder) return;

    const currentIdx = sequence.indexOf(currentOrder.status);
    const nextStatus = currentIdx < sequence.length - 1 ? sequence[currentIdx + 1] : sequence[0];

    // If order transitioned to delivered, credit +₹220 to kitchen payout
    const addedPayout = nextStatus === 'delivered' ? 220 : 0;

    set((state) => ({
      kitchenOrders: state.kitchenOrders.map((ord) =>
        ord.id === orderId ? { ...ord, status: nextStatus } : ord
      ),
      kitchenPendingPayout: state.kitchenPendingPayout + addedPayout,
    }));
  },

  // ─ Super Admin (GymFoodie HQ Central Treasury & Support)
  supportTickets: INITIAL_SUPPORT_TICKETS,
  subscribersAudit: INITIAL_SUBSCRIBERS_AUDIT,

  platformTreasury: {
    grossPlatformRevenue: 584000,
    totalSettledToGyms: 117000,
    pendingGymLiability: 28400,
    totalSettledToKitchens: 147400,
    pendingKitchenLiability: 34200,
    logisticsCost: 42000,
    netPlatformProfit: 215000,
  },

  releaseGymWeeklyPayout: () => {
    const { gymPendingPayout, gymSettledPayout, platformTreasury } = get();
    if (gymPendingPayout <= 0) return;

    set({
      gymSettledPayout: gymSettledPayout + gymPendingPayout,
      gymPendingPayout: 0,
      platformTreasury: {
        ...platformTreasury,
        totalSettledToGyms: platformTreasury.totalSettledToGyms + gymPendingPayout,
        pendingGymLiability: 0,
      },
    });
  },

  releaseKitchenWeeklyPayout: () => {
    const { kitchenPendingPayout, kitchenSettledPayout, platformTreasury } = get();
    if (kitchenPendingPayout <= 0) return;

    set({
      kitchenSettledPayout: kitchenSettledPayout + kitchenPendingPayout,
      kitchenPendingPayout: 0,
      platformTreasury: {
        ...platformTreasury,
        totalSettledToKitchens: platformTreasury.totalSettledToKitchens + kitchenPendingPayout,
        pendingKitchenLiability: 0,
      },
    });
  },

  resolveTicket: (ticketId, resolutionNote) => {
    set((state) => ({
      supportTickets: state.supportTickets.map((tck) =>
        tck.id === ticketId
          ? {
              ...tck,
              status: 'resolved',
              resolutionNote: resolutionNote || 'Resolved by GymFoodie HQ Support.',
            }
          : tck
      ),
    }));
  },

  compensateMemberCredit: (memberCode) => {
    // If Abhishek's pass code is compensated
    if (memberCode === '#GF-8921') {
      get().addCredits(1);
    }
  },

  // ─ UI State
  activeSwapDate: null,
  setActiveSwapDate: (date) => set({ activeSwapDate: date }),

  selectedPlan: 'transformation',
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
}));

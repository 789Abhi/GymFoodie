import type {
  User, Subscription, PartnerGym, Coach,
  DailyMeal, Meal, DailyMacros, CheckIn, Plan, CreditPack,
} from '@/types';

// ─── Static OTP for prototype ─────────────────
export const STATIC_OTP = '123456';
export const STATIC_PHONE = '+91 98765 43210';
export const STATIC_EMAIL = 'abhishek@gymfoodie.in';
export const STATIC_PASSWORD = 'GymFoodie@123';
export const INVITE_CODE = 'IRONHOUSE2026';

// ─── Coach ───────────────────────────────────
export const MOCK_COACH: Coach = {
  id: 'coach_001',
  name: 'Coach Rahul',
  specialization: 'Body Recomposition & Macro Nutrition',
  macrosSynced: true,
};

// ─── Partner Gym ─────────────────────────────
export const MOCK_GYM: PartnerGym = {
  id: 'gym_001',
  name: 'Iron House Gym',
  location: 'Kankanady, Mangaluru',
  city: 'Mangaluru, India',
  distance: '1.2 km',
  openHours: '5:00 AM – 11:00 PM',
  currentOccupancy: 35,
  peakHours: '6:00 PM – 8:30 PM',
  assignedCoach: MOCK_COACH,
};

// ─── User ────────────────────────────────────
export const MOCK_USER: User = {
  id: 'user_001',
  name: 'Abhishek TK',
  email: 'abhishek@gymfoodie.in',
  phone: '+91 98765 43210',
  avatar: null,
  fitnessGoal: 'muscle_gain',
  dietType: 'non_veg',
  partnerGymId: 'gym_001',
  deliveryAddresses: [
    {
      id: 'addr_001',
      label: 'Home',
      line1: 'Flat 4B, Green Valley Apartments',
      line2: 'Near Pumpwell Circle',
      city: 'Mangaluru',
      pincode: '575001',
      isDefault: true,
    },
    {
      id: 'addr_002',
      label: 'Office',
      line1: 'WeWork, Kodialbail',
      city: 'Mangaluru',
      pincode: '575003',
      isDefault: false,
    },
  ],
  joinedAt: '2024-08-01',
};

// ─── Subscription ─────────────────────────────
export const MOCK_SUBSCRIPTION: Subscription = {
  plan: 'transformation',
  billing: 'monthly',
  totalCredits: 40,
  remainingCredits: 28,
  renewalDate: '2024-10-31',
  partnerGym: MOCK_GYM,
  isActive: true,
  deliveriesRemaining: 14,
};

// ─── Daily Macros ─────────────────────────────
export const MOCK_DAILY_MACROS: DailyMacros = {
  targets: { calories: 2200, protein: 150, carbs: 180, fats: 60 },
  consumed: { calories: 1650, protein: 110, carbs: 120, fats: 42 },
  date: new Date().toISOString().split('T')[0],
};

// ─── Meals Library ────────────────────────────
export const MEALS_LIBRARY: Meal[] = [
  {
    id: 'meal_001',
    name: 'Grilled Herb Chicken & Quinoa Bowl',
    description: 'Sous-vide herb chicken, avocado cream, citrus kale, and protein-packed quinoa',
    emoji: '🍗',
    kitchen: 'Diet & Protein Mangaluru',
    kitchenRating: 4.9,
    calories: 620,
    protein: 48,
    carbs: 52,
    fats: 14,
    fiber: 6,
    tags: ['High Protein', 'Post-Workout'],
    allergens: [],
    creditCost: 1,
    isGlutenFree: false,
    isHighProtein: true,
  },
  {
    id: 'meal_002',
    name: 'Teriyaki Paneer & Brown Rice Bowl',
    description: 'House-marinated paneer grilled with sugar-free teriyaki, steamed broccoli, mineral-rich brown rice',
    emoji: '🧆',
    kitchen: 'Diet & Protein Mangaluru',
    kitchenRating: 4.8,
    calories: 580,
    protein: 38,
    carbs: 65,
    fats: 14,
    fiber: 7,
    tags: ['Gluten Free', 'High Protein'],
    allergens: ['Dairy'],
    creditCost: 1,
    isGlutenFree: true,
    isHighProtein: true,
  },
  {
    id: 'meal_003',
    name: 'Egg White Burrito Bowl',
    description: 'Fluffy egg whites, black beans, roasted corn, pico de gallo, light sour cream',
    emoji: '🌯',
    kitchen: 'FitKitchen Co.',
    kitchenRating: 4.7,
    calories: 540,
    protein: 42,
    carbs: 48,
    fats: 12,
    fiber: 8,
    tags: ['High Protein', 'Low Carb'],
    allergens: ['Eggs'],
    creditCost: 1,
    isGlutenFree: true,
    isHighProtein: true,
  },
  {
    id: 'meal_004',
    name: 'Soya Tikka & Mash',
    description: 'Smoky soya chunks tikka with spiced cauliflower mash and mint chutney',
    emoji: '🥣',
    kitchen: 'GreenFuel Kitchen',
    kitchenRating: 4.6,
    calories: 560,
    protein: 40,
    carbs: 55,
    fats: 13,
    fiber: 9,
    tags: ['Veg', 'High Protein'],
    allergens: ['Soy'],
    creditCost: 1,
    isGlutenFree: false,
    isHighProtein: true,
  },
  {
    id: 'meal_005',
    name: 'Salmon Avocado Power Bowl',
    description: 'Wild-caught salmon fillet, creamy avocado, edamame, sesame brown rice, ponzu dressing',
    emoji: '🐟',
    kitchen: 'Coastal Macros',
    kitchenRating: 4.9,
    calories: 650,
    protein: 45,
    carbs: 44,
    fats: 22,
    fiber: 5,
    tags: ['Omega-3', 'High Protein'],
    allergens: ['Fish', 'Soy'],
    creditCost: 1,
    isGlutenFree: true,
    isHighProtein: true,
  },
  {
    id: 'meal_006',
    name: 'Greek Chicken Wrap',
    description: 'Grilled chicken, tzatziki, cucumber, tomato, olives in a whole-wheat wrap',
    emoji: '🫔',
    kitchen: 'Diet & Protein Mangaluru',
    kitchenRating: 4.7,
    calories: 590,
    protein: 44,
    carbs: 50,
    fats: 16,
    fiber: 6,
    tags: ['High Protein', 'Balanced'],
    allergens: ['Gluten', 'Dairy'],
    creditCost: 1,
    isGlutenFree: false,
    isHighProtein: true,
  },
  {
    id: 'meal_007',
    name: 'Turkey Meatball Zoodles',
    description: 'Lean turkey meatballs in marinara sauce over zucchini noodles',
    emoji: '🍝',
    kitchen: 'FitKitchen Co.',
    kitchenRating: 4.8,
    calories: 510,
    protein: 46,
    carbs: 28,
    fats: 18,
    fiber: 7,
    tags: ['Low Carb', 'High Protein'],
    allergens: [],
    creditCost: 1,
    isGlutenFree: true,
    isHighProtein: true,
  },
];

// ─── 30-Day Meal Schedule ─────────────────────
const generateMealSchedule = (): DailyMeal[] => {
  const today = new Date();
  const schedule: DailyMeal[] = [];
  const couriers = ['Kiran', 'Rahul S', 'Mohan', 'Deepak', 'Suresh'];

  for (let i = -10; i < 20; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const meal = MEALS_LIBRARY[Math.abs(i) % MEALS_LIBRARY.length];

    let status: DailyMeal['status'];
    if (i < -2) status = 'delivered';
    else if (i === -1 || i === -2) status = 'swapped';
    else if (i === 0) status = 'scheduled';
    else if (i <= 7) status = 'scheduled';
    else status = 'locked';

    schedule.push({
      date: dateStr,
      meal,
      status,
      deliveryTime: i === 0 ? '1:00 PM' : i % 2 === 0 ? '12:30 PM' : '1:30 PM',
      deliveryType: 'home',
      courierName: couriers[Math.abs(i) % couriers.length],
      distanceKm: parseFloat((Math.random() * 2 + 0.5).toFixed(1)),
    });
  }
  return schedule;
};

export const MOCK_MEAL_SCHEDULE: DailyMeal[] = generateMealSchedule();

// ─── Gym Check-ins ────────────────────────────
const generateCheckIns = (): CheckIn[] => {
  const today = new Date();
  const checkIns: CheckIn[] = [];
  const checkedDays = [0,1,2,3,4,7,8,9,10,11,14,15,16,17,18,21,22,23];

  checkedDays.forEach((daysAgo, idx) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    checkIns.push({
      id: `checkin_${idx}`,
      date: date.toISOString().split('T')[0],
      gymId: 'gym_001',
      gymName: 'Iron House Gym',
      timeIn: `${5 + (idx % 4)}:${idx % 2 === 0 ? '00' : '30'} AM`,
      timeOut: `${6 + (idx % 3)}:${idx % 2 === 0 ? '45' : '15'} AM`,
    });
  });
  return checkIns;
};

export const MOCK_CHECK_INS: CheckIn[] = generateCheckIns();

// ─── Plans ──────────────────────────────────
export const PLANS: Plan[] = [
  {
    id: 'fitness',
    tierLabel: 'STARTER TIER',
    name: 'FITNESS',
    tagline: 'Essential fuel and workout access',
    monthlyPrice: 5999,
    quarterlyPrice: 15297,
    credits: 20,
    deliveries: 0,
    features: [
      'Any Partner Gym Access',
      '20 Gourmet Meal Credits / month',
      'Macro Tracking via App',
      'Kitchen Pick-Up Only',
      'Quick Digital Check-In',
    ],
    isPopular: false,
    accentColor: '#94A3B8',
  },
  {
    id: 'transformation',
    tierLabel: 'RECOMMENDED',
    name: 'TRANSFORMATION',
    tagline: 'The full athlete body recomposition suite',
    monthlyPrice: 8999,
    quarterlyPrice: 22947,
    credits: 40,
    deliveries: 20,
    features: [
      'All Gym Access + High-End Clubs',
      '40 Gourmet Meal Credits / month',
      'Trainer Macro Sync via Apple Health',
      '20 Free Priority Home Deliveries',
      'Weekly Macro Tuning by Dietitian',
      'Personal Locker Priority',
    ],
    isPopular: true,
    accentColor: '#10B981',
  },
  {
    id: 'premium',
    tierLabel: 'VIP CONCIERGE',
    name: 'PREMIUM',
    tagline: 'White-glove executive performance',
    monthlyPrice: 11999,
    quarterlyPrice: 30597,
    credits: 60,
    deliveries: 'unlimited',
    features: [
      'VIP Gym Access + Tier-1 CrossFit Boxes',
      '60 Meal Credits (Lunch + Dinner)',
      'Unlimited Doorstep Thermal Delivery',
      '1-on-1 Monthly Nutritionist Video Call',
      'Direct Michelin-trained Chef Requests',
      'Dedicated Concierge Line',
    ],
    isPopular: false,
    accentColor: '#8B5CF6',
  },
];

// ─── Add-On Credit Packs ─────────────────────
export const CREDIT_PACKS: CreditPack[] = [
  { id: 'pack_10', credits: 10, price: 850, label: '+10 Credits' },
  { id: 'pack_20', credits: 20, price: 1600, label: '+20 Credits' },
];

// ─── Gyms List (for Goal Setup) ──────────────
export const MANGALURU_GYMS = [
  { id: 'gym_001', name: 'Iron House Gym', location: 'Kankanady' },
  { id: 'gym_002', name: 'Gold\'s Gym', location: 'Falnir Road' },
  { id: 'gym_003', name: 'Fitness First', location: 'Balmatta' },
  { id: 'gym_004', name: 'Power Zone Gym', location: 'Attavar' },
  { id: 'gym_005', name: 'Body Craft Gym', location: 'Hampankatta' },
];

// ─── Swap Alternatives (for any meal) ────────
export const SWAP_ALTERNATIVES = (excludeId: string): Meal[] =>
  MEALS_LIBRARY.filter(m => m.id !== excludeId).slice(0, 3);

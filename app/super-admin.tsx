import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';
import { useTheme } from '@/hooks/useTheme';
import RoleSwitcherModal from '@/components/RoleSwitcherModal';
import type { SupportTicket, FinancialMetrics } from '@/types';

// Static Financial Datasets for HQ Commercial Engine
const FINANCIAL_DATA: Record<'sep' | 'aug' | 'ytd', FinancialMetrics> = {
  sep: {
    periodLabel: 'September 2024 (Live Current)',
    grossRevenue: 584000,
    cogsFood: 181600,
    cogsGym: 145400,
    totalCogs: 327000,
    grossProfit: 257000,
    grossMarginPercent: 44.0,
    logisticsCost: 42000,
    marketingSpend: 42000,
    paymentGatewayFees: 11680,
    cloudInfraCost: 6500,
    packagingCost: 7500,
    totalOpex: 109680,
    lossLeakageRefunds: 8500,
    netProfit: 138820,
    netMarginPercent: 23.8,
    adSpend: 42000,
    attributedRevenue: 324000,
    roas: 7.71,
    cac: 1166,
    ltv: 24000,
    ltvCacRatio: 20.5,
    arpu: 3945,
    churnRate: 2.1,
    activeSubscribers: 148,
  },
  aug: {
    periodLabel: 'August 2024 (Previous Month)',
    grossRevenue: 492000,
    cogsFood: 155000,
    cogsGym: 124000,
    totalCogs: 279000,
    grossProfit: 213000,
    grossMarginPercent: 43.3,
    logisticsCost: 37500,
    marketingSpend: 38000,
    paymentGatewayFees: 9840,
    cloudInfraCost: 6500,
    packagingCost: 6800,
    totalOpex: 98640,
    lossLeakageRefunds: 6200,
    netProfit: 108160,
    netMarginPercent: 22.0,
    adSpend: 38000,
    attributedRevenue: 275000,
    roas: 7.24,
    cac: 1225,
    ltv: 23500,
    ltvCacRatio: 19.2,
    arpu: 3880,
    churnRate: 2.4,
    activeSubscribers: 127,
  },
  ytd: {
    periodLabel: 'FY 2024-25 (Year-To-Date Cumulative)',
    grossRevenue: 2840000,
    cogsFood: 892000,
    cogsGym: 710000,
    totalCogs: 1602000,
    grossProfit: 1238000,
    grossMarginPercent: 43.6,
    logisticsCost: 205000,
    marketingSpend: 210000,
    paymentGatewayFees: 56800,
    cloudInfraCost: 39000,
    packagingCost: 41000,
    totalOpex: 551800,
    lossLeakageRefunds: 41200,
    netProfit: 645000,
    netMarginPercent: 22.7,
    adSpend: 210000,
    attributedRevenue: 1620000,
    roas: 7.71,
    cac: 1180,
    ltv: 24000,
    ltvCacRatio: 20.3,
    arpu: 3920,
    churnRate: 2.2,
    activeSubscribers: 148,
  },
};

const LEAKAGE_INCIDENTS = [
  {
    id: 'LK-101',
    category: 'Logistics Damage',
    emoji: '🛵',
    description: 'Rider slip in Kadri rains; 4 glass macro containers cracked & meal contents spilled.',
    cost: 3200,
    resolution: 'Dispatched 4 immediate replacement bowls + covered rider first-aid.',
    date: 'Sep 02, 2024 • 1:15 PM',
    status: 'Absorbed & Covered',
  },
  {
    id: 'LK-102',
    category: 'Logistics Delay Refund',
    emoji: '🌧️',
    description: 'Heavy waterlogging at Jyothi Circle delayed batch delivery by 45 minutes.',
    cost: 2600,
    resolution: 'Automated ₹325 refund coupons credited to 8 affected subscribers.',
    date: 'Aug 29, 2024 • 2:10 PM',
    status: 'Refunded via Wallet',
  },
  {
    id: 'LK-103',
    category: 'Turnstile IoT Reboot',
    emoji: '📶',
    description: 'Firmware sync timeout at Iron House turnstile gate #2; grace access provided.',
    cost: 1500,
    resolution: 'Watchdog restart deployed; gym owner compensated as per offline tariff.',
    date: 'Aug 24, 2024 • 6:40 AM',
    status: 'Compensated & Fixed',
  },
  {
    id: 'LK-104',
    category: 'Kitchen Recipe Mismatch',
    emoji: '🥪',
    description: 'Brown rice bowl packed instead of Low-Carb Keto Paneer for #SUB-4102.',
    cost: 1200,
    resolution: 'Fresh Keto bowl cooked and delivered within 25 minutes with apology note.',
    date: 'Aug 18, 2024 • 1:30 PM',
    status: 'Replaced & Solved',
  },
];

const AD_CAMPAIGNS = [
  {
    name: 'Meta Ads (Instagram Reels + Stories)',
    platform: 'Meta',
    icon: '📱',
    spend: 26000,
    impressions: '142,000',
    clicks: '4,890',
    newSubscribers: 24,
    revenue: 218000,
    roas: 8.38,
    cac: 1083,
    status: '🔥 Top Decile ROAS',
  },
  {
    name: 'Google Search ("Gym Meal Delivery Mangaluru")',
    platform: 'Google',
    icon: '🔍',
    spend: 16000,
    impressions: '18,500',
    clicks: '1,420',
    newSubscribers: 12,
    revenue: 106000,
    roas: 6.62,
    cac: 1333,
    status: '⚡ High Buying Intent',
  },
];

export default function SuperAdminDashboard() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const {
    platformTreasury,
    supportTickets,
    subscribersAudit,
    resolveTicket,
    compensateMemberCredit,
    gymPendingPayout,
    gymSettledPayout,
    releaseGymWeeklyPayout,
    kitchenPendingPayout,
    kitchenSettledPayout,
    releaseKitchenWeeklyPayout,
    isDarkMode,
    toggleTheme,
    kitchenOrders,
    gymVisitors,
  } = useGymFoodieStore();

  const [activeTab, setActiveTab] = useState<'treasury' | 'settlement' | 'food' | 'gyms' | 'tickets' | 'subscribers'>('treasury');
  const [financialPeriod, setFinancialPeriod] = useState<'sep' | 'aug' | 'ytd'>('sep');
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [leakageModalVisible, setLeakageModalVisible] = useState(false);
  const [campaignModalVisible, setCampaignModalVisible] = useState(false);

  // Active period metrics
  const currentFin = FINANCIAL_DATA[financialPeriod];

  // Total gross platform calculations
  const totalGymLiability = gymPendingPayout;
  const totalKitchenLiability = kitchenPendingPayout;
  const totalPlatformLiability = totalGymLiability + totalKitchenLiability;

  // Resolve ticket handler
  const handleResolveTicket = (ticket: SupportTicket) => {
    resolveTicket(ticket.id, 'Resolved by GymFoodie HQ Command. Compensation credit granted.');
    compensateMemberCredit(ticket.memberCode);
    Alert.alert(
      'Ticket Resolved! ✅',
      `Ticket #${ticket.id} closed. Member ${ticket.memberCode} credited with +1 compensation meal credit.`
    );
  };

  // Handle Gym batch release
  const handleReleaseGym = () => {
    if (gymPendingPayout <= 0) {
      Alert.alert('No Pending Dues', 'Iron House Gym has zero pending balance to settle.');
      return;
    }
    const amt = gymPendingPayout;
    releaseGymWeeklyPayout();
    Alert.alert(
      'Gym Batch Settled! 💳',
      `₹${amt.toLocaleString('en-IN')} successfully disbursed to Iron House Gym HDFC Bank A/c ****4102 via direct corporate gateway.`
    );
  };

  // Handle Kitchen batch release
  const handleReleaseKitchen = () => {
    if (kitchenPendingPayout <= 0) {
      Alert.alert('No Pending Dues', 'Diet & Protein Central Kitchen has zero pending balance to settle.');
      return;
    }
    const amt = kitchenPendingPayout;
    releaseKitchenWeeklyPayout();
    Alert.alert(
      'Kitchen Batch Settled! 🍳',
      `₹${amt.toLocaleString('en-IN')} disbursed to Diet & Protein Central Kitchen ICICI Bank A/c ****8821.`
    );
  };

  // Handle Export P&L report
  const handleExportReport = () => {
    Alert.alert(
      'P&L Statement Exported 📥',
      `Period: ${currentFin.periodLabel}\n\n• Gross Revenue: ₹${currentFin.grossRevenue.toLocaleString('en-IN')}\n• COGS: ₹${currentFin.totalCogs.toLocaleString('en-IN')} (${((currentFin.totalCogs / currentFin.grossRevenue) * 100).toFixed(1)}%)\n• Gross Profit: ₹${currentFin.grossProfit.toLocaleString('en-IN')} (${currentFin.grossMarginPercent}%)\n• Total OpEx: ₹${currentFin.totalOpex.toLocaleString('en-IN')}\n• Loss/Leakage: ₹${currentFin.lossLeakageRefunds.toLocaleString('en-IN')}\n• Net Operating Profit (EBITDA): ₹${currentFin.netProfit.toLocaleString('en-IN')} (${currentFin.netMarginPercent}%)\n• Blended ROAS: ${currentFin.roas}x\n• CAC: ₹${currentFin.cac.toLocaleString('en-IN')}\n\nEncrypted administrative audit statement has been generated successfully.`
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.bgPrimary }]}>
      {/* Top Header */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top, 14),
            backgroundColor: theme.bgCard,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.headerTitleBlock}>
          <View style={[styles.hqLogoCircle, { backgroundColor: theme.greenMuted, borderColor: theme.green }]}>
            <Text style={styles.hqLogoEmoji}>👑</Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.hqTitle, { color: theme.textPrimary }]}>GymFoodie HQ</Text>
              <View style={[styles.superPill, { backgroundColor: theme.purpleMuted }]}>
                <Text style={[styles.superPillText, { color: theme.purple }]}>MAIN ADMIN</Text>
              </View>
            </View>
            <Text style={[styles.hqSubtitle, { color: theme.textMuted }]}>
              Central Operations & Treasury Command
            </Text>
          </View>
        </View>

        <View style={styles.headerControls}>
          <TouchableOpacity
            style={[styles.themeBtn, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}
            onPress={toggleTheme}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 16 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switchRoleBtn, { backgroundColor: theme.green }]}
            onPress={() => setRoleModalVisible(true)}
            activeOpacity={0.75}
          >
            <Text style={[styles.switchRoleText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
              Switch Role ⇄
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Segmented Horizontal Navigation Bar */}
      <View style={[styles.navScrollWrapper, { backgroundColor: theme.bgCard, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navScroll}>
          {[
            { id: 'treasury', label: '📊 Financials' },
            { id: 'settlement', label: `💰 Weekly Payouts (₹${totalPlatformLiability.toLocaleString('en-IN')})` },
            { id: 'food', label: '🍳 Food Dispatch' },
            { id: 'gyms', label: '🏋️ Gym Attendance' },
            { id: 'tickets', label: `🎫 Complaints (${supportTickets.filter(t => t.status !== 'resolved').length})` },
            { id: 'subscribers', label: '🔒 Subscribers (Audit)' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navTab,
                  isActive && { borderBottomColor: theme.green, borderBottomWidth: 3 },
                ]}
                onPress={() => setActiveTab(item.id as any)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.navTabText,
                    { color: isActive ? theme.green : theme.textMuted },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* TAB 1: EXECUTIVE FINANCIAL OVERVIEW                      */}
        {/* ========================================================= */}
        {activeTab === 'treasury' && (
          <>
            {/* Timeframe Selector */}
            <View style={[styles.timeframeBar, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.timeframeLabel, { color: theme.textMuted }]}>TIMEFRAME:</Text>
              <View style={styles.timeframePills}>
                {[
                  { id: 'sep', label: 'Sep 2024 (Live)' },
                  { id: 'aug', label: 'Aug 2024' },
                  { id: 'ytd', label: 'FY24-25 (YTD)' },
                ].map((item) => {
                  const isSelected = financialPeriod === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.timeframePill,
                        {
                          backgroundColor: isSelected ? theme.green : theme.bgPrimary,
                          borderColor: isSelected ? theme.green : theme.border,
                        },
                      ]}
                      onPress={() => setFinancialPeriod(item.id as any)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.timeframePillText,
                          { color: isSelected ? (theme.isDark ? '#090D16' : '#FFFFFF') : theme.textMuted },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Active Period & Export Header */}
            <View style={[styles.periodHeaderRow, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTag, { color: theme.green }]}>FINANCIAL AUDIT ENGINE</Text>
                <Text style={[styles.periodTitle, { color: theme.textPrimary }]}>{currentFin.periodLabel}</Text>
                <Text style={[styles.periodSub, { color: theme.textMuted }]}>
                  {financialPeriod === 'sep'
                    ? '148 Active Paid Subscribers • Real-Time Inflow'
                    : financialPeriod === 'aug'
                    ? '127 Paid Subscribers • Month Closed & Reconciled'
                    : '720 Subscription Cycles Reconciled (Apr - Sep)'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.exportBtn, { backgroundColor: theme.greenMuted, borderColor: theme.green }]}
                onPress={handleExportReport}
                activeOpacity={0.75}
              >
                <Text style={[styles.exportBtnText, { color: theme.green }]}>📥 Export P&L</Text>
              </TouchableOpacity>
            </View>

            {/* 4 Core Executive Metric Cards (2x2 Grid) */}
            <View style={styles.execGrid}>
              {/* 1. Gross Revenue */}
              <View style={[styles.execCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                <View style={styles.execCardTop}>
                  <Text style={[styles.execCardTag, { color: theme.textMuted }]}>GROSS REVENUE</Text>
                  <View style={[styles.badgePill, { backgroundColor: theme.greenMuted }]}>
                    <Text style={[styles.badgePillText, { color: theme.green }]}>
                      {financialPeriod === 'sep' ? '+18.7% MoM' : 'Verified'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.execCardVal, { color: theme.textPrimary }]}>
                  ₹{currentFin.grossRevenue.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.execCardSub, { color: theme.textMuted }]}>
                  100% Inflow via Razorpay Gateway
                </Text>
              </View>

              {/* 2. Net EBITDA Profit */}
              <View style={[styles.execCard, { backgroundColor: theme.bgCard, borderColor: theme.green }]}>
                <View style={styles.execCardTop}>
                  <Text style={[styles.execCardTag, { color: theme.green }]}>NET PROFIT (EBITDA)</Text>
                  <View style={[styles.badgePill, { backgroundColor: theme.greenMuted }]}>
                    <Text style={[styles.badgePillText, { color: theme.green }]}>
                      {currentFin.netMarginPercent}% Margin
                    </Text>
                  </View>
                </View>
                <Text style={[styles.execCardVal, { color: theme.green }]}>
                  ₹{currentFin.netProfit.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.execCardSub, { color: theme.textMuted }]}>
                  Retained Operating Surplus
                </Text>
              </View>

              {/* 3. Direct Costing (COGS) */}
              <View style={[styles.execCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                <View style={styles.execCardTop}>
                  <Text style={[styles.execCardTag, { color: theme.textMuted }]}>DIRECT COGS (FOOD+GYM)</Text>
                  <View style={[styles.badgePill, { backgroundColor: theme.purpleMuted }]}>
                    <Text style={[styles.badgePillText, { color: theme.purple }]}>
                      {((currentFin.totalCogs / currentFin.grossRevenue) * 100).toFixed(1)}% Ratio
                    </Text>
                  </View>
                </View>
                <Text style={[styles.execCardVal, { color: theme.warning }]}>
                  ₹{currentFin.totalCogs.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.execCardSub, { color: theme.textMuted }]}>
                  Meals (₹{currentFin.cogsFood.toLocaleString('en-IN')}) + Gym Access
                </Text>
              </View>

              {/* 4. Loss & Leakage */}
              <TouchableOpacity
                style={[styles.execCard, { backgroundColor: theme.bgCard, borderColor: theme.error }]}
                onPress={() => setLeakageModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.execCardTop}>
                  <Text style={[styles.execCardTag, { color: theme.error }]}>LOSS & LEAKAGE ⚠️</Text>
                  <View style={[styles.badgePill, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                    <Text style={[styles.badgePillText, { color: theme.error }]}>
                      {((currentFin.lossLeakageRefunds / currentFin.grossRevenue) * 100).toFixed(2)}%
                    </Text>
                  </View>
                </View>
                <Text style={[styles.execCardVal, { color: theme.error }]}>
                  ₹{currentFin.lossLeakageRefunds.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.execCardSub, { color: theme.error }]}>
                  4 Incidents (Tap to Audit ➔)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Profit & Loss Statement (P&L Card) */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: theme.green }]}>COMPREHENSIVE AUDIT</Text>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Profit & Loss Statement (P&L)</Text>
                </View>
                <View style={[styles.badgePill, { backgroundColor: theme.greenMuted }]}>
                  <Text style={[styles.badgePillText, { color: theme.green }]}>TAX & AUDIT READY</Text>
                </View>
              </View>

              <View style={styles.waterfallList}>
                {/* Gross Revenue */}
                <View style={[styles.waterfallRow, { borderBottomColor: theme.border }]}>
                  <Text style={{ fontSize: 18 }}>📥</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.waterfallName, { color: theme.textPrimary }]}>
                      Gross Subscription Inflows
                    </Text>
                    <Text style={[styles.waterfallDesc, { color: theme.textMuted }]}>
                      Member renewals, upgrades & credit packs
                    </Text>
                  </View>
                  <Text style={[styles.waterfallAmt, { color: theme.textPrimary }]}>
                    +₹{currentFin.grossRevenue.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* COGS - Food */}
                <View style={[styles.waterfallRow, { borderBottomColor: theme.border }]}>
                  <Text style={{ fontSize: 18 }}>🥩</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.waterfallName, { color: theme.textPrimary }]}>
                      Kitchen Partners Meal Prep (COGS)
                    </Text>
                    <Text style={[styles.waterfallDesc, { color: theme.textMuted }]}>
                      ₹220/macro box food & culinary reimbursement
                    </Text>
                  </View>
                  <Text style={[styles.waterfallAmt, { color: theme.warning }]}>
                    −₹{currentFin.cogsFood.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* COGS - Gym Access */}
                <View style={[styles.waterfallRow, { borderBottomColor: theme.border }]}>
                  <Text style={{ fontSize: 18 }}>🏋️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.waterfallName, { color: theme.textPrimary }]}>
                      Partner Gyms Turnstile Access (COGS)
                    </Text>
                    <Text style={[styles.waterfallDesc, { color: theme.textMuted }]}>
                      Facility floor check-ins & gym membership pool
                    </Text>
                  </View>
                  <Text style={[styles.waterfallAmt, { color: theme.warning }]}>
                    −₹{currentFin.cogsGym.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* Gross Profit Summary Bar */}
                <View style={[styles.subtotalBanner, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <View>
                    <Text style={[styles.subtotalTitle, { color: theme.textPrimary }]}>Gross Operating Profit</Text>
                    <Text style={[styles.subtotalSub, { color: theme.green }]}>
                      Gross Margin: {currentFin.grossMarginPercent}%
                    </Text>
                  </View>
                  <Text style={[styles.subtotalAmt, { color: theme.green }]}>
                    +₹{currentFin.grossProfit.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* OpEx - Logistics */}
                <View style={[styles.waterfallRow, { borderBottomColor: theme.border }]}>
                  <Text style={{ fontSize: 18 }}>🛵</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.waterfallName, { color: theme.textPrimary }]}>
                      Thermal EV Courier Fleet Logistics
                    </Text>
                    <Text style={[styles.waterfallDesc, { color: theme.textMuted }]}>
                      Last-mile scheduled batch delivery
                    </Text>
                  </View>
                  <Text style={[styles.waterfallAmt, { color: theme.error }]}>
                    −₹{currentFin.logisticsCost.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* OpEx - Marketing */}
                <View style={[styles.waterfallRow, { borderBottomColor: theme.border }]}>
                  <Text style={{ fontSize: 18 }}>📢</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.waterfallName, { color: theme.textPrimary }]}>
                      Paid Performance Marketing (Ads)
                    </Text>
                    <Text style={[styles.waterfallDesc, { color: theme.textMuted }]}>
                      Meta Instagram Fitness Ads & Google Search
                    </Text>
                  </View>
                  <Text style={[styles.waterfallAmt, { color: theme.error }]}>
                    −₹{currentFin.marketingSpend.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* OpEx - Gateway Interchange */}
                <View style={[styles.waterfallRow, { borderBottomColor: theme.border }]}>
                  <Text style={{ fontSize: 18 }}>💳</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.waterfallName, { color: theme.textPrimary }]}>
                      Payment Gateway & Banking Fees
                    </Text>
                    <Text style={[styles.waterfallDesc, { color: theme.textMuted }]}>
                      Razorpay 2% interchange + UPI nodal fee
                    </Text>
                  </View>
                  <Text style={[styles.waterfallAmt, { color: theme.error }]}>
                    −₹{currentFin.paymentGatewayFees.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* OpEx - Cloud & IoT Hardware */}
                <View style={[styles.waterfallRow, { borderBottomColor: theme.border }]}>
                  <Text style={{ fontSize: 18 }}>☁️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.waterfallName, { color: theme.textPrimary }]}>
                      Cloud Infrastructure & Turnstile IoT
                    </Text>
                    <Text style={[styles.waterfallDesc, { color: theme.textMuted }]}>
                      AWS servers, Supabase database, RFID MQTT broker
                    </Text>
                  </View>
                  <Text style={[styles.waterfallAmt, { color: theme.error }]}>
                    −₹{currentFin.cloudInfraCost.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* OpEx - Packaging Subsidy */}
                <View style={[styles.waterfallRow, { borderBottomColor: theme.border }]}>
                  <Text style={{ fontSize: 18 }}>📦</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.waterfallName, { color: theme.textPrimary }]}>
                      Thermal Bags & Eco Container Subsidy
                    </Text>
                    <Text style={[styles.waterfallDesc, { color: theme.textMuted }]}>
                      Insulated glass/BPA-free subscription boxes
                    </Text>
                  </View>
                  <Text style={[styles.waterfallAmt, { color: theme.error }]}>
                    −₹{currentFin.packagingCost.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* OpEx - Loss & Leakage */}
                <View style={[styles.waterfallRow, { borderBottomColor: theme.border }]}>
                  <Text style={{ fontSize: 18 }}>⚠️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.waterfallName, { color: theme.error }]}>
                      Losses, Spoilage & Member Refunds
                    </Text>
                    <Text style={[styles.waterfallDesc, { color: theme.textMuted }]}>
                      Transit spills, rain delays & turnstile grace
                    </Text>
                  </View>
                  <Text style={[styles.waterfallAmt, { color: theme.error, fontWeight: 'bold' }]}>
                    −₹{currentFin.lossLeakageRefunds.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* Final Net Profit Banner */}
                <View style={[styles.netProfitBanner, { backgroundColor: theme.greenMuted, borderColor: theme.green }]}>
                  <Text style={{ fontSize: 24 }}>🏆</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.netProfitTitle, { color: theme.green }]}>
                      Retained Operating Profit (EBITDA)
                    </Text>
                    <Text style={[styles.netProfitSub, { color: theme.textPrimary }]}>
                      Net Profit Margin: {currentFin.netMarginPercent}%
                    </Text>
                  </View>
                  <Text style={[styles.netProfitAmt, { color: theme.green }]}>
                    +₹{currentFin.netProfit.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Marketing Efficiency, ROAS & Unit Economics */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: theme.cyan }]}>ACQUISITION & UNIT ECONOMICS</Text>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>ROAS & Marketing Efficiency</Text>
                </View>
                <TouchableOpacity
                  style={[styles.badgePill, { backgroundColor: theme.cyanMuted }]}
                  onPress={() => setCampaignModalVisible(true)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.badgePillText, { color: theme.cyan }]}>Campaign Details 🔍</Text>
                </TouchableOpacity>
              </View>

              {/* 3 Main KPI Pillars */}
              <View style={styles.roasGrid}>
                {/* ROAS */}
                <View style={[styles.roasBox, { backgroundColor: theme.bgPrimary, borderColor: theme.cyan }]}>
                  <Text style={[styles.roasBoxTag, { color: theme.cyan }]}>BLENDED ROAS</Text>
                  <Text style={[styles.roasBoxVal, { color: theme.cyan }]}>{currentFin.roas}x</Text>
                  <Text style={[styles.roasBoxSub, { color: theme.textDim }]}>
                    ₹{(currentFin.attributedRevenue / 100000).toFixed(2)}L Rev / ₹{(currentFin.adSpend / 1000).toFixed(0)}k Spend
                  </Text>
                </View>

                {/* CAC */}
                <View style={[styles.roasBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.roasBoxTag, { color: theme.textMuted }]}>CAC (ACQUISITION)</Text>
                  <Text style={[styles.roasBoxVal, { color: theme.textPrimary }]}>
                    ₹{currentFin.cac.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.roasBoxSub, { color: theme.textDim }]}>Per paid new subscriber</Text>
                </View>

                {/* LTV */}
                <View style={[styles.roasBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.roasBoxTag, { color: theme.textMuted }]}>CUSTOMER LTV</Text>
                  <Text style={[styles.roasBoxVal, { color: theme.green }]}>
                    ₹{currentFin.ltv.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.roasBoxSub, { color: theme.textDim }]}>Avg. 6.1 months lifespan</Text>
                </View>
              </View>

              {/* Secondary Unit Economics Grid */}
              <View style={styles.unitEconGrid}>
                <View style={[styles.unitEconItem, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.unitEconLabel, { color: theme.textMuted }]}>LTV : CAC Ratio</Text>
                  <Text style={[styles.unitEconVal, { color: theme.green }]}>{currentFin.ltvCacRatio}x</Text>
                  <Text style={[styles.unitEconSub, { color: theme.green }]}>Top Decile (Target &gt; 3x)</Text>
                </View>

                <View style={[styles.unitEconItem, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.unitEconLabel, { color: theme.textMuted }]}>Monthly ARPU</Text>
                  <Text style={[styles.unitEconVal, { color: theme.textPrimary }]}>
                    ₹{currentFin.arpu.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.unitEconSub, { color: theme.textDim }]}>Avg. revenue per member</Text>
                </View>

                <View style={[styles.unitEconItem, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.unitEconLabel, { color: theme.textMuted }]}>Monthly Churn</Text>
                  <Text style={[styles.unitEconVal, { color: theme.textPrimary }]}>{currentFin.churnRate}%</Text>
                  <Text style={[styles.unitEconSub, { color: theme.cyan }]}>97.9% Member Retention</Text>
                </View>

                <View style={[styles.unitEconItem, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.unitEconLabel, { color: theme.textMuted }]}>Ad Conversion Rate</Text>
                  <Text style={[styles.unitEconVal, { color: theme.textPrimary }]}>5.2%</Text>
                  <Text style={[styles.unitEconSub, { color: theme.textDim }]}>App download to paid pass</Text>
                </View>
              </View>

              {/* Channel Quick Summary */}
              <View style={styles.channelPreviewList}>
                <View style={[styles.channelPreviewRow, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={{ fontSize: 20 }}>📱</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.channelName, { color: theme.textPrimary }]}>
                      Meta Ads (Instagram Reels & Stories)
                    </Text>
                    <Text style={[styles.channelMeta, { color: theme.textMuted }]}>
                      ₹26,000 spend • 24 new subscribers • ₹2,18,000 revenue
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.channelRoas, { color: theme.green }]}>8.38x ROAS</Text>
                    <Text style={[styles.channelStatus, { color: theme.green }]}>🔥 Top Decile</Text>
                  </View>
                </View>

                <View style={[styles.channelPreviewRow, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={{ fontSize: 20 }}>🔍</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.channelName, { color: theme.textPrimary }]}>
                      Google Search ("Gym Meal Delivery Mangaluru")
                    </Text>
                    <Text style={[styles.channelMeta, { color: theme.textMuted }]}>
                      ₹16,000 spend • 12 new subscribers • ₹1,06,000 revenue
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.channelRoas, { color: theme.cyan }]}>6.62x ROAS</Text>
                    <Text style={[styles.channelStatus, { color: theme.cyan }]}>⚡ High Intent</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Granular Costing Breakdown ("Where does every ₹100 go?") */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: theme.textMuted }]}>UNIT COSTING STRUCTURE</Text>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Where Does Every ₹100 Go?</Text>
                </View>
                <View style={[styles.badgePill, { backgroundColor: theme.bgPrimary, borderColor: theme.border, borderWidth: 1 }]}>
                  <Text style={[styles.badgePillText, { color: theme.textMuted }]}>UNIT COST MATRIX</Text>
                </View>
              </View>

              {/* Multi-Segment Color Progress Bar */}
              <View style={styles.costProgressBar}>
                <View style={[styles.costBarSegment, { flex: 31.1, backgroundColor: '#F59E0B' }]} />
                <View style={[styles.costBarSegment, { flex: 24.9, backgroundColor: '#06B6D4' }]} />
                <View style={[styles.costBarSegment, { flex: 7.2, backgroundColor: '#8B5CF6' }]} />
                <View style={[styles.costBarSegment, { flex: 7.2, backgroundColor: '#EC4899' }]} />
                <View style={[styles.costBarSegment, { flex: 4.4, backgroundColor: '#3B82F6' }]} />
                <View style={[styles.costBarSegment, { flex: 1.4, backgroundColor: '#EF4444' }]} />
                <View style={[styles.costBarSegment, { flex: 23.8, backgroundColor: '#10B981' }]} />
              </View>

              {/* Costing Itemized Breakdown */}
              <View style={styles.costingTable}>
                {[
                  {
                    color: '#F59E0B',
                    label: 'Kitchen Partners Meal Prep (COGS)',
                    share: '31.1%',
                    perHundred: '₹31.10',
                    total: `₹${currentFin.cogsFood.toLocaleString('en-IN')}`,
                  },
                  {
                    color: '#06B6D4',
                    label: 'Partner Gyms Turnstile Access (COGS)',
                    share: '24.9%',
                    perHundred: '₹24.90',
                    total: `₹${currentFin.cogsGym.toLocaleString('en-IN')}`,
                  },
                  {
                    color: '#8B5CF6',
                    label: 'Thermal Fleet Last-Mile Logistics',
                    share: '7.2%',
                    perHundred: '₹7.20',
                    total: `₹${currentFin.logisticsCost.toLocaleString('en-IN')}`,
                  },
                  {
                    color: '#EC4899',
                    label: 'Paid Customer Acquisition (Meta/Google)',
                    share: '7.2%',
                    perHundred: '₹7.20',
                    total: `₹${currentFin.marketingSpend.toLocaleString('en-IN')}`,
                  },
                  {
                    color: '#3B82F6',
                    label: 'Gateway, Cloud & Packaging Overhead',
                    share: '4.4%',
                    perHundred: '₹4.40',
                    total: `₹${(currentFin.paymentGatewayFees + currentFin.cloudInfraCost + currentFin.packagingCost).toLocaleString('en-IN')}`,
                  },
                  {
                    color: '#EF4444',
                    label: 'Loss, Spills & Member Refunds',
                    share: '1.4%',
                    perHundred: '₹1.40',
                    total: `₹${currentFin.lossLeakageRefunds.toLocaleString('en-IN')}`,
                  },
                  {
                    color: '#10B981',
                    label: 'Retained Net Platform EBITDA',
                    share: '23.8%',
                    perHundred: '₹23.80',
                    total: `₹${currentFin.netProfit.toLocaleString('en-IN')}`,
                    bold: true,
                  },
                ].map((row, idx) => (
                  <View key={idx} style={[styles.costingRow, { borderBottomColor: theme.border }]}>
                    <View style={[styles.costColorDot, { backgroundColor: row.color }]} />
                    <Text
                      style={[
                        styles.costingLabel,
                        { color: theme.textPrimary },
                        row.bold && { fontWeight: 'bold', color: theme.green },
                      ]}
                    >
                      {row.label}
                    </Text>
                    <Text style={[styles.costingShare, { color: theme.textMuted }]}>{row.share}</Text>
                    <Text
                      style={[
                        styles.costingAmt,
                        { color: theme.textPrimary },
                        row.bold && { fontWeight: 'bold', color: theme.green },
                      ]}
                    >
                      {row.perHundred}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Loss & Leakage Protection Audit Card */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.error }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: theme.error }]}>LEAKAGE, REFUNDS & WRITE-OFFS</Text>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Loss Protection Audit</Text>
                </View>
                <TouchableOpacity
                  style={[styles.badgePill, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}
                  onPress={() => setLeakageModalVisible(true)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.badgePillText, { color: theme.error }]}>Audit 4 Logs ⚠️</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.leakageNotice, { color: theme.textMuted }]}>
                Total leakage in {currentFin.periodLabel.split(' ')[0]} was contained at{' '}
                <Text style={{ color: theme.error, fontWeight: 'bold' }}>
                  ₹{currentFin.lossLeakageRefunds.toLocaleString('en-IN')} (1.45%)
                </Text>
                , comfortably below the board-mandated 2.00% risk threshold.
              </Text>

              <View style={styles.leakageMiniList}>
                {LEAKAGE_INCIDENTS.map((inc) => (
                  <View
                    key={inc.id}
                    style={[styles.leakageMiniRow, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}
                  >
                    <Text style={{ fontSize: 18 }}>{inc.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.leakageCategory, { color: theme.textPrimary }]}>{inc.category}</Text>
                      <Text style={[styles.leakageDate, { color: theme.textDim }]}>{inc.date}</Text>
                    </View>
                    <Text style={[styles.leakageCost, { color: theme.error }]}>
                      −₹{inc.cost.toLocaleString('en-IN')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Direct Bridge to Settlement Hub */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: theme.warning }]}>WEEKLY CLEARANCE PIPELINE</Text>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Pending Settlement Liabilities</Text>
                </View>
                <View style={[styles.badgePill, { backgroundColor: theme.purpleMuted }]}>
                  <Text style={[styles.badgePillText, { color: theme.purple }]}>FRIDAY CYCLE</Text>
                </View>
              </View>

              <View style={styles.metricGrid}>
                <View style={[styles.metricBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Gym Liability</Text>
                  <Text style={[styles.metricVal, { color: theme.warning }]}>
                    ₹{gymPendingPayout.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.metricSub, { color: theme.textDim }]}>
                    Settled: ₹{gymSettledPayout.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={[styles.metricBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Kitchen Liability</Text>
                  <Text style={[styles.metricVal, { color: theme.warning }]}>
                    ₹{kitchenPendingPayout.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.metricSub, { color: theme.textDim }]}>
                    Settled: ₹{kitchenSettledPayout.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={[styles.metricBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Total Queue</Text>
                  <Text style={[styles.metricVal, { color: theme.purple }]}>
                    ₹{totalPlatformLiability.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.metricSub, { color: theme.purple }]}>Awaiting Batch Run</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.switchPerspectiveFooter, { borderColor: theme.green, backgroundColor: theme.greenMuted, marginTop: 12 }]}
                onPress={() => setActiveTab('settlement')}
                activeOpacity={0.8}
              >
                <Text style={[styles.switchPerspectiveText, { color: theme.green, fontWeight: 'bold' }]}>
                  ⚡ Go To Weekly Settlement Hub (Disburse ₹{totalPlatformLiability.toLocaleString('en-IN')}) ➔
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CENTRAL SETTLEMENT ENGINE                         */}
        {/* ========================================================= */}
        {activeTab === 'settlement' && (
          <>
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: theme.green }]}>CENTRAL TREASURY CLEARANCE</Text>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Weekly Partner Settlements</Text>
                </View>
                <View style={[styles.badgePill, { backgroundColor: theme.greenMuted }]}>
                  <Text style={[styles.badgePillText, { color: theme.green }]}>FRIDAY RUN READY</Text>
                </View>
              </View>
              <Text style={[styles.instructionText, { color: theme.textMuted }]}>
                GymFoodie HQ controls all external payouts. Partners view their balances in real time, but release execution is managed exclusively from this portal.
              </Text>

              {/* Gym Batch Card */}
              <View style={[styles.settlementPartnerCard, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                <View style={styles.partnerTopRow}>
                  <View>
                    <Text style={[styles.partnerName, { color: theme.textPrimary }]}>🏋️ Iron House Gym (Kankanady)</Text>
                    <Text style={[styles.partnerMeta, { color: theme.textMuted }]}>
                      HDFC Bank ****4102 • 236 Turnstile Unlocks Accrued
                    </Text>
                  </View>
                  <Text style={[styles.partnerDueAmt, { color: theme.warning }]}>
                    ₹{gymPendingPayout.toLocaleString('en-IN')} Due
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.executePayoutBtn,
                    { backgroundColor: gymPendingPayout > 0 ? theme.green : theme.border },
                  ]}
                  onPress={handleReleaseGym}
                  disabled={gymPendingPayout <= 0}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.executePayoutText, { color: gymPendingPayout > 0 ? (theme.isDark ? '#090D16' : '#FFFFFF') : theme.textMuted }]}>
                    {gymPendingPayout > 0
                      ? `⚡ Execute Weekly Settlement (₹${gymPendingPayout.toLocaleString('en-IN')}) to Gym`
                      : '✓ Zero Pending Balance (Settled)'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Kitchen Batch Card */}
              <View style={[styles.settlementPartnerCard, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                <View style={styles.partnerTopRow}>
                  <View>
                    <Text style={[styles.partnerName, { color: theme.textPrimary }]}>🍳 Diet & Protein Central Kitchen</Text>
                    <Text style={[styles.partnerMeta, { color: theme.textMuted }]}>
                      ICICI Bank ****8821 • 155 Gourmet Macro Boxes Fulfilled
                    </Text>
                  </View>
                  <Text style={[styles.partnerDueAmt, { color: theme.warning }]}>
                    ₹{kitchenPendingPayout.toLocaleString('en-IN')} Due
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.executePayoutBtn,
                    { backgroundColor: kitchenPendingPayout > 0 ? theme.green : theme.border },
                  ]}
                  onPress={handleReleaseKitchen}
                  disabled={kitchenPendingPayout <= 0}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.executePayoutText, { color: kitchenPendingPayout > 0 ? (theme.isDark ? '#090D16' : '#FFFFFF') : theme.textMuted }]}>
                    {kitchenPendingPayout > 0
                      ? `⚡ Execute Weekly Settlement (₹${kitchenPendingPayout.toLocaleString('en-IN')}) to Kitchen`
                      : '✓ Zero Pending Balance (Settled)'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Scheduled Automated Cycle Card */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.sectionTag, { color: theme.textMuted }]}>AUTOMATION PROTOCOL</Text>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Scheduled Payout Frequency</Text>
              <Text style={[styles.scheduleInfo, { color: theme.textMuted }]}>
                🗓️ Standard disbursements execute every <Text style={{ color: theme.green, fontWeight: 'bold' }}>Friday at 11:00 AM IST</Text> via automated banking API webhook. Super Admin can trigger on-demand emergency clearance above anytime.
              </Text>
            </View>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CITY-WIDE FOOD LOGISTICS                          */}
        {/* ========================================================= */}
        {activeTab === 'food' && (
          <>
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: theme.cyan }]}>CITY DISPATCH STATUS</Text>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Mangaluru Macro Meal Network</Text>
                </View>
                <View style={[styles.badgePill, { backgroundColor: 'rgba(6,182,212,0.15)' }]}>
                  <Text style={[styles.badgePillText, { color: theme.cyan }]}>42 DISPATCHES TODAY</Text>
                </View>
              </View>

              <View style={styles.dispatchPillGrid}>
                <View style={[styles.statusPillBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.statusPillNumber, { color: theme.warning }]}>
                    {kitchenOrders.filter(o => o.status === 'preparing').length}
                  </Text>
                  <Text style={[styles.statusPillLabel, { color: theme.textMuted }]}>Kitchen Prep</Text>
                </View>
                <View style={[styles.statusPillBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.statusPillNumber, { color: theme.cyan }]}>
                    {kitchenOrders.filter(o => o.status === 'ready').length}
                  </Text>
                  <Text style={[styles.statusPillLabel, { color: theme.textMuted }]}>Thermal Packed</Text>
                </View>
                <View style={[styles.statusPillBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.statusPillNumber, { color: theme.purple }]}>
                    {kitchenOrders.filter(o => o.status === 'out_for_delivery').length}
                  </Text>
                  <Text style={[styles.statusPillLabel, { color: theme.textMuted }]}>Courier Transit</Text>
                </View>
                <View style={[styles.statusPillBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.statusPillNumber, { color: theme.green }]}>
                    {kitchenOrders.filter(o => o.status === 'delivered').length}
                  </Text>
                  <Text style={[styles.statusPillLabel, { color: theme.textMuted }]}>Fulfilled</Text>
                </View>
              </View>
            </View>

            {/* Central Kitchen Performance Table */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.sectionTag, { color: theme.textMuted }]}>KITCHEN PARTNER QUALITY AUDIT</Text>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Culinary Quality Scores</Text>

              <View style={styles.kitchenAuditList}>
                <View style={[styles.kitchenAuditItem, { borderBottomColor: theme.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.kitchenAuditName, { color: theme.textPrimary }]}>Diet & Protein Mangaluru</Text>
                    <Text style={[styles.kitchenAuditLocation, { color: theme.textMuted }]}>Central Hub • FSSAI Certified</Text>
                  </View>
                  <Text style={[styles.kitchenAuditScore, { color: theme.green }]}>⭐ 4.9 Rating • 100% On-Time</Text>
                </View>

                <View style={styles.kitchenAuditItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.kitchenAuditName, { color: theme.textPrimary }]}>Coastal Macros Kitchen</Text>
                    <Text style={[styles.kitchenAuditLocation, { color: theme.textMuted }]}>Kadri Hub • High-Protein Specialty</Text>
                  </View>
                  <Text style={[styles.kitchenAuditScore, { color: theme.green }]}>⭐ 4.8 Rating • 98.4% On-Time</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 4: GYM ATTENDANCE & TURNSTILES                       */}
        {/* ========================================================= */}
        {activeTab === 'gyms' && (
          <>
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: theme.green }]}>TURNSTILE NETWORK</Text>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Gym Partner Attendance</Text>
                </View>
                <View style={[styles.badgePill, { backgroundColor: theme.greenMuted }]}>
                  <Text style={[styles.badgePillText, { color: theme.green }]}>3 HUBS LIVE</Text>
                </View>
              </View>

              <View style={styles.gymNetworksList}>
                <View style={[styles.gymNetworkCard, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[styles.gymNetworkName, { color: theme.textPrimary }]}>🏋️ Iron House Gym (Kankanady)</Text>
                    <Text style={[styles.turnstileStatusText, { color: theme.green }]}>● Gates 1 & 2 Online</Text>
                  </View>
                  <Text style={[styles.gymNetworkStats, { color: theme.textMuted }]}>
                    Today's Check-ins: <Text style={{ color: theme.textPrimary, fontWeight: 'bold' }}>{gymVisitors.length}</Text> • Floor Crowd: 35% (Moderate)
                  </Text>
                </View>

                <View style={[styles.gymNetworkCard, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[styles.gymNetworkName, { color: theme.textPrimary }]}>🏋️ Gold's Gym (Falnir Road)</Text>
                    <Text style={[styles.turnstileStatusText, { color: theme.green }]}>● Gate Online</Text>
                  </View>
                  <Text style={[styles.gymNetworkStats, { color: theme.textMuted }]}>
                    Today's Check-ins: <Text style={{ color: theme.textPrimary, fontWeight: 'bold' }}>52</Text> • Floor Crowd: 48%
                  </Text>
                </View>

                <View style={[styles.gymNetworkCard, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[styles.gymNetworkName, { color: theme.textPrimary }]}>🏋️ PowerZone Gym (Attavar)</Text>
                    <Text style={[styles.turnstileStatusText, { color: theme.green }]}>● Gate Online</Text>
                  </View>
                  <Text style={[styles.gymNetworkStats, { color: theme.textMuted }]}>
                    Today's Check-ins: <Text style={{ color: theme.textPrimary, fontWeight: 'bold' }}>28</Text> • Floor Crowd: 30%
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CUSTOMER COMPLAINTS & ESCALATIONS                 */}
        {/* ========================================================= */}
        {activeTab === 'tickets' && (
          <>
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: theme.warning }]}>MEMBER SUPPORT TICKETS</Text>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Customer Escalation Hub</Text>
                </View>
                <Text style={[styles.openTicketsNotice, { color: theme.warning }]}>
                  {supportTickets.filter(t => t.status !== 'resolved').length} Pending Resolution
                </Text>
              </View>

              <View style={styles.ticketsList}>
                {supportTickets.map((tck) => {
                  const isResolved = tck.status === 'resolved';
                  return (
                    <View
                      key={tck.id}
                      style={[
                        styles.ticketBox,
                        { backgroundColor: theme.bgPrimary, borderColor: theme.border },
                        !isResolved && { borderLeftColor: theme.warning, borderLeftWidth: 4 },
                      ]}
                    >
                      <View style={styles.ticketTopRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.ticketId, { color: theme.textPrimary }]}>#{tck.id}</Text>
                          <View
                            style={[
                              styles.ticketPriorityBadge,
                              {
                                backgroundColor:
                                  tck.priority === 'urgent'
                                    ? theme.errorMuted
                                    : tck.priority === 'high'
                                    ? theme.warningMuted
                                    : theme.greenMuted,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.ticketPriorityText,
                                {
                                  color:
                                    tck.priority === 'urgent'
                                      ? theme.error
                                      : tck.priority === 'high'
                                      ? theme.warning
                                      : theme.green,
                                },
                              ]}
                            >
                              {tck.priority.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.ticketMemberCode, { color: theme.green }]}>
                          🔒 Member {tck.memberCode}
                        </Text>
                      </View>

                      <Text style={[styles.ticketSubject, { color: theme.textPrimary }]}>{tck.subject}</Text>
                      <Text style={[styles.ticketDesc, { color: theme.textMuted }]}>{tck.description}</Text>

                      {isResolved ? (
                        <View style={[styles.resolvedBanner, { backgroundColor: theme.greenMuted }]}>
                          <Text style={[styles.resolvedBannerText, { color: theme.green }]}>
                            ✓ Resolved: {tck.resolutionNote}
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[styles.resolveTicketBtn, { backgroundColor: theme.green }]}
                          onPress={() => handleResolveTicket(tck)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.resolveTicketText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
                            ✓ Resolve & Credit +1 Apology Meal
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 6: PRIVACY-COMPLIANT SUBSCRIBER AUDIT                */}
        {/* ========================================================= */}
        {activeTab === 'subscribers' && (
          <>
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.sectionTag, { color: theme.green }]}>PRIVACY-FIRST SUBSCRIBER AUDIT</Text>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Active Members Registry</Text>
                </View>
                <View style={[styles.badgePill, { backgroundColor: theme.greenMuted }]}>
                  <Text style={[styles.badgePillText, { color: theme.green }]}>ANONYMIZED</Text>
                </View>
              </View>
              <Text style={[styles.instructionText, { color: theme.textMuted }]}>
                🔒 Personal health data, body composition, and workout logs are strictly encrypted and hidden from administrative views to protect subscriber privacy. Only commercial subscription terms, billing status, and plan validity are audited here.
              </Text>

              <View style={styles.subscribersList}>
                {subscribersAudit.map((sub) => (
                  <View
                    key={sub.id}
                    style={[styles.subAuditRow, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.subCode, { color: theme.textPrimary }]}>{sub.memberCode}</Text>
                        <View style={[styles.planPill, { backgroundColor: theme.greenMuted }]}>
                          <Text style={[styles.planPillText, { color: theme.green }]}>{sub.planTier}</Text>
                        </View>
                      </View>
                      <Text style={[styles.subGym, { color: theme.textMuted }]}>
                        📍 {sub.registeredGym} • Renews {sub.renewalDate}
                      </Text>
                      <Text style={[styles.subBilling, { color: theme.textDim }]}>
                        Paid ₹{sub.grossPaid.toLocaleString('en-IN')} ({sub.billingCycle}) via {sub.paymentGateway}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.creditsUsage, { color: theme.textPrimary }]}>
                        {sub.creditsUsed}/{sub.creditsTotal}
                      </Text>
                      <Text style={[styles.creditsLabel, { color: theme.textMuted }]}>Credits Used</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Global Portal Switcher Footer */}
        <TouchableOpacity
          style={[styles.switchPerspectiveFooter, { borderColor: theme.border }]}
          onPress={() => setRoleModalVisible(true)}
          activeOpacity={0.75}
        >
          <Text style={[styles.switchPerspectiveText, { color: theme.textMuted }]}>
            🔄 Switch Perspective (Member, Gym Admin, or Kitchen Admin)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        visible={roleModalVisible}
        onClose={() => setRoleModalVisible(false)}
      />

      {/* Leakage Incidents Detailed Audit Modal */}
      <Modal
        visible={leakageModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setLeakageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.sectionTag, { color: theme.error }]}>AUDIT TRAIL & LOSS RECOVERY</Text>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Leakage Incident Logs</Text>
              </View>
              <TouchableOpacity
                onPress={() => setLeakageModalVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: theme.bgPrimary }]}
              >
                <Text style={[styles.modalCloseText, { color: theme.textPrimary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <View style={{ gap: 12, paddingVertical: 6 }}>
                {LEAKAGE_INCIDENTS.map((inc) => (
                  <View
                    key={inc.id}
                    style={[styles.leakageDetailCard, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}
                  >
                    <View style={styles.leakageDetailTop}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 20 }}>{inc.emoji}</Text>
                        <View>
                          <Text style={[styles.leakageDetailCat, { color: theme.textPrimary }]}>{inc.category}</Text>
                          <Text style={[styles.leakageDetailId, { color: theme.textDim }]}>{inc.id} • {inc.date}</Text>
                        </View>
                      </View>
                      <Text style={[styles.leakageDetailCost, { color: theme.error }]}>
                        −₹{inc.cost.toLocaleString('en-IN')}
                      </Text>
                    </View>

                    <Text style={[styles.leakageDetailDesc, { color: theme.textMuted }]}>
                      {inc.description}
                    </Text>

                    <View style={[styles.leakageResolutionBanner, { backgroundColor: theme.greenMuted }]}>
                      <Text style={[styles.leakageResolutionText, { color: theme.green }]}>
                        ✓ Resolution: {inc.resolution}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalDoneBtn, { backgroundColor: theme.green }]}
              onPress={() => setLeakageModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalDoneBtnText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
                Close Audit Log
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Marketing Campaign Performance Modal */}
      <Modal
        visible={campaignModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCampaignModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.sectionTag, { color: theme.cyan }]}>PAID CHANNELS & ROAS BREAKDOWN</Text>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Ad Campaign Analytics</Text>
              </View>
              <TouchableOpacity
                onPress={() => setCampaignModalVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: theme.bgPrimary }]}
              >
                <Text style={[styles.modalCloseText, { color: theme.textPrimary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <View style={{ gap: 12, paddingVertical: 6 }}>
                {AD_CAMPAIGNS.map((camp, idx) => (
                  <View
                    key={idx}
                    style={[styles.campaignCard, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}
                  >
                    <View style={styles.campaignHeaderRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 22 }}>{camp.icon}</Text>
                        <View>
                          <Text style={[styles.campaignName, { color: theme.textPrimary }]}>{camp.name}</Text>
                          <Text style={[styles.campaignTag, { color: theme.cyan }]}>{camp.status}</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.campaignRoasLarge, { color: theme.green }]}>{camp.roas}x ROAS</Text>
                        <Text style={[styles.campaignSpendText, { color: theme.textMuted }]}>
                          Spend: ₹{camp.spend.toLocaleString('en-IN')}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.campaignStatsGrid}>
                      <View style={styles.campaignStatBox}>
                        <Text style={[styles.campaignStatLabel, { color: theme.textDim }]}>Impressions</Text>
                        <Text style={[styles.campaignStatVal, { color: theme.textPrimary }]}>{camp.impressions}</Text>
                      </View>
                      <View style={styles.campaignStatBox}>
                        <Text style={[styles.campaignStatLabel, { color: theme.textDim }]}>Clicks</Text>
                        <Text style={[styles.campaignStatVal, { color: theme.textPrimary }]}>{camp.clicks}</Text>
                      </View>
                      <View style={styles.campaignStatBox}>
                        <Text style={[styles.campaignStatLabel, { color: theme.textDim }]}>New Subs</Text>
                        <Text style={[styles.campaignStatVal, { color: theme.green }]}>{camp.newSubscribers}</Text>
                      </View>
                      <View style={styles.campaignStatBox}>
                        <Text style={[styles.campaignStatLabel, { color: theme.textDim }]}>CAC</Text>
                        <Text style={[styles.campaignStatVal, { color: theme.cyan }]}>₹{camp.cac}</Text>
                      </View>
                    </View>

                    <View style={[styles.campaignRevenueBanner, { backgroundColor: theme.greenMuted }]}>
                      <Text style={[styles.campaignRevenueText, { color: theme.green }]}>
                        Generated Inflow: ₹{camp.revenue.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalDoneBtn, { backgroundColor: theme.green }]}
              onPress={() => setCampaignModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalDoneBtnText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
                Close Campaign Analytics
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    flexShrink: 1,
  },
  hqLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hqLogoEmoji: {
    fontSize: 22,
  },
  hqTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  superPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  superPillText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  hqSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },

  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchRoleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  switchRoleText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  navScrollWrapper: {
    borderBottomWidth: 1,
  },
  navScroll: {
    paddingHorizontal: 12,
  },
  navTab: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  navTabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  contentContainer: {
    padding: 16,
    gap: 14,
  },

  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  highlightCard: {
    borderWidth: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sectionTag: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  bigStatAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  bigStatSub: {
    fontSize: 12,
    marginBottom: 14,
  },

  metricGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 9,
  },

  waterfallList: {
    gap: 10,
    marginTop: 8,
  },
  waterfallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  waterfallName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  waterfallDesc: {
    fontSize: 11,
    marginTop: 1,
  },
  waterfallAmt: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },

  settlementPartnerCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  partnerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  partnerMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  partnerDueAmt: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  executePayoutBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  executePayoutText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  scheduleInfo: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  dispatchPillGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  statusPillBox: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statusPillNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusPillLabel: {
    fontSize: 10,
    fontWeight: '500',
  },

  kitchenAuditList: {
    gap: 10,
    marginTop: 6,
  },
  kitchenAuditItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  kitchenAuditName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  kitchenAuditLocation: {
    fontSize: 11,
    marginTop: 1,
  },
  kitchenAuditScore: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  gymNetworksList: {
    gap: 10,
    marginTop: 8,
  },
  gymNetworkCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  gymNetworkName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  turnstileStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  gymNetworkStats: {
    fontSize: 11,
  },

  openTicketsNotice: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  ticketsList: {
    gap: 10,
    marginTop: 6,
  },
  ticketBox: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  ticketTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketId: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  ticketPriorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ticketPriorityText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  ticketMemberCode: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  ticketSubject: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  ticketDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  resolvedBanner: {
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  resolvedBannerText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  resolveTicketBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  resolveTicketText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  subscribersList: {
    gap: 8,
    marginTop: 6,
  },
  subAuditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  subCode: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  planPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  planPillText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  subGym: {
    fontSize: 11,
    marginTop: 2,
  },
  subBilling: {
    fontSize: 10,
    marginTop: 1,
  },
  creditsUsage: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  creditsLabel: {
    fontSize: 10,
  },

  switchPerspectiveFooter: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: 6,
  },
  switchPerspectiveText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // ── Financial Analytics & Executive Grid ──
  timeframeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  timeframeLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  timeframePills: {
    flexDirection: 'row',
    gap: 6,
  },
  timeframePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeframePillText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  periodHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  periodTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  periodSub: {
    fontSize: 11,
    marginTop: 2,
  },
  exportBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  execGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  execCard: {
    width: '48.5%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  execCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  execCardTag: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  execCardVal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  execCardSub: {
    fontSize: 10,
    marginTop: 1,
  },

  subtotalBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 4,
  },
  subtotalTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  subtotalSub: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  subtotalAmt: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  netProfitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 6,
  },
  netProfitTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  netProfitSub: {
    fontSize: 11,
    marginTop: 1,
  },
  netProfitAmt: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  roasGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  roasBox: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  roasBoxTag: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  roasBoxVal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  roasBoxSub: {
    fontSize: 9,
    textAlign: 'center',
  },

  unitEconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  unitEconItem: {
    width: '48.5%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
  },
  unitEconLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  unitEconVal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  unitEconSub: {
    fontSize: 9,
  },

  channelPreviewList: {
    gap: 8,
    marginTop: 10,
  },
  channelPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  channelName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  channelMeta: {
    fontSize: 10,
    marginTop: 2,
  },
  channelRoas: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  channelStatus: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },

  costProgressBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 10,
  },
  costBarSegment: {
    height: '100%',
  },
  costingTable: {
    gap: 6,
    marginTop: 4,
  },
  costingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    gap: 8,
  },
  costColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  costingLabel: {
    flex: 1,
    fontSize: 12,
  },
  costingShare: {
    fontSize: 11,
    width: 44,
    textAlign: 'right',
  },
  costingAmt: {
    fontSize: 12,
    width: 55,
    textAlign: 'right',
  },

  leakageNotice: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  leakageMiniList: {
    gap: 6,
  },
  leakageMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  leakageCategory: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  leakageDate: {
    fontSize: 10,
    marginTop: 1,
  },
  leakageCost: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  // ── Modals ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalDoneBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  modalDoneBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  leakageDetailCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  leakageDetailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leakageDetailCat: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  leakageDetailId: {
    fontSize: 10,
  },
  leakageDetailCost: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  leakageDetailDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  leakageResolutionBanner: {
    padding: 8,
    borderRadius: 8,
    marginTop: 2,
  },
  leakageResolutionText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  campaignCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  campaignHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  campaignName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  campaignTag: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  campaignRoasLarge: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  campaignSpendText: {
    fontSize: 10,
    marginTop: 1,
  },
  campaignStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  campaignStatBox: {
    alignItems: 'center',
  },
  campaignStatLabel: {
    fontSize: 10,
  },
  campaignStatVal: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  campaignRevenueBanner: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  campaignRevenueText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

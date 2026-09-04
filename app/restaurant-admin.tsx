import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';
import { useTheme } from '@/hooks/useTheme';
import RoleSwitcherModal from '@/components/RoleSwitcherModal';
import type { KitchenOrderStatus, PayoutTransaction } from '@/types';

// Mock Restaurant/Kitchen Payout Transactions
const INITIAL_KITCHEN_TRANSACTIONS: PayoutTransaction[] = [
  {
    id: 'TXN-KIT-7732',
    date: '01 Sep 2024',
    amount: 46200,
    status: 'settled',
    destinationAccount: 'ICICI Bank ****8821',
    description: 'Bi-Weekly Meal Reimbursement (210 meals × ₹220)',
    unitsCount: 210,
    ratePerUnit: 220,
  },
  {
    id: 'TXN-KIT-7681',
    date: '18 Aug 2024',
    amount: 52800,
    status: 'settled',
    destinationAccount: 'ICICI Bank ****8821',
    description: 'Bi-Weekly Meal Reimbursement (240 meals × ₹220)',
    unitsCount: 240,
    ratePerUnit: 220,
  },
  {
    id: 'TXN-KIT-7610',
    date: '04 Aug 2024',
    amount: 48400,
    status: 'settled',
    destinationAccount: 'ICICI Bank ****8821',
    description: 'Bi-Weekly Meal Reimbursement (220 meals × ₹220)',
    unitsCount: 220,
    ratePerUnit: 220,
  },
  {
    id: 'TXN-KIT-PENDING',
    date: '04 Sep 2024 (Today)',
    amount: 34200,
    status: 'pending',
    destinationAccount: 'ICICI Bank ****8821',
    description: 'Accrued Meal Dispatches (155 meals + packaging split)',
    unitsCount: 155,
    ratePerUnit: 220,
  },
];

export default function RestaurantAdminDashboard() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const {
    kitchenOrders,
    advanceOrderStatus,
    isDarkMode,
    toggleTheme,
    kitchenPendingPayout,
    kitchenSettledPayout,
  } = useGymFoodieStore();

  const [activeTab, setActiveTab] = useState<'operations' | 'payments'>('operations');
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<KitchenOrderStatus | 'all'>('all');

  // Payout states from store
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(INITIAL_KITCHEN_TRANSACTIONS);

  // KPI Calculations
  const totalCount = kitchenOrders.length;
  const preparingCount = kitchenOrders.filter((o) => o.status === 'preparing').length;
  const readyCount = kitchenOrders.filter((o) => o.status === 'ready').length;
  const outCount = kitchenOrders.filter((o) => o.status === 'out_for_delivery').length;
  const deliveredCount = kitchenOrders.filter((o) => o.status === 'delivered').length;

  // Filtered orders
  const displayedOrders = filterStatus === 'all'
    ? kitchenOrders
    : kitchenOrders.filter((o) => o.status === filterStatus);

  const getStatusBadge = (status: KitchenOrderStatus) => {
    switch (status) {
      case 'preparing':
        return { label: '🔥 Preparing', color: theme.warning, bg: theme.warningMuted };
      case 'ready':
        return { label: '📦 Ready for Courier', color: theme.cyan, bg: 'rgba(6,182,212,0.15)' };
      case 'out_for_delivery':
        return { label: '🛵 On The Way', color: theme.purple, bg: theme.purpleMuted };
      case 'delivered':
        return { label: '✅ Delivered', color: theme.green, bg: theme.greenMuted };
    }
  };

  const getNextActionText = (status: KitchenOrderStatus) => {
    switch (status) {
      case 'preparing':
        return 'Pack & Mark Ready ➔';
      case 'ready':
        return 'Handover to Courier ➔';
      case 'out_for_delivery':
        return 'Confirm Delivery (+₹220) ➔';
      case 'delivered':
        return '↺ Reset to Preparing (Demo)';
    }
  };

  const handleAdvance = (orderId: string, customerName: string, currentStatus: KitchenOrderStatus) => {
    advanceOrderStatus(orderId);
    let msg = '';
    if (currentStatus === 'preparing') {
      msg = `Order for ${customerName} packed and ready for courier pickup!`;
    } else if (currentStatus === 'ready') {
      msg = `Order for ${customerName} handed to courier for delivery!`;
    } else if (currentStatus === 'out_for_delivery') {
      msg = `Order for ${customerName} delivered! +₹220 reimbursement credited to pending payout balance.`;
    } else {
      msg = `Order reset for demo testing.`;
    }
    Alert.alert('Status Updated 🍳', msg);
  };

  // Instant Settle for Kitchen
  const handleRequestKitchenPayout = () => {
    Alert.alert(
      'Weekly Kitchen Reimbursement 👑',
      `Diet & Protein Central Kitchen meal payouts are released every Friday by GymFoodie Main Admin. You can switch to the GymFoodie HQ dashboard to execute the weekly batch release immediately!`,
      [
        { text: 'OK', style: 'cancel' },
        { text: 'Open GymFoodie HQ ➔', onPress: () => router.push('/super-admin') },
      ]
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.bgPrimary }]}>
      {/* Top Navigation Bar */}
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
        <View style={styles.partnerInfo}>
          <View style={[styles.kitchenIconCircle, { backgroundColor: 'rgba(6,182,212,0.15)', borderColor: theme.cyan }]}>
            <Text style={styles.kitchenIconEmoji}>🍳</Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.kitchenTitle, { color: theme.textPrimary }]}>Diet & Protein</Text>
              <View style={[styles.livePill, { backgroundColor: theme.greenMuted }]}>
                <Text style={[styles.livePillText, { color: theme.green }]}>● DISPATCH LIVE</Text>
              </View>
            </View>
            <Text style={[styles.kitchenBranch, { color: theme.textMuted }]}>
              Central Prep Kitchen • Mangaluru Hub
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}
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

      {/* Segmented Tab Bar (Operations vs Payments) */}
      <View style={[styles.tabBarWrapper, { backgroundColor: theme.bgCard, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeTab === 'operations' && { borderBottomColor: theme.green, borderBottomWidth: 3 },
          ]}
          onPress={() => setActiveTab('operations')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              { color: activeTab === 'operations' ? theme.green : theme.textMuted },
            ]}
          >
            🍳 Dispatch Queue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeTab === 'payments' && { borderBottomColor: theme.green, borderBottomWidth: 3 },
          ]}
          onPress={() => setActiveTab('payments')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              { color: activeTab === 'payments' ? theme.green : theme.textMuted },
            ]}
          >
            💰 Meal Revenue (₹{(kitchenSettledPayout + kitchenPendingPayout).toLocaleString('en-IN')})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'operations' ? (
          <>
            {/* KPI Counter Row */}
            <View style={[styles.kpiContainer, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.kpiHeaderRow}>
                <Text style={[styles.kpiMainLabel, { color: theme.textMuted }]}>TODAY'S DISPATCH METRICS</Text>
                <Text style={[styles.kpiTotalText, { color: theme.textPrimary }]}>
                  {totalCount} Total Planned
                </Text>
              </View>
              <View style={styles.kpiBoxes}>
                <TouchableOpacity
                  style={[
                    styles.kpiBox,
                    { backgroundColor: theme.bgPrimary, borderColor: theme.border },
                    filterStatus === 'preparing' && { borderColor: theme.warning, borderWidth: 2 },
                  ]}
                  onPress={() => setFilterStatus(filterStatus === 'preparing' ? 'all' : 'preparing')}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.kpiNum, { color: theme.warning }]}>{preparingCount}</Text>
                  <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>Preparing</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.kpiBox,
                    { backgroundColor: theme.bgPrimary, borderColor: theme.border },
                    filterStatus === 'ready' && { borderColor: theme.cyan, borderWidth: 2 },
                  ]}
                  onPress={() => setFilterStatus(filterStatus === 'ready' ? 'all' : 'ready')}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.kpiNum, { color: theme.cyan }]}>{readyCount}</Text>
                  <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>Ready</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.kpiBox,
                    { backgroundColor: theme.bgPrimary, borderColor: theme.border },
                    filterStatus === 'out_for_delivery' && { borderColor: theme.purple, borderWidth: 2 },
                  ]}
                  onPress={() => setFilterStatus(filterStatus === 'out_for_delivery' ? 'all' : 'out_for_delivery')}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.kpiNum, { color: theme.purple }]}>{outCount}</Text>
                  <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>On Bike</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.kpiBox,
                    { backgroundColor: theme.bgPrimary, borderColor: theme.border },
                    filterStatus === 'delivered' && { borderColor: theme.green, borderWidth: 2 },
                  ]}
                  onPress={() => setFilterStatus(filterStatus === 'delivered' ? 'all' : 'delivered')}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.kpiNum, { color: theme.green }]}>{deliveredCount}</Text>
                  <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>Delivered</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Live Order Queue Header & Filter reset */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Live Kitchen Tickets ({displayedOrders.length})
                </Text>
                <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
                  {filterStatus === 'all' ? 'Showing all active orders' : `Filtered: ${filterStatus}`}
                </Text>
              </View>
              {filterStatus !== 'all' && (
                <TouchableOpacity onPress={() => setFilterStatus('all')}>
                  <Text style={[styles.clearFilterText, { color: theme.green }]}>Show All ✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Live Kitchen Order Tickets */}
            <View style={styles.ordersList}>
              {displayedOrders.map((ord) => {
                const badge = getStatusBadge(ord.status);
                const actionText = getNextActionText(ord.status);

                return (
                  <View
                    key={ord.id}
                    style={[styles.ticketCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
                  >
                    {/* Ticket Top Info */}
                    <View style={styles.ticketTopRow}>
                      <View style={styles.customerBlock}>
                        <Text style={[styles.customerName, { color: theme.textPrimary }]}>
                          {ord.customerName}
                        </Text>
                        <Text style={[styles.customerPhone, { color: theme.textMuted }]}>
                          {ord.customerPhone} • {ord.deliverySlot}
                        </Text>
                      </View>
                      <View style={[styles.statusPill, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.statusPillText, { color: badge.color }]}>{badge.label}</Text>
                      </View>
                    </View>

                    {/* Meal Info */}
                    <View style={[styles.mealBanner, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                      <Text style={styles.mealEmoji}>{ord.mealEmoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.mealTitle, { color: theme.textPrimary }]}>{ord.mealName}</Text>
                        <Text style={[styles.macroSpecs, { color: theme.textMuted }]}>
                          {ord.calories} kcal • <Text style={{ color: theme.green, fontWeight: 'bold' }}>{ord.protein}g Protein</Text>
                        </Text>
                      </View>
                    </View>

                    {/* Delivery & Special Notes */}
                    <View style={styles.detailsRow}>
                      <Text style={[styles.detailText, { color: theme.textMuted }]}>
                        📍 {ord.deliveryAddress}
                      </Text>
                      <Text style={[styles.detailText, { color: theme.textMuted }]}>
                        🛵 Assigned: <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>{ord.courierName}</Text>
                      </Text>
                      {ord.specialNotes && (
                        <View style={[styles.notesBadge, { backgroundColor: theme.warningMuted }]}>
                          <Text style={[styles.notesText, { color: theme.warning }]}>
                            ⚠️ Special Request: {ord.specialNotes}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* 1-Tap Status Advancement Action Button */}
                    <TouchableOpacity
                      style={[
                        styles.advanceBtn,
                        {
                          backgroundColor:
                            ord.status === 'delivered'
                              ? theme.border
                              : ord.status === 'out_for_delivery'
                              ? theme.purple
                              : theme.green,
                        },
                      ]}
                      onPress={() => handleAdvance(ord.id, ord.customerName, ord.status)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.advanceBtnText,
                          { color: ord.status === 'delivered' ? theme.textPrimary : (theme.isDark ? '#090D16' : '#FFFFFF') },
                        ]}
                      >
                        {actionText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            {/* Batch Kitchen Prep Summary */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.cardTag, { color: theme.textMuted }]}>BATCH COOKING SUMMARY</Text>
              <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Portions in Prep Right Now</Text>

              <View style={styles.batchRows}>
                <View style={styles.batchItem}>
                  <Text style={{ fontSize: 20 }}>🍗</Text>
                  <Text style={[styles.batchName, { color: theme.textPrimary }]}>Grilled Herb Chicken & Quinoa</Text>
                  <Text style={[styles.batchCount, { color: theme.green }]}>24 portions</Text>
                </View>
                <View style={styles.batchItem}>
                  <Text style={{ fontSize: 20 }}>🧆</Text>
                  <Text style={[styles.batchName, { color: theme.textPrimary }]}>Teriyaki Paneer & Brown Rice</Text>
                  <Text style={[styles.batchCount, { color: theme.green }]}>12 portions</Text>
                </View>
                <View style={styles.batchItem}>
                  <Text style={{ fontSize: 20 }}>🌯</Text>
                  <Text style={[styles.batchName, { color: theme.textPrimary }]}>Egg White Burrito Bowl</Text>
                  <Text style={[styles.batchCount, { color: theme.green }]}>8 portions</Text>
                </View>
              </View>
            </View>

            {/* Courier Fleet Overview */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.cardTag, { color: theme.textMuted }]}>DISPATCH LOGISTICS</Text>
              <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Active Delivery Fleet</Text>

              <View style={styles.fleetRow}>
                <View style={[styles.courierCard, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={{ fontSize: 22 }}>🛵</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.courierName, { color: theme.textPrimary }]}>Courier Karan</Text>
                    <Text style={[styles.courierSub, { color: theme.green }]}>On Bike • 3 bags active</Text>
                  </View>
                </View>
                <View style={[styles.courierCard, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={{ fontSize: 22 }}>🛴</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.courierName, { color: theme.textPrimary }]}>Courier Sachin</Text>
                    <Text style={[styles.courierSub, { color: theme.green }]}>EV Scooter • 2 bags active</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          /* ========================================================= */
          /* PAYMENTS & REVENUE DASHBOARD FOR RESTAURANT ADMIN         */
          /* ========================================================= */
          <>
            {/* Big Financial Overview Banner */}
            <View style={[styles.card, styles.earningsHighlightCard, { backgroundColor: theme.bgCard, borderColor: theme.green }]}>
              <Text style={[styles.cardTag, { color: theme.green }]}>KITCHEN SETTLEMENT (SEPTEMBER 2024)</Text>
              <Text style={[styles.bigEarningsAmount, { color: theme.textPrimary }]}>
                ₹{(kitchenSettledPayout + kitchenPendingPayout).toLocaleString('en-IN')}
              </Text>
              <Text style={[styles.earningsSubtext, { color: theme.textMuted }]}>
                Total Diet & Protein Kitchen payout generated via GymFoodie meal plan subscriptions
              </Text>

              {/* Settlement Progress Grid */}
              <View style={styles.settlementGrid}>
                <View style={[styles.settlementBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.settlementBoxLabel, { color: theme.textMuted }]}>Disbursed to Bank</Text>
                  <Text style={[styles.settlementBoxVal, { color: theme.green }]}>
                    ₹{kitchenSettledPayout.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.settlementBoxSub, { color: theme.textDim }]}>Direct IMPS Settled</Text>
                </View>

                <View style={[styles.settlementBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.settlementBoxLabel, { color: theme.textMuted }]}>Unsettled Balance</Text>
                  <Text style={[styles.settlementBoxVal, { color: theme.warning }]}>
                    ₹{kitchenPendingPayout.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.settlementBoxSub, { color: theme.textDim }]}>Accruing per dispatch</Text>
                </View>
              </View>

              {/* Request Payout Action */}
              <TouchableOpacity
                style={[styles.payoutActionBtn, { backgroundColor: theme.green }]}
                onPress={handleRequestKitchenPayout}
                activeOpacity={0.8}
              >
                <Text style={[styles.payoutActionText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
                  ⚡ Weekly Payout Managed by HQ (Pending: ₹{kitchenPendingPayout.toLocaleString('en-IN')})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Commercial Model Breakdown */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.cardTag, { color: theme.textMuted }]}>REIMBURSEMENT RATE CARD</Text>
              <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Kitchen Commercial Split</Text>

              <View style={styles.revenueModelList}>
                <View style={[styles.revenueModelItem, { borderBottomColor: theme.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.revenueModelTitle, { color: theme.textPrimary }]}>
                      Gourmet Macro Meal Unit Reimbursement
                    </Text>
                    <Text style={[styles.revenueModelSub, { color: theme.textMuted }]}>
                      Fixed payout per chef-prepared macro box (720 meals fulfilled this month)
                    </Text>
                  </View>
                  <Text style={[styles.revenueModelAmt, { color: theme.green }]}>₹220 / meal</Text>
                </View>

                <View style={[styles.revenueModelItem, { borderBottomColor: theme.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.revenueModelTitle, { color: theme.textPrimary }]}>
                      Thermal Packaging & Eco-Box Subsidy
                    </Text>
                    <Text style={[styles.revenueModelSub, { color: theme.textMuted }]}>
                      Subsidized by GymFoodie for insulated eco-friendly containers
                    </Text>
                  </View>
                  <Text style={[styles.revenueModelAmt, { color: theme.green }]}>₹25 / order</Text>
                </View>

                <View style={styles.revenueModelItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.revenueModelTitle, { color: theme.textPrimary }]}>
                      Performance Quality Bonus
                    </Text>
                    <Text style={[styles.revenueModelSub, { color: theme.textMuted }]}>
                      Maintained 4.9⭐ athlete rating bonus for August-September
                    </Text>
                  </View>
                  <Text style={[styles.revenueModelAmt, { color: theme.green }]}>₹10,000 bonus</Text>
                </View>
              </View>
            </View>

            {/* Linked Bank Account Details */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTag, { color: theme.textMuted }]}>KITCHEN BENEFICIARY ACCOUNT</Text>
                  <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Verified Bank Account</Text>
                </View>
                <View style={[styles.verifiedPill, { backgroundColor: theme.greenMuted }]}>
                  <Text style={[styles.verifiedPillText, { color: theme.green }]}>✓ Auto-Settlement Active</Text>
                </View>
              </View>

              <View style={[styles.bankDetailsBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                <Text style={[styles.bankName, { color: theme.textPrimary }]}>
                  🏦 ICICI Bank Ltd. — Kadri Main Road Branch
                </Text>
                <Text style={[styles.bankAcc, { color: theme.textMuted }]}>
                  Account: <Text style={{ color: theme.textPrimary, fontWeight: 'bold' }}>•••• •••• •••• 8821</Text>
                </Text>
                <Text style={[styles.bankIfsc, { color: theme.textMuted }]}>
                  IFSC: <Text style={{ color: theme.textPrimary }}>ICIC0001290</Text> • Current Account (FSSAI Reg: 212230040001)
                </Text>
              </View>
            </View>

            {/* Kitchen Payout Transaction Ledger */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTag, { color: theme.textMuted }]}>REIMBURSEMENT LOG</Text>
                  <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Settlement History</Text>
                </View>
                <TouchableOpacity
                  onPress={() => Alert.alert('Export Statement', 'September GST & TDS Meal Statement exported as PDF.')}
                >
                  <Text style={[styles.downloadLink, { color: theme.green }]}>📥 Download Statement</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.txnsList}>
                {transactions.map((txn) => (
                  <View
                    key={txn.id}
                    style={[styles.txnRow, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.txnId, { color: theme.textPrimary }]}>{txn.id}</Text>
                        <View
                          style={[
                            styles.txnStatusBadge,
                            {
                              backgroundColor:
                                txn.status === 'settled'
                                  ? theme.greenMuted
                                  : txn.status === 'processing'
                                  ? theme.purpleMuted
                                  : theme.warningMuted,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.txnStatusText,
                              {
                                color:
                                  txn.status === 'settled'
                                    ? theme.green
                                    : txn.status === 'processing'
                                    ? theme.purple
                                    : theme.warning,
                              },
                            ]}
                          >
                            {txn.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.txnDesc, { color: theme.textMuted }]}>{txn.description}</Text>
                      <Text style={[styles.txnDate, { color: theme.textDim }]}>
                        {txn.date} • {txn.destinationAccount}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.txnAmount, { color: theme.textPrimary }]}>
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => Alert.alert('Settlement Voucher', `Meal settlement voucher #${txn.id} for ₹${txn.amount} authorized by GymFoodie Logistics.`)}
                      >
                        <Text style={[styles.viewReceiptText, { color: theme.green }]}>Voucher ›</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Switch Portal Footer */}
        <TouchableOpacity
          style={[styles.switchPerspectiveFooter, { borderColor: theme.border }]}
          onPress={() => setRoleModalVisible(true)}
          activeOpacity={0.75}
        >
          <Text style={[styles.switchPerspectiveText, { color: theme.textMuted }]}>
            🔄 Switch Perspective (Member or Gym Admin)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        visible={roleModalVisible}
        onClose={() => setRoleModalVisible(false)}
      />
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
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  kitchenIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kitchenIconEmoji: {
    fontSize: 22,
  },
  kitchenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  livePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  livePillText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  kitchenBranch: {
    fontSize: 11,
    marginTop: 1,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
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

  tabBarWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  scrollContent: {
    padding: 16,
    gap: 14,
  },

  kpiContainer: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  kpiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiMainLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  kpiTotalText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  kpiBoxes: {
    flexDirection: 'row',
    gap: 8,
  },
  kpiBox: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  kpiNum: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '500',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  sectionSub: {
    fontSize: 11,
    marginTop: 1,
  },
  clearFilterText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  ordersList: {
    gap: 12,
  },
  ticketCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  ticketTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  customerBlock: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  customerPhone: {
    fontSize: 11,
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  mealBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  mealEmoji: {
    fontSize: 24,
  },
  mealTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  macroSpecs: {
    fontSize: 11,
    marginTop: 2,
  },

  detailsRow: {
    gap: 4,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 11,
  },
  notesBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  notesText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  advanceBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  advanceBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  batchRows: {
    gap: 8,
  },
  batchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  batchName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  batchCount: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  fleetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  courierCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  courierName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  courierSub: {
    fontSize: 10,
    marginTop: 1,
  },

  // Payments styling
  earningsHighlightCard: {
    borderWidth: 2,
  },
  bigEarningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  earningsSubtext: {
    fontSize: 12,
    marginBottom: 14,
  },
  settlementGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  settlementBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  settlementBoxLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settlementBoxVal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  settlementBoxSub: {
    fontSize: 10,
  },
  payoutActionBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  payoutActionText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  revenueModelList: {
    gap: 10,
    marginTop: 4,
  },
  revenueModelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  revenueModelTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  revenueModelSub: {
    fontSize: 11,
    marginTop: 2,
  },
  revenueModelAmt: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  verifiedPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedPillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  bankDetailsBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  bankName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  bankAcc: {
    fontSize: 12,
  },
  bankIfsc: {
    fontSize: 11,
  },

  downloadLink: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  txnsList: {
    gap: 10,
    marginTop: 4,
  },
  txnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  txnId: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  txnStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  txnStatusText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  txnDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  txnDate: {
    fontSize: 10,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  viewReceiptText: {
    fontSize: 11,
    fontWeight: 'bold',
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
});

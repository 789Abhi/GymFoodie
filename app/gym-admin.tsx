import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';
import { useTheme } from '@/hooks/useTheme';
import RoleSwitcherModal from '@/components/RoleSwitcherModal';
import type { PayoutTransaction } from '@/types';

// Mock Gym Payout Transactions
const INITIAL_GYM_TRANSACTIONS: PayoutTransaction[] = [
  {
    id: 'TXN-GYM-9821',
    date: '01 Sep 2024',
    amount: 38400,
    status: 'settled',
    destinationAccount: 'HDFC Bank ****4102',
    description: 'Weekly Turnstile Settlement (320 check-ins)',
    unitsCount: 320,
    ratePerUnit: 120,
  },
  {
    id: 'TXN-GYM-9750',
    date: '25 Aug 2024',
    amount: 42600,
    status: 'settled',
    destinationAccount: 'HDFC Bank ****4102',
    description: 'Weekly Turnstile Settlement + VIP Pool Share',
    unitsCount: 355,
    ratePerUnit: 120,
  },
  {
    id: 'TXN-GYM-9689',
    date: '18 Aug 2024',
    amount: 36000,
    status: 'settled',
    destinationAccount: 'HDFC Bank ****4102',
    description: 'Weekly Turnstile Settlement (300 check-ins)',
    unitsCount: 300,
    ratePerUnit: 120,
  },
  {
    id: 'TXN-GYM-PENDING',
    date: '04 Sep 2024 (Today)',
    amount: 28400,
    status: 'pending',
    destinationAccount: 'HDFC Bank ****4102',
    description: 'Accrued Check-in Balance (236 turnstile scans)',
    unitsCount: 236,
    ratePerUnit: 120,
  },
];

export default function GymAdminDashboard() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const {
    gymOccupancy,
    adjustOccupancy,
    gymVisitors,
    admitMember,
    isDarkMode,
    toggleTheme,
    gymPendingPayout,
    gymSettledPayout,
  } = useGymFoodieStore();

  const [activeTab, setActiveTab] = useState<'operations' | 'payments'>('operations');
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [manualPassId, setManualPassId] = useState('');
  const [manualName, setManualName] = useState('');
  const [lastScannedMember, setLastScannedMember] = useState<string | null>(null);

  // Financial calculations from store
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(INITIAL_GYM_TRANSACTIONS);

  // Quick simulate member scan
  const handleSimulateScan = () => {
    admitMember('#GF-8921', 'Abhishek TK');
    setLastScannedMember('Abhishek TK (#GF-8921)');
    Alert.alert('Turnstile Unlocked! 🟢', 'Member Abhishek TK (#GF-8921) verified. Check-in payout +₹120 credited to pending balance.');
  };

  // Manual pass entry
  const handleManualAdmit = () => {
    if (!manualPassId.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid Pass ID (e.g. GF-8921).');
      return;
    }
    const name = manualName.trim() || 'Walk-in Member';
    admitMember(manualPassId.trim(), name);
    setLastScannedMember(`${name} (${manualPassId.trim()})`);
    setManualPassId('');
    setManualName('');
    Alert.alert('Pass Verified! 🟢', `Member ${name} admitted successfully. +₹120 credited to pending balance.`);
  };

  // Fast-track request to GymFoodie HQ
  const handleRequestPayout = () => {
    Alert.alert(
      'Weekly Cycle Managed by HQ 👑',
      `Iron House Gym payouts are released every Friday by GymFoodie Main Admin. You can switch to the GymFoodie HQ dashboard to execute the weekly batch release immediately!`,
      [
        { text: 'OK', style: 'cancel' },
        { text: 'Open GymFoodie HQ ➔', onPress: () => router.push('/super-admin') },
      ]
    );
  };

  const occupancyPercentage = Math.min(100, Math.round((gymOccupancy / 100) * 100));

  return (
    <View style={[styles.screen, { backgroundColor: theme.bgPrimary }]}>
      {/* Top Bar */}
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
          <View style={[styles.gymIconCircle, { backgroundColor: theme.greenMuted, borderColor: theme.green }]}>
            <Text style={styles.gymIconEmoji}>🏋️‍♂️</Text>
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.gymTitle, { color: theme.textPrimary }]}>Iron House Gym</Text>
              <View style={[styles.livePill, { backgroundColor: theme.greenMuted }]}>
                <Text style={[styles.livePillText, { color: theme.green }]}>● LIVE</Text>
              </View>
            </View>
            <Text style={[styles.gymBranch, { color: theme.textMuted }]}>
              Partner Portal • Mangaluru Turnstiles
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
            ⚡ Live Operations
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
            💰 Payouts (₹{(gymSettledPayout + gymPendingPayout).toLocaleString('en-IN')})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'operations' ? (
          <>
            {/* Turnstile Scanner Simulation Widget */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTag, { color: theme.green }]}>HARDWARE TURNSTILE INTERFACE</Text>
                  <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>NFC & QR Turnstile Scanner</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: theme.greenMuted }]}>
                  <Text style={[styles.statusBadgeText, { color: theme.green }]}>ONLINE • SYNCED</Text>
                </View>
              </View>

              {/* Scanner Visual Screen */}
              <View style={[styles.scannerMonitor, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                <Text style={styles.scannerEmoji}>📱 ➔ 📟</Text>
                <Text style={[styles.scannerStatusTitle, { color: theme.textPrimary }]}>
                  Gate 1 Ready for Turnstile NFC Wave
                </Text>
                <Text style={[styles.scannerStatusSub, { color: theme.textMuted }]}>
                  Auto-scans dynamic QR codes & member passes (+₹120 per scan)
                </Text>
                {lastScannedMember && (
                  <View style={[styles.lastScannedBanner, { backgroundColor: theme.greenMuted, borderColor: theme.green }]}>
                    <Text style={[styles.lastScannedText, { color: theme.green }]}>
                      ✓ Recently Admitted: {lastScannedMember}
                    </Text>
                  </View>
                )}
              </View>

              {/* 1-Tap Quick Member Scan Simulation */}
              <TouchableOpacity
                style={[styles.simulateScanBtn, { backgroundColor: theme.green }]}
                onPress={handleSimulateScan}
                activeOpacity={0.8}
              >
                <Text style={[styles.simulateScanText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
                  ⚡ Quick Scan Member (#GF-8921 Abhishek TK)
                </Text>
              </TouchableOpacity>

              {/* Manual Member Verification Form */}
              <View style={[styles.manualFormBox, { borderTopColor: theme.border }]}>
                <Text style={[styles.manualFormLabel, { color: theme.textMuted }]}>
                  OR MANUAL VERIFICATION / WALK-IN:
                </Text>
                <View style={styles.manualInputRow}>
                  <TextInput
                    style={[styles.manualInput, { backgroundColor: theme.bgPrimary, borderColor: theme.border, color: theme.textPrimary }]}
                    placeholder="Pass ID (e.g. GF-8921)"
                    placeholderTextColor={theme.textDim}
                    value={manualPassId}
                    onChangeText={setManualPassId}
                    autoCapitalize="characters"
                  />
                  <TextInput
                    style={[styles.manualInput, { backgroundColor: theme.bgPrimary, borderColor: theme.border, color: theme.textPrimary }]}
                    placeholder="Member Name"
                    placeholderTextColor={theme.textDim}
                    value={manualName}
                    onChangeText={setManualName}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.manualAdmitBtn, { borderColor: theme.border }]}
                  onPress={handleManualAdmit}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.manualAdmitText, { color: theme.textPrimary }]}>
                    ✓ Verify & Admit Member
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Live Floor Occupancy Manager */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTag, { color: theme.textMuted }]}>FACILITY HEADCOUNT</Text>
                  <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Live Floor Occupancy</Text>
                </View>
                <Text style={[styles.capacityNumber, { color: theme.green }]}>
                  {gymOccupancy} <Text style={{ fontSize: 13, color: theme.textMuted }}>/ 100 Max</Text>
                </Text>
              </View>

              {/* Progress bar */}
              <View style={[styles.occupancyBarTrack, { backgroundColor: theme.border }]}>
                <View
                  style={[
                    styles.occupancyBarFill,
                    {
                      width: `${occupancyPercentage}%`,
                      backgroundColor: occupancyPercentage > 80 ? theme.error : theme.green,
                    },
                  ]}
                />
              </View>

              <View style={styles.occupancyMetaRow}>
                <Text style={[styles.occupancyNote, { color: theme.textMuted }]}>
                  {occupancyPercentage < 50
                    ? '🟢 Moderate Crowd • Good time to workout'
                    : '🟡 High Activity • Peak Hours Active'}
                </Text>
                <Text style={[styles.occupancyPct, { color: theme.textPrimary }]}>
                  {occupancyPercentage}% Full
                </Text>
              </View>

              {/* Headcount Adjusters */}
              <View style={styles.adjusterRow}>
                <TouchableOpacity
                  style={[styles.adjustBtn, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}
                  onPress={() => adjustOccupancy(-1)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.adjustBtnText, { color: theme.textPrimary }]}>− 1 Member Exit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.adjustBtn, { backgroundColor: theme.greenMuted, borderColor: theme.green }]}
                  onPress={() => adjustOccupancy(1)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.adjustBtnText, { color: theme.green }]}>+ 1 Member Entry</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Today's Check-in Log Table */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTag, { color: theme.textMuted }]}>ATTENDANCE AUDIT</Text>
                  <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>
                    Today's Visitor Log ({gymVisitors.length})
                  </Text>
                </View>
                <Text style={[styles.refreshText, { color: theme.green }]}>Auto-syncing 🟢</Text>
              </View>

              <View style={styles.visitorsList}>
                {gymVisitors.map((vis) => (
                  <View
                    key={vis.id}
                    style={[styles.visitorRow, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}
                  >
                    <View style={[styles.visitorAvatar, { backgroundColor: theme.green }]}>
                      <Text style={[styles.visitorAvatarText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
                        {vis.avatarLetter}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.visitorName, { color: theme.textPrimary }]}>{vis.memberName}</Text>
                      <Text style={[styles.visitorMeta, { color: theme.textMuted }]}>
                        {vis.passId} • {vis.planName}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.visitorTime, { color: theme.textPrimary }]}>{vis.timeIn}</Text>
                      <View style={[styles.admittedBadge, { backgroundColor: theme.greenMuted }]}>
                        <Text style={[styles.admittedBadgeText, { color: theme.green }]}>✓ +₹120</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* ========================================================= */
          /* PAYMENTS & REVENUE DASHBOARD FOR GYM ADMIN               */
          /* ========================================================= */
          <>
            {/* Big Financial Overview Banner */}
            <View style={[styles.card, styles.earningsHighlightCard, { backgroundColor: theme.bgCard, borderColor: theme.green }]}>
              <Text style={[styles.cardTag, { color: theme.green }]}>SETTLEMENT OVERVIEW (SEPTEMBER 2024)</Text>
              <Text style={[styles.bigEarningsAmount, { color: theme.textPrimary }]}>
                ₹{(gymSettledPayout + gymPendingPayout).toLocaleString('en-IN')}
              </Text>
              <Text style={[styles.earningsSubtext, { color: theme.textMuted }]}>
                Total Iron House Gym Revenue earned through GymFoodie
              </Text>

              {/* Settlement Progress Grid */}
              <View style={styles.settlementGrid}>
                <View style={[styles.settlementBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.settlementBoxLabel, { color: theme.textMuted }]}>Settled to Bank</Text>
                  <Text style={[styles.settlementBoxVal, { color: theme.green }]}>
                    ₹{gymSettledPayout.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.settlementBoxSub, { color: theme.textDim }]}>100% Disbursed by HQ</Text>
                </View>

                <View style={[styles.settlementBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                  <Text style={[styles.settlementBoxLabel, { color: theme.textMuted }]}>Pending Settle</Text>
                  <Text style={[styles.settlementBoxVal, { color: theme.warning }]}>
                    ₹{gymPendingPayout.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.settlementBoxSub, { color: theme.textDim }]}>Auto-settles every Friday</Text>
                </View>
              </View>

              {/* Request Payout Action */}
              <TouchableOpacity
                style={[styles.payoutActionBtn, { backgroundColor: theme.green }]}
                onPress={handleRequestPayout}
                activeOpacity={0.8}
              >
                <Text style={[styles.payoutActionText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
                  ⚡ Weekly Payout Managed by HQ (Pending: ₹{gymPendingPayout.toLocaleString('en-IN')})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Payout Mechanism Breakdown */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.cardTag, { color: theme.textMuted }]}>COMMERCIAL REVENUE MODEL</Text>
              <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Partner Split Breakdown</Text>

              <View style={styles.revenueModelList}>
                <View style={[styles.revenueModelItem, { borderBottomColor: theme.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.revenueModelTitle, { color: theme.textPrimary }]}>
                      Turnstile Check-in Fee
                    </Text>
                    <Text style={[styles.revenueModelSub, { color: theme.textMuted }]}>
                      Fixed payout per turnstile unlock (640 scans accrued)
                    </Text>
                  </View>
                  <Text style={[styles.revenueModelAmt, { color: theme.green }]}>₹120 / scan</Text>
                </View>

                <View style={[styles.revenueModelItem, { borderBottomColor: theme.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.revenueModelTitle, { color: theme.textPrimary }]}>
                      Subscription Share
                    </Text>
                    <Text style={[styles.revenueModelSub, { color: theme.textMuted }]}>
                      40% split on active members registered at Iron House Gym
                    </Text>
                  </View>
                  <Text style={[styles.revenueModelAmt, { color: theme.green }]}>₹66,000 / mo</Text>
                </View>

                <View style={styles.revenueModelItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.revenueModelTitle, { color: theme.textPrimary }]}>
                      Designated Trainer Commission
                    </Text>
                    <Text style={[styles.revenueModelSub, { color: theme.textMuted }]}>
                      Coach Rahul macro sync & routine consultation split
                    </Text>
                  </View>
                  <Text style={[styles.revenueModelAmt, { color: theme.green }]}>₹13,200 / mo</Text>
                </View>
              </View>
            </View>

            {/* Linked Bank Account Details */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTag, { color: theme.textMuted }]}>SETTLEMENT RECIPIENT</Text>
                  <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Verified Bank Account</Text>
                </View>
                <View style={[styles.verifiedPill, { backgroundColor: theme.greenMuted }]}>
                  <Text style={[styles.verifiedPillText, { color: theme.green }]}>✓ Auto-Debit Active</Text>
                </View>
              </View>

              <View style={[styles.bankDetailsBox, { backgroundColor: theme.bgPrimary, borderColor: theme.border }]}>
                <Text style={[styles.bankName, { color: theme.textPrimary }]}>
                  🏦 HDFC Bank Ltd. — Kankanady Branch
                </Text>
                <Text style={[styles.bankAcc, { color: theme.textMuted }]}>
                  Account: <Text style={{ color: theme.textPrimary, fontWeight: 'bold' }}>•••• •••• •••• 4102</Text>
                </Text>
                <Text style={[styles.bankIfsc, { color: theme.textMuted }]}>
                  IFSC: <Text style={{ color: theme.textPrimary }}>HDFC0000321</Text> • Direct IMPS enabled
                </Text>
              </View>
            </View>

            {/* Transaction Settlement Log */}
            <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTag, { color: theme.textMuted }]}>DISBURSEMENT LEDGER</Text>
                  <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Payout History</Text>
                </View>
                <TouchableOpacity
                  onPress={() => Alert.alert('Export Invoices', 'Monthly GST Invoice for September downloaded to device.')}
                >
                  <Text style={[styles.downloadLink, { color: theme.green }]}>📥 Download GST Invoices</Text>
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
                        onPress={() => Alert.alert('Receipt', `Settlement reference #${txn.id} for ₹${txn.amount} verified by GymFoodie Financial Gateway.`)}
                      >
                        <Text style={[styles.viewReceiptText, { color: theme.green }]}>Receipt ›</Text>
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
            🔄 Switch Perspective (Member or Kitchen Admin)
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
  gymIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gymIconEmoji: {
    fontSize: 22,
  },
  gymTitle: {
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
  gymBranch: {
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
    fontSize: 17,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },

  scannerMonitor: {
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  scannerEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  scannerStatusTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scannerStatusSub: {
    fontSize: 12,
  },
  lastScannedBanner: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  lastScannedText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  simulateScanBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  simulateScanText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  manualFormBox: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  manualFormLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  manualInput: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    borderWidth: 1,
  },
  manualAdmitBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  manualAdmitText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  capacityNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  occupancyBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  occupancyBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  occupancyMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  occupancyNote: {
    fontSize: 12,
  },
  occupancyPct: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  adjusterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  adjustBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  adjustBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  refreshText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  visitorsList: {
    gap: 8,
  },
  visitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  visitorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  visitorName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  visitorMeta: {
    fontSize: 11,
    marginTop: 1,
  },
  visitorTime: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  admittedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  admittedBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Earnings styling
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

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  ActivityIndicator, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { useBackendFinanceContext } from '@/hooks/useBackendFinanceContext';
import { exchangePublicToken, createLinkToken } from '@/services/financeService';
import { useAlert } from '@/template';

// ── Severity color map ────────────────────────────────
const SEV_COLORS: Record<string, string> = {
  high: Colors.danger,
  medium: Colors.warning,
  low: Colors.primary,
};

// ── Mini Link Modal (simulates Plaid Link UI for sandbox) ─────
function PlaidLinkModal({
  visible, onClose, onLinked,
}: { visible: boolean; onClose: () => void; onLinked: () => void }) {
  const [institutionName, setInstitutionName] = useState('');
  const [publicToken, setPublicToken] = useState('');
  const [linking, setLinking] = useState(false);
  const { showAlert } = useAlert();

  const handleLink = async () => {
    if (!institutionName.trim() || !publicToken.trim()) {
      showAlert('Required', 'Enter both institution name and public token.');
      return;
    }
    setLinking(true);
    try {
      await exchangePublicToken(publicToken.trim(), null, institutionName.trim());
      showAlert('Linked!', `${institutionName} connected. Initial sync started.`);
      onLinked();
      onClose();
    } catch (e: any) {
      showAlert('Link Failed', e.message);
    } finally {
      setLinking(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={link.overlay}>
        <View style={link.sheet}>
          <View style={link.sheetHeader}>
            <Text style={link.sheetTitle}>Connect Bank Account</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={22} color={Colors.textMuted} />
            </Pressable>
          </View>

          <Text style={link.label}>Institution Name</Text>
          <TextInput
            style={link.input}
            value={institutionName}
            onChangeText={setInstitutionName}
            placeholder="Chase, Wells Fargo, ..."
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={link.label}>Plaid Public Token</Text>
          <TextInput
            style={link.input}
            value={publicToken}
            onChangeText={setPublicToken}
            placeholder="public-sandbox-..."
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
          />

          <Text style={link.note}>
            In production this step is handled by the Plaid Link SDK — no credentials are ever entered here.
          </Text>

          <Pressable
            style={({ pressed }) => [link.btn, pressed && { opacity: 0.8 }, linking && { opacity: 0.5 }]}
            onPress={handleLink}
            disabled={linking}
          >
            {linking
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={link.btnText}>Connect Account</Text>}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ── AI Insight Panel ──────────────────────────────────
function InsightPanel({ askInsight, insightAnswer, insightLoading }: {
  askInsight: (q: string) => void;
  insightAnswer: string | null;
  insightLoading: boolean;
}) {
  const [query, setQuery] = useState('');

  const QUICK = [
    'How much did I spend on dining?',
    'What is my biggest expense category?',
    'Am I on track with my budget?',
    'Where can I save the most money?',
  ];

  return (
    <View style={ai.container}>
      <View style={ai.header}>
        <MaterialIcons name="auto-awesome" size={18} color={Colors.gold} />
        <Text style={ai.title}>AI Financial Insight</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ai.quickScroll}>
        {QUICK.map(q => (
          <Pressable key={q} style={({ pressed }) => [ai.chip, pressed && { opacity: 0.7 }]} onPress={() => { setQuery(q); askInsight(q); }}>
            <Text style={ai.chipText}>{q}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={ai.inputRow}>
        <TextInput
          style={ai.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Ask anything about your finances..."
          placeholderTextColor={Colors.textMuted}
          onSubmitEditing={() => query.trim() && askInsight(query.trim())}
          returnKeyType="send"
        />
        <Pressable
          style={({ pressed }) => [ai.sendBtn, pressed && { opacity: 0.7 }]}
          onPress={() => query.trim() && askInsight(query.trim())}
        >
          <MaterialIcons name="send" size={18} color="#fff" />
        </Pressable>
      </View>

      {insightLoading && (
        <View style={ai.answerBox}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={ai.thinking}>Analyzing your finances...</Text>
        </View>
      )}
      {!insightLoading && insightAnswer && (
        <View style={ai.answerBox}>
          <Text style={ai.answer}>{insightAnswer}</Text>
        </View>
      )}
    </View>
  );
}

// ── Main Dashboard Screen ─────────────────────────────
export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const {
    accounts, transactions, alerts,
    loading, syncing, error, unreadAlertCount,
    totalBalance, monthlySpend,
    triggerSync, dismissAlert,
    insightAnswer, insightLoading, askInsight,
    reload, institutions,
  } = useBackendFinanceContext();

  const [linkVisible, setLinkVisible] = useState(false);
  const [txTab, setTxTab] = useState<'all' | 'flagged'>('all');

  const visibleTx = txTab === 'flagged'
    ? transactions.filter(t => t.flagged)
    : transactions.slice(0, 15);

  const hasData = accounts.length > 0 || transactions.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={styles.headerActions}>
          {unreadAlertCount > 0 && (
            <View style={styles.alertBadge}>
              <MaterialIcons name="warning" size={13} color={Colors.warning} />
              <Text style={styles.alertBadgeText}>{unreadAlertCount}</Text>
            </View>
          )}
          <Pressable
            style={({ pressed }) => [styles.syncBtn, pressed && { opacity: 0.7 }, syncing && { opacity: 0.5 }]}
            onPress={triggerSync}
            disabled={syncing}
            hitSlop={8}
          >
            {syncing
              ? <ActivityIndicator size="small" color={Colors.primary} />
              : <MaterialIcons name="sync" size={20} color={Colors.primary} />}
          </Pressable>
          <Pressable style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.8 }]} onPress={() => setLinkVisible(true)}>
            <MaterialIcons name="add-link" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Link Bank</Text>
          </Pressable>
        </View>
      </View>

      {/* Error Banner */}
      {error ? (
        <View style={styles.errorBanner}>
          <MaterialIcons name="error-outline" size={16} color={Colors.danger} />
          <Text style={styles.errorBannerText} numberOfLines={2}>{error}</Text>
          <Pressable onPress={reload} hitSlop={8} accessibilityLabel="Retry">
            <MaterialIcons name="refresh" size={16} color={Colors.danger} />
          </Pressable>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your financial data...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* No accounts — empty state */}
          {!hasData && (
            <View style={styles.emptyState}>
              <MaterialIcons name="account-balance" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No accounts linked yet</Text>
              <Text style={styles.emptySub}>Connect your bank to start tracking spending, alerts, and goals.</Text>
              <Pressable style={({ pressed }) => [styles.addBtnLarge, pressed && { opacity: 0.8 }]} onPress={() => setLinkVisible(true)}>
                <MaterialIcons name="add-link" size={20} color="#fff" />
                <Text style={styles.addBtnText}>Link Your First Bank</Text>
              </Pressable>
            </View>
          )}

          {/* Net Worth Overview */}
          {hasData && (
            <View style={styles.netWorthCard}>
              <Text style={styles.netWorthLabel}>Total Balance</Text>
              <Text style={styles.netWorthValue}>
                {totalBalance < 0 ? '-' : ''}${Math.abs(totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
              <View style={styles.netWorthRow}>
                <View style={styles.netWorthStat}>
                  <Text style={styles.statLabel}>This Month Spent</Text>
                  <Text style={[styles.statValue, { color: Colors.warning }]}>${monthlySpend.toFixed(2)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.netWorthStat}>
                  <Text style={styles.statLabel}>Linked Accounts</Text>
                  <Text style={[styles.statValue, { color: Colors.primary }]}>{accounts.length}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.netWorthStat}>
                  <Text style={styles.statLabel}>Active Alerts</Text>
                  <Text style={[styles.statValue, { color: unreadAlertCount > 0 ? Colors.danger : Colors.success }]}>
                    {unreadAlertCount}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Linked institutions */}
          {institutions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Connected Banks</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
                {institutions.map(inst => (
                  <View key={inst.id} style={styles.instCard}>
                    <MaterialIcons name="account-balance" size={22} color={Colors.primary} />
                    <Text style={styles.instName}>{inst.institution_name}</Text>
                    <Text style={styles.instSync}>
                      {inst.last_synced_at
                        ? `Synced ${new Date(inst.last_synced_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : 'Pending sync'}
                    </Text>
                  </View>
                ))}
                <Pressable style={[styles.instCard, styles.instAddCard]} onPress={() => setLinkVisible(true)}>
                  <MaterialIcons name="add-circle-outline" size={22} color={Colors.textMuted} />
                  <Text style={styles.instAddText}>Add Bank</Text>
                </Pressable>
              </ScrollView>
            </>
          )}

          {/* Accounts */}
          {accounts.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Accounts</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
                {accounts.map(acc => (
                  <View key={acc.id} style={styles.accountCard}>
                    <MaterialIcons
                      name={acc.type === 'depository' ? 'account-balance' : acc.type === 'credit' ? 'credit-card' : 'show-chart'}
                      size={20}
                      color={Colors.primary}
                    />
                    <Text style={styles.accName} numberOfLines={1}>{acc.name}</Text>
                    <Text style={styles.accInst}>{acc.institution_name ?? acc.subtype}</Text>
                    <Text style={[styles.accBalance, { color: (acc.current_balance ?? 0) < 0 ? Colors.danger : Colors.textPrimary }]}>
                      {(acc.current_balance ?? 0) < 0 ? '-' : ''}${Math.abs(acc.current_balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* Alerts */}
          {alerts.filter(a => !a.read).length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Active Alerts</Text>
              {alerts.filter(a => !a.read).map(alert => (
                <View key={alert.id} style={[styles.alertCard, { borderColor: SEV_COLORS[alert.severity] + '66' }]}>
                  <View style={styles.alertLeft}>
                    <MaterialIcons
                      name={alert.type === 'unusual' ? 'warning' : alert.type === 'threshold' ? 'bar-chart' : 'insights'}
                      size={20}
                      color={SEV_COLORS[alert.severity]}
                    />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertDesc}>{alert.description}</Text>
                  </View>
                  <Pressable onPress={() => dismissAlert(alert.id)} hitSlop={8} style={styles.alertDismiss}>
                    <MaterialIcons name="check-circle" size={20} color={Colors.textMuted} />
                  </Pressable>
                </View>
              ))}
            </>
          )}

          {/* AI Insight */}
          <InsightPanel askInsight={askInsight} insightAnswer={insightAnswer} insightLoading={insightLoading} />

          {/* Transactions */}
          {transactions.length > 0 && (
            <>
              <View style={styles.txHeader}>
                <Text style={styles.sectionTitle}>Transactions</Text>
                <View style={styles.txTabs}>
                  {(['all', 'flagged'] as const).map(tab => (
                    <Pressable
                      key={tab}
                      style={[styles.txTab, txTab === tab && styles.txTabActive]}
                      onPress={() => setTxTab(tab)}
                    >
                      <Text style={[styles.txTabText, txTab === tab && styles.txTabTextActive]}>
                        {tab === 'all' ? 'All' : '⚠ Flagged'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {visibleTx.map(tx => (
                <View key={tx.id} style={[styles.txRow, tx.flagged && styles.txRowFlagged]}>
                  <View style={[styles.txIcon, tx.flagged && styles.txIconFlagged]}>
                    <MaterialIcons name={tx.flagged ? 'warning' : 'receipt'} size={18} color={tx.flagged ? Colors.danger : Colors.textSecondary} />
                  </View>
                  <View style={styles.txContent}>
                    <Text style={styles.txMerchant}>{tx.merchant_name ?? 'Unknown'}</Text>
                    <Text style={styles.txMeta}>{tx.category} · {tx.date}{tx.pending ? ' · Pending' : ''}</Text>
                  </View>
                  <Text style={[styles.txAmount, tx.flagged && { color: Colors.danger }]}>
                    -${tx.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </>
          )}

        </ScrollView>
      )}

      <PlaidLinkModal
        visible={linkVisible}
        onClose={() => setLinkVisible(false)}
        onLinked={reload}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  headerTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  alertBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.warningGlow, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.warning + '66',
  },
  alertBadgeText: { fontSize: 11, color: Colors.warning, fontWeight: Typography.semibold },
  syncBtn: { padding: 6 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: Radius.full,
  },
  addBtnText: { fontSize: 12, color: '#fff', fontWeight: Typography.semibold },
  addBtnLarge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: Radius.full, marginTop: Spacing.lg,
  },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: Colors.textMuted, fontSize: Typography.base },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.dangerGlow,
    borderBottomWidth: 1, borderBottomColor: Colors.danger + '44',
  },
  errorBannerText: { flex: 1, fontSize: Typography.sm, color: Colors.danger },
  scroll: { padding: Spacing.md, paddingBottom: 100 },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: Spacing.sm },
  emptyTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  emptySub: { fontSize: Typography.sm, color: Colors.textMuted, textAlign: 'center', maxWidth: 280, lineHeight: 20 },
  netWorthCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.xl,
    padding: Spacing.lg, marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.primary + '33',
    ...Shadows.glow(Colors.primary),
  },
  netWorthLabel: { fontSize: Typography.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  netWorthValue: { fontSize: Typography.hero, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  netWorthRow: { flexDirection: 'row', alignItems: 'center' },
  netWorthStat: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  statValue: { fontSize: Typography.sm, fontWeight: Typography.bold },
  divider: { width: 1, height: 32, backgroundColor: Colors.surfaceBorder },
  sectionTitle: {
    fontSize: Typography.xs, fontWeight: Typography.semibold, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm, marginTop: Spacing.sm,
  },
  hScroll: { marginBottom: Spacing.md, marginHorizontal: -Spacing.md, paddingHorizontal: Spacing.md },
  instCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.lg,
    padding: Spacing.md, marginRight: Spacing.sm, borderWidth: 1,
    borderColor: Colors.surfaceBorder, alignItems: 'center', minWidth: 110, gap: 4,
  },
  instAddCard: { borderStyle: 'dashed' },
  instName: { fontSize: Typography.xs, fontWeight: Typography.semibold, color: Colors.textPrimary, textAlign: 'center' },
  instSync: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  instAddText: { fontSize: Typography.xs, color: Colors.textMuted },
  accountCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.lg, padding: Spacing.md,
    marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.surfaceBorder,
    width: 148, gap: 4,
  },
  accName: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary },
  accInst: { fontSize: 11, color: Colors.textMuted },
  accBalance: { fontSize: Typography.base, fontWeight: Typography.bold },
  alertCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    padding: Spacing.sm, backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md, marginBottom: Spacing.sm, borderWidth: 1,
  },
  alertLeft: { paddingTop: 2 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary, marginBottom: 2 },
  alertDesc: { fontSize: Typography.xs, color: Colors.textSecondary, lineHeight: 18 },
  alertDismiss: { padding: 4 },
  txHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.sm },
  txTabs: { flexDirection: 'row', gap: 6 },
  txTab: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.surfaceBorder, backgroundColor: Colors.surface,
  },
  txTabActive: { backgroundColor: Colors.primary + '22', borderColor: Colors.primary },
  txTabText: { fontSize: 11, color: Colors.textMuted },
  txTabTextActive: { color: Colors.primary, fontWeight: Typography.semibold },
  txRow: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    marginBottom: Spacing.xs, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  txRowFlagged: { borderColor: Colors.danger + '55', backgroundColor: Colors.dangerGlow },
  txIcon: { width: 36, height: 36, borderRadius: Radius.sm, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  txIconFlagged: { backgroundColor: Colors.dangerGlow },
  txContent: { flex: 1 },
  txMerchant: { fontSize: Typography.sm, fontWeight: Typography.medium, color: Colors.textPrimary },
  txMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  txAmount: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary },
});

const link = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.xl, paddingBottom: 40, gap: Spacing.sm,
    borderWidth: 1, borderBottomWidth: 0, borderColor: Colors.surfaceBorder,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  sheetTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  label: { fontSize: Typography.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.surfaceBorder, color: Colors.textPrimary,
    fontSize: Typography.base, marginBottom: Spacing.xs,
  },
  note: { fontSize: Typography.xs, color: Colors.textMuted, lineHeight: 18, marginTop: 4 },
  btn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full, padding: Spacing.md,
    alignItems: 'center', marginTop: Spacing.md,
  },
  btnText: { fontSize: Typography.base, fontWeight: Typography.bold, color: '#fff' },
});

const ai = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, marginTop: Spacing.sm,
    borderWidth: 1, borderColor: Colors.gold + '44',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  title: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  quickScroll: { marginBottom: Spacing.sm, marginHorizontal: -Spacing.md, paddingHorizontal: Spacing.md },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, marginRight: 8,
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  chipText: { fontSize: 12, color: Colors.textSecondary },
  inputRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  input: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.sm, paddingHorizontal: Spacing.md,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    color: Colors.textPrimary, fontSize: Typography.sm,
  },
  sendBtn: {
    backgroundColor: Colors.primary, width: 40, height: 40,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  answerBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    marginTop: Spacing.sm, padding: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.primary + '33',
  },
  thinking: { fontSize: Typography.sm, color: Colors.textMuted, marginLeft: 8 },
  answer: { flex: 1, fontSize: Typography.sm, color: Colors.textPrimary, lineHeight: 20 },
});

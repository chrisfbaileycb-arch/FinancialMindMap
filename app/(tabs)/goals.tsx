import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Modal,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFinance } from '@/hooks/useFinance';
import { useAlert } from '@/template';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { FinancialGoal } from '@/constants/mockData';

const GOAL_ICONS: readonly string[] = ['security', 'directions-car', 'flight', 'credit-card', 'home', 'school', 'favorite', 'savings'];
const GOAL_COLORS = [Colors.success, Colors.gold, Colors.primary, Colors.danger, Colors.nodeHousing, Colors.nodeEntertainment, Colors.nodeFood, Colors.nodeSavings];

// ── Add Goal Modal ─────────────────────────────────────────────────────────

function AddGoalModal({ visible, onClose, onAdd }: {
  visible: boolean;
  onClose: () => void;
  onAdd: (goal: Omit<FinancialGoal, 'id'>) => void;
}) {
  const [title, setTitle]           = useState('');
  const [target, setTarget]         = useState('');
  const [deadline, setDeadline]     = useState('');
  const [iconIndex, setIconIndex]   = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const { showAlert } = useAlert();

  const reset = () => {
    setTitle(''); setTarget(''); setDeadline('');
    setIconIndex(0); setColorIndex(0);
  };

  const handleAdd = () => {
    if (!title.trim()) { showAlert('Title required', 'Enter a goal name.'); return; }
    const amt = parseFloat(target);
    if (isNaN(amt) || amt <= 0) { showAlert('Invalid amount', 'Enter a valid target amount greater than 0.'); return; }
    if (!deadline.trim()) { showAlert('Deadline required', 'Enter a target date in YYYY-MM-DD format.'); return; }
    onAdd({
      title: title.trim(),
      target: amt,
      current: 0,
      deadline: deadline.trim(),
      color: GOAL_COLORS[colorIndex],
      icon: GOAL_ICONS[iconIndex],
    });
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={() => { reset(); onClose(); }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={modal.overlay}>
          <View style={modal.sheet}>
            <View style={modal.sheetHeader}>
              <Text style={modal.sheetTitle}>New Goal</Text>
              <Pressable onPress={() => { reset(); onClose(); }} hitSlop={8}>
                <MaterialIcons name="close" size={22} color={Colors.textMuted} />
              </Pressable>
            </View>

            <Text style={modal.label}>Goal Name</Text>
            <TextInput
              style={modal.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Emergency Fund, New Car"
              placeholderTextColor={Colors.textMuted}
              accessibilityLabel="Goal name"
            />

            <Text style={modal.label}>Target Amount ($)</Text>
            <TextInput
              style={modal.input}
              value={target}
              onChangeText={setTarget}
              placeholder="e.g. 10000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              accessibilityLabel="Target amount"
            />

            <Text style={modal.label}>Target Date (YYYY-MM-DD)</Text>
            <TextInput
              style={modal.input}
              value={deadline}
              onChangeText={setDeadline}
              placeholder="e.g. 2027-06-01"
              placeholderTextColor={Colors.textMuted}
              accessibilityLabel="Target date"
            />

            <Text style={modal.label}>Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
              <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}>
                {GOAL_ICONS.map((icon, i) => (
                  <Pressable
                    key={icon}
                    style={[modal.iconBtn, i === iconIndex && modal.iconBtnActive]}
                    onPress={() => setIconIndex(i)}
                    accessibilityLabel={`Select ${icon} icon`}
                  >
                    <MaterialIcons name={icon as any} size={20} color={i === iconIndex ? Colors.primary : Colors.textMuted} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <Text style={modal.label}>Color</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.lg }}>
              {GOAL_COLORS.map((c, i) => (
                <Pressable
                  key={i}
                  style={[modal.colorDot, { backgroundColor: c }, i === colorIndex && modal.colorDotActive]}
                  onPress={() => setColorIndex(i)}
                  accessibilityLabel={`Select color ${i + 1}`}
                />
              ))}
            </View>

            <Pressable
              style={({ pressed }) => [modal.addBtn, pressed && { opacity: 0.8 }]}
              onPress={handleAdd}
              accessibilityLabel="Add goal"
              accessibilityRole="button"
            >
              <Text style={modal.addBtnText}>Add Goal</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────

export default function GoalsScreen() {
  const { goals, addGoal } = useFinance();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Goals</Text>
        <Pressable
          style={styles.addBtn}
          hitSlop={8}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Add new financial goal"
          accessibilityRole="button"
        >
          <MaterialIcons name="add" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Text style={styles.intro}>
          Track your financial milestones. Every dollar saved is a step toward freedom.
        </Text>

        {goals.map(goal => {
          const pct      = Math.min((goal.current / goal.target) * 100, 100);
          const remaining = goal.target - goal.current;
          const daysLeft  = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000);

          return (
            <View key={goal.id} style={[styles.goalCard, { borderColor: goal.color + '44' }]}>
              <View style={styles.goalCardTop}>
                <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                  <MaterialIcons name={goal.icon as any} size={22} color={goal.color} />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDeadline}>
                    {Math.max(0, daysLeft)} days left · {goal.deadline}
                  </Text>
                </View>
                <View style={styles.goalPct}>
                  <Text style={[styles.goalPctValue, { color: goal.color }]}>{pct.toFixed(0)}%</Text>
                </View>
              </View>

              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: goal.color }]} />
              </View>

              <View style={styles.goalAmounts}>
                <View>
                  <Text style={styles.goalAmountLabel}>Saved</Text>
                  <Text style={[styles.goalAmountValue, { color: goal.color }]}>${goal.current.toLocaleString()}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.goalAmountLabel}>Target</Text>
                  <Text style={styles.goalAmountValue}>${goal.target.toLocaleString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.goalAmountLabel}>Remaining</Text>
                  <Text style={[styles.goalAmountValue, { color: remaining <= 0 ? Colors.success : Colors.textSecondary }]}>
                    {remaining <= 0 ? 'Complete!' : `$${remaining.toLocaleString()}`}
                  </Text>
                </View>
              </View>

              {pct >= 100 ? (
                <View style={styles.completeBanner}>
                  <Text style={styles.completeBannerText}>Goal Achieved!</Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="flag" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptySubtitle}>Tap + to add your first financial goal.</Text>
          </View>
        ) : null}

        <View style={styles.tipCard}>
          <MaterialIcons name="lightbulb" size={20} color={Colors.gold} />
          <Text style={styles.tipText}>
            Small consistent contributions compound over time. Even $50/month toward your emergency fund adds up to $600 a year.
          </Text>
        </View>

      </ScrollView>

      <AddGoalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addGoal}
      />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  headerTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  addBtn: { padding: Spacing.sm, backgroundColor: Colors.primaryGlow, borderRadius: Radius.sm },
  scrollContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl, paddingTop: Spacing.md },
  intro: { fontSize: Typography.base, color: Colors.textSecondary, lineHeight: Typography.base * 1.6, marginBottom: Spacing.lg },
  goalCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.xl,
    padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, ...Shadows.card,
  },
  goalCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  goalIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  goalInfo: { flex: 1 },
  goalTitle: { fontSize: Typography.md, fontWeight: Typography.semibold, color: Colors.textPrimary },
  goalDeadline: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  goalPct: { alignItems: 'flex-end' },
  goalPctValue: { fontSize: Typography.xl, fontWeight: Typography.bold },
  progressBg: { height: 8, backgroundColor: Colors.surfaceBorder, borderRadius: 4, overflow: 'hidden', marginBottom: Spacing.md },
  progressFill: { height: '100%', borderRadius: 4 },
  goalAmounts: { flexDirection: 'row', justifyContent: 'space-between' },
  goalAmountLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  goalAmountValue: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  completeBanner: {
    marginTop: Spacing.sm, padding: Spacing.sm,
    backgroundColor: Colors.successGlow, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.success + '55', alignItems: 'center',
  },
  completeBannerText: { fontSize: Typography.sm, color: Colors.success, fontWeight: Typography.semibold },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: Spacing.sm },
  emptyTitle: { fontSize: Typography.lg, fontWeight: Typography.semibold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: Typography.base, color: Colors.textMuted, textAlign: 'center' },
  tipCard: {
    flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.gold + '33', marginTop: Spacing.sm, alignItems: 'flex-start',
  },
  tipText: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: Typography.sm * 1.6 },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.xl, paddingBottom: 40,
    borderWidth: 1, borderBottomWidth: 0, borderColor: Colors.surfaceBorder,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  sheetTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  label: { fontSize: Typography.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.surfaceBorder,
    color: Colors.textPrimary, fontSize: Typography.base, marginBottom: Spacing.md,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1,
    borderColor: Colors.surfaceBorder, alignItems: 'center', justifyContent: 'center',
  },
  iconBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGlow },
  colorDot: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: 'transparent' },
  colorDotActive: { borderColor: Colors.textPrimary },
  addBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: Spacing.md, alignItems: 'center',
  },
  addBtnText: { fontSize: Typography.base, fontWeight: Typography.bold, color: '#fff' },
});

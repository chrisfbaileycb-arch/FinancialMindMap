import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface Lesson {
  id: string;
  title: string;
  category: string;
  duration: string;
  icon: string;
  color: string;
  content: string;
  tip: string;
}

const LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'The 50/30/20 Rule',
    category: 'Budgeting',
    duration: '3 min',
    icon: 'pie-chart',
    color: Colors.primary,
    content: '50% of your income goes to needs (rent, groceries, utilities), 30% to wants (dining out, entertainment), and 20% to savings and debt repayment. This simple framework creates a sustainable financial habit without over-restricting.',
    tip: 'Start tracking your spending for just one month to see which category you overspend in most.',
  },
  {
    id: 'l2',
    title: 'Emergency Fund Basics',
    category: 'Saving',
    duration: '4 min',
    icon: 'security',
    color: Colors.success,
    content: 'An emergency fund is 3–6 months of essential expenses saved in a liquid (easy-access) account. It protects you from needing credit cards when unexpected expenses hit — car repairs, medical bills, or job loss. Without it, one crisis can derail years of progress.',
    tip: 'Even $1,000 saved prevents most minor emergencies from becoming debt.',
  },
  {
    id: 'l3',
    title: 'Understanding Credit Scores',
    category: 'Credit',
    duration: '5 min',
    icon: 'credit-score',
    color: Colors.gold,
    content: 'Your credit score (300–850) is calculated from: Payment history (35%), Amounts owed (30%), Length of credit history (15%), New credit (10%), Credit mix (10%). Paying on time and keeping card balances below 30% of your limit has the biggest impact.',
    tip: 'Check your credit report for free at AnnualCreditReport.com — errors affect 1 in 5 people.',
  },
  {
    id: 'l4',
    title: 'Compound Interest Explained',
    category: 'Investing',
    duration: '4 min',
    icon: 'trending-up',
    color: Colors.nodeEntertainment,
    content: 'Compound interest means you earn interest on your interest. $1,000 at 7% annual return becomes ~$1,967 in 10 years and ~$7,612 in 30 years — without adding a single dollar. Starting early is far more powerful than investing more later.',
    tip: 'Use the "Rule of 72": divide 72 by your interest rate to find how many years to double your money.',
  },
  {
    id: 'l5',
    title: 'Identifying Subscription Creep',
    category: 'Awareness',
    duration: '3 min',
    icon: 'notifications',
    color: Colors.warning,
    content: 'Subscription creep happens when small recurring charges accumulate invisibly. $10 here, $15 there — it adds up to hundreds per year. Services also quietly raise prices (like Netflix going from $9.99 to $22.99). Audit your subscriptions monthly by checking your Mind Map cloud sizes.',
    tip: 'Cancel anything you have not used in the past 30 days. You can always re-subscribe.',
  },
  {
    id: 'l6',
    title: 'The Latte Factor',
    category: 'Awareness',
    duration: '2 min',
    icon: 'local-cafe',
    color: Colors.nodeFood,
    content: 'Small daily purchases add up more than we think. $7/day at coffee shops equals $2,555 per year — or $38,000 over 15 years if invested at 7% return. This is not about never buying coffee. It is about making intentional choices and understanding their true long-term cost.',
    tip: 'Your Mind Map shows exactly which "small" categories are your biggest leaks.',
  },
];

const CATEGORIES = ['All', 'Budgeting', 'Saving', 'Credit', 'Investing', 'Awareness'];

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'All' ? LESSONS : LESSONS.filter(l => l.category === filter);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Education</Text>
        <Text style={styles.headerSub}>{LESSONS.length} lessons</Text>
      </View>

      {/* Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {CATEGORIES.map(cat => (
          <Pressable
            key={cat}
            style={[styles.filterChip, filter === cat && styles.filterChipActive]}
            onPress={() => setFilter(cat)}
          >
            <Text style={[styles.filterChipText, filter === cat && styles.filterChipTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Text style={styles.subtitle}>
          Financial literacy is the most valuable skill not taught in school. Learn at your own pace.
        </Text>

        {filtered.map(lesson => (
          <Pressable
            key={lesson.id}
            style={[styles.lessonCard, { borderColor: lesson.color + '44' }]}
            onPress={() => setExpanded(expanded === lesson.id ? null : lesson.id)}
          >
            <View style={styles.lessonHeader}>
              <View style={[styles.lessonIcon, { backgroundColor: lesson.color + '20' }]}>
                <MaterialIcons name={lesson.icon as any} size={22} color={lesson.color} />
              </View>
              <View style={styles.lessonMeta}>
                <View style={styles.lessonTopRow}>
                  <Text style={[styles.lessonCategory, { color: lesson.color }]}>{lesson.category}</Text>
                  <Text style={styles.lessonDuration}>
                    <MaterialIcons name="schedule" size={11} color={Colors.textMuted} /> {lesson.duration}
                  </Text>
                </View>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
              </View>
              <MaterialIcons
                name={expanded === lesson.id ? 'expand-less' : 'expand-more'}
                size={22}
                color={Colors.textMuted}
              />
            </View>

            {expanded === lesson.id && (
              <View style={styles.lessonBody}>
                <Text style={styles.lessonContent}>{lesson.content}</Text>
                <View style={[styles.lessonTip, { borderColor: lesson.color + '55', backgroundColor: lesson.color + '10' }]}>
                  <MaterialIcons name="lightbulb" size={16} color={lesson.color} />
                  <Text style={[styles.lessonTipText, { color: lesson.color }]}>{lesson.tip}</Text>
                </View>
              </View>
            )}
          </Pressable>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  headerTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  headerSub: { fontSize: Typography.sm, color: Colors.textMuted },
  filterScroll: { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder },
  filterContent: { paddingHorizontal: Spacing.md, paddingVertical: 8, gap: 8, flexDirection: 'row' },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  filterChipActive: { backgroundColor: Colors.primary + '22', borderColor: Colors.primary },
  filterChipText: { fontSize: Typography.sm, color: Colors.textMuted },
  filterChipTextActive: { color: Colors.primary, fontWeight: Typography.semibold },
  scrollContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl, paddingTop: Spacing.md },
  subtitle: { fontSize: Typography.base, color: Colors.textSecondary, lineHeight: Typography.base * 1.6, marginBottom: Spacing.lg },
  lessonCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1,
  },
  lessonHeader: { flexDirection: 'row', alignItems: 'center' },
  lessonIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  lessonMeta: { flex: 1 },
  lessonTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  lessonCategory: { fontSize: 12, fontWeight: Typography.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
  lessonDuration: { fontSize: 12, color: Colors.textMuted },
  lessonTitle: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  lessonBody: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.surfaceBorder },
  lessonContent: { fontSize: Typography.base, color: Colors.textSecondary, lineHeight: Typography.base * Typography.normal, marginBottom: Spacing.md },
  lessonTip: {
    flexDirection: 'row', gap: 8, padding: Spacing.sm,
    borderRadius: Radius.md, borderWidth: 1, alignItems: 'flex-start',
  },
  lessonTipText: { flex: 1, fontSize: Typography.sm, lineHeight: Typography.sm * 1.6, fontWeight: Typography.medium },
});

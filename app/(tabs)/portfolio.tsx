import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFinance } from '@/hooks/useFinance';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

const ALLOC_COLORS = [Colors.primary, Colors.gold, Colors.nodeHealth, Colors.nodeEntertainment];

export default function PortfolioScreen() {
  const { portfolio } = useFinance();
  const insets = useSafeAreaInsets();
  const isPositive = portfolio.dayChange >= 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio</Text>
        <View style={styles.changeBadge}>
          <MaterialIcons
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={14}
            color={isPositive ? Colors.success : Colors.danger}
          />
          <Text style={[styles.changeText, { color: isPositive ? Colors.success : Colors.danger }]}>
            {isPositive ? '+' : ''}{portfolio.dayChange.toFixed(2)} ({portfolio.dayChangePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Demo notice */}
        <View style={styles.demoNotice}>
          <MaterialIcons name="info" size={14} color={Colors.gold} />
          <Text style={styles.demoNoticeText}>
            Portfolio data is illustrative. Connect your investment accounts via the Dashboard to see live holdings.
          </Text>
        </View>

        {/* Total Value */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Portfolio Value</Text>
          <Text style={styles.totalValue}>${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
          <Text style={[styles.dayChange, { color: isPositive ? Colors.success : Colors.danger }]}>
            {isPositive ? '▲' : '▼'} ${Math.abs(portfolio.dayChange).toFixed(2)} today ({portfolio.dayChangePercent.toFixed(2)}%)
          </Text>
        </View>

        {/* Allocation Visual */}
        <Text style={styles.sectionTitle}>Allocation</Text>
        <View style={styles.allocationBar}>
          {portfolio.holdings.map((h, i) => (
            <View
              key={h.id}
              style={[styles.allocationSegment, { flex: h.allocation / 100, backgroundColor: ALLOC_COLORS[i] }]}
            />
          ))}
        </View>
        <View style={styles.allocationLegend}>
          {portfolio.holdings.map((h, i) => (
            <View key={h.id} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: ALLOC_COLORS[i] }]} />
              <Text style={styles.legendText}>{h.allocation}% {h.name.split(' ')[0]}</Text>
            </View>
          ))}
        </View>

        {/* Holdings */}
        <Text style={styles.sectionTitle}>Holdings</Text>
        {portfolio.holdings.map((h, i) => (
          <View key={h.id} style={[styles.holdingCard, { borderColor: ALLOC_COLORS[i] + '44' }]}>
            <View style={[styles.holdingBadge, { backgroundColor: ALLOC_COLORS[i] + '20' }]}>
              <Text style={[styles.holdingTicker, { color: ALLOC_COLORS[i] }]}>{h.ticker}</Text>
            </View>
            <View style={styles.holdingInfo}>
              <Text style={styles.holdingName}>{h.name}</Text>
              <Text style={styles.holdingAlloc}>{h.allocation}% of portfolio</Text>
            </View>
            <View style={styles.holdingRight}>
              <Text style={styles.holdingValue}>${h.value.toLocaleString()}</Text>
              <Text style={[styles.holdingChange, { color: h.change >= 0 ? Colors.success : Colors.danger }]}>
                {h.change >= 0 ? '+' : ''}{h.change}%
              </Text>
            </View>
          </View>
        ))}

        {/* Info */}
        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={18} color={Colors.primary} />
          <Text style={styles.infoText}>
            Diversification across asset classes reduces risk. Your current allocation aligns with a balanced growth strategy.
          </Text>
        </View>

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
  changeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  changeText: { fontSize: 12, fontWeight: Typography.semibold },
  scrollContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl, paddingTop: Spacing.md },
  totalCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.xl,
    padding: Spacing.lg, marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.gold + '33',
    alignItems: 'center',
    ...Shadows.glow(Colors.gold),
  },
  totalLabel: { fontSize: Typography.sm, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  totalValue: { fontSize: Typography.hero, fontWeight: Typography.bold, color: Colors.textPrimary },
  dayChange: { fontSize: Typography.sm, marginTop: 4 },
  sectionTitle: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm },
  allocationBar: {
    flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  allocationSegment: { height: '100%' },
  allocationLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: Colors.textSecondary },
  holdingCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg, marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  holdingBadge: { width: 52, height: 38, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  holdingTicker: { fontSize: 12, fontWeight: Typography.bold, letterSpacing: 0.5 },
  holdingInfo: { flex: 1 },
  holdingName: { fontSize: Typography.base, fontWeight: Typography.medium, color: Colors.textPrimary },
  holdingAlloc: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  holdingRight: { alignItems: 'flex-end' },
  holdingValue: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  holdingChange: { fontSize: 12, fontWeight: Typography.semibold, marginTop: 2 },
  infoCard: {
    flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.primary + '33', alignItems: 'flex-start',
    marginTop: Spacing.sm,
  },
  infoText: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: Typography.sm * 1.6 },
  demoNotice: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    padding: Spacing.sm, backgroundColor: Colors.goldGlow,
    borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.gold + '44', marginBottom: Spacing.lg,
  },
  demoNoticeText: { flex: 1, fontSize: 12, color: Colors.gold, lineHeight: 18 },
});

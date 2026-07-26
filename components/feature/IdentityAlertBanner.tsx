import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useFinance } from '@/hooks/useFinance';
import { IdentityAlert } from '@/constants/mockData';

interface Props {
  alert: IdentityAlert;
}

const severityConfig = {
  high: { bg: Colors.dangerGlow, border: Colors.danger, icon: 'error' as const, color: Colors.danger },
  medium: { bg: Colors.warningGlow, border: Colors.warning, icon: 'warning' as const, color: Colors.warning },
  low: { bg: Colors.primaryGlow, border: Colors.primary, icon: 'info' as const, color: Colors.primary },
};

export function IdentityAlertBanner({ alert }: Props) {
  const { markAlertRead } = useFinance();
  const config = severityConfig[alert.severity];

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.border }]}>
      <MaterialIcons name={config.icon} size={18} color={config.color} style={{ marginTop: 1 }} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: config.color }]}>{alert.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{alert.description}</Text>
      </View>
      <Pressable
        onPress={() => markAlertRead(alert.id)}
        hitSlop={8}
        style={styles.dismissBtn}
      >
        <MaterialIcons name="close" size={16} color={config.color} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  content: { flex: 1 },
  title: { fontSize: Typography.sm, fontWeight: Typography.semibold, marginBottom: 2 },
  desc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 16 },
  dismissBtn: { padding: 4 },
});

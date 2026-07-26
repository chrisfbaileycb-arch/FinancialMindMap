import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Dimensions, Modal, ScrollView, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFinance } from '@/hooks/useFinance';
import { useBackendFinanceContext } from '@/hooks/useBackendFinanceContext';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { IdentityAlertBanner } from '@/components/feature/IdentityAlertBanner';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
  TapGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CANVAS_W = SCREEN_W * 2.2;
const CANVAS_H = SCREEN_H * 1.8;
const CENTER_X = CANVAS_W / 2;
const CENTER_Y = CANVAS_H / 2;
const CENTER_RADIUS = 58;
const ORBIT_RADIUS = 170;

function getInitialPositions(categories: any[]) {
  const count = categories.length;
  return categories.map((cat, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    const ratio = Math.min(cat.spent / cat.budget, 1.5);
    const nodeR = 32 + ratio * 22;
    return {
      id: cat.id,
      x: CENTER_X + Math.cos(angle) * ORBIT_RADIUS,
      y: CENTER_Y + Math.sin(angle) * ORBIT_RADIUS,
      radius: nodeR,
    };
  });
}

interface NodeState {
  id: string;
  x: number;
  y: number;
  radius: number;
}

function DraggableNode({
  category,
  nodeState,
  onPositionChange,
  onTap,
  isSelected,
}: {
  category: any;
  nodeState: NodeState;
  onPositionChange: (id: string, x: number, y: number) => void;
  onTap: (id: string) => void;
  isSelected: boolean;
}) {
  const overspent = category.spent > category.budget;
  const translateX = useSharedValue(nodeState.x - nodeState.radius);
  const translateY = useSharedValue(nodeState.y - nodeState.radius);
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(isSelected ? 1 : 0);

  // Overspent pulse animation
  useEffect(() => {
    if (overspent) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 700 }),
          withTiming(1.0, { duration: 700 }),
        ),
        -1,
        false
      );
    }
  }, [overspent]);

  // Selection glow
  useEffect(() => {
    glowOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected]);

  const panHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number; startY: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      scale.value = withSpring(1.15, { damping: 12 });
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      scale.value = withSpring(1, { damping: 14 });
      const cx = translateX.value + nodeState.radius;
      const cy = translateY.value + nodeState.radius;
      runOnJS(onPositionChange)(nodeState.id, cx, cy);
    },
  });

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value * pulseScale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const d = nodeState.radius * 2;

  return (
    <PanGestureHandler onGestureEvent={panHandler}>
      <Animated.View
        style={[
          styles.nodeWrapper,
          { width: d, height: d, position: 'absolute' },
          animStyle,
        ]}
      >
        {/* Selection glow ring */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: nodeState.radius,
              borderWidth: 3,
              borderColor: category.color,
              shadowColor: category.color,
              shadowOpacity: 0.9,
              shadowRadius: 18,
              elevation: 16,
            },
            glowStyle,
          ]}
        />
        <Pressable
          style={[
            styles.nodeCircle,
            {
              width: d,
              height: d,
              borderRadius: nodeState.radius,
              backgroundColor: isSelected ? category.color + '40' : category.color + '22',
              borderColor: category.color,
              borderWidth: overspent ? 2.5 : 1.5,
            },
            overspent && {
              shadowColor: category.color,
              shadowOpacity: 0.6,
              shadowRadius: 14,
              elevation: 10,
            },
          ]}
          onPress={() => onTap(category.id)}
          hitSlop={6}
        >
          <MaterialIcons
            name={category.icon as any}
            size={nodeState.radius > 42 ? 18 : 14}
            color={category.color}
          />
          <Text
            style={[
              styles.nodeLabel,
              { fontSize: nodeState.radius > 42 ? 10 : 9, color: category.color },
            ]}
            numberOfLines={1}
          >
            {category.name}
          </Text>
          <Text
            style={[
              styles.nodeAmount,
              { fontSize: nodeState.radius > 42 ? 11 : 9, color: Colors.textPrimary },
            ]}
          >
            ${category.spent}
          </Text>
          {overspent && (
            <View style={styles.overDot}>
              <Text style={{ fontSize: 7, color: Colors.danger }}>!</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    </PanGestureHandler>
  );
}

function ConnectionLine({
  fromX, fromY, toX, toY, color,
}: {
  fromX: number; fromY: number; toX: number; toY: number; color: string;
}) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  // Center the view at midpoint so default center-pivot rotation aligns endpoints correctly
  const cx = (fromX + toX) / 2;
  const cy = (fromY + toY) / 2;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: len,
        height: 1.5,
        left: cx - len / 2,
        top: cy - 0.75,
        transform: [{ rotate: `${angle}deg` }],
        backgroundColor: color + '30',
      }}
    />
  );
}

export default function MindMapScreen() {
  const { categories: mockCategories, alerts } = useFinance();
  const { mapCategories, hasRealData } = useBackendFinanceContext();
  // Use real transaction-derived categories when a bank is linked, else mock
  const categories = mapCategories;
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<NodeState[]>(() => getInitialPositions(categories));

  // Re-initialise nodes when data source switches (mock <-> real)
  const prevCategoryIds = useRef<string>('');
  useEffect(() => {
    const ids = categories.map(c => c.id).join(',');
    if (ids !== prevCategoryIds.current) {
      prevCategoryIds.current = ids;
      setNodes(getInitialPositions(categories));
      setSelectedId(null);
    }
  }, [categories]);

  const totalSpend = categories.reduce((s, c) => s + c.spent, 0);
  const firstAlert = alerts.find(a => !a.read);
  const selectedCat = categories.find(c => c.id === selectedId);

  // Canvas pan & zoom
  const canvasX = useSharedValue(-(CANVAS_W / 2 - SCREEN_W / 2));
  const canvasY = useSharedValue(-(CANVAS_H / 2 - (isFullscreen ? SCREEN_H : 320) / 2));
  const canvasScale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const centerPulse = useSharedValue(1);
  useEffect(() => {
    centerPulse.value = withRepeat(
      withSequence(
        withTiming(1.07, { duration: 1800 }),
        withTiming(1.0, { duration: 1800 }),
      ),
      -1,
      false
    );
  }, []);

  const canvasPanHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number; startY: number }>({
    onStart: (_, ctx) => {
      ctx.startX = canvasX.value;
      ctx.startY = canvasY.value;
    },
    onActive: (event, ctx) => {
      canvasX.value = ctx.startX + event.translationX;
      canvasY.value = ctx.startY + event.translationY;
    },
  });

  const canvasPinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onStart: () => {
      savedScale.value = canvasScale.value;
    },
    onActive: (event) => {
      const next = savedScale.value * event.scale;
      canvasScale.value = Math.min(Math.max(next, 0.35), 2.2);
    },
    onEnd: () => {
      if (canvasScale.value < 0.45) {
        canvasScale.value = withSpring(0.45);
      }
    },
  });

  const canvasAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: canvasX.value },
      { translateY: canvasY.value },
      { scale: canvasScale.value },
    ],
  }));

  const centerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: centerPulse.value }],
  }));

  const handleNodePositionChange = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  }, []);

  const handleNodeTap = useCallback((id: string) => {
    setSelectedId(prev => prev === id ? null : id);
  }, []);

  const openFullscreen = () => {
    setIsFullscreen(true);
    // Center canvas on open
    canvasX.value = withSpring(-(CANVAS_W / 2 - SCREEN_W / 2));
    canvasY.value = withSpring(-(CANVAS_H / 2 - SCREEN_H / 2));
    canvasScale.value = withSpring(0.85);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    canvasScale.value = withSpring(1);
  };

  const MapCanvas = ({ fullscreen }: { fullscreen: boolean }) => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler onGestureEvent={canvasPinchHandler}>
        <Animated.View style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={canvasPanHandler} minPointers={1} maxPointers={1}>
            <Animated.View style={{ flex: 1, overflow: 'hidden' }}>
              <Animated.View style={[{ width: CANVAS_W, height: CANVAS_H }, canvasAnimStyle]}>
                {/* Connection lines */}
                {nodes.map(n => {
                  const cat = categories.find(c => c.id === n.id);
                  return cat ? (
                    <ConnectionLine
                      key={n.id + '_line'}
                      fromX={CENTER_X}
                      fromY={CENTER_Y}
                      toX={n.x}
                      toY={n.y}
                      color={cat.color}
                    />
                  ) : null;
                })}

                {/* Center node */}
                <Animated.View
                  style={[
                    styles.centerNode,
                    {
                      left: CENTER_X - CENTER_RADIUS,
                      top: CENTER_Y - CENTER_RADIUS,
                    },
                    centerAnimStyle,
                  ]}
                >
                  <Text style={styles.centerLabel}>Monthly</Text>
                  <Text style={styles.centerAmount}>${totalSpend.toLocaleString()}</Text>
                  <Text style={styles.centerSub}>spend</Text>
                </Animated.View>

                {/* Draggable nodes */}
                {nodes.map((n) => {
                  const cat = categories.find(c => c.id === n.id);
                  return cat ? (
                    <DraggableNode
                      key={n.id}
                      category={cat}
                      nodeState={n}
                      onPositionChange={handleNodePositionChange}
                      onTap={handleNodeTap}
                      isSelected={selectedId === n.id}
                    />
                  ) : null;
                })}
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mind Map</Text>
          <Text style={styles.headerSub}>
            {hasRealData ? 'Live spending · ' : 'Demo data · '}Tap to explore · Drag nodes · Pinch to zoom
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={openFullscreen} style={styles.headerBtn} hitSlop={8}>
            <MaterialIcons name="fullscreen" size={22} color={Colors.primary} />
          </Pressable>
          <Pressable onPress={logout} style={styles.headerBtn} hitSlop={8}>
            <MaterialIcons name="lock" size={20} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {firstAlert && <IdentityAlertBanner alert={firstAlert} />}

      {/* Inline Map Preview */}
      <Pressable style={styles.mapPreviewWrapper} onPress={openFullscreen}>
        <View style={styles.mapPreviewCanvas} pointerEvents="none">
          {/* Simplified static preview lines */}
          {nodes.map(n => {
            const cat = categories.find(c => c.id === n.id);
            const scale = 0.38;
            const offX = 20;
            const offY = 10;
            const fx = CENTER_X * scale + offX;
            const fy = CENTER_Y * scale + offY;
            const tx = n.x * scale + offX;
            const ty = n.y * scale + offY;
            const dx = tx - fx;
            const dy = ty - fy;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ang = Math.atan2(dy, dx) * (180 / Math.PI);
            const pcx = (fx + tx) / 2;
            const pcy = (fy + ty) / 2;
            return cat ? (
              <View
                key={n.id + '_prev_line'}
                style={{
                  position: 'absolute',
                  width: len,
                  height: 1.5,
                  left: pcx - len / 2,
                  top: pcy - 0.75,
                  transform: [{ rotate: `${ang}deg` }],
                  backgroundColor: cat.color + '50',
                }}
              />
            ) : null;
          })}

          {/* Preview center */}
          <View style={[styles.prevCenter, { left: CENTER_X * 0.38 + 20 - 18, top: CENTER_Y * 0.38 + 10 - 18 }]}>
            <Text style={{ fontSize: 7, color: Colors.primary, fontWeight: '700' }}>$</Text>
            <Text style={{ fontSize: 6, color: Colors.textMuted }}>total</Text>
          </View>

          {/* Preview nodes */}
          {nodes.map(n => {
            const cat = categories.find(c => c.id === n.id);
            if (!cat) return null;
            const scale = 0.38;
            const r = n.radius * scale;
            const cx = n.x * scale + 20;
            const cy = n.y * scale + 10;
            return (
              <View
                key={n.id + '_prev'}
                style={[
                  styles.prevNode,
                  {
                    left: cx - r,
                    top: cy - r,
                    width: r * 2,
                    height: r * 2,
                    borderRadius: r,
                    backgroundColor: cat.color + '30',
                    borderColor: cat.color,
                    borderWidth: 1,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Tap to expand overlay */}
        <View style={styles.expandOverlay}>
          <View style={styles.expandBtn}>
            <MaterialIcons name="open-in-full" size={18} color={Colors.primary} />
            <Text style={styles.expandText}>Tap to open interactive map</Text>
          </View>
        </View>
      </Pressable>

      {/* Category list scroll */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedCat && (
          <View style={[styles.catDetail, { borderColor: selectedCat.color + '55' }]}>
            <View style={styles.catDetailHeader}>
              <View style={[styles.catDot, { backgroundColor: selectedCat.color }]} />
              <Text style={styles.catDetailName}>{selectedCat.name}</Text>
              {selectedCat.spent > selectedCat.budget && (
                <View style={styles.overBadge}>
                  <Text style={styles.overBadgeText}>Over Budget</Text>
                </View>
              )}
            </View>
            <View style={styles.catDetailRow}>
              <View style={styles.catDetailStat}>
                <Text style={styles.catDetailStatLabel}>Spent</Text>
                <Text style={[styles.catDetailStatValue, { color: selectedCat.color }]}>${selectedCat.spent}</Text>
              </View>
              <View style={styles.catDetailStat}>
                <Text style={styles.catDetailStatLabel}>Budget</Text>
                <Text style={styles.catDetailStatValue}>${selectedCat.budget}</Text>
              </View>
              <View style={styles.catDetailStat}>
                <Text style={styles.catDetailStatLabel}>Remaining</Text>
                <Text style={[styles.catDetailStatValue, { color: selectedCat.spent > selectedCat.budget ? Colors.danger : Colors.success }]}>
                  {selectedCat.spent > selectedCat.budget
                    ? `$${selectedCat.spent - selectedCat.budget} over`
                    : `$${selectedCat.budget - selectedCat.spent} left`}
                </Text>
              </View>
            </View>
            <View style={styles.budgetBarBg}>
              <View style={[
                styles.budgetBarFill,
                {
                  width: `${Math.min((selectedCat.spent / selectedCat.budget) * 100, 100)}%` as any,
                  backgroundColor: selectedCat.spent > selectedCat.budget ? Colors.danger : selectedCat.color,
                }
              ]} />
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>All Categories</Text>
        {!hasRealData && (
          <View style={styles.demoBanner}>
            <MaterialIcons name="info" size={13} color={Colors.gold} />
            <Text style={styles.demoBannerText}>
              Showing demo data. Link a bank account on the Dashboard tab to see your real spending.
            </Text>
          </View>
        )}
        {categories.map(cat => {
          const pct = Math.min((cat.spent / cat.budget) * 100, 100);
          const over = cat.spent > cat.budget;
          return (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [styles.catRow, pressed && styles.catRowPressed, selectedId === cat.id && { borderColor: cat.color }]}
              onPress={() => setSelectedId(selectedId === cat.id ? null : cat.id)}
            >
              <View style={[styles.catRowIcon, { backgroundColor: cat.color + '20' }]}>
                <MaterialIcons name={cat.icon as any} size={18} color={cat.color} />
              </View>
              <View style={styles.catRowContent}>
                <View style={styles.catRowTop}>
                  <Text style={styles.catRowName}>{cat.name}</Text>
                  <Text style={[styles.catRowAmount, over && { color: Colors.danger }]}>
                    ${cat.spent} <Text style={styles.catRowBudget}>/ ${cat.budget}</Text>
                  </Text>
                </View>
                <View style={styles.catBarBg}>
                  <View style={[styles.catBarFill, { width: `${pct}%` as any, backgroundColor: over ? Colors.danger : cat.color }]} />
                </View>
              </View>
              {over && <MaterialIcons name="warning" size={16} color={Colors.warning} style={{ marginLeft: 8 }} />}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Fullscreen Modal */}
      <Modal
        visible={isFullscreen}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeFullscreen}
      >
        <View style={styles.fullscreenContainer}>
          <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

          {/* Fullscreen header */}
          <View style={[styles.fsHeader, { paddingTop: insets.top + 8 }]}>
            <View>
              <Text style={styles.fsTitle}>Financial Mind Map</Text>
              <Text style={styles.fsSub}>
                {hasRealData ? 'Live spending · ' : 'Demo · '}Drag nodes · Pinch to zoom · Tap for details
              </Text>
            </View>
            <Pressable onPress={closeFullscreen} style={styles.closeBtn} hitSlop={8}>
              <MaterialIcons name="fullscreen-exit" size={26} color={Colors.textPrimary} />
            </Pressable>
          </View>

          {/* Hint strip */}
          <View style={styles.hintStrip}>
            <Text style={styles.hintText}>
              <MaterialIcons name="pan-tool" size={11} color={Colors.textMuted} /> Drag canvas to pan  ·  Pinch to zoom  ·  Drag bubbles to rearrange
            </Text>
          </View>

          {/* Interactive Map */}
          <MapCanvas fullscreen={true} />

          {/* Legend / selected detail overlay */}
          {selectedCat && (
            <View style={[styles.fsDetailCard, { borderColor: selectedCat.color + '66' }]}>
              <View style={styles.catDetailHeader}>
                <View style={[styles.catDot, { backgroundColor: selectedCat.color }]} />
                <Text style={[styles.catDetailName, { fontSize: 15 }]}>{selectedCat.name}</Text>
                {selectedCat.spent > selectedCat.budget && (
                  <View style={styles.overBadge}>
                    <Text style={styles.overBadgeText}>Over Budget</Text>
                  </View>
                )}
                <Pressable onPress={() => setSelectedId(null)} hitSlop={8} style={{ marginLeft: 'auto' }}>
                  <MaterialIcons name="close" size={18} color={Colors.textMuted} />
                </Pressable>
              </View>
              <View style={styles.catDetailRow}>
                <View style={styles.catDetailStat}>
                  <Text style={styles.catDetailStatLabel}>Spent</Text>
                  <Text style={[styles.catDetailStatValue, { color: selectedCat.color }]}>${selectedCat.spent}</Text>
                </View>
                <View style={styles.catDetailStat}>
                  <Text style={styles.catDetailStatLabel}>Budget</Text>
                  <Text style={styles.catDetailStatValue}>${selectedCat.budget}</Text>
                </View>
                <View style={styles.catDetailStat}>
                  <Text style={styles.catDetailStatLabel}>Remaining</Text>
                  <Text style={[styles.catDetailStatValue, { color: selectedCat.spent > selectedCat.budget ? Colors.danger : Colors.success }]}>
                    {selectedCat.spent > selectedCat.budget
                      ? `$${selectedCat.spent - selectedCat.budget} over`
                      : `$${selectedCat.budget - selectedCat.spent} left`}
                  </Text>
                </View>
              </View>
              <View style={styles.budgetBarBg}>
                <View style={[styles.budgetBarFill, {
                  width: `${Math.min((selectedCat.spent / selectedCat.budget) * 100, 100)}%` as any,
                  backgroundColor: selectedCat.spent > selectedCat.budget ? Colors.danger : selectedCat.color,
                }]} />
              </View>
            </View>
          )}

          {/* Legend dots */}
          <View style={[styles.fsLegend, { paddingBottom: insets.bottom + 12 }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
              {categories.map(cat => (
                <Pressable
                  key={cat.id}
                  style={[styles.legendChip, selectedId === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '22' }]}
                  onPress={() => setSelectedId(selectedId === cat.id ? null : cat.id)}
                >
                  <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                  <Text style={[styles.legendLabel, selectedId === cat.id && { color: cat.color }]}>{cat.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  headerSub: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 4 },
  headerBtn: { padding: Spacing.sm },

  // Inline preview
  mapPreviewWrapper: {
    height: 220, margin: Spacing.md, borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  mapPreviewCanvas: { ...StyleSheet.absoluteFillObject },
  prevLine: { position: 'absolute', height: 1.5 },
  prevCenter: {
    position: 'absolute', width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary + '25', borderWidth: 1.5, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.5, shadowRadius: 8, elevation: 6,
  },
  prevNode: { position: 'absolute' },
  expandOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 14,
  },
  expandBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surface + 'CC', paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.primary + '55',
  },
  expandText: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.medium },

  // Category list
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl, paddingTop: Spacing.sm },

  catDetail: {
    marginBottom: Spacing.md, padding: Spacing.md,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.lg,
    borderWidth: 1,
  },
  catDetailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
  catDot: { width: 12, height: 12, borderRadius: 6 },
  catDetailName: { fontSize: Typography.md, fontWeight: Typography.semibold, color: Colors.textPrimary, flex: 1 },
  overBadge: {
    backgroundColor: Colors.dangerGlow, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.danger,
  },
  overBadgeText: { fontSize: 11, color: Colors.danger, fontWeight: Typography.semibold },
  catDetailRow: { flexDirection: 'row', marginBottom: Spacing.md },
  catDetailStat: { flex: 1, alignItems: 'center' },
  catDetailStatLabel: { fontSize: Typography.xs, color: Colors.textMuted, marginBottom: 2 },
  catDetailStatValue: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary },
  budgetBarBg: { height: 6, backgroundColor: Colors.surfaceBorder, borderRadius: 3, overflow: 'hidden' },
  budgetBarFill: { height: '100%', borderRadius: 3 },

  sectionTitle: {
    fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textSecondary,
    marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 1,
  },
  catRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  catRowPressed: { opacity: 0.7 },
  catRowIcon: { width: 38, height: 38, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  catRowContent: { flex: 1 },
  catRowTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catRowName: { fontSize: Typography.base, fontWeight: Typography.medium, color: Colors.textPrimary },
  catRowAmount: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary },
  catRowBudget: { color: Colors.textMuted, fontWeight: Typography.regular },
  catBarBg: { height: 4, backgroundColor: Colors.surfaceBorder, borderRadius: 2, overflow: 'hidden' },
  catBarFill: { height: '100%', borderRadius: 2 },

  // Canvas nodes
  nodeWrapper: { position: 'absolute' },
  nodeCircle: { alignItems: 'center', justifyContent: 'center', gap: 1 },
  nodeLabel: { fontWeight: Typography.semibold, textAlign: 'center', paddingHorizontal: 2 },
  nodeAmount: { fontWeight: Typography.bold, textAlign: 'center' },
  overDot: {
    position: 'absolute', top: 4, right: 4,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.dangerGlow, borderWidth: 1, borderColor: Colors.danger,
    alignItems: 'center', justifyContent: 'center',
  },

  centerNode: {
    position: 'absolute',
    width: CENTER_RADIUS * 2,
    height: CENTER_RADIUS * 2,
    borderRadius: CENTER_RADIUS,
    backgroundColor: Colors.primary + '22',
    borderWidth: 2.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 14,
  },
  centerLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: Typography.medium },
  centerAmount: { fontSize: 16, color: Colors.textPrimary, fontWeight: Typography.bold, marginTop: 1 },
  centerSub: { fontSize: 9, color: Colors.textMuted },

  connectionLine: {
    position: 'absolute',
    height: 1.5,
  },

  // Fullscreen
  fullscreenContainer: { flex: 1, backgroundColor: Colors.background },
  fsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  fsTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  fsSub: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  closeBtn: { padding: Spacing.sm },
  hintStrip: {
    paddingHorizontal: Spacing.md, paddingVertical: 5,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  hintText: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },

  fsDetailCard: {
    position: 'absolute',
    bottom: 80,
    left: Spacing.md,
    right: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface + 'EE',
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  fsLegend: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface + 'F0',
    paddingTop: 8,
    borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  legendChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.surfaceBorder,
    backgroundColor: Colors.surfaceElevated,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12, color: Colors.textSecondary },

  demoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm,
    backgroundColor: Colors.goldGlow,
    borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.gold + '44', marginBottom: Spacing.md,
  },
  demoBannerText: { flex: 1, fontSize: 12, color: Colors.gold, lineHeight: 18 },
});

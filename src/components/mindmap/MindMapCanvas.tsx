import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  X,
  Edit2,
  Check,
  Plus,
  Home,
  Utensils,
  Car,
  Film,
  PiggyBank,
  Heart,
  ShoppingBag,
  Layers,
  Eye,
  Sliders,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  PlusCircle,
  BarChart3,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { useFinanceContext } from '../../context/FinanceContext';
import { Category, Transaction } from '../../types';

// Map icon string to Lucide component
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Home':
    case 'home':
      return Home;
    case 'Utensils':
    case 'restaurant':
      return Utensils;
    case 'Car':
    case 'directions-car':
      return Car;
    case 'Film':
    case 'movie':
      return Film;
    case 'PiggyBank':
    case 'savings':
      return PiggyBank;
    case 'Heart':
    case 'favorite':
      return Heart;
    case 'ShoppingBag':
    case 'shopping-bag':
    default:
      return ShoppingBag;
  }
};

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

interface MindMapCanvasProps {
  onOpenGuide?: () => void;
}

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({ onOpenGuide }) => {
  const {
    categories,
    totalMonthlySpend,
    totalMonthlyBudget,
    transactions,
    activeCategory,
    setActiveCategory,
    updateCategoryBudget,
    addTransaction,
    accounts,
    highlightedElementId,
  } = useFinanceContext();

  // Full Overlay / Fullscreen mode
  const [isOverlayMode, setIsOverlayMode] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'overspent' | 'top'>('all');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Inspector & detail states
  const [showCenterDetail, setShowCenterDetail] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState<string>('');
  const [quickTxMerchant, setQuickTxMerchant] = useState('');
  const [quickTxAmount, setQuickTxAmount] = useState('');
  const [showAddTxForm, setShowAddTxForm] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 1400, height: 800 });

  // Responsive dimension tracker
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setCanvasDimensions({
          width: Math.max(1200, clientWidth || 1400),
          height: Math.max(750, clientHeight || 800),
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isOverlayMode]);

  // Center coordinate of canvas dynamically scaled
  const CANVAS_WIDTH = canvasDimensions.width;
  const CANVAS_HEIGHT = canvasDimensions.height;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;
  const CENTER_RADIUS = 76;

  // Filtered categories based on selected view
  const visibleCategories = useMemo(() => {
    if (filterMode === 'overspent') {
      return categories.filter(c => c.spent > c.budget);
    }
    if (filterMode === 'top') {
      return [...categories].sort((a, b) => b.spent - a.spent).slice(0, 5);
    }
    return categories;
  }, [categories, filterMode]);

  // Compute radial layout coordinates proportionally
  const computeInitialPositions = useCallback((): Record<string, NodePosition> => {
    const positions: Record<string, NodePosition> = {};
    const count = categories.length;
    // Orbit radius dynamically scales with screen width
    const ORBIT_RADIUS = Math.min(CANVAS_WIDTH * 0.28, CANVAS_HEIGHT * 0.36, 320);

    categories.forEach((cat, index) => {
      const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
      positions[cat.id] = {
        id: cat.id,
        x: CENTER_X + Math.cos(angle) * ORBIT_RADIUS,
        y: CENTER_Y + Math.sin(angle) * ORBIT_RADIUS,
      };
    });
    return positions;
  }, [categories, CENTER_X, CENTER_Y, CANVAS_WIDTH, CANVAS_HEIGHT]);

  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>(() => computeInitialPositions());

  // Update positions when canvas dimensions or categories change
  useEffect(() => {
    setNodePositions(computeInitialPositions());
  }, [categories, computeInitialPositions]);

  // Active category object
  const selectedCat = useMemo(() => {
    return categories.find(c => c.id === activeCategory) || null;
  }, [categories, activeCategory]);

  // Selected category transactions
  const categoryTransactions = useMemo(() => {
    if (!selectedCat) return [];
    return transactions.filter(
      t =>
        t.category.toLowerCase().includes(selectedCat.name.toLowerCase()) ||
        selectedCat.name.toLowerCase().includes(t.category.toLowerCase())
    );
  }, [selectedCat, transactions]);

  // Canvas pan & drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest('.mindmap-node') ||
      (e.target as HTMLElement).closest('.hud-control') ||
      (e.target as HTMLElement).closest('.detail-panel')
    ) {
      return;
    }
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingNodeId) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = (e.clientX - rect.left - pan.x) / zoom;
      const rawY = (e.clientY - rect.top - pan.y) / zoom;

      setNodePositions(prev => ({
        ...prev,
        [draggingNodeId]: {
          id: draggingNodeId,
          x: Math.max(70, Math.min(CANVAS_WIDTH - 70, rawX)),
          y: Math.max(70, Math.min(CANVAS_HEIGHT - 70, rawY)),
        },
      }));
      return;
    }

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggingNodeId(id);
  };

  const resetLayout = () => {
    setNodePositions(computeInitialPositions());
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleSaveBudget = () => {
    if (!selectedCat) return;
    const val = parseFloat(newBudgetValue);
    if (!isNaN(val) && val > 0) {
      updateCategoryBudget(selectedCat.id, val);
    }
    setEditingBudget(false);
  };

  const handleQuickAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat) return;
    const amount = parseFloat(quickTxAmount);
    if (!quickTxMerchant.trim() || isNaN(amount) || amount <= 0) return;

    addTransaction({
      merchant: quickTxMerchant.trim(),
      amount,
      category: selectedCat.name,
      account: accounts[0]?.name || 'Chase Checking',
      date: new Date().toISOString().split('T')[0],
      flagged: false,
    });

    setQuickTxMerchant('');
    setQuickTxAmount('');
    setShowAddTxForm(false);
  };

  // Keyboard shortcut: ESC exits overlay or closes details
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedCat) {
          setActiveCategory(null);
        } else if (showCenterDetail) {
          setShowCenterDetail(false);
        } else if (isOverlayMode) {
          setIsOverlayMode(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCat, showCenterDetail, isOverlayMode, setActiveCategory]);

  return (
    <div
      className={`transition-all duration-300 w-full ${
        isOverlayMode
          ? 'fixed inset-0 z-50 bg-[#030712] flex flex-col p-3 sm:p-5'
          : 'relative flex flex-col w-full'
      }`}
    >
      {/* Top Floating Overlay Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#0B1B33]/90 backdrop-blur-xl border border-[#1E3352] shadow-2xl mb-3">
        {/* Title & Overall Indicator */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FDE047] text-[#06101E] shadow-[0_0_15px_rgba(253,224,71,0.4)]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                Financial Mind Map <span className="text-[#FDE047]">Topology</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FDE047]/20 text-[#FDE047] border border-[#FDE047]/40 shadow-sm">
                Full-Canvas Overlay
              </span>
            </div>
            <p className="text-[11px] text-[#9BB5D6]">
              Visual wealth orbit. Click any bubble or the master center hub to view transactions & adjust budgets.
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#06101E] border border-[#1E3352]">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-[#FDE047] text-[#06101E] shadow-[0_0_10px_rgba(253,224,71,0.3)]'
                : 'text-[#9BB5D6] hover:text-white'
            }`}
          >
            All Nodes ({categories.length})
          </button>
          <button
            onClick={() => setFilterMode('overspent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              filterMode === 'overspent'
                ? 'bg-[#FF4D6A] text-white shadow-[0_0_10px_rgba(255,77,106,0.4)]'
                : 'text-[#9BB5D6] hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Overspent</span>
          </button>
          <button
            onClick={() => setFilterMode('top')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'top'
                ? 'bg-[#FDE047] text-[#06101E] shadow-[0_0_10px_rgba(253,224,71,0.3)]'
                : 'text-[#9BB5D6] hover:text-white'
            }`}
          >
            Top 5 Spenders
          </button>
        </div>

        {/* Viewport & Overlay Controls */}
        <div className="flex items-center space-x-2">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              title="Open User Guide & Cover Manual"
              className="hud-control flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0F2444] hover:bg-[#132E56] text-[#FDE047] border border-[#FDE047]/40 shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#FDE047]" />
              <span className="hidden md:inline">User Guide</span>
            </button>
          )}
          <button
            onClick={() => setZoom(z => Math.min(1.8, z + 0.15))}
            title="Zoom In"
            className="hud-control p-2 rounded-xl bg-[#0F2444] hover:bg-[#132E56] text-[#9BB5D6] hover:text-white border border-[#1E3352] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.15))}
            title="Zoom Out"
            className="hud-control p-2 rounded-xl bg-[#0F2444] hover:bg-[#132E56] text-[#9BB5D6] hover:text-white border border-[#1E3352] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetLayout}
            title="Recenter Topology"
            className="hud-control flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#0F2444] hover:bg-[#132E56] text-[#9BB5D6] hover:text-white border border-[#1E3352] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Recenter</span>
          </button>
          <button
            onClick={() => setIsOverlayMode(prev => !prev)}
            title={isOverlayMode ? 'Exit Fullscreen Overlay (Esc)' : 'Expand to Full Screen Overlay'}
            className="hud-control flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] shadow-[0_0_18px_rgba(253,224,71,0.4)] transition-all"
          >
            {isOverlayMode ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Overlay</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Full Overlay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas - Fluidly responsive */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#030712] via-[#071324] to-[#0B1B33] border border-[#1E3352] shadow-2xl select-none flex-1 min-h-[640px] sm:min-h-[720px] lg:min-h-[780px]`}
      >
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-full h-full min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] cursor-grab active:cursor-grabbing overflow-hidden"
        >
          {/* Ambient Background Starfield / Matrix Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: `radial-gradient(#FDE047 1px, transparent 1px), radial-gradient(#3D9EFF 1px, transparent 1px)`,
              backgroundSize: '48px 48px, 24px 24px',
              backgroundPosition: '0 0, 12px 12px',
            }}
          />

          {/* Quick Interaction Hint Badge */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0B1B33]/85 backdrop-blur-md border border-[#FDE047]/30 text-[11px] text-[#FDE047] shadow-lg">
            <Eye className="w-3.5 h-3.5 text-[#FDE047]" />
            <span className="font-semibold">Click any category bubble or central hub for full transaction ledgers</span>
          </div>

          {/* Transformable Canvas Layer */}
          <div
            className="absolute origin-center transition-transform duration-75"
            style={{
              width: `${CANVAS_WIDTH}px`,
              height: `${CANVAS_HEIGHT}px`,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {/* SVG Connecting Orbits and Energy Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
            >
              <defs>
                <radialGradient id="orbitRingGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FDE047" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Outer Orbit Guide Ring */}
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={Math.min(CANVAS_WIDTH * 0.28, CANVAS_HEIGHT * 0.36, 320)}
                fill="url(#orbitRingGlow)"
                stroke="#FDE047"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                className="opacity-40"
              />

              {/* Inner Orbit Guide Ring */}
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={Math.min(CANVAS_WIDTH * 0.14, CANVAS_HEIGHT * 0.18, 160)}
                fill="none"
                stroke="#1E3352"
                strokeWidth="1"
                strokeDasharray="3 6"
                className="opacity-30"
              />

              {/* Connecting Splines */}
              {visibleCategories.map(cat => {
                const pos = nodePositions[cat.id];
                if (!pos) return null;
                const isOver = cat.spent > cat.budget;
                const isSelected = activeCategory === cat.id;

                return (
                  <g key={`spline-${cat.id}`}>
                    <line
                      x1={CENTER_X}
                      y1={CENTER_Y}
                      x2={pos.x}
                      y2={pos.y}
                      stroke={isOver ? '#FF4D6A' : cat.color}
                      strokeWidth={isSelected ? '4' : isOver ? '3.5' : '2'}
                      strokeOpacity={isSelected ? 0.95 : isOver ? 0.8 : 0.4}
                      strokeDasharray={isOver ? '6 4' : undefined}
                    />
                    {/* Pulsing energy waypoint */}
                    <circle
                      cx={(CENTER_X + pos.x) / 2}
                      cy={(CENTER_Y + pos.y) / 2}
                      r={isOver ? 5 : 3.5}
                      fill={isOver ? '#FF4D6A' : cat.color}
                      className="opacity-90 animate-pulse"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Center Node: Total Monthly Financial Hub */}
            <div
              id="node-mindmap-center"
              className={`absolute flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#0B1B33] via-[#0F2444] to-[#040914] border-4 border-[#FDE047] shadow-[0_0_55px_rgba(253,224,71,0.45)] cursor-pointer transition-all duration-300 z-20 group ${
                highlightedElementId === 'node-mindmap-center'
                  ? 'ring-8 ring-[#FDE047] shadow-[0_0_80px_rgba(253,224,71,0.9)] scale-120 animate-pulse'
                  : 'hover:scale-108'
              }`}
              style={{
                left: `${CENTER_X - CENTER_RADIUS}px`,
                top: `${CENTER_Y - CENTER_RADIUS}px`,
                width: `${CENTER_RADIUS * 2}px`,
                height: `${CENTER_RADIUS * 2}px`,
              }}
              onClick={() => {
                setActiveCategory(null);
                setShowCenterDetail(true);
              }}
            >
              {highlightedElementId === 'node-mindmap-center' && (
                <div className="absolute -bottom-8 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FDE047] text-[#06101E] shadow-2xl animate-bounce whitespace-nowrap">
                  👆 Workflow Bubble (Sign Up Core)
                </div>
              )}
              <div className="absolute -top-3.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FDE047] text-[#06101E] shadow-[0_0_10px_rgba(253,224,71,0.5)]">
                Master Hub
              </div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#FDE047]">Monthly Total</span>
              <span className="text-2xl font-black text-white font-mono mt-0.5">
                ${totalMonthlySpend.toLocaleString()}
              </span>
              <div className="flex items-center space-x-1 mt-1 text-[11px] text-[#9BB5D6]">
                <span>of</span>
                <span className="font-bold text-[#FDE047]">${totalMonthlyBudget.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-[#FDE047] font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click for details
              </span>
            </div>

            {/* Orbiting Category Nodes */}
            {visibleCategories.map(cat => {
              const pos = nodePositions[cat.id];
              if (!pos) return null;
              const ratio = cat.spent / cat.budget;
              const isOver = cat.spent > cat.budget;
              const isSelected = activeCategory === cat.id;
              const isHighlighted = highlightedElementId === `node-cat-${cat.id}` || (highlightedElementId === 'node-cat-2' && (cat.id === 'cat_2' || cat.id === 'c2' || cat.id === '2'));
              const Icon = getCategoryIcon(cat.icon);

              // Proportional radius based on spend ratio
              const baseRadius = 50 + Math.min(ratio, 1.5) * 18;
              const diameter = baseRadius * 2;

              return (
                <div
                  key={cat.id}
                  id={`node-cat-${cat.id}`}
                  className="mindmap-node absolute z-30 group select-none"
                  style={{
                    left: `${pos.x - baseRadius}px`,
                    top: `${pos.y - baseRadius}px`,
                    width: `${diameter}px`,
                    height: `${diameter}px`,
                  }}
                  onMouseDown={e => handleNodeMouseDown(e, cat.id)}
                  onClick={() => {
                    setShowCenterDetail(false);
                    setActiveCategory(activeCategory === cat.id ? null : cat.id);
                  }}
                >
                  <div
                    className={`relative w-full h-full rounded-full flex flex-col items-center justify-center p-3 text-center transition-all duration-200 cursor-pointer ${
                      isOver ? 'animate-pulse-glow ring-2 ring-[#FF4D6A]' : ''
                    } ${
                      isHighlighted
                        ? 'ring-8 ring-[#FDE047] scale-125 shadow-[0_0_60px_rgba(253,224,71,0.85)] animate-pulse'
                        : isSelected
                        ? 'ring-4 ring-[#FDE047] shadow-[0_0_40px_rgba(253,224,71,0.5)] scale-110'
                        : 'hover:scale-106 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
                    }`}
                    style={{
                      backgroundColor: `${cat.color}28`,
                      border: `2.5px solid ${isOver ? '#FF4D6A' : cat.color}`,
                    }}
                  >
                    {/* Warning Indicator */}
                    {isOver && (
                      <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#FF4D6A] text-white shadow-lg border-2 border-[#030712]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Category Icon */}
                    <div
                      className="p-2 rounded-full mb-1"
                      style={{ backgroundColor: `${cat.color}40`, color: cat.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Category Title */}
                    <span className="text-xs font-extrabold text-white truncate max-w-[90%] leading-tight">
                      {cat.name}
                    </span>

                    {/* Category Spend */}
                    <span
                      className={`text-xs sm:text-sm font-black font-mono mt-0.5 ${
                        isOver ? 'text-[#FF4D6A]' : 'text-white'
                      }`}
                    >
                      ${cat.spent.toLocaleString()}
                    </span>

                    {/* Subtext info */}
                    <span className="text-[10px] text-[#9BB5D6] font-semibold">
                      / ${cat.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* DETAILED CATEGORY INSPECTOR OVERLAY / DRAWER                              */}
          {/* ========================================================================= */}
          {selectedCat && (
            <div className="detail-panel absolute top-4 right-4 bottom-4 w-full sm:w-[440px] p-6 rounded-3xl bg-[#0B1B33]/98 backdrop-blur-2xl border-2 border-[#FDE047]/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] z-40 overflow-y-auto flex flex-col justify-between animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                {/* Header with Color Tag & Close */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1E3352]">
                  <div className="flex items-center space-x-3.5">
                    <div
                      className="p-3 rounded-2xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: `${selectedCat.color}35`, color: selectedCat.color }}
                    >
                      {React.createElement(getCategoryIcon(selectedCat.icon), { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base sm:text-lg font-black text-white">{selectedCat.name}</h3>
                        {selectedCat.spent > selectedCat.budget ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF4D6A]/20 text-[#FF4D6A] border border-[#FF4D6A]/40">
                            Over Budget
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDE047]/15 text-[#FDE047] border border-[#FDE047]/30">
                            On Track
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#9BB5D6]">Category Details & Direct Controls</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveCategory(null)}
                    className="p-2 rounded-xl text-[#9BB5D6] hover:text-[#FDE047] hover:bg-[#0F2444] transition-colors border border-[#1E3352]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Consumption Progress Meter */}
                <div className="mt-4 p-4 rounded-2xl bg-[#06101E]/90 border border-[#1E3352]">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-[#9BB5D6] font-bold">Budget Consumption</span>
                    <span
                      className={`font-mono font-black ${
                        selectedCat.spent > selectedCat.budget ? 'text-[#FF4D6A]' : 'text-[#FDE047]'
                      }`}
                    >
                      {((selectedCat.spent / selectedCat.budget) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-3.5 rounded-full bg-[#0F2444] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((selectedCat.spent / selectedCat.budget) * 100, 100)}%`,
                        backgroundColor: selectedCat.spent > selectedCat.budget ? '#FF4D6A' : selectedCat.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#9BB5D6] mt-2 font-semibold">
                    <span>${selectedCat.spent.toLocaleString()} spent</span>
                    <span>${selectedCat.budget.toLocaleString()} target</span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 mt-3 text-center">
                  <div className="p-3 rounded-2xl bg-[#06101E]/80 border border-[#1E3352]">
                    <div className="text-[10px] uppercase font-bold text-[#9BB5D6]">Spent</div>
                    <div
                      className="text-sm font-black font-mono mt-0.5"
                      style={{ color: selectedCat.color }}
                    >
                      ${selectedCat.spent.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#06101E]/80 border border-[#1E3352]">
                    <div className="text-[10px] uppercase font-bold text-[#9BB5D6]">Budget</div>
                    <div className="text-sm font-black font-mono text-white mt-0.5">
                      ${selectedCat.budget.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#06101E]/80 border border-[#1E3352]">
                    <div className="text-[10px] uppercase font-bold text-[#9BB5D6]">Remaining</div>
                    <div
                      className={`text-sm font-black font-mono mt-0.5 ${
                        selectedCat.spent > selectedCat.budget ? 'text-[#FF4D6A]' : 'text-[#FDE047]'
                      }`}
                    >
                      {selectedCat.spent > selectedCat.budget
                        ? `-$${(selectedCat.spent - selectedCat.budget).toLocaleString()}`
                        : `$${(selectedCat.budget - selectedCat.spent).toLocaleString()}`}
                    </div>
                  </div>
                </div>

                {/* Budget Adjustment Panel */}
                <div className="mt-4 p-4 rounded-2xl bg-[#06101E]/80 border border-[#1E3352]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Sliders className="w-4 h-4 text-[#FDE047]" />
                      <span>Adjust Monthly Budget</span>
                    </span>
                    {!editingBudget && (
                      <button
                        onClick={() => {
                          setEditingBudget(true);
                          setNewBudgetValue(selectedCat.budget.toString());
                        }}
                        className="text-xs text-[#FDE047] hover:underline flex items-center space-x-1 font-bold"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  {editingBudget ? (
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={newBudgetValue}
                          onChange={e => setNewBudgetValue(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#0F2444] border border-[#FDE047] text-white font-mono focus:outline-none"
                          placeholder="e.g. 800"
                        />
                        <button
                          onClick={handleSaveBudget}
                          className="px-4 py-2 rounded-xl bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-black shadow-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingBudget(false)}
                          className="px-3 py-2 rounded-xl bg-[#0F2444] text-[#9BB5D6] hover:text-white text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#9BB5D6]">
                      Current monthly allocation is <strong className="text-white">${selectedCat.budget}</strong>. Click edit to rebalance instantly.
                    </p>
                  )}
                </div>

                {/* Category Transaction Activity */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Recent Activity ({categoryTransactions.length})
                    </span>
                    <button
                      onClick={() => setShowAddTxForm(prev => !prev)}
                      className="text-xs text-[#FDE047] hover:underline flex items-center space-x-1 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Expense</span>
                    </button>
                  </div>

                  {/* Inline quick expense logger */}
                  {showAddTxForm && (
                    <form onSubmit={handleQuickAddTx} className="p-3.5 mb-2.5 rounded-2xl bg-[#0F2444] border border-[#FDE047]/40 space-y-2 shadow-lg">
                      <div className="text-[11px] font-bold text-white">Log Expense to {selectedCat.name}</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={quickTxMerchant}
                          onChange={e => setQuickTxMerchant(e.target.value)}
                          placeholder="Merchant (e.g. Target)"
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
                        />
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={quickTxAmount}
                          onChange={e => setQuickTxAmount(e.target.value)}
                          placeholder="$0.00"
                          className="w-24 px-3 py-1.5 text-xs font-mono rounded-xl bg-[#06101E] border border-[#1E3352] text-white focus:outline-none focus:border-[#FDE047]"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-[#FDE047] hover:bg-[#FEF08A] text-[#06101E] text-xs font-black rounded-xl"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {categoryTransactions.length > 0 ? (
                      categoryTransactions.map(tx => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#06101E]/80 border border-[#1E3352] text-xs hover:border-[#FDE047]/30 transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-white truncate">{tx.merchant}</div>
                            <div className="text-[10px] text-[#9BB5D6] flex items-center space-x-1.5 mt-0.5">
                              <span>{tx.date}</span>
                              <span>•</span>
                              <span>{tx.account}</span>
                            </div>
                          </div>
                          <div className="font-black text-white font-mono flex-shrink-0">
                            -${tx.amount.toFixed(2)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-[#9BB5D6] text-center py-4 bg-[#06101E]/60 rounded-2xl border border-[#1E3352]">
                        No recorded transactions for this category yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button Footer */}
              <div className="pt-4 mt-4 border-t border-[#1E3352]">
                <button
                  onClick={() => setActiveCategory(null)}
                  className="w-full py-2.5 rounded-2xl bg-[#0F2444] hover:bg-[#132E56] text-[#FDE047] text-xs font-bold transition-colors border border-[#1E3352]"
                >
                  Close Category Details
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DETAILED MASTER CENTER OVERLAY DRAWER                                     */}
          {/* ========================================================================= */}
          {showCenterDetail && !selectedCat && (
            <div className="detail-panel absolute top-4 right-4 bottom-4 w-full sm:w-[440px] p-6 rounded-3xl bg-[#0B1B33]/98 backdrop-blur-2xl border-2 border-[#FDE047]/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] z-40 overflow-y-auto flex flex-col justify-between animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#1E3352]">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 rounded-2xl bg-[#FDE047] text-[#06101E] shadow-md">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white">Monthly Cashflow Overview</h3>
                      <p className="text-xs text-[#9BB5D6]">Holistic budget allocation & velocity</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCenterDetail(false)}
                    className="p-2 rounded-xl text-[#9BB5D6] hover:text-[#FDE047] hover:bg-[#0F2444] transition-colors border border-[#1E3352]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Overall Summary Cards */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3.5 rounded-2xl bg-[#06101E]/90 border border-[#1E3352]">
                    <div className="text-[10px] uppercase font-bold text-[#9BB5D6]">Total Spent</div>
                    <div className="text-lg font-black text-white font-mono mt-0.5">
                      ${totalMonthlySpend.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#06101E]/90 border border-[#1E3352]">
                    <div className="text-[10px] uppercase font-bold text-[#9BB5D6]">Target Budget</div>
                    <div className="text-lg font-black text-[#FDE047] font-mono mt-0.5">
                      ${totalMonthlyBudget.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 p-4 rounded-2xl bg-[#06101E]/90 border border-[#1E3352]">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#9BB5D6] font-bold">Total Monthly Burn</span>
                    <span className="font-black text-white font-mono">
                      {((totalMonthlySpend / totalMonthlyBudget) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#0F2444] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#FDE047]"
                      style={{
                        width: `${Math.min((totalMonthlySpend / totalMonthlyBudget) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#9BB5D6] mt-2 font-semibold">
                    <span>${totalMonthlyBudget - totalMonthlySpend} cushion remaining</span>
                  </div>
                </div>

                {/* Ranked Category Distribution */}
                <div className="mt-4">
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                    Spending by Category
                  </div>
                  <div className="space-y-2">
                    {categories.map(cat => {
                      const isOver = cat.spent > cat.budget;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setShowCenterDetail(false);
                            setActiveCategory(cat.id);
                          }}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#06101E]/80 border border-[#1E3352] hover:border-[#FDE047]/50 cursor-pointer transition-all"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-xs font-bold text-white truncate">{cat.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs font-mono font-black ${
                                isOver ? 'text-[#FF4D6A]' : 'text-white'
                              }`}
                            >
                              ${cat.spent.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-[#9BB5D6]">/ ${cat.budget}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E3352]">
                <button
                  onClick={() => setShowCenterDetail(false)}
                  className="w-full py-2.5 rounded-2xl bg-[#0F2444] hover:bg-[#132E56] text-[#FDE047] text-xs font-bold transition-colors border border-[#1E3352]"
                >
                  Close Overview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

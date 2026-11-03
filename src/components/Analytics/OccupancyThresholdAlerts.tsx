import React, { useState, useMemo } from 'react';
import { DailyMetric } from '../../types';
import { 
  WEEKLY_OCCUPANCY_DATA, 
  MONTHLY_OCCUPANCY_DATA, 
  PeriodOccupancyMetric 
} from '../../data/occupancyPeriodsData';
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Calendar, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  BellRing, 
  Filter, 
  Info,
  DollarSign,
  BedDouble,
  BarChart3,
  Percent
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  Cell,
  Legend,
  ComposedChart,
  Line
} from 'recharts';

interface OccupancyThresholdAlertsProps {
  dailyMetrics: DailyMetric[];
}

export const OccupancyThresholdAlerts: React.FC<OccupancyThresholdAlertsProps> = ({ dailyMetrics }) => {
  // Configurable threshold target goal (default 80%)
  const [occupancyGoal, setOccupancyGoal] = useState<number>(80);
  // View mode: 'daily' | 'weekly' | 'monthly'
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  // Filter only deficient periods
  const [showOnlyAlerts, setShowOnlyAlerts] = useState<boolean>(false);
  // Toast notification for applied remediation
  const [remediationApplied, setRemediationApplied] = useState<string | null>(null);

  // Normalize daily metrics into unified PeriodOccupancyMetric format
  const dailyPeriodData: PeriodOccupancyMetric[] = useMemo(() => {
    return dailyMetrics.map(d => ({
      id: d.date,
      label: d.dayLabel.replace(' (Today)', ''),
      subLabel: d.date,
      periodType: 'day' as const,
      occupancyPercent: d.occupancyPercent,
      adr: d.adr,
      revPar: d.revPar,
      roomNightsAvailable: 12,
      roomNightsSold: Math.round((d.occupancyPercent / 100) * 12),
      totalRevenue: d.totalRoomRevenue + d.totalFBRevenue + d.totalSpaRevenue + d.totalExcursionsRevenue,
      status: 'actual' as const,
      primaryFactor: d.occupancyPercent < occupancyGoal ? 'Midweek business travel slowdown' : 'High luxury suite demand',
      recommendedAction: d.occupancyPercent < occupancyGoal ? 'Activate 2-night minimum luxury spa inclusion' : undefined
    }));
  }, [dailyMetrics, occupancyGoal]);

  // Current active dataset based on timeframe selection
  const activeDataset: PeriodOccupancyMetric[] = useMemo(() => {
    if (timeframe === 'daily') return dailyPeriodData;
    if (timeframe === 'weekly') return WEEKLY_OCCUPANCY_DATA;
    return MONTHLY_OCCUPANCY_DATA;
  }, [timeframe, dailyPeriodData]);

  // Filtered dataset (for cards & table)
  const displayDataset = useMemo(() => {
    if (!showOnlyAlerts) return activeDataset;
    return activeDataset.filter(item => item.occupancyPercent < occupancyGoal);
  }, [activeDataset, showOnlyAlerts, occupancyGoal]);

  // Threshold breaches analysis
  const alertItems = useMemo(() => {
    return activeDataset.filter(item => item.occupancyPercent < occupancyGoal);
  }, [activeDataset, occupancyGoal]);

  const totalDeficitRoomNights = useMemo(() => {
    return alertItems.reduce((acc, item) => {
      const targetSold = Math.round((occupancyGoal / 100) * item.roomNightsAvailable);
      const gap = Math.max(0, targetSold - item.roomNightsSold);
      return acc + gap;
    }, 0);
  }, [alertItems, occupancyGoal]);

  const estimatedRevenueDeficit = useMemo(() => {
    return alertItems.reduce((acc, item) => {
      const targetSold = Math.round((occupancyGoal / 100) * item.roomNightsAvailable);
      const gap = Math.max(0, targetSold - item.roomNightsSold);
      return acc + (gap * item.adr);
    }, 0);
  }, [alertItems, occupancyGoal]);

  const avgDatasetOccupancy = useMemo(() => {
    if (!activeDataset.length) return 0;
    return Math.round(activeDataset.reduce((acc, item) => acc + item.occupancyPercent, 0) / activeDataset.length);
  }, [activeDataset]);

  const handleApplyRemediation = (itemLabel: string, actionText: string) => {
    setRemediationApplied(`Applied yield action for ${itemLabel}: "${actionText}"`);
    setTimeout(() => {
      setRemediationApplied(null);
    }, 4000);
  };

  if (dailyMetrics.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-[#D8CEBF] bg-[#FAF8F4] px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFE8DA] text-[#8C6C1D]">
          <BarChart3 className="h-5 w-5" />
        </div>
        <h3 className="mt-4 font-serif-heading text-xl font-semibold text-[#1E2522]">No occupancy history yet</h3>
        <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-[#71827B]">
          Occupancy thresholds and revenue opportunities will appear here when this property has reporting data. Demo history from other hotels is kept out of this workspace.
        </p>
      </section>
    );
  }

  return (
    <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-7 shadow-sm space-y-6">
      
      {/* Toast Notification */}
      {remediationApplied && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E2522] text-[#FBF9F5] px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">Yield Automation Executed</p>
            <p className="text-[11px] text-[#A8BDB4]">{remediationApplied}</p>
          </div>
        </div>
      )}

      {/* Header & Threshold Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-6 border-b border-[#EAE3D6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              Threshold Alert Engine
            </span>
            <span className="text-xs text-[#7A8C84]">Occupancy Floor & Deficit Monitoring</span>
          </div>
          <h3 className="font-serif-heading text-2xl font-bold text-[#1E2522]">
            Occupancy Target & Threshold Breach Detection
          </h3>
          <p className="text-xs text-[#6B7E76] mt-0.5">
            Highlight months, weeks, and operational days falling below target occupancy to trigger rapid yield actions.
          </p>
        </div>

        {/* Goal Selector Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-[#FAF8F4] border border-[#E7DFD2] p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold text-[#1E2522]">Target Goal:</span>
          </div>

          <div className="flex items-center gap-1 bg-white border border-[#E3DCD1] p-1 rounded-xl">
            {[70, 75, 80, 85, 90].map((goal) => (
              <button
                key={goal}
                onClick={() => setOccupancyGoal(goal)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  occupancyGoal === goal
                    ? 'bg-[#1E2522] text-[#D4AF37] shadow-sm'
                    : 'text-[#697D74] hover:text-[#1E2522] hover:bg-[#FAF8F4]'
                }`}
              >
                {goal}%
              </button>
            ))}
          </div>

          {/* Custom Slider / Fine Tuner */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E3DCD1]">
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={occupancyGoal}
              onChange={(e) => setOccupancyGoal(Number(e.target.value))}
              className="w-20 accent-[#1E2522] cursor-pointer"
            />
            <span className="font-serif-heading font-bold text-sm text-[#1E2522] min-w-[32px]">
              {occupancyGoal}%
            </span>
          </div>
        </div>
      </div>

      {/* Threshold Status Summary Banner */}
      {alertItems.length > 0 ? (
        <div className="bg-rose-50/90 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-heading font-bold text-base text-rose-950">
                  {alertItems.length} {timeframe.toUpperCase()} {alertItems.length === 1 ? 'Period' : 'Periods'} Below {occupancyGoal}% Target
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900 uppercase">
                  Alert Active
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Identified a cumulative deficit of <strong>{totalDeficitRoomNights} room nights</strong> below floor goal ({occupancyGoal}%), representing an estimated <strong>${estimatedRevenueDeficit.toLocaleString()}</strong> revenue gap.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setShowOnlyAlerts(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              View {alertItems.length} Alert {alertItems.length === 1 ? 'Period' : 'Periods'}
            </button>
            <button
              onClick={() => handleApplyRemediation('All Deficient Periods', 'OTA Boost + Resident Direct Promo Broadcasted')}
              className="px-3.5 py-2 rounded-xl bg-[#1E2522] hover:bg-[#2C3B34] text-[#D4AF37] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
              Auto-Resolve Gap
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-heading font-bold text-base text-emerald-950">
                All {timeframe.toUpperCase()} Periods Meeting or Exceeding {occupancyGoal}% Target
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Current operational performance has zero threshold alerts across this timeframe view. Average occupancy is {avgDatasetOccupancy}%.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View Switchers & Interactive Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        
        {/* Timeframe Granularity Tabs */}
        <div className="flex items-center bg-[#FAF8F4] p-1 rounded-2xl border border-[#E7DFD2]">
          <button
            onClick={() => { setTimeframe('daily'); setShowOnlyAlerts(false); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              timeframe === 'daily'
                ? 'bg-[#1E2522] text-white shadow-sm'
                : 'text-[#64776E] hover:text-[#1E2522]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Daily Cycle (May 9–17)
          </button>
          <button
            onClick={() => { setTimeframe('weekly'); setShowOnlyAlerts(false); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              timeframe === 'weekly'
                ? 'bg-[#1E2522] text-white shadow-sm'
                : 'text-[#64776E] hover:text-[#1E2522]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Weekly Cohorts (8 Weeks)
          </button>
          <button
            onClick={() => { setTimeframe('monthly'); setShowOnlyAlerts(false); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              timeframe === 'monthly'
                ? 'bg-[#1E2522] text-white shadow-sm'
                : 'text-[#64776E] hover:text-[#1E2522]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Monthly Overview (FY 2026)
          </button>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#64776E] font-medium">Filter View:</span>
          <button
            onClick={() => setShowOnlyAlerts(false)}
            className={`px-3 py-1 rounded-xl font-bold transition-colors ${
              !showOnlyAlerts
                ? 'bg-[#1E2522] text-white'
                : 'bg-[#FAF8F4] text-[#64776E] border border-[#E7DFD2] hover:text-[#1E2522]'
            }`}
          >
            All Periods ({activeDataset.length})
          </button>
          <button
            onClick={() => setShowOnlyAlerts(true)}
            className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
              showOnlyAlerts
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Alerts Only ({alertItems.length})
          </button>
        </div>
      </div>

      {/* Interactive Chart with Red Threshold Indicators */}
      <div className="bg-[#FAF8F4] border border-[#E7DFD2] rounded-2xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-serif-heading text-lg font-bold text-[#1E2522] flex items-center gap-2">
              Occupancy Curve vs Threshold Goal ({occupancyGoal}%)
            </h4>
            <p className="text-xs text-[#6B7E76]">
              Red bars and dots denote operational periods falling below the {occupancyGoal}% threshold target.
            </p>
          </div>

          {/* Legend indicators */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#1E2522]" />
              <span className="text-[#51635C] font-medium">≥ {occupancyGoal}% (Target Met)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
              <span className="text-rose-700 font-bold">&lt; {occupancyGoal}% (Alert Threshold)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-rose-600" />
              <span className="text-rose-700 font-semibold">Goal Floor ({occupancyGoal}%)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={activeDataset} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
              <XAxis 
                dataKey="label" 
                stroke="#7A8D85" 
                fontSize={11} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#7A8D85" 
                fontSize={11} 
                domain={[40, 105]} 
                tickLine={false} 
                tickFormatter={(v) => `${v}%`} 
              />
              
              {/* Red Dashed Goal Reference Line */}
              <ReferenceLine 
                y={occupancyGoal} 
                stroke="#E11D48" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                label={{ 
                  value: `Goal: ${occupancyGoal}%`, 
                  position: 'insideTopRight', 
                  fill: '#E11D48', 
                  fontSize: 11, 
                  fontWeight: 700 
                }} 
              />

              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload as PeriodOccupancyMetric;
                  const isBelow = data.occupancyPercent < occupancyGoal;
                  const gap = occupancyGoal - data.occupancyPercent;

                  return (
                    <div className="bg-[#1E2522] text-[#FBF9F5] p-3.5 rounded-2xl shadow-xl border border-[#3A4842] text-xs space-y-2 min-w-[200px]">
                      <div className="flex justify-between items-start border-b border-[#2E3C36] pb-1.5">
                        <div>
                          <p className="font-bold text-white text-sm">{data.label}</p>
                          <p className="text-[10px] text-[#A6B8B0]">{data.subLabel}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isBelow ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {isBelow ? `⚠️ Deficit (-${gap}%)` : `✅ Exceeding (+${data.occupancyPercent - occupancyGoal}%)`}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#9DB1A8]">Occupancy:</span>
                          <span className={`font-bold ${isBelow ? 'text-rose-400 text-sm' : 'text-white'}`}>
                            {data.occupancyPercent}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9DB1A8]">ADR:</span>
                          <span className="font-semibold text-white">${data.adr}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9DB1A8]">RevPAR:</span>
                          <span className="font-semibold text-white">${data.revPar}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9DB1A8]">Room Nights Sold:</span>
                          <span className="font-semibold text-white">{data.roomNightsSold} / {data.roomNightsAvailable}</span>
                        </div>
                      </div>

                      {isBelow && data.recommendedAction && (
                        <div className="pt-1.5 border-t border-[#2E3C36] text-[10px] text-amber-300">
                          💡 <em>{data.recommendedAction}</em>
                        </div>
                      )}
                    </div>
                  );
                }}
              />

              {/* Bar with Conditional Red Highlighting for Below-Threshold Data */}
              <Bar 
                dataKey="occupancyPercent" 
                radius={[6, 6, 0, 0]}
                barSize={timeframe === 'monthly' ? 24 : 32}
              >
                {activeDataset.map((entry) => {
                  const isBelow = entry.occupancyPercent < occupancyGoal;
                  return (
                    <Cell 
                      key={`cell-${entry.id}`} 
                      fill={isBelow ? '#E11D48' : '#1E2522'} 
                    />
                  );
                })}
              </Bar>

              {/* Trend line on top */}
              <Line 
                type="monotone" 
                dataKey="occupancyPercent" 
                stroke="#D4AF37" 
                strokeWidth={2} 
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isBelow = payload.occupancyPercent < occupancyGoal;
                  return (
                    <circle 
                      key={`dot-${payload.id}`}
                      cx={cx} 
                      cy={cy} 
                      r={isBelow ? 5 : 3.5} 
                      fill={isBelow ? '#E11D48' : '#D4AF37'} 
                      stroke="#FFFFFF" 
                      strokeWidth={isBelow ? 2 : 1.5} 
                    />
                  );
                }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Period Cards Grid with Red Alert Indicators & Remediation Triggers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-serif-heading text-base font-bold text-[#1E2522] flex items-center gap-2">
            Period Audit Breakdown ({displayDataset.length} {displayDataset.length === 1 ? 'Period' : 'Periods'})
          </h4>
          <span className="text-xs text-[#6B7E76]">
            Showing {showOnlyAlerts ? 'Alert Breaches Only' : 'Complete Series'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayDataset.map((item) => {
            const isBelow = item.occupancyPercent < occupancyGoal;
            const gap = occupancyGoal - item.occupancyPercent;
            const targetSold = Math.round((occupancyGoal / 100) * item.roomNightsAvailable);
            const nightsShortfall = Math.max(0, targetSold - item.roomNightsSold);
            const revShortfall = nightsShortfall * item.adr;

            return (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isBelow 
                    ? 'bg-rose-50/60 border-rose-300 shadow-sm ring-1 ring-rose-300/50' 
                    : 'bg-[#FAF8F4] border-[#E7DFD2] hover:border-[#D4AF37]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-serif-heading font-bold text-base text-[#1E2522] block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-[#6C7E77] block mt-0.5">
                      {item.subLabel}
                    </span>
                  </div>

                  {/* Red Alert Pill or Green Success Pill */}
                  {isBelow ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1 shadow-sm">
                      <TrendingDown className="w-3 h-3" />
                      {item.occupancyPercent}% (Alert -{gap}%)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-700" />
                      {item.occupancyPercent}% (Passed)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 py-2 border-y border-[#EAE3D6] text-xs">
                  <div>
                    <span className="text-[10px] text-[#7A8C84] uppercase font-semibold block">ADR</span>
                    <span className="font-bold text-[#1E2522]">${item.adr}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A8C84] uppercase font-semibold block">RevPAR</span>
                    <span className="font-bold text-[#1E2522]">${item.revPar}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A8C84] uppercase font-semibold block">Sold</span>
                    <span className="font-bold text-[#1E2522]">{item.roomNightsSold}/{item.roomNightsAvailable} nts</span>
                  </div>
                </div>

                {/* Primary Factor & Alert Context */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-start gap-1 text-[#50625B]">
                    <Info className="w-3.5 h-3.5 text-[#889B92] shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">{item.primaryFactor || 'Standard Demand Trend'}</span>
                  </div>

                  {isBelow && (
                    <div className="pt-2">
                      <div className="p-2.5 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-950 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-rose-900 uppercase">
                          <span>Shortfall vs {occupancyGoal}% Goal</span>
                          <span>-{nightsShortfall} keys (~${revShortfall.toLocaleString()})</span>
                        </div>
                        {item.recommendedAction && (
                          <p className="text-[11px] text-rose-800 leading-snug font-medium">
                            👉 {item.recommendedAction}
                          </p>
                        )}
                        <button
                          onClick={() => handleApplyRemediation(item.label, item.recommendedAction || 'Applied dynamic rate reduction')}
                          className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Zap className="w-3 h-3 text-[#D4AF37]" />
                          Execute Yield Action
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

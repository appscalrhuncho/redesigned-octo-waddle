import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { 
  Users, 
  Bed, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Key, 
  ShieldAlert, 
  Bot, 
  Zap, 
  Play, 
  Check, 
  Plus, 
  ArrowRight,
  RefreshCw,
  Sliders,
  BellRing,
  Utensils
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const OperationsCommandCenter: React.FC = () => {
  const { 
    rooms, 
    reservations, 
    todayArrivals, 
    todayDepartures, 
    todayInHouse, 
    occupancyRate, 
    todayRevenue, 
    currentDate,
    activeProperty,
    metrics, 
    alerts, 
    automationRules,
    toggleAutomationRule,
    runAutomationRule,
    channels,
    resolveParityViolation,
    serviceRequests,
    updateServiceRequestStatus,
    updateRoomStatus,
    openFolioModal,
    openDigitalKeyModal,
    setActiveView,
    formatCurrency
  } = useHotel();

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning'>('all');
  const [activeAutomationTab, setActiveAutomationTab] = useState<'rules' | 'logs'>('rules');
  const currentMetric = metrics.find(metric => metric.date === currentDate);
  const adr = currentMetric?.adr;
  const revPar = currentMetric?.revPar;
  const trevPar = rooms.length > 0 ? Math.round(todayRevenue / rooms.length) : undefined;

  // Operational tallies
  const cleanRooms = rooms.filter(r => r.status === 'clean').length;
  const dirtyRooms = rooms.filter(r => r.status === 'dirty').length;
  const inspectingRooms = rooms.filter(r => r.status === 'inspecting').length;
  const outOfOrderRooms = rooms.filter(r => r.status === 'maintenance' || r.status === 'out_of_order').length;

  const vipArrivals = todayArrivals.filter(r => r.vipTier && r.vipTier !== 'Standard');
  const parityViolations = channels.filter(c => c.parityStatus === 'violation');
  const urgentServices = serviceRequests.filter(s => s.status !== 'completed');

  // Exceptions list for the Exception-First Operational Workflows
  const exceptions = [
    ...(dirtyRooms > 0 && vipArrivals.length > 0 ? [{
      id: 'EXC-1',
      severity: 'critical' as const,
      category: 'VIP Readiness',
      title: 'VIP Arrival Expected — Suite Turnover Pending',
      detail: `${vipArrivals[0]?.guestName} (${vipArrivals[0]?.vipTier}) arriving for Suite ${vipArrivals[0]?.roomNumber}. Room currently awaiting final inspection.`,
      actionText: 'Rush Housekeeping',
      onAction: () => {
        if (vipArrivals[0]?.roomId) updateRoomStatus(vipArrivals[0].roomId, 'clean');
      }
    }] : []),
    ...(parityViolations.length > 0 ? [{
      id: 'EXC-2',
      severity: 'warning' as const,
      category: 'Rate Parity',
      title: 'OTA Channel Undercutting Direct Best Rate',
      detail: `Expedia is offering rate of $580 vs Direct BAR of $620 (18% margin erosion risk).`,
      actionText: 'Auto-Fix Rate Parity',
      onAction: () => {
        if (parityViolations[0]) resolveParityViolation(parityViolations[0].id);
      }
    }] : []),
    ...(urgentServices.length > 0 ? [{
      id: 'EXC-3',
      severity: 'critical' as const,
      category: 'Guest SLA',
      title: `Service Request Pending in Suite ${urgentServices[0]?.roomNumber}`,
      detail: `${urgentServices[0]?.guestName} requested: ${urgentServices[0]?.item} (${urgentServices[0]?.requestedAt}).`,
      actionText: 'Mark Dispatched',
      onAction: () => {
        if (urgentServices[0]) updateServiceRequestStatus(urgentServices[0].id, 'completed');
      }
    }] : [])
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Operations Command Briefing */}
      <div className="brand-command-hero brand-neon-glow text-white rounded-2xl p-5 sm:p-6 border border-[#20313B] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00DDF2]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#B8FF00]/15 text-[#C8FF45] border border-[#B8FF00]/35">
                Operations Command Center
              </span>
              <span className={`flex items-center gap-1 text-[11px] font-semibold ${metrics.length > 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                <span className={`w-2 h-2 rounded-full ${metrics.length > 0 ? 'bg-emerald-400 animate-ping' : 'bg-amber-300'}`} />
                {metrics.length > 0 ? 'Property performance active' : 'New property workspace'}
              </span>
            </div>
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {activeProperty} — Executive Morning Briefing
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B4AE] mt-1 max-w-2xl">
              {metrics.length > 0
                ? 'A live overview of hotel inventory, guest folios, and operational exceptions.'
                : 'Your hotel workspace is ready. Add reservations and reporting data to activate performance insights.'}
            </p>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 shrink-0">
            <div className="bg-[#111922] border border-[#253640] rounded-xl p-3 text-center">
              <span className="text-[10px] text-[#8EA299] uppercase tracking-wider block">Occupancy</span>
              <span className="text-xl font-bold font-serif-heading text-[#B8FF00]">{occupancyRate}%</span>
              <span className="text-[10px] text-[#A6B4AE] block">Current in-house</span>
            </div>
            <div className="bg-[#111922] border border-[#253640] rounded-xl p-3 text-center">
              <span className="text-[10px] text-[#8EA299] uppercase tracking-wider block">Est. ADR</span>
              <span className="text-xl font-bold font-serif-heading text-white">{adr !== undefined ? formatCurrency(adr) : '—'}</span>
              <span className="text-[10px] text-[#A6B4AE] block">Avg Daily Rate</span>
            </div>
            <div className="bg-[#111922] border border-[#253640] rounded-xl p-3 text-center">
              <span className="text-[10px] text-[#8EA299] uppercase tracking-wider block">RevPAR</span>
              <span className="text-xl font-bold font-serif-heading text-white">{revPar !== undefined ? formatCurrency(revPar) : '—'}</span>
              <span className="text-[10px] text-[#A6B4AE] block">Revenue / available suite</span>
            </div>
            <div className="bg-[#111922] border border-[#253640] rounded-xl p-3 text-center">
              <span className="text-[10px] text-[#8EA299] uppercase tracking-wider block">TRevPAR</span>
              <span className="text-xl font-bold font-serif-heading text-[#00DDF2]">{trevPar !== undefined ? formatCurrency(trevPar) : '—'}</span>
              <span className="text-[10px] text-[#8EA299] block">Total rev / suite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exception-First Design Attention Board */}
      <div className="bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EAE3D6]">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h2 className="font-serif-heading text-lg font-bold text-[#1E2522]">
                Exception-First Operational Attention Board
              </h2>
            </div>
            <p className="text-xs text-[#7A8C84]">
              High-priority events requiring immediate staff triage before impacting guest satisfaction.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
            {exceptions.length} Active Exceptions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {exceptions.length === 0 ? (
            <div className="col-span-3 text-center py-6 text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
              <span className="font-semibold text-sm">All Operational Systems Operating at 100% SLA</span>
              <p className="text-xs text-emerald-700 mt-1">No VIP delays, unallocated rooms, or channel parity violations.</p>
            </div>
          ) : (
            exceptions.map((exc) => (
              <div 
                key={exc.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  exc.severity === 'critical' 
                    ? 'bg-rose-50/70 border-rose-200 text-[#1E2522]' 
                    : 'bg-amber-50/70 border-amber-200 text-[#1E2522]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      exc.severity === 'critical' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {exc.category}
                    </span>
                    <span className="text-[11px] font-medium text-[#7A8C84]">Action Required</span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#1E2522] leading-snug">{exc.title}</h3>
                  <p className="text-xs text-[#52645D] mt-1.5 leading-relaxed">{exc.detail}</p>
                </div>

                <button
                  onClick={exc.onAction}
                  className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                    exc.severity === 'critical'
                      ? 'bg-rose-700 hover:bg-rose-800 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{exc.actionText}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main 2-Column Grid: Live Property Matrix + Visual Automation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Room Readiness & Front Desk Pulse */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Room Inventory Status Cards */}
          <div className="bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl p-5 shadow-sm">
            <h2 className="font-serif-heading text-base font-bold text-[#1E2522] mb-3 flex items-center justify-between">
              <span>Suite Inventory Readiness Breakdown</span>
              <button 
                onClick={() => setActiveView('matrix')}
                className="text-xs text-[#9E7D23] font-medium hover:underline flex items-center gap-1"
              >
                <span>View Full Tape Chart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-[#EAE3D6] rounded-xl p-3 text-center">
                <span className="text-xs font-semibold text-emerald-700 block">Clean & Ready</span>
                <span className="text-2xl font-bold font-serif-heading text-[#1E2522]">{cleanRooms}</span>
                <span className="text-[10px] text-[#7A8C84] block">Available to check-in</span>
              </div>
              <div className="bg-white border border-[#EAE3D6] rounded-xl p-3 text-center">
                <span className="text-xs font-semibold text-amber-700 block">Dirty / Turnover</span>
                <span className="text-2xl font-bold font-serif-heading text-[#1E2522]">{dirtyRooms}</span>
                <span className="text-[10px] text-[#7A8C84] block">Housekeeping queued</span>
              </div>
              <div className="bg-white border border-[#EAE3D6] rounded-xl p-3 text-center">
                <span className="text-xs font-semibold text-blue-700 block">Inspecting</span>
                <span className="text-2xl font-bold font-serif-heading text-[#1E2522]">{inspectingRooms}</span>
                <span className="text-[10px] text-[#7A8C84] block">Supervisor sign-off</span>
              </div>
              <div className="bg-white border border-[#EAE3D6] rounded-xl p-3 text-center">
                <span className="text-xs font-semibold text-purple-700 block">Maintenance (OOO)</span>
                <span className="text-2xl font-bold font-serif-heading text-[#1E2522]">{outOfOrderRooms}</span>
                <span className="text-[10px] text-[#7A8C84] block">Engineering active</span>
              </div>
            </div>
          </div>

          {/* Today's VIP Arrivals & In-House Spotlight */}
          <div className="bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif-heading text-base font-bold text-[#1E2522]">
                  Today's VIP Arrivals & Suite Allocations
                </h3>
                <p className="text-xs text-[#7A8C84]">High-value guests scheduled to arrive</p>
              </div>
              <button
                onClick={() => setActiveView('frontdesk')}
                className="text-xs font-semibold text-[#9E7D23] hover:underline"
              >
                Front Desk Workspace →
              </button>
            </div>

            <div className="space-y-3">
              {todayArrivals.length === 0 ? (
                <p className="text-xs text-[#7A8C84] text-center py-4">No scheduled arrivals remaining for today.</p>
              ) : (
                todayArrivals.map((res) => (
                  <div
                    key={res.id}
                    className="relative rounded-2xl border border-[#EAE3D6] bg-white p-4 transition-all hover:border-[#D4AF37] hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#1E2522] text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0">
                          {res.guestName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-[#1E2522] truncate">{res.guestName}</span>
                            {res.vipTier && res.vipTier !== 'Standard' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7E9B8] text-[#785C11] border border-[#E5C95F] shrink-0">
                                {res.vipTier}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#7A8C84] block truncate">
                            Suite {res.roomNumber} · {res.roomType} · {res.nights} nights
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A8C84] shrink-0">Today</span>
                    </div>

                    <div className="relative mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="hidden md:block absolute left-[9%] right-[9%] top-3 border-t border-dashed border-[#D8CEBF]" />
                      <div className="relative flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#F7E9B8] text-[#785C11] flex items-center justify-center text-[10px] font-bold z-10">1</span>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8A9A93] font-semibold">Arrival ETA</span>
                          <p className="text-xs font-semibold text-[#1E2522] mt-1">{res.estimatedArrivalTime || '15:00'}</p>
                          <p className="text-[10px] text-[#7A8C84]">Front desk briefing</p>
                        </div>
                      </div>
                      <div className="relative flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#DCEFE7] text-[#176047] flex items-center justify-center text-[10px] font-bold z-10">2</span>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8A9A93] font-semibold">Suite readiness</span>
                          <p className="text-xs font-semibold text-[#1E2522] mt-1">
                            {rooms.find(room => room.id === res.roomId)?.status?.replace('_', ' ') || 'Preparing'}
                          </p>
                          <p className="text-[10px] text-[#7A8C84]">Housekeeping status</p>
                        </div>
                      </div>
                      <div className="relative flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#E8E1F4] text-[#5D3D86] flex items-center justify-center text-[10px] font-bold z-10">3</span>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8A9A93] font-semibold">Concierge action</span>
                          <p className="text-xs font-semibold text-[#1E2522] mt-1">{res.isPreRegistered ? 'Pre-arrival complete' : 'Welcome note pending'}</p>
                          <p className="text-[10px] text-[#7A8C84]">Aura guest brief</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#F0EBE3] pt-3">
                      <button
                        onClick={() => openFolioModal(res)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D8CEBF] bg-[#FAF8F4] text-[#1E2522] hover:bg-[#F2ECE1]"
                      >
                        View folio
                      </button>
                      <button
                        onClick={() => openDigitalKeyModal(res)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1E2522] text-[#D4AF37] hover:bg-[#2C3B34]"
                      >
                        Issue keycard
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 7-Day Performance Pace Chart */}
          <div className="bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl p-5 shadow-sm">
            <h3 className="font-serif-heading text-base font-bold text-[#1E2522] mb-1">
              7-Day Occupancy & Revenue Pace Trend
            </h3>
            <p className="text-xs text-[#7A8C84] mb-4">Historical vs projected booking trajectory</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.slice(0, 7)}>
                  <defs>
                    <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00DDF2" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00DDF2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dayLabel" stroke="#8EA299" fontSize={10} tickLine={false} />
                  <YAxis stroke="#8EA299" fontSize={10} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E2522', borderRadius: '12px', border: '1px solid #3A4E43', color: '#FBF9F5', fontSize: '11px' }}
                    formatter={(val: number) => [`${val}% Occupancy`, 'Yield']}
                  />
                  <Area type="monotone" dataKey="occupancyPercent" stroke="#9E7D23" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOcc)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right 5 Columns: Visual Automation Rules Engine */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#19221E] text-[#FBF9F5] border border-[#2D3E35] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B3B33] mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="font-serif-heading text-base font-bold text-[#F7F4EE]">
                    Automation Rules Engine
                  </h3>
                  <span className="text-[10px] text-[#8EA299] uppercase tracking-wider block">Intelligent Event Triggers</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#202C26] p-1 rounded-xl border border-[#304239] text-xs">
                <button
                  onClick={() => setActiveAutomationTab('rules')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeAutomationTab === 'rules' ? 'bg-[#D4AF37] text-[#141A17]' : 'text-[#8EA299] hover:text-white'
                  }`}
                >
                  Rules ({automationRules.length})
                </button>
                <button
                  onClick={() => setActiveAutomationTab('logs')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeAutomationTab === 'logs' ? 'bg-[#D4AF37] text-[#141A17]' : 'text-[#8EA299] hover:text-white'
                  }`}
                >
                  Audit Log
                </button>
              </div>
            </div>

            {activeAutomationTab === 'rules' ? (
              <div className="space-y-3.5">
                {automationRules.map((rule) => (
                  <div 
                    key={rule.id}
                    className="p-3.5 bg-[#202C26] border border-[#2F4037] rounded-xl hover:border-[#D4AF37]/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-[#F7F4EE]">{rule.name}</span>
                      <button
                        onClick={() => toggleAutomationRule(rule.id)}
                        className={`w-8 h-4 rounded-full transition-colors relative ${
                          rule.enabled ? 'bg-emerald-500' : 'bg-gray-600'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                          rule.enabled ? 'right-0.5' : 'left-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="text-[11px] space-y-1 mb-3">
                      <div className="text-[#D4AF37] font-mono bg-[#141A17] p-1.5 rounded border border-[#26332C]">
                        {rule.trigger}
                      </div>
                      <div className="text-[#8EA299] px-1 text-[10px]">
                        THEN ({rule.actions.length} Automated Actions):
                      </div>
                      <ul className="list-disc list-inside text-[#B8C9C1] text-[11px] space-y-0.5 pl-1">
                        {rule.actions.slice(0, 2).map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#293930] text-[10px] text-[#8EA299]">
                      <span>Fired {rule.executionCount} times • Last: {rule.lastExecuted || 'Never'}</span>
                      <button
                        onClick={() => runAutomationRule(rule.id)}
                        className="px-2 py-1 rounded bg-[#2B3B33] hover:bg-[#35483E] text-[#D4AF37] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-2.5 h-2.5" />
                        <span>Test Trigger</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#202C26] rounded-xl border border-[#2F4037] text-[11px]">
                  <div className="flex justify-between text-[#8EA299] text-[10px] mb-1">
                    <span>AUTO-01 • VIP Pre-Arrival Protocol</span>
                    <span>Today 08:30 AM</span>
                  </div>
                  <p className="text-[#D1DDD7]">Triggered for Victoria Sterling. Concierge notified, champagne queued for Celeste Penthouse.</p>
                </div>
                <div className="p-2.5 bg-[#202C26] rounded-xl border border-[#2F4037] text-[11px]">
                  <div className="flex justify-between text-[#8EA299] text-[10px] mb-1">
                    <span>AUTO-02 • F&B Dining Folio Sync</span>
                    <span>19:22 PM</span>
                  </div>
                  <p className="text-[#D1DDD7]">Posted $340 bottle charge to Suite 201 folio. Credited 1,700 loyalty points to CRM profile.</p>
                </div>
                <div className="p-2.5 bg-[#202C26] rounded-xl border border-[#2F4037] text-[11px]">
                  <div className="flex justify-between text-[#8EA299] text-[10px] mb-1">
                    <span>AUTO-03 • Express Checkout Turnover</span>
                    <span>10:45 AM</span>
                  </div>
                  <p className="text-[#D1DDD7]">Room 104 marked dirty. Housekeeping task HK-101 generated automatically with High priority.</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Staff Navigation Shortcuts */}
          <div className="bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl p-5 shadow-sm">
            <h3 className="font-serif-heading text-base font-bold text-[#1E2522] mb-3">
              One Operational Workspace Switcher
            </h3>
            
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <button
                onClick={() => setActiveView('pos')}
                className="p-3 bg-white border border-[#EAE3D6] rounded-xl hover:border-[#D4AF37] text-left transition-all"
              >
                <Utensils className="w-4 h-4 text-amber-700 mb-1" />
                <span className="font-bold block text-[#1E2522]">Restaurant & Spa POS</span>
                <span className="text-[10px] text-[#7A8C84]">Charge dining to room folio</span>
              </button>

              <button
                onClick={() => setActiveView('housekeeping')}
                className="p-3 bg-white border border-[#EAE3D6] rounded-xl hover:border-[#D4AF37] text-left transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-700 mb-1" />
                <span className="font-bold block text-[#1E2522]">Housekeeping Board</span>
                <span className="text-[10px] text-[#7A8C84]">Room turns & work orders</span>
              </button>

              <button
                onClick={() => setActiveView('channels')}
                className="p-3 bg-white border border-[#EAE3D6] rounded-xl hover:border-[#D4AF37] text-left transition-all"
              >
                <Zap className="w-4 h-4 text-blue-700 mb-1" />
                <span className="font-bold block text-[#1E2522]">Channel Manager</span>
                <span className="text-[10px] text-[#7A8C84]">Rate parity & OTA sync</span>
              </button>

              <button
                onClick={() => setActiveView('guest_portal')}
                className="p-3 bg-white border border-[#EAE3D6] rounded-xl hover:border-[#D4AF37] text-left transition-all"
              >
                <Key className="w-4 h-4 text-purple-700 mb-1" />
                <span className="font-bold block text-[#1E2522]">Guest Companion</span>
                <span className="text-[10px] text-[#7A8C84]">Mobile key & room service</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

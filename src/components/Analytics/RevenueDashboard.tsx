import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { exportFinancialCSV } from '../../utils/exportFinancials';
import { FinancialReportModal } from './FinancialReportModal';
import { OccupancyThresholdAlerts } from './OccupancyThresholdAlerts';
import { 
  LineChart as LineChartIcon, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  BedDouble, 
  Percent, 
  ArrowUpRight, 
  Download, 
  Calendar,
  Layers,
  Award,
  Zap,
  Printer,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';

export const RevenueDashboard: React.FC = () => {
  const { rooms, metrics, reservations } = useHotel();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'threshold_alerts'>('overview');

  // Channel metrics
  const directBookings = reservations.filter(r => r.channel === 'Direct Web').length;
  const otaBookings = reservations.filter(r => r.channel === 'Luxury Retreats OTA').length;
  const vipCorporate = reservations.filter(r => r.channel === 'VIP Corporate').length;

  const totalRev = metrics.reduce((acc, m) => acc + m.totalRoomRevenue + m.totalFBRevenue + m.totalSpaRevenue + m.totalExcursionsRevenue, 0);
  const avgAdr = metrics.length
    ? Math.round(metrics.reduce((acc, m) => acc + m.adr, 0) / metrics.length)
    : 0;
  const avgOcc = metrics.length
    ? Math.round(metrics.reduce((acc, m) => acc + m.occupancyPercent, 0) / metrics.length)
    : 0;
  const avgRevPar = Math.round((avgAdr * (avgOcc / 100)) * 10) / 10;

  // Threshold calculations for overview
  const defaultThreshold = 80;
  const deficientDays = metrics.filter(m => m.occupancyPercent < defaultThreshold);

  const handleQuickCSV = () => {
    exportFinancialCSV({
      metrics,
      rooms,
      reservations,
      periodLabel: 'May 9 – May 17, 2026',
      departmentFilter: 'all',
      reportType: 'Yield, Occupancy & Financial Ledger Audit'
    });
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Export Confirmation Toast */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E2522] text-[#FBF9F5] px-4 py-3 rounded-2xl shadow-xl border border-[#D4AF37]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs font-bold text-white">Financial Dataset Exported</p>
            <p className="text-[11px] text-[#A8BDB4]">Downloaded Azure_Sanctuary_Financial_Report.csv</p>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#1E2522] text-[#D4AF37]">
                Yield & Revenue Management
              </span>
              <span className="text-xs text-[#7A8C84]">Cycle Analytics & Rate Optimization</span>
            </div>
            <h2 className="font-serif-heading text-2xl lg:text-3xl font-medium text-[#1E2522]">
              RevPAR, ADR & Revenue Streams
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#E0D8CC] text-xs font-semibold text-[#1E2522] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#7A8C84]" />
              Cycle: May 9 – May 17, 2026
            </span>

            {/* Direct CSV Export */}
            <button
              onClick={handleQuickCSV}
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F4] hover:bg-[#EFE9DD] text-[#1E2522] border border-[#DCD3C5] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              title="Download raw financial and occupancy ledger (.csv)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              Download CSV
            </button>

            {/* Interactive PDF & Management Report Modal Trigger */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-[#1E2522] hover:bg-[#2C3B34] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
              title="Open Printable Financial & Occupancy Report"
            >
              <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
              Periodic Report (PDF)
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#EAE3D6]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#1E2522] text-[#D4AF37] shadow-sm'
                : 'bg-[#FAF8F4] text-[#63766D] border border-[#EAE3D6] hover:text-[#1E2522]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Executive Revenue Overview & Streams
          </button>

          <button
            onClick={() => setActiveTab('threshold_alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'threshold_alerts'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Occupancy Threshold Alerts (Monthly / Weekly)
            {deficientDays.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-200 text-rose-900 font-bold ml-0.5">
                {deficientDays.length} Alerts
              </span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#71827B] uppercase tracking-wider">Avg RevPAR</span>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="mt-2 font-serif-heading text-3xl font-bold text-[#1E2522]">
            ${avgRevPar}
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block flex items-center gap-0.5">
            {metrics.length > 0 ? (
              <><TrendingUp className="w-3.5 h-3.5" /> +14.2% vs prior month</>
            ) : (
              <span className="text-[#6E8078]">Awaiting property performance data</span>
            )}
          </span>
        </div>

        <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#71827B] uppercase tracking-wider">Average Daily Rate (ADR)</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 font-serif-heading text-3xl font-bold text-[#1E2522]">
            ${avgAdr}
          </div>
          <span className="text-xs text-[#6E8078] mt-1 block">
            {metrics.length > 0 ? `Across ${rooms.length} property keys` : 'No performance data yet'}
          </span>
        </div>

        <div className={`border rounded-3xl p-5 shadow-sm transition-all ${
          avgOcc >= defaultThreshold
            ? 'bg-white border-[#E3DCD1]'
            : 'bg-rose-50/70 border-rose-300'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#71827B] uppercase tracking-wider">Mean Occupancy</span>
            <Percent className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 font-serif-heading text-3xl font-bold text-[#1E2522] flex items-center gap-2">
            <span>{avgOcc}%</span>
            {deficientDays.length > 0 && (
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {deficientDays.length} Days &lt; {defaultThreshold}%
              </span>
            )}
          </div>
          <span className={`text-xs font-semibold mt-1 block ${
            avgOcc >= defaultThreshold ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {avgOcc >= defaultThreshold ? 'Target exceeded (>80%)' : `Below ${defaultThreshold}% target`}
          </span>
        </div>

        <div className="bg-[#1E2522] text-[#FBF9F5] rounded-3xl p-5 border border-[#33423B] shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">Gross Cycle Revenue</span>
            <Award className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="mt-2 font-serif-heading text-3xl font-bold text-white">
            ${totalRev.toLocaleString()}
          </div>
          <span className="text-xs text-[#A8B8B1] mt-1 block">
            Rooms + F&B + Spa + Marine
          </span>
        </div>

      </div>

      {/* Conditional Content based on Tab */}
      {activeTab === 'threshold_alerts' ? (
        <OccupancyThresholdAlerts dailyMetrics={metrics} />
      ) : (
        <>
          {/* Dynamic Rate Intelligence Callout */}
          <div className="bg-[#FAF6EC] border border-[#E6DCC9] rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-[#D4AF37]/20 text-[#8F701B] shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1E2522] flex items-center gap-2">
                  Automated Yield & Dynamic Pricing Recommendation
                </h4>
                <p className="text-xs text-[#5D6F67] mt-0.5 leading-relaxed">
                  Weekend demand for May 15–17 is at 100% capacity. Recommended rate adjustment: Increase Azure Penthouse and Star Deck suites by <strong>+15%</strong> for late walk-ins and direct inquiries.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setActiveTab('threshold_alerts')}
                className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Audit Month Deficits
              </button>
              <button 
                onClick={() => alert('Dynamic rate rule applied across booking engine.')}
                className="px-4 py-2 bg-[#1E2522] hover:bg-[#2C3B34] text-white font-semibold text-xs rounded-xl"
              >
                Apply Yield Surge (+15%)
              </button>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Department Revenue Breakdown Stacked Bar (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-heading text-xl font-semibold text-[#1E2522]">
                    Revenue Breakdown by Department
                  </h3>
                  <p className="text-xs text-[#7A8C84]">Rooms, Restaurant, Spa Sanctuary & Marine Excursions</p>
                </div>
              </div>

              <div className="h-72 w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="dayLabel" stroke="#8E9F97" fontSize={11} tickLine={false} />
                    <YAxis stroke="#8E9F97" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E2522', 
                        borderRadius: '12px', 
                        border: '1px solid #3A4842', 
                        color: '#FBF9F5',
                        fontSize: '12px' 
                      }} 
                      formatter={(value: any, name: any) => [`$${Number(value).toLocaleString()}`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="totalRoomRevenue" name="Suite Accommodation" fill="#1E2522" stackId="a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="totalFBRevenue" name="Restaurant & Bar" fill="#D4AF37" stackId="a" />
                    <Bar dataKey="totalSpaRevenue" name="Sanctuary Spa" fill="#5E7D72" stackId="a" />
                    <Bar dataKey="totalExcursionsRevenue" name="Excursions & Heli" fill="#99B5A8" stackId="a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Occupancy Trend Curve with Threshold Alert Line (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-heading text-xl font-semibold text-[#1E2522]">
                    Daily Occupancy Curve (%)
                  </h3>
                  <p className="text-xs text-[#7A8C84]">Red markers denote days below 80% goal</p>
                </div>
                <button
                  onClick={() => setActiveTab('threshold_alerts')}
                  className="text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3" />
                  Goal: {defaultThreshold}%
                </button>
              </div>

              <div className="h-72 w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E2522" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#1E2522" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="dayLabel" stroke="#8E9F97" fontSize={11} tickLine={false} />
                    <YAxis stroke="#8E9F97" fontSize={11} domain={[50, 100]} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    
                    {/* Dashed Red Threshold Goal Line */}
                    <ReferenceLine 
                      y={defaultThreshold} 
                      stroke="#E11D48" 
                      strokeDasharray="3 3" 
                      label={{ value: `Goal: ${defaultThreshold}%`, position: 'insideTopRight', fill: '#E11D48', fontSize: 10, fontWeight: 700 }} 
                    />

                    <Tooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const d = payload[0].payload;
                        const isAlert = d.occupancyPercent < defaultThreshold;
                        return (
                          <div className="bg-[#1E2522] text-[#FBF9F5] p-3 rounded-xl border border-[#3A4842] text-xs space-y-1">
                            <p className="font-bold text-white">{d.dayLabel}</p>
                            <p className="flex justify-between gap-4">
                              <span>Occupancy:</span>
                              <span className={`font-bold ${isAlert ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {d.occupancyPercent}% {isAlert && '(Below Goal)'}
                              </span>
                            </p>
                            <p className="flex justify-between gap-4 text-[#A8B8B1]">
                              <span>ADR:</span>
                              <span>${d.adr}</span>
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="occupancyPercent" 
                      stroke="#1E2522" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#occGrad)" 
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        const isBelow = payload.occupancyPercent < defaultThreshold;
                        return (
                          <circle 
                            key={`dot-${payload.date}`}
                            cx={cx} 
                            cy={cy} 
                            r={isBelow ? 5 : 3} 
                            fill={isBelow ? '#E11D48' : '#1E2522'} 
                            stroke="#FFFFFF" 
                            strokeWidth={isBelow ? 2 : 1} 
                          />
                        );
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Embedded Threshold Alerts Section */}
          <OccupancyThresholdAlerts dailyMetrics={metrics} />

          {/* Booking Channel Distribution & Suite Ranking Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Booking Channels */}
            <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm space-y-4">
              <h3 className="font-serif-heading text-xl font-semibold text-[#1E2522]">
                Channel Yield & Distribution
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-sm text-[#1E2522]">Direct Sanctuary Web Portal</span>
                    <span className="text-[11px] text-[#71827B] block">0% commission • Highest ADR</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-base text-[#1E2522]">68%</span>
                    <span className="text-[10px] text-emerald-700 block font-semibold">+12% YoY</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-sm text-[#1E2522]">VIP Corporate & Bespoke Concierge</span>
                    <span className="text-[11px] text-[#71827B] block">Direct relationship • Multi-room buyout</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-base text-[#1E2522]">20%</span>
                    <span className="text-[10px] text-[#71827B] block font-medium">Stable</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-sm text-[#1E2522]">Luxury Retreats & Selected OTAs</span>
                    <span className="text-[11px] text-[#71827B] block">15% commission tier</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-base text-[#1E2522]">12%</span>
                    <span className="text-[10px] text-[#71827B] block font-medium">Capped quota</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Suite Revenue Rankings */}
            <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm space-y-4">
              <h3 className="font-serif-heading text-xl font-semibold text-[#1E2522]">
                Suite Category Performance
              </h3>

              <div className="space-y-3 text-xs">
                {rooms.slice(0, 4).map((rm, idx) => (
                  <div key={rm.id} className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1E2522] text-[#D4AF37] font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#1E2522]">Suite {rm.number} - {rm.name}</span>
                        <span className="text-[11px] text-[#71827B] block">{rm.type}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-[#1E2522]">${rm.seasonalPrice}/nt</span>
                      <span className="text-[10px] text-emerald-700 block font-semibold">95% Occupancy</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* Periodic Financial Statement & Manager Audit Banner */}
      <div className="bg-[#1E2522] text-[#FBF9F5] border border-[#2F3E37] rounded-3xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-heading text-xl font-bold text-white">
                Periodic Financial & Occupancy Statements
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-[#1E2522] uppercase tracking-wider">
                Audited
              </span>
            </div>
            <p className="text-xs text-[#9CB2A7] mt-1 max-w-2xl leading-relaxed">
              Generate certified management statements for General Managers, Financial Controllers, and Board of Directors. Export comprehensive datasets in raw CSV or printable PDF documents complete with departmental revenue shares, daily occupancy curves, and signature sign-offs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleQuickCSV}
            className="px-4 py-2.5 rounded-xl bg-[#2A3731] hover:bg-[#384A42] text-white text-xs font-semibold flex items-center gap-2 border border-[#3E5249] transition-colors"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            Download Full CSV (.csv)
          </button>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C29D29] text-[#1E2522] text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            Generate PDF Report (.pdf)
          </button>
        </div>
      </div>

      {/* Certified Financial Report Modal */}
      <FinancialReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />

    </div>
  );
};


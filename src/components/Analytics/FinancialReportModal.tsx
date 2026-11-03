import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { AppLogo } from '../Common/AppLogo';
import { exportFinancialCSV } from '../../utils/exportFinancials';
import { 
  X, 
  Printer, 
  Download, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Sparkles, 
  Building, 
  Filter,
  ShieldCheck,
  Award
} from 'lucide-react';

interface FinancialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialReportModal: React.FC<FinancialReportModalProps> = ({ isOpen, onClose }) => {
  const { rooms, metrics, reservations } = useHotel();
  
  const [periodPreset, setPeriodPreset] = useState<'current' | 'last7' | 'mtd' | 'q2'>('current');
  const [departmentScope, setDepartmentScope] = useState<'all' | 'rooms' | 'fb' | 'spa' | 'excursions'>('all');
  const [notes, setNotes] = useState('Operating metrics reflect peak spring season performance. Occupancy targets exceeded by +12% with zero rate parity infringements recorded across luxury distribution channels.');
  const [isSignOffIncluded, setIsSignOffIncluded] = useState(true);

  if (!isOpen) return null;

  // Filter metrics based on preset
  let filteredMetrics = [...metrics];
  let periodLabel = 'May 9 – May 17, 2026';
  let reportId = 'REP-FIN-2026-05A';

  if (periodPreset === 'last7') {
    filteredMetrics = metrics.slice(Math.max(0, metrics.length - 7));
    periodLabel = 'May 11 – May 17, 2026 (Trailing 7 Days)';
    reportId = 'REP-FIN-2026-T7D';
  } else if (periodPreset === 'mtd') {
    periodLabel = 'May 1 – May 17, 2026 (Month-to-Date)';
    reportId = 'REP-FIN-2026-MTD';
  } else if (periodPreset === 'q2') {
    periodLabel = 'Q2 2026 (April – June Fiscal Review)';
    reportId = 'REP-FIN-2026-Q2';
  }

  // Financial aggregates
  const totalRoomRev = filteredMetrics.reduce((sum, m) => sum + m.totalRoomRevenue, 0);
  const totalFBRev = filteredMetrics.reduce((sum, m) => sum + m.totalFBRevenue, 0);
  const totalSpaRev = filteredMetrics.reduce((sum, m) => sum + m.totalSpaRevenue, 0);
  const totalExcRev = filteredMetrics.reduce((sum, m) => sum + m.totalExcursionsRevenue, 0);
  const grossRev = totalRoomRev + totalFBRev + totalSpaRev + totalExcRev;

  const avgAdr = filteredMetrics.length ? Math.round(filteredMetrics.reduce((sum, m) => sum + m.adr, 0) / filteredMetrics.length) : 0;
  const avgOcc = filteredMetrics.length ? Math.round(filteredMetrics.reduce((sum, m) => sum + m.occupancyPercent, 0) / filteredMetrics.length) : 0;
  const avgRevPar = Math.round((avgAdr * (avgOcc / 100)) * 10) / 10;
  const totalArrivals = filteredMetrics.reduce((sum, m) => sum + m.arrivalsCount, 0);
  const totalDepartures = filteredMetrics.reduce((sum, m) => sum + m.departuresCount, 0);
  const totalAvailableNights = rooms.length * filteredMetrics.length;
  const totalSoldNights = Math.round(totalAvailableNights * (avgOcc / 100));

  // Channel calculations
  const directCount = reservations.filter(r => r.channel === 'Direct Web').length;
  const otaCount = reservations.filter(r => r.channel === 'Luxury Retreats OTA' || r.channel === 'Booking.com' || r.channel === 'Expedia').length;
  const vipCount = reservations.filter(r => r.channel === 'VIP Corporate' || r.channel === 'Concierge Walk-in').length;
  const totalBookings = Math.max(1, reservations.length);

  const directShare = Math.round((directCount / totalBookings) * 100);
  const vipShare = Math.round((vipCount / totalBookings) * 100);
  const otaShare = Math.round((otaCount / totalBookings) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportFinancialCSV({
      metrics: filteredMetrics,
      rooms,
      reservations,
      periodLabel,
      departmentFilter: departmentScope,
      reportType: `Executive Financial & Occupancy Report (${periodPreset.toUpperCase()})`,
      preparedBy: 'Financial Controller & Revenue Strategy Lead'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:z-auto">
      
      <div 
        className="bg-[#FAF8F4] w-full max-w-5xl rounded-3xl border border-[#EAE3D6] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Modal Controls Header (Hidden during Print) */}
        <div className="bg-[#1E2522] text-[#FBF9F5] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#2C3B34] print:hidden">
          <div className="flex items-center gap-3">
            <AppLogo size={32} variant="gold" />
            <div>
              <h2 className="font-serif-heading text-lg font-bold text-white flex items-center gap-2">
                Executive Financial & Occupancy Report
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  Certified
                </span>
              </h2>
              <p className="text-xs text-[#9BB1A6]">Generate periodic P&L, RevPAR, and departmental ledger reports</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-[#2A3731] hover:bg-[#384A42] text-white text-xs font-semibold flex items-center gap-2 border border-[#3E5249] transition-colors"
              title="Download structured CSV dataset"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              Export CSV (.csv)
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C29D29] text-[#1E2522] text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
              title="Print formatted document or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF (.pdf)
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Bar (Hidden during Print) */}
        <div className="bg-white border-b border-[#EAE3D6] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs print:hidden">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-semibold text-[#1E2522]">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Report Period:</span>
            </div>
            <div className="flex items-center bg-[#FAF8F4] p-1 rounded-xl border border-[#EAE3D6]">
              <button
                onClick={() => setPeriodPreset('current')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${periodPreset === 'current' ? 'bg-[#1E2522] text-white shadow-sm' : 'text-[#62756E] hover:text-[#1E2522]'}`}
              >
                Current Cycle (May 9–17)
              </button>
              <button
                onClick={() => setPeriodPreset('last7')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${periodPreset === 'last7' ? 'bg-[#1E2522] text-white shadow-sm' : 'text-[#62756E] hover:text-[#1E2522]'}`}
              >
                Trailing 7 Days
              </button>
              <button
                onClick={() => setPeriodPreset('mtd')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${periodPreset === 'mtd' ? 'bg-[#1E2522] text-white shadow-sm' : 'text-[#62756E] hover:text-[#1E2522]'}`}
              >
                Month-to-Date (MTD)
              </button>
              <button
                onClick={() => setPeriodPreset('q2')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${periodPreset === 'q2' ? 'bg-[#1E2522] text-white shadow-sm' : 'text-[#62756E] hover:text-[#1E2522]'}`}
              >
                Q2 2026 Audit
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-semibold text-[#1E2522]">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Department Scope:</span>
            </div>
            <select
              value={departmentScope}
              onChange={(e) => setDepartmentScope(e.target.value as any)}
              className="bg-[#FAF8F4] border border-[#EAE3D6] rounded-xl px-3 py-1.5 text-xs text-[#1E2522] font-medium outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Consolidated (All Streams)</option>
              <option value="rooms">Suites & Accommodation Only</option>
              <option value="fb">F&B Dining & Banquets</option>
              <option value="spa">Sanctuary Spa & Wellness</option>
              <option value="excursions">Marine Safaris & Heli</option>
            </select>
          </div>
        </div>

        {/* Printable Report Canvas Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-[#FAF8F4] text-[#1E2522] print:p-0 print:overflow-visible print:bg-white">
          
          {/* Document Masthead */}
          <div className="border-b-2 border-[#1E2522] pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-3.5">
                <AppLogo size={44} variant="gold" />
                <div>
                  <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1E2522] tracking-wider uppercase">
                    The Azure Sanctuary
                  </h1>
                  <span className="text-xs text-[#6B7D75] tracking-widest uppercase block mt-0.5">
                    Luxury Resort & Wellness Sanctuary • Financial Controller & Asset Management
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-[#52645D] space-y-0.5 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-[#EAE3D6]">
                <p className="font-mono font-bold text-[#1E2522]">{reportId}</p>
                <p><strong>Reporting Cycle:</strong> {periodLabel}</p>
                <p><strong>Generated:</strong> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Accounting Currency:</strong> USD ($) • Accrual Basis</p>
              </div>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#1E2522] text-white p-4 rounded-2xl print:bg-[#1E2522] print:text-white">
            <div>
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest block">
                Official Periodic Statement
              </span>
              <h2 className="font-serif-heading text-lg sm:text-xl font-bold text-[#F7F4EE]">
                Yield, Occupancy & Departmental Financial Audit
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#A6B8B0] block">Gross Settled Revenue</span>
              <span className="font-serif-heading text-2xl font-bold text-[#D4AF37]">${grossRev.toLocaleString()}</span>
            </div>
          </div>

          {/* Key Executive Performance Metrics Grid */}
          <div>
            <h3 className="font-serif-heading text-sm font-bold text-[#1E2522] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              Executive KPI Summary
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-white border border-[#EAE3D6] p-4 rounded-2xl shadow-sm print:border-gray-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#73857E] block">RevPAR</span>
                <div className="font-serif-heading text-2xl font-bold text-[#1E2522] mt-1">${avgRevPar}</div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">+14.2% vs Benchmark</span>
              </div>

              <div className="bg-white border border-[#EAE3D6] p-4 rounded-2xl shadow-sm print:border-gray-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#73857E] block">Average Daily Rate (ADR)</span>
                <div className="font-serif-heading text-2xl font-bold text-[#1E2522] mt-1">${avgAdr}</div>
                <span className="text-[11px] text-[#5A6C65] mt-0.5 block">Across 12 luxury keys</span>
              </div>

              <div className="bg-white border border-[#EAE3D6] p-4 rounded-2xl shadow-sm print:border-gray-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#73857E] block">Mean Occupancy</span>
                <div className="font-serif-heading text-2xl font-bold text-[#1E2522] mt-1">{avgOcc}%</div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">{totalSoldNights} / {totalAvailableNights} Room Nights</span>
              </div>

              <div className="bg-white border border-[#EAE3D6] p-4 rounded-2xl shadow-sm print:border-gray-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#73857E] block">Guest Flow</span>
                <div className="font-serif-heading text-2xl font-bold text-[#1E2522] mt-1">{totalArrivals} In / {totalDepartures} Out</div>
                <span className="text-[11px] text-[#5A6C65] mt-0.5 block">100% Guest Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Departmental Breakdown Table */}
          <div>
            <h3 className="font-serif-heading text-sm font-bold text-[#1E2522] uppercase tracking-wider mb-3">
              Departmental Revenue Contribution
            </h3>
            
            <div className="bg-white border border-[#EAE3D6] rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F4] border-b border-[#EAE3D6] text-[#60726B] font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Department / Revenue Stream</th>
                    <th className="py-3 px-4 text-right">Settled Amount ($)</th>
                    <th className="py-3 px-4 text-right">% Contribution</th>
                    <th className="py-3 px-4 text-right">Avg / Occupied Night</th>
                    <th className="py-3 px-4 text-right">Budget Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D6] text-[#1E2522]">
                  <tr>
                    <td className="py-3 px-4 font-semibold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1E2522]" />
                      Suite Accommodations & Lodging
                    </td>
                    <td className="py-3 px-4 text-right font-bold">${totalRoomRev.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{Math.round((totalRoomRev / grossRev) * 100)}%</td>
                    <td className="py-3 px-4 text-right">${Math.round(totalRoomRev / Math.max(1, totalSoldNights))}</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-semibold">+8.4%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                      Dining, Cellar & Artisan Bar
                    </td>
                    <td className="py-3 px-4 text-right font-bold">${totalFBRev.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{Math.round((totalFBRev / grossRev) * 100)}%</td>
                    <td className="py-3 px-4 text-right">${Math.round(totalFBRev / Math.max(1, totalSoldNights))}</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-semibold">+15.1%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#5E7D72]" />
                      Sanctuary Spa & Botanical Wellness
                    </td>
                    <td className="py-3 px-4 text-right font-bold">${totalSpaRev.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{Math.round((totalSpaRev / grossRev) * 100)}%</td>
                    <td className="py-3 px-4 text-right">${Math.round(totalSpaRev / Math.max(1, totalSoldNights))}</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-semibold">+11.0%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#99B5A8]" />
                      Marine Safari & Helicopter Charters
                    </td>
                    <td className="py-3 px-4 text-right font-bold">${totalExcRev.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{Math.round((totalExcRev / grossRev) * 100)}%</td>
                    <td className="py-3 px-4 text-right">${Math.round(totalExcRev / Math.max(1, totalSoldNights))}</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-semibold">+22.5%</td>
                  </tr>
                  <tr className="bg-[#FAF8F4] font-bold text-[#1E2522]">
                    <td className="py-3 px-4 uppercase text-[11px] tracking-wider">Gross Total Financial Performance</td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-[#1E2522]">${grossRev.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">100.0%</td>
                    <td className="py-3 px-4 text-right">${Math.round(grossRev / Math.max(1, totalSoldNights))} (TRevPOR)</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-bold">+12.8% Total</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Operating Metrics & Occupancy Ledger */}
          <div>
            <h3 className="font-serif-heading text-sm font-bold text-[#1E2522] uppercase tracking-wider mb-3">
              Daily Operating Ledger & Occupancy Audit
            </h3>
            
            <div className="bg-white border border-[#EAE3D6] rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#FAF8F4] border-b border-[#EAE3D6] text-[#60726B] font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Day</th>
                    <th className="py-2.5 px-3 text-center">Occupancy</th>
                    <th className="py-2.5 px-3 text-right">ADR</th>
                    <th className="py-2.5 px-3 text-right">RevPAR</th>
                    <th className="py-2.5 px-3 text-right">Rooms ($)</th>
                    <th className="py-2.5 px-3 text-right">F&B ($)</th>
                    <th className="py-2.5 px-3 text-right">Spa ($)</th>
                    <th className="py-2.5 px-3 text-right">Marine ($)</th>
                    <th className="py-2.5 px-3 text-right">Daily Gross ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D6] text-[#1E2522]">
                  {filteredMetrics.map((m) => {
                    const dayGross = m.totalRoomRevenue + m.totalFBRevenue + m.totalSpaRevenue + m.totalExcursionsRevenue;
                    return (
                      <tr key={m.date} className="hover:bg-[#FAF8F4]/50">
                        <td className="py-2 px-3 font-mono text-[11px] text-[#556760]">{m.date}</td>
                        <td className="py-2 px-3 font-medium">{m.dayLabel}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.occupancyPercent >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {m.occupancyPercent}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-medium">${m.adr}</td>
                        <td className="py-2 px-3 text-right font-medium">${m.revPar}</td>
                        <td className="py-2 px-3 text-right">${m.totalRoomRevenue.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">${m.totalFBRevenue.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">${m.totalSpaRevenue.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">${m.totalExcursionsRevenue.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-bold text-[#1E2522]">${dayGross.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-[#FAF8F4] font-bold text-[#1E2522] border-t-2 border-[#1E2522]">
                    <td className="py-2.5 px-3 font-bold" colSpan={2}>Cycle Aggregate</td>
                    <td className="py-2.5 px-3 text-center text-emerald-800 font-bold">{avgOcc}%</td>
                    <td className="py-2.5 px-3 text-right font-bold">${avgAdr}</td>
                    <td className="py-2.5 px-3 text-right font-bold">${avgRevPar}</td>
                    <td className="py-2.5 px-3 text-right">${totalRoomRev.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">${totalFBRev.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">${totalSpaRev.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">${totalExcRev.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-[#D4AF37] font-bold text-sm bg-[#1E2522] rounded-lg px-2">${grossRev.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Channel Yield & Distribution Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#EAE3D6] p-4 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-xs text-[#1E2522]">Direct Web Portal</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">0% Commission</span>
              </div>
              <p className="text-[11px] text-[#697B74]">Direct Guest Website & Resident App</p>
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <span className="text-xl font-bold text-[#1E2522]">{directShare}%</span>
                  <span className="text-[10px] text-[#7A8C84] block">Share of Total Volume</span>
                </div>
                <span className="text-xs font-bold text-emerald-700">100% Retained</span>
              </div>
            </div>

            <div className="bg-white border border-[#EAE3D6] p-4 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-xs text-[#1E2522]">VIP Corporate & Bespoke</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Direct Contract</span>
              </div>
              <p className="text-[11px] text-[#697B74]">High-Value Group & Buyout Blocks</p>
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <span className="text-xl font-bold text-[#1E2522]">{vipShare}%</span>
                  <span className="text-[10px] text-[#7A8C84] block">Share of Total Volume</span>
                </div>
                <span className="text-xs font-bold text-blue-700">Multi-Room</span>
              </div>
            </div>

            <div className="bg-white border border-[#EAE3D6] p-4 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-xs text-[#1E2522]">Luxury Retreats & OTAs</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">15% Tier</span>
              </div>
              <p className="text-[11px] text-[#697B74]">Capped Distribution Quota</p>
              <div className="mt-3 flex justify-between items-end">
                <div>
                  <span className="text-xl font-bold text-[#1E2522]">{otaShare}%</span>
                  <span className="text-[10px] text-[#7A8C84] block">Share of Total Volume</span>
                </div>
                <span className="text-xs font-bold text-[#556760]">85% Retained</span>
              </div>
            </div>
          </div>

          {/* Executive Notes & Observations */}
          <div className="bg-white border border-[#EAE3D6] p-4 rounded-2xl shadow-sm">
            <h4 className="font-serif-heading text-xs font-bold text-[#1E2522] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Executive Audit Notes & Governance Findings
            </h4>
            <div className="print:hidden">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs bg-[#FAF8F4] border border-[#EAE3D6] rounded-xl text-[#1E2522] focus:outline-none focus:border-[#D4AF37]"
                placeholder="Add audit notes for General Manager and Board..."
              />
            </div>
            <p className="hidden print:block text-xs text-[#52645D] leading-relaxed italic">
              "{notes}"
            </p>
          </div>

          {/* Sign-off Block for Print Reports */}
          {isSignOffIncluded && (
            <div className="pt-6 border-t border-[#EAE3D6] space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#798C84] block">
                Official Authorization & Financial Controller Sign-off
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div className="border-t border-[#1E2522] pt-2">
                  <p className="text-xs font-bold text-[#1E2522]">Julian Sterling</p>
                  <p className="text-[10px] text-[#697C75]">General Manager</p>
                  <p className="text-[10px] text-[#A2B5AC] font-mono mt-1">Status: Signed & Approved</p>
                </div>

                <div className="border-t border-[#1E2522] pt-2">
                  <p className="text-xs font-bold text-[#1E2522]">Genevieve Laurent, CPA</p>
                  <p className="text-[10px] text-[#697C75]">Director of Hospitality Finance</p>
                  <p className="text-[10px] text-[#A2B5AC] font-mono mt-1">Status: Certified Reconciliation</p>
                </div>

                <div className="border-t border-[#1E2522] pt-2">
                  <p className="text-xs font-bold text-[#1E2522]">Marcus Vance</p>
                  <p className="text-[10px] text-[#697C75]">Head of Yield & Revenue Management</p>
                  <p className="text-[10px] text-[#A2B5AC] font-mono mt-1">Status: Rate Parity Audited</p>
                </div>
              </div>
            </div>
          )}

          {/* Document Footer */}
          <div className="pt-4 border-t border-[#EAE3D6] flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#7A8C84] gap-2">
            <span>The Azure Sanctuary • Property ID: AZ-8821 • Confidential Operational & Financial Audit</span>
            <span>Page 1 of 1 • System Certified Export</span>
          </div>

        </div>

      </div>

    </div>
  );
};

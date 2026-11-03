import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { 
  Share2, 
  Globe, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Sliders, 
  RefreshCw, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  Lock,
  Unlock,
  Percent
} from 'lucide-react';

export const ChannelManager: React.FC = () => {
  const { 
    channels, 
    updateChannelPrice, 
    resolveParityViolation, 
    toggleChannelStopSell,
    formatCurrency
  } = useHotel();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const parityViolations = channels.filter(c => c.parityStatus === 'violation');

  const handleGlobalSync = () => {
    setIsSyncing(true);
    setSyncFeedback('Pushing rate matrices and availability delta to 2-way ARI XML endpoints...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncFeedback('Global OTA Channel Inventory Synchronized with 0 error packets.');
      setTimeout(() => setSyncFeedback(null), 4000);
    }, 1500);
  };

  const handleFixAllParity = () => {
    parityViolations.forEach(c => resolveParityViolation(c.id));
    setSyncFeedback('Rate parity realigned: Direct booking pricing restored as lowest Best Available Rate (BAR).');
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#141A17] text-[#FBF9F5] rounded-2xl p-5 border border-[#2D3E35] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-950/80 text-blue-300 border border-blue-800">
              Global Distribution & Channel Management
            </span>
            <span className="text-xs text-[#A6B4AE]">2-Way Real-Time ARI (Availability, Rates, Inventory)</span>
          </div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#F7F4EE]">
            Channel Manager & Rate Parity Engine
          </h1>
          <p className="text-xs text-[#8EA299]">
            Maintain automated rate parity, manage OTA inventory allocations, prevent overbooking, and enforce direct booking yield advantage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {parityViolations.length > 0 && (
            <button
              onClick={handleFixAllParity}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#141A17] rounded-xl text-xs font-bold shadow-md transition-all animate-pulse"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Auto-Fix {parityViolations.length} Parity Violation{parityViolations.length > 1 ? 's' : ''}</span>
            </button>
          )}

          <button
            onClick={handleGlobalSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#202C26] hover:bg-[#2B3B33] text-[#E0CDA9] border border-[#3A4E43] rounded-xl text-xs font-semibold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#D4AF37]' : ''}`} />
            <span>{isSyncing ? 'Syncing ARI...' : 'Force Global OTA Sync'}</span>
          </button>
        </div>
      </div>

      {/* Sync Feedback Message */}
      {syncFeedback && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Rate Parity Overview Alert Box */}
      <div className="bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D6]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              parityViolations.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-heading text-base font-bold text-[#1E2522]">
                Rate Parity & Direct Advantage Monitor
              </h2>
              <p className="text-xs text-[#7A8C84]">
                Direct hotel bookings yield 100% net revenue (0% OTA commission). Automated monitoring prevents rogue OTA discounting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              parityViolations.length > 0 
                ? 'bg-rose-100 text-rose-800 border-rose-200' 
                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}>
              {parityViolations.length > 0 ? `${parityViolations.length} Parity Violation Detected` : '100% Rate Parity Intact'}
            </span>
          </div>
        </div>

        {/* Live Channel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {channels.map((ch) => {
            const isDirect = ch.type === 'direct';
            const isViolation = ch.parityStatus === 'violation';

            return (
              <div 
                key={ch.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isViolation 
                    ? 'bg-rose-50/60 border-rose-300 shadow-sm' 
                    : isDirect 
                    ? 'bg-[#FAF8F4] border-[#D4AF37] shadow-sm' 
                    : 'bg-white border-[#EAE3D6]'
                }`}
              >
                <div>
                  {/* Channel Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1E2522]">{ch.name}</span>
                      {isDirect && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#9E7D23] border border-[#D4AF37]/30">
                          Direct BAR (Anchor)
                        </span>
                      )}
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isViolation 
                        ? 'bg-rose-200 text-rose-900' 
                        : ch.status === 'connected' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {isViolation ? 'Parity Alert' : ch.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Channel Rates & Commissions */}
                  <div className="bg-[#FAF8F4] p-3 rounded-xl border border-[#EAE3D6] space-y-1.5 my-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#7A8C84]">Active Nightly Rate:</span>
                      <span className="font-serif-heading font-bold text-sm text-[#1E2522]">{formatCurrency(ch.price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#7A8C84]">Commission Fee:</span>
                      <span className={`font-semibold ${isDirect ? 'text-emerald-700 font-bold' : 'text-[#1E2522]'}`}>
                        {ch.commission}% {isDirect ? '(Zero Fee)' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#7A8C84]">Net Revenue Per Night:</span>
                      <span className="font-bold text-emerald-800">
                        {formatCurrency(ch.price * (1 - ch.commission / 100))}
                      </span>
                    </div>
                  </div>

                  {/* Allocation & Stop Sell */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[11px] text-[#52645D]">
                      <span>Inventory Allocation:</span>
                      <span className="font-bold">{ch.inventoryAllocated}% of rooms</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D6]">
                      <span className="text-[11px] text-[#7A8C84]">Stop-Sell Status:</span>
                      <button
                        onClick={() => toggleChannelStopSell(ch.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          ch.stopSell 
                            ? 'bg-rose-700 text-white' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {ch.stopSell ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        <span>{ch.stopSell ? 'Stop-Sell Active' : 'Open / Selling'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Action for Violation */}
                {isViolation && (
                  <button
                    onClick={() => resolveParityViolation(ch.id)}
                    className="mt-4 w-full py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Auto-Match Direct Rate (${620})</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

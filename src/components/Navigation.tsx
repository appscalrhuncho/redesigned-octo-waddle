import React from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  LayoutDashboard, 
  CalendarRange, 
  ConciergeBell, 
  Compass, 
  Smartphone,
  Bot,
  UtensilsCrossed, 
  Sparkles, 
  Users, 
  LineChart, 
  Share2,
  Briefcase,
  Layers
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    todayArrivals, 
    todayDepartures, 
    housekeeping, 
    maintenance,
    rooms,
    channels,
    serviceRequests
  } = useHotel();

  const dirtyRoomsCount = rooms.filter(r => r.status === 'dirty' || r.status === 'inspecting').length;
  const parityViolations = channels.filter(c => c.parityStatus === 'violation').length;
  const pendingRequests = serviceRequests.filter(s => s.status !== 'completed').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Operations Command',
      icon: LayoutDashboard,
      badge: null,
      description: 'Exception board & live pulse'
    },
    {
      id: 'matrix',
      label: 'Tape Chart & Matrix',
      icon: CalendarRange,
      badge: `${rooms.length} Suites`,
      badgeColor: 'bg-[#2E3C36] text-[#D4AF37]',
      description: '14-Day inventory timeline'
    },
    {
      id: 'frontdesk',
      label: 'Front Desk & Run Sheet',
      icon: ConciergeBell,
      badge: `${todayArrivals.length} Arr / ${todayDepartures.length} Dep`,
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800',
      description: 'Check-in, check-out & keys'
    },
    {
      id: 'booking_portal',
      label: 'Direct Booking Suite',
      icon: Compass,
      badge: 'Live Engine',
      badgeColor: 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30',
      description: 'High-conversion commerce'
    },
    {
      id: 'guest_portal',
      label: 'In-Stay Guest Companion',
      icon: Smartphone,
      badge: 'Digital Room Pass',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border border-cyan-800',
      description: 'Smart room controls & mobile key'
    },
    {
      id: 'concierge_ai',
      label: 'AI Concierge & Messaging',
      icon: Bot,
      badge: pendingRequests > 0 ? `${pendingRequests} Requests` : 'AI Live',
      badgeColor: pendingRequests > 0 ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-purple-950/80 text-purple-300',
      description: 'Aura AI & Unified inbox'
    },
    {
      id: 'pos',
      label: 'Restaurant & Spa POS',
      icon: UtensilsCrossed,
      badge: '9 Tables',
      badgeColor: 'bg-amber-950/80 text-amber-300 border border-amber-800',
      description: 'Table seating & room charging'
    },
    {
      id: 'housekeeping',
      label: 'Housekeeping & Repairs',
      icon: Sparkles,
      badge: dirtyRoomsCount > 0 ? `${dirtyRoomsCount} Turn` : 'All Clean',
      badgeColor: dirtyRoomsCount > 0 ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-emerald-950/80 text-emerald-300',
      description: 'Room turnover & maintenance'
    },
    {
      id: 'guest_crm',
      label: 'Guest CRM & VIPs',
      icon: Users,
      badge: 'Loyalty Tiers',
      badgeColor: 'bg-purple-950/80 text-purple-300 border border-purple-800',
      description: 'Preferences & spend histories'
    },
    {
      id: 'channels',
      label: 'Channel Distribution',
      icon: Share2,
      badge: parityViolations > 0 ? `${parityViolations} Parity Alert` : 'Synced',
      badgeColor: parityViolations > 0 ? 'bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse' : 'bg-emerald-950/80 text-emerald-300',
      description: 'OTA sync & parity monitor'
    },
    {
      id: 'sales_events',
      label: 'Sales, Groups & BEO',
      icon: Briefcase,
      badge: '2 Events',
      badgeColor: 'bg-blue-950/80 text-blue-300 border border-blue-800',
      description: 'Room blocks & banquet sheets'
    },
    {
      id: 'analytics',
      label: 'RevPAR & Financials',
      icon: LineChart,
      badge: null,
      description: 'ADR, TRevPAR & pace curve'
    }
  ];

  return (
    <nav className="brand-dark-shell bg-[#080C11] text-[#D1DDD7] border-b lg:border-b-0 lg:border-r border-[#263540] w-full max-w-full lg:w-[272px] lg:min-w-[272px] lg:shrink-0 overflow-hidden">
      <div className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar p-2.5 sm:p-3 lg:p-4 lg:sticky lg:top-[76px] w-full max-w-full">
        <div className="hidden lg:flex items-center justify-between px-2 pb-3 mb-1 border-b border-[#2C3B34]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#7F958A] font-semibold">Workspace</span>
            <p className="text-xs text-[#E0CDA9] mt-1">Operations & guest care</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#B8FF00] shadow-[0_0_0_4px_rgba(184,255,0,0.14)]" />
        </div>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const sectionLabel =
            index === 0 ? 'Overview' :
            index === 1 ? 'Operations' :
            index === 3 ? 'Guest experience' :
            index === 6 ? 'Property operations' :
            index === 9 ? 'Commercial' : null;
          return (
            <React.Fragment key={item.id}>
              {sectionLabel && (
                <div className={`hidden lg:block text-[10px] uppercase tracking-[0.14em] text-[#678075] font-semibold px-2 ${index === 0 ? '' : 'pt-3'}`}>
                  {sectionLabel}
                </div>
              )}
              <button
                onClick={() => setActiveView(item.id)}
                title={item.description}
                className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 lg:w-full min-w-0 ${
                  isActive
                    ? 'bg-[#F8F6F1] text-[#1E2522] shadow-sm font-semibold'
                    : 'hover:bg-[#23332B] text-[#A2B5AD] hover:text-[#FBF9F5]'
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-[#EAE4D8]' : 'bg-[#1C2A24] group-hover:bg-[#2A3B32]'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E2522]' : 'text-[#8EA299]'}`} />
                </span>
                <span className="text-left flex-1 min-w-0 truncate">{item.label}</span>
                {item.badge && <span className={`max-w-[86px] truncate shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isActive ? 'bg-[#1E2522] text-[#E0CDA9]' : item.badgeColor}`}>{item.badge}</span>}
              </button>
            </React.Fragment>
          );
        })}
        <div className="hidden lg:block mt-4 pt-4 border-t border-[#2C3B34]">
          <button
            onClick={() => setActiveView('concierge_ai')}
            className="w-full rounded-xl border border-[#3B5146] bg-[#1C2A24] px-3 py-3 text-left hover:border-[#D4AF37]/70 transition-colors"
          >
            <div className="flex items-center gap-2 text-[#E0CDA9] text-xs font-semibold">
              <span className="w-7 h-7 rounded-lg bg-[#2A3B32] flex items-center justify-center">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
              </span>
              <span>Need a hand?</span>
            </div>
            <p className="text-[10px] leading-relaxed text-[#8EA299] mt-2 pl-9">Ask Aura to route a guest request or find a stay.</p>
          </button>
        </div>
      </div>
    </nav>
  );
};

import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { 
  BedDouble, 
  Users, 
  DollarSign, 
  Sparkles, 
  Key, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Utensils, 
  Calendar, 
  Compass,
  TrendingUp,
  Award
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const OperationsPulse: React.FC = () => {
  const { 
    rooms, 
    reservations, 
    guests, 
    currentDate, 
    occupancyRate, 
    todayArrivals, 
    todayDepartures, 
    todayInHouse, 
    todayRevenue,
    metrics,
    checkInGuest,
    checkOutGuest,
    openNewReservationModal,
    openFolioModal,
    openDigitalKeyModal,
    setActiveView,
    updateRoomStatus
  } = useHotel();

  const dirtyRooms = rooms.filter(r => r.status === 'dirty' || r.status === 'inspecting');
  const availableRooms = rooms.filter(r => r.status === 'clean');
  const vipInHouse = todayInHouse.filter(r => r.vipTier === 'Black Diamond VIP' || r.vipTier === 'Gold');

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Briefing */}
      <div className="bg-gradient-to-r from-[#1E2522] via-[#24302C] to-[#1E2522] text-[#FBF9F5] rounded-3xl p-6 lg:p-8 border border-[#33423B] shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37] via-transparent to-transparent"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                Live Operations Briefing
              </span>
              <span className="text-xs text-[#A2B5AD] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Date: {currentDate} • 14:00 Shift
              </span>
            </div>
            <h1 className="font-serif-heading text-3xl lg:text-4xl font-medium tracking-tight">
              Hospitality Command & Run Sheet
            </h1>
            <p className="text-sm text-[#B4C4BC] mt-1.5 max-w-2xl leading-relaxed">
              Resort operating at <span className="text-[#D4AF37] font-semibold">{occupancyRate}% occupancy</span> today. 
              {todayArrivals.length > 0 ? ` ${todayArrivals.length} VIP arrivals scheduled.` : ' All arrivals processed.'} 
              {dirtyRooms.length > 0 ? ` Housekeeping actively turning ${dirtyRooms.length} suites.` : ' All suites pristine.'}
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openNewReservationModal()}
              className="bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1A2420] font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-[#D4AF37]/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Booking</span>
            </button>
            <button
              onClick={() => setActiveView('matrix')}
              className="bg-[#2B3832] hover:bg-[#384941] text-[#E0E9E4] font-medium px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-[#44554D] transition-all"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Tape Chart</span>
            </button>
            <button
              onClick={() => setActiveView('pos')}
              className="bg-[#2B3832] hover:bg-[#384941] text-[#E0E9E4] font-medium px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-[#44554D] transition-all"
            >
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Room Charge POS</span>
            </button>
            <button
              onClick={() => setActiveView('booking_portal')}
              className="bg-[#2B3832] hover:bg-[#384941] text-[#E5D8BA] font-medium px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-[#526359] transition-all"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span>Guest Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div className="bg-white border border-[#E3DCD1] rounded-2xl p-4 shadow-sm hover:border-[#D4AF37]/60 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-[#788880] uppercase tracking-wider font-semibold">Occupancy</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 font-serif-heading text-2xl lg:text-3xl font-semibold text-[#1A2420]">
            {occupancyRate}%
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <span>+{todayInHouse.length} suites occupied</span>
          </div>
        </div>

        <div className="bg-white border border-[#E3DCD1] rounded-2xl p-4 shadow-sm hover:border-[#D4AF37]/60 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-[#788880] uppercase tracking-wider font-semibold">Avg Daily Rate</span>
            <DollarSign className="w-4 h-4 text-[#A38020]" />
          </div>
          <div className="mt-2 font-serif-heading text-2xl lg:text-3xl font-semibold text-[#1A2420]">
            $960
          </div>
          <div className="mt-1 text-[11px] text-[#697972]">
            Peak season yield
          </div>
        </div>

        <div className="bg-white border border-[#E3DCD1] rounded-2xl p-4 shadow-sm hover:border-[#D4AF37]/60 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-[#788880] uppercase tracking-wider font-semibold">RevPAR</span>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="mt-2 font-serif-heading text-2xl lg:text-3xl font-semibold text-[#1A2420]">
            $960.00
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            +18% vs seasonal target
          </div>
        </div>

        <div className="bg-white border border-[#E3DCD1] rounded-2xl p-4 shadow-sm hover:border-[#D4AF37]/60 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-[#788880] uppercase tracking-wider font-semibold">Today's Arrivals</span>
            <ArrowDownLeft className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 font-serif-heading text-2xl lg:text-3xl font-semibold text-[#1A2420]">
            {todayArrivals.length}
          </div>
          <div className="mt-1 text-[11px] text-blue-700 font-medium">
            {todayArrivals.filter(a => a.status === 'checked_in').length} In / {todayArrivals.filter(a => a.status === 'confirmed').length} Expected
          </div>
        </div>

        <div className="bg-white border border-[#E3DCD1] rounded-2xl p-4 shadow-sm hover:border-[#D4AF37]/60 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-[#788880] uppercase tracking-wider font-semibold">Departures</span>
            <ArrowUpRight className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 font-serif-heading text-2xl lg:text-3xl font-semibold text-[#1A2420]">
            {todayDepartures.length}
          </div>
          <div className="mt-1 text-[11px] text-purple-700 font-medium">
            {todayDepartures.filter(d => d.status === 'checked_out').length} Out / {todayDepartures.filter(d => d.status !== 'checked_out').length} Pending
          </div>
        </div>

        <div className="bg-white border border-[#E3DCD1] rounded-2xl p-4 shadow-sm hover:border-[#D4AF37]/60 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-[#788880] uppercase tracking-wider font-semibold">Housekeeping</span>
            <BedDouble className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="mt-2 font-serif-heading text-2xl lg:text-3xl font-semibold text-[#1A2420]">
            {availableRooms.length} / {rooms.length}
          </div>
          <div className="mt-1 text-[11px] text-[#788880]">
            {dirtyRooms.length} in turnover
          </div>
        </div>

      </div>

      {/* Main 2-Column Split: Active Arrivals/Departures + Real-time Suite Matrix Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Front Desk Live Run Sheet (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Arrivals Table Card */}
          <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE5DA] mb-4">
              <div>
                <h3 className="font-serif-heading text-xl font-medium text-[#1E2522]">
                  Today's Scheduled Arrivals
                </h3>
                <p className="text-xs text-[#708078]">
                  Direct check-in, keycard provisioning, and luggage dispatch
                </p>
              </div>
              <button 
                onClick={() => setActiveView('frontdesk')}
                className="text-xs text-[#A38020] hover:text-[#7A5F14] font-semibold flex items-center gap-1"
              >
                View Full Run Sheet <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todayArrivals.map(res => (
                <div 
                  key={res.id}
                  className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#EBE4D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#D4AF37] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E2522] text-[#D4AF37] font-semibold text-xs flex items-center justify-center shrink-0">
                      {res.guestName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#1E2522]">{res.guestName}</span>
                        {res.vipTier && res.vipTier !== 'Standard' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#856715] border border-[#D4AF37]/40 flex items-center gap-1">
                            <Award className="w-3 h-3" /> {res.vipTier}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7C75] mt-0.5">
                        Suite {res.roomNumber} ({res.roomType}) • {res.nights} nights • {res.numGuests} guests
                      </p>
                      {res.specialRequests && (
                        <p className="text-[11px] text-[#A67C1E] mt-1 bg-[#F5EEDD] px-2 py-0.5 rounded inline-block">
                          Note: {res.specialRequests}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openFolioModal(res)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-[#D8CFC2] hover:bg-[#F3EFE7] text-[#2C3833]"
                    >
                      Folio (${res.totalAmount})
                    </button>
                    {res.status === 'confirmed' ? (
                      <button
                        onClick={() => checkInGuest(res.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#1E2522] hover:bg-[#2A3732] text-white flex items-center gap-1.5 shadow-sm"
                      >
                        <Key className="w-3.5 h-3.5 text-[#D4AF37]" /> Check In
                      </button>
                    ) : (
                      <button
                        onClick={() => openDigitalKeyModal(res)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> In House
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {todayArrivals.length === 0 && (
                <div className="text-center py-6 text-xs text-[#8A9C94] bg-[#FAF8F4] rounded-2xl border border-dashed border-[#DFD7CA]">
                  No remaining arrivals scheduled for today.
                </div>
              )}
            </div>
          </div>

          {/* 7-Day Revenue & Occupancy Spark Chart */}
          <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif-heading text-xl font-medium text-[#1E2522]">
                  Weekly Revenue Trend
                </h3>
                <p className="text-xs text-[#708078]">Rooms & F&B daily revenue across current cycle</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F3EFE7] text-[#1E2522]">
                7-Day Total: ${metrics.reduce((s, m) => s + m.totalRoomRevenue + m.totalFBRevenue, 0).toLocaleString()}
              </span>
            </div>

            <div className="h-56 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="roomRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E2522" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1E2522" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="fbRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="totalRoomRevenue" name="Room Revenue" stroke="#1E2522" strokeWidth={2.5} fillOpacity={1} fill="url(#roomRevGrad)" />
                  <Area type="monotone" dataKey="totalFBRevenue" name="F&B & Spa" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#fbRevGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: VIP Spotlight & Suite Status Snapshot (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* VIP In-House Highlights */}
          <div className="bg-[#1E2522] text-[#FBF9F5] rounded-3xl p-5 lg:p-6 border border-[#33423B] shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#2F3D37] mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif-heading text-lg font-medium text-white">
                  VIP In-House Spotlight
                </h3>
              </div>
              <span className="text-[11px] bg-[#2B3933] text-[#D4AF37] px-2 py-0.5 rounded-full">
                {vipInHouse.length} VIPs
              </span>
            </div>

            <div className="space-y-3">
              {vipInHouse.map(res => {
                const guest = guests.find(g => g.id === res.guestId) || {
                  vipTier: res.vipTier,
                  dietaryRestrictions: ['Pescatarian'],
                  pillowPreference: 'Silk mask & firm goose down',
                  favoriteDrinks: ['Dom Pérignon']
                };

                return (
                  <div key={res.id} className="p-3.5 rounded-2xl bg-[#24302A] border border-[#384841] text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-sm text-white">{res.guestName}</span>
                        <span className="text-[#A7B9B1] block text-[11px]">{res.roomType} • Suite {res.roomNumber}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-[#1E2522]">
                        {res.vipTier}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#314139] grid grid-cols-2 gap-2 text-[11px] text-[#CAD6D0]">
                      <div>
                        <span className="text-[#7A8E85] block text-[10px] uppercase">Dietary</span>
                        <span>{guest.dietaryRestrictions?.join(', ') || 'No restrictions'}</span>
                      </div>
                      <div>
                        <span className="text-[#7A8E85] block text-[10px] uppercase">Pillow Preference</span>
                        <span className="truncate block">{guest.pillowPreference || 'Standard'}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => openFolioModal(res)}
                        className="flex-1 py-1.5 rounded-lg bg-[#2E3D36] hover:bg-[#3A4C44] text-[#E0EBE6] text-[11px] font-medium"
                      >
                        View Folio (${res.totalAmount})
                      </button>
                      <button
                        onClick={() => openDigitalKeyModal(res)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#C49F2E] text-[#1E2522] text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Key className="w-3 h-3" /> Key
                      </button>
                    </div>
                  </div>
                );
              })}

              {vipInHouse.length === 0 && (
                <p className="text-center py-4 text-xs text-[#7A8C84]">No VIP guests currently in house.</p>
              )}
            </div>
          </div>

          {/* Quick Suite Status Grid */}
          <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE5DA] mb-4">
              <div>
                <h3 className="font-serif-heading text-xl font-medium text-[#1E2522]">
                  Suite Status Matrix
                </h3>
                <p className="text-xs text-[#708078]">12 luxury keys • Click status to toggle</p>
              </div>
              <button
                onClick={() => setActiveView('housekeeping')}
                className="text-xs text-[#A38020] hover:text-[#7A5F14] font-semibold"
              >
                Board →
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {rooms.map(room => {
                const isOccupied = todayInHouse.some(r => r.roomId === room.id);
                
                let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
                if (room.status === 'dirty') badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
                if (room.status === 'inspecting') badgeColor = 'bg-blue-50 text-blue-800 border-blue-300';
                if (room.status === 'maintenance') badgeColor = 'bg-rose-50 text-rose-800 border-rose-300';

                return (
                  <div 
                    key={room.id}
                    className="p-2.5 rounded-xl border border-[#E7E0D5] bg-[#FAF8F4] hover:bg-white hover:border-[#D4AF37] transition-all text-center group cursor-pointer"
                    onClick={() => {
                      // quick toggle status
                      const next = room.status === 'clean' ? 'dirty' : room.status === 'dirty' ? 'inspecting' : 'clean';
                      updateRoomStatus(room.id, next);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#1E2522]">{room.number}</span>
                      {isOccupied && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" title="Occupied" />}
                    </div>
                    <span className="text-[10px] text-[#71807A] block truncate">{room.type.split(' ')[0]}</span>
                    <span className={`mt-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider block border ${badgeColor}`}>
                      {room.status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#EBE5DA] flex items-center justify-between text-[11px] text-[#708078]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Clean & Ready
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Turnover
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Repair
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

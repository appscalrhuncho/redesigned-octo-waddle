import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Room, RoomType, Reservation } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Sparkles, 
  Bed, 
  Users, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Layers,
  LayoutGrid,
  List,
  Eye,
  Key
} from 'lucide-react';

export const AvailabilityGrid: React.FC = () => {
  const { 
    rooms, 
    reservations, 
    currentDate, 
    openNewReservationModal, 
    openFolioModal,
    openDigitalKeyModal,
    updateRoomStatus
  } = useHotel();

  const [startDateStr, setStartDateStr] = useState('2026-05-10');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'tape' | 'cards'>('tape');
  const [hoveredRes, setHoveredRes] = useState<Reservation | null>(null);

  // Generate 14 continuous days from startDate
  const daysArray = useMemo(() => {
    const start = new Date(startDateStr);
    const days: { dateStr: string; dayName: string; dayNum: number; isToday: boolean; isWeekend: boolean }[] = [];
    
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const isToday = dateStr === currentDate;
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      days.push({ dateStr, dayName, dayNum, isToday, isWeekend });
    }
    return days;
  }, [startDateStr, currentDate]);

  const handlePrevWeek = () => {
    const d = new Date(startDateStr);
    d.setDate(d.getDate() - 7);
    setStartDateStr(d.toISOString().split('T')[0]);
  };

  const handleNextWeek = () => {
    const d = new Date(startDateStr);
    d.setDate(d.getDate() + 7);
    setStartDateStr(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 2); // Start 2 days before current
    setStartDateStr(d.toISOString().split('T')[0]);
  };

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      if (selectedType !== 'All' && r.type !== selectedType) return false;
      if (selectedFloor !== 'All' && r.floor.toString() !== selectedFloor) return false;
      return true;
    });
  }, [rooms, selectedType, selectedFloor]);

  // Calculate daily occupancy
  const getOccupancyForDate = (dateStr: string) => {
    const occupied = reservations.filter(r => {
      if (r.status === 'cancelled') return false;
      return dateStr >= r.checkInDate && dateStr < r.checkOutDate;
    }).length;
    return Math.round((occupied / rooms.length) * 100);
  };

  // Check reservation for a room and date
  const getReservationForCell = (roomId: string, dateStr: string) => {
    return reservations.find(r => {
      if (r.roomId !== roomId || r.status === 'cancelled') return false;
      return dateStr >= r.checkInDate && dateStr < r.checkOutDate;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Matrix Controls */}
      <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#1E2522] text-[#D4AF37]">
                Live Availability Matrix
              </span>
              <span className="text-xs text-[#7A8C84]">14-Day Timeline Tape Chart</span>
            </div>
            <h2 className="font-serif-heading text-2xl lg:text-3xl font-medium text-[#1E2522]">
              Room Inventory & Schedule
            </h2>
          </div>

          {/* Controls: Date Nav, Filters, View Modes */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Timeline Pagination */}
            <div className="flex items-center bg-[#FAF8F4] border border-[#E0D7CB] rounded-xl p-1 text-xs">
              <button 
                onClick={handlePrevWeek} 
                className="p-1.5 rounded-lg hover:bg-white text-[#4D5E56] hover:text-[#1E2522] transition-colors"
                title="Previous 7 Days"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleToday}
                className="px-3 py-1 font-semibold text-[#1E2522] hover:bg-white rounded-lg transition-colors"
              >
                Focus Today
              </button>
              <button 
                onClick={handleNextWeek} 
                className="p-1.5 rounded-lg hover:bg-white text-[#4D5E56] hover:text-[#1E2522] transition-colors"
                title="Next 7 Days"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Room Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#FAF8F4] border border-[#E0D7CB] text-xs font-medium text-[#1E2522] rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-[#D4AF37]"
            >
              <option value="All">All Categories ({rooms.length})</option>
              <option value="Cliffside Pavilion">Cliffside Pavilion</option>
              <option value="Garden Pool Villa">Garden Pool Villa</option>
              <option value="Azure Penthouse">Azure Penthouse</option>
              <option value="Oceanfront Bungalow">Oceanfront Bungalow</option>
              <option value="Heritage Courtyard Suite">Heritage Courtyard</option>
              <option value="Sunset Star Deck Suite">Sunset Star Deck</option>
            </select>

            {/* View Mode Toggle (Tape Chart vs Card Grid) */}
            <div className="flex items-center bg-[#FAF8F4] border border-[#E0D7CB] rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode('tape')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'tape' ? 'bg-[#1E2522] text-white shadow-sm' : 'text-[#6C7E77] hover:text-[#1E2522]'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Tape Chart
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'cards' ? 'bg-[#1E2522] text-white shadow-sm' : 'text-[#6C7E77] hover:text-[#1E2522]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Room Cards
              </button>
            </div>

            {/* New Reservation Action */}
            <button
              onClick={() => openNewReservationModal()}
              className="bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1A2420] font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> New Booking
            </button>

          </div>

        </div>

        {/* Status Legend Bar */}
        <div className="mt-4 pt-4 border-t border-[#EBE4D8] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-[#6A7B74]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#254133] inline-block shadow-sm"></span> Confirmed Reservation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#A38020] inline-block shadow-sm"></span> Checked In (Active)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#64748B] inline-block shadow-sm"></span> Checked Out
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#C2410C] inline-block shadow-sm"></span> Maintenance Hold
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#FAF8F4] border border-dashed border-[#C5BBAA] inline-block"></span> Available
            </span>
          </div>

          <div className="text-[11px] text-[#869790] italic">
            * Click any empty slot to book; click active block to inspect folio.
          </div>
        </div>
      </div>

      {/* VIEW 1: Tape Chart Timeline Matrix */}
      {viewMode === 'tape' && (
        <div className="bg-white border border-[#E3DCD1] rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1100px]">
              
              {/* Matrix Column Headers */}
              <div className="grid grid-cols-[240px_repeat(14,_minmax(58px,_1fr))] border-b border-[#E3DCD1] bg-[#1E2522] text-[#FBF9F5] sticky top-0 z-20">
                
                {/* Top-Left Corner: Suite Info Header */}
                <div className="p-3.5 font-semibold text-xs border-r border-[#303E38] flex items-center justify-between">
                  <span>Suite / Room Details</span>
                  <span className="text-[10px] text-[#A2B5AD] uppercase font-normal">{filteredRooms.length} keys</span>
                </div>

                {/* Date Columns */}
                {daysArray.map((day) => {
                  const occ = getOccupancyForDate(day.dateStr);
                  return (
                    <div 
                      key={day.dateStr}
                      className={`p-2 text-center border-r border-[#303E38] ${
                        day.isToday ? 'bg-[#D4AF37]/20 border-b-2 border-b-[#D4AF37]' : day.isWeekend ? 'bg-[#25302B]' : ''
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-[#A2B5AD]">
                        {day.dayName}
                      </div>
                      <div className={`font-serif-heading text-sm font-bold ${day.isToday ? 'text-[#D4AF37]' : 'text-white'}`}>
                        {day.dayNum}
                      </div>
                      <div className="text-[9px] text-[#82968E] mt-0.5">
                        {occ}%
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Matrix Rows (Rooms) */}
              <div className="divide-y divide-[#EBE4D8]">
                {filteredRooms.map((room) => {
                  return (
                    <div 
                      key={room.id}
                      className="grid grid-cols-[240px_repeat(14,_minmax(58px,_1fr))] hover:bg-[#FAF8F4] transition-colors group"
                    >
                      
                      {/* Left Room Info Column */}
                      <div className="p-3 border-r border-[#EBE4D8] bg-white group-hover:bg-[#FAF8F4] flex items-center justify-between sticky left-0 z-10 shadow-[2px_0_6px_rgba(0,0,0,0.02)]">
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[#1E2522]">{room.number}</span>
                            <span className="text-[10px] font-semibold text-[#8B7543] bg-[#F7F2E7] px-1.5 py-0.2 rounded truncate">
                              {room.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#71827B] block truncate mt-0.5">
                            {room.type} • Floor {room.floor}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-[#1E2522] block">${room.seasonalPrice}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                            room.status === 'clean' ? 'bg-emerald-50 text-emerald-800' :
                            room.status === 'dirty' ? 'bg-amber-50 text-amber-800' :
                            room.status === 'inspecting' ? 'bg-blue-50 text-blue-800' : 'bg-rose-50 text-rose-800'
                          }`}>
                            {room.status}
                          </span>
                        </div>
                      </div>

                      {/* 14 Day Cells */}
                      {daysArray.map((day) => {
                        const res = getReservationForCell(room.id, day.dateStr);
                        const isCheckInDay = res && res.checkInDate === day.dateStr;
                        const isCheckOutDay = res && res.checkOutDate === day.dateStr;

                        if (res) {
                          let bgClass = 'bg-[#233C2E] text-[#F3EFE6] border-[#314F3E]';
                          if (res.status === 'checked_in') bgClass = 'bg-[#8F701B] text-[#FFFDF8] border-[#A88626] shadow-sm';
                          if (res.status === 'checked_out') bgClass = 'bg-[#56687A] text-white border-[#697E94]';
                          if (room.status === 'maintenance') bgClass = 'bg-[#B84018] text-white border-[#CE4F26]';

                          return (
                            <div 
                              key={day.dateStr}
                              onClick={() => openFolioModal(res)}
                              onMouseEnter={() => setHoveredRes(res)}
                              onMouseLeave={() => setHoveredRes(null)}
                              className={`p-1 border-r border-[#EBE4D8] relative cursor-pointer group/cell ${
                                day.isWeekend ? 'bg-[#F9F7F2]' : 'bg-white'
                              }`}
                            >
                              <div className={`h-11 rounded-lg p-1.5 text-[11px] font-medium border flex flex-col justify-between overflow-hidden transition-transform group-hover/cell:scale-[0.98] ${bgClass}`}>
                                <div className="flex items-center justify-between gap-1 leading-tight">
                                  <span className="font-bold truncate text-[11px]">
                                    {isCheckInDay ? `▶ ${res.guestName}` : res.guestName}
                                  </span>
                                  {res.vipTier === 'Black Diamond VIP' && (
                                    <Sparkles className="w-2.5 h-2.5 text-[#FFE28A] shrink-0" />
                                  )}
                                </div>
                                <div className="flex justify-between items-center text-[9px] opacity-90 leading-none">
                                  <span>{res.numGuests}g • {res.nights}n</span>
                                  <span className="font-semibold">${res.totalAmount}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Empty cell: Click to book
                        return (
                          <div 
                            key={day.dateStr}
                            onClick={() => {
                              const nextDay = new Date(day.dateStr);
                              nextDay.setDate(nextDay.getDate() + 2);
                              openNewReservationModal({
                                roomId: room.id,
                                roomNumber: room.number,
                                roomType: room.type,
                                checkInDate: day.dateStr,
                                checkOutDate: nextDay.toISOString().split('T')[0]
                              });
                            }}
                            className={`p-1 border-r border-[#EBE4D8] relative hover:bg-[#FAF3E0] cursor-pointer transition-colors flex items-center justify-center group/slot ${
                              day.isToday ? 'bg-[#FAF6EC]' : day.isWeekend ? 'bg-[#F9F7F2]' : 'bg-white'
                            }`}
                            title={`Book Suite ${room.number} on ${day.dateStr}`}
                          >
                            <span className="text-[10px] text-[#A69E8F] opacity-0 group-hover/slot:opacity-100 flex items-center gap-0.5 font-medium">
                              <Plus className="w-3 h-3 text-[#D4AF37]" /> Book
                            </span>
                          </div>
                        );
                      })}

                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Room Cards Showcase View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => {
            const activeRes = reservations.find(r => 
              r.roomId === room.id && 
              r.status !== 'cancelled' &&
              currentDate >= r.checkInDate && 
              currentDate < r.checkOutDate
            );

            return (
              <div 
                key={room.id}
                className="bg-white border border-[#E3DCD1] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Header with Badges */}
                  <div className="relative h-52 overflow-hidden bg-[#1E2522]">
                    <img 
                      src={room.images[0]} 
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-[#1E2522]/90 backdrop-blur text-white text-[11px] font-semibold tracking-wider">
                        Suite {room.number}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[#1E2522] text-[11px] font-medium">
                        {room.type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${
                        room.status === 'clean' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        room.status === 'dirty' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                        room.status === 'inspecting' ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}>
                        {room.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                      <div>
                        <span className="text-[11px] opacity-80">{room.sizeSqM} m² • {room.bedConfig}</span>
                        <h3 className="font-serif-heading text-lg font-medium leading-tight">{room.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold font-serif-heading">${room.seasonalPrice}</span>
                        <span className="text-[10px] opacity-75 block">/ night</span>
                      </div>
                    </div>
                  </div>

                  {/* Room Details & Amenities */}
                  <div className="p-4 space-y-3 text-xs">
                    <p className="text-[#64766E] leading-relaxed">
                      <strong className="text-[#1E2522]">View:</strong> {room.view}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {room.amenities.slice(0, 3).map((am, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-[#FAF8F4] border border-[#EBE4D8] text-[11px] text-[#55675F]">
                          {am}
                        </span>
                      ))}
                    </div>

                    {/* Active Occupant Status */}
                    {activeRes ? (
                      <div className="p-3 rounded-2xl bg-[#F7F4EC] border border-[#E6DDCF] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#867650] uppercase font-bold tracking-wider block">Current Guest</span>
                          <span className="font-semibold text-sm text-[#1E2522]">{activeRes.guestName}</span>
                          <span className="text-[11px] text-[#71827B] block">{activeRes.checkInDate} → {activeRes.checkOutDate}</span>
                        </div>
                        <button
                          onClick={() => openFolioModal(activeRes)}
                          className="px-3 py-1.5 rounded-xl bg-[#1E2522] text-white text-xs font-medium"
                        >
                          Folio
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                        <span className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Vacant & Ready
                        </span>
                        <button
                          onClick={() => openNewReservationModal({ roomId: room.id, roomNumber: room.number, roomType: room.type })}
                          className="px-3 py-1.5 rounded-xl bg-[#1E2522] hover:bg-[#2A3832] text-white text-xs font-semibold"
                        >
                          Book Suite
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 pt-0 border-t border-[#F2ECE1] mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      const next = room.status === 'clean' ? 'dirty' : room.status === 'dirty' ? 'inspecting' : 'clean';
                      updateRoomStatus(room.id, next);
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-medium bg-[#FAF8F4] border border-[#E0D7CB] hover:bg-[#F2ECE1] text-[#2F3C36]"
                  >
                    Cycle Status: {room.status}
                  </button>
                  {activeRes && (
                    <button
                      onClick={() => openDigitalKeyModal(activeRes)}
                      className="px-3 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1E2522] text-xs font-semibold flex items-center gap-1"
                    >
                      <Key className="w-3.5 h-3.5" /> Digital Key
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

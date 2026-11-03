import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Plus, 
  DollarSign, 
  Clock, 
  Utensils, 
  Sparkles, 
  Printer, 
  ShieldCheck,
  Building,
  Check
} from 'lucide-react';
import { GroupEvent } from '../../types';

export const GroupEventsManager: React.FC = () => {
  const { 
    groupEvents, 
    addGroupEvent, 
    formatCurrency 
  } = useHotel();

  const [selectedEventId, setSelectedEventId] = useState<string>(groupEvents[0]?.id || 'GRP-2026-01');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Event Form State
  const [groupName, setGroupName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [eventType, setEventType] = useState<'Wedding & Celebration' | 'Executive Retreat' | 'Catering Banquet' | 'Film Production'>('Executive Retreat');
  const [arrivalDate, setArrivalDate] = useState('2026-06-15');
  const [departureDate, setDepartureDate] = useState('2026-06-18');
  const [roomsBlocked, setRoomsBlocked] = useState(6);
  const [attendeesCount, setAttendeesCount] = useState(12);
  const [totalContractValue, setTotalContractValue] = useState(28000);
  const [depositPaid, setDepositPaid] = useState(14000);
  const [spacesBookedStr, setSpacesBookedStr] = useState('Cliffside Pavilion, Wine Cellar Boardroom');
  const [functionSheetNotes, setFunctionSheetNotes] = useState('BEO: Dedicated 1Gbps uplink, 7-course Mediterranean tasting gala dinner on night 2, Billing to Master Folio.');

  const selectedEvent = groupEvents.find(e => e.id === selectedEventId) || groupEvents[0];

  const handleCreateGroupEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !organizer.trim()) return;

    const newEv: GroupEvent = {
      id: `GRP-2026-${Date.now().toString().slice(-3)}`,
      groupName,
      organizer,
      contactEmail: contactEmail || 'corporate@azure-sanctuary.com',
      contactPhone: contactPhone || '+1 (555) 982-1200',
      eventType,
      arrivalDate,
      departureDate,
      roomsBlocked: Number(roomsBlocked),
      attendeesCount: Number(attendeesCount),
      totalContractValue: Number(totalContractValue),
      depositPaid: Number(depositPaid),
      status: 'Contract Signed',
      spacesBooked: spacesBookedStr.split(',').map(s => s.trim()),
      functionSheetNotes
    };

    addGroupEvent(newEv);
    setSelectedEventId(newEv.id);
    setShowNewModal(false);
    setGroupName('');
    setOrganizer('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#141A17] text-[#FBF9F5] rounded-2xl p-5 border border-[#2D3E35] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-950/80 text-blue-300 border border-blue-800">
              Sales, Group Blocks & Banquet Event Orders (BEO)
            </span>
            <span className="text-xs text-[#A6B4AE]">High-Margin Corporate & Buyout Revenue</span>
          </div>
          <h1 className="font-serif-heading text-2xl font-bold text-[#F7F4EE]">
            Sales & Group Event Management
          </h1>
          <p className="text-xs text-[#8EA299]">
            Track group room blocks, pickup pace, catering function sheets, and Master Folio billing.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B89327] hover:from-[#E5C358] text-[#141A17] rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Group Block & BEO</span>
        </button>
      </div>

      {/* Main 2-Column Layout: Group List + BEO Function Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Group Events List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="font-serif-heading text-sm font-bold text-[#1E2522] px-1">
            Active Group Contracts & Buyouts
          </h2>

          {groupEvents.map(event => {
            const isSelected = selectedEventId === event.id;

            return (
              <div 
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-white border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]' 
                    : 'bg-[#FAF8F4] border-[#EAE3D6] hover:bg-[#F2ECE1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAE3D6] text-[#52645D]">
                    {event.eventType}
                  </span>
                  <span className="font-serif-heading font-bold text-sm text-[#9E7D23]">
                    {formatCurrency(event.totalContractValue)}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#1E2522] leading-snug">{event.groupName}</h3>
                <p className="text-xs text-[#7A8C84] mt-0.5">Organizer: {event.organizer}</p>

                {/* Allocation stats */}
                <div className="mt-3 pt-2.5 border-t border-[#EAE3D6] flex justify-between text-[11px] text-[#52645D]">
                  <span>{event.roomsBlocked} Suites Blocked</span>
                  <span className="font-bold">{event.attendeesCount} Attendees</span>
                </div>

                <div className="flex justify-between text-[10px] text-[#7A8C84] mt-2">
                  <span>{event.arrivalDate} → {event.departureDate}</span>
                  <span className="text-emerald-700 font-semibold uppercase">{event.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 8 Cols: Banquet Event Order (BEO) Detail Sheet */}
        {selectedEvent && (
          <div className="lg:col-span-8 bg-white border border-[#EAE3D6] rounded-2xl shadow-md p-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D6]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#9E7D23]">{selectedEvent.id}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {selectedEvent.status.toUpperCase()}
                  </span>
                </div>
                <h2 className="font-serif-heading text-xl font-bold text-[#1E2522]">
                  Banquet Event Order (BEO) — {selectedEvent.groupName}
                </h2>
                <p className="text-xs text-[#7A8C84]">Official Resort Function Sheet & Group Room Block Allocation</p>
              </div>

              <button 
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D8CEBF] bg-[#FAF8F4] text-xs font-semibold text-[#1E2522] hover:bg-[#F2ECE1] transition-colors self-start sm:self-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print BEO Sheet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
              <div className="p-3.5 bg-[#FAF8F4] rounded-xl border border-[#EAE3D6]">
                <span className="text-[10px] text-[#7A8C84] uppercase tracking-wider block">Total Contract Value</span>
                <span className="font-serif-heading font-bold text-lg text-[#1E2522]">{formatCurrency(selectedEvent.totalContractValue)}</span>
                <span className="text-[10px] text-emerald-700 block">Deposit Paid: {formatCurrency(selectedEvent.depositPaid)}</span>
              </div>
              <div className="p-3.5 bg-[#FAF8F4] rounded-xl border border-[#EAE3D6]">
                <span className="text-[10px] text-[#7A8C84] uppercase tracking-wider block">Room Block Allocation</span>
                <span className="font-serif-heading font-bold text-lg text-[#1E2522]">{selectedEvent.roomsBlocked} Suites</span>
                <span className="text-[10px] text-[#52645D] block">{selectedEvent.attendeesCount} Registered Attendees</span>
              </div>
              <div className="p-3.5 bg-[#FAF8F4] rounded-xl border border-[#EAE3D6]">
                <span className="text-[10px] text-[#7A8C84] uppercase tracking-wider block">Contract Stay Dates</span>
                <span className="font-bold text-xs text-[#1E2522] block mt-1">{selectedEvent.arrivalDate} — {selectedEvent.departureDate}</span>
                <span className="text-[10px] text-[#7A8C84] block">Contact: {selectedEvent.contactPhone}</span>
              </div>
            </div>

            {/* BEO Specifications Sections */}
            <div className="space-y-4 text-xs">
              
              <div className="p-4 bg-[#FAF8F4] border border-[#EAE3D6] rounded-xl">
                <span className="font-bold text-xs text-[#1E2522] block mb-1">Reserved Function Spaces & Venues</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {selectedEvent.spacesBooked.map((sp, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-[#D8CEBF] rounded-lg font-medium text-[#1E2522]">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F4] border border-[#EAE3D6] rounded-xl">
                <span className="font-bold text-xs text-[#1E2522] block mb-1">BEO Catering & Function Notes</span>
                <p className="text-[#52645D] leading-relaxed">{selectedEvent.functionSheetNotes}</p>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* New Event Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE3D6] rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="font-serif-heading text-xl font-bold text-[#1E2522]">Contract New Group Block & BEO</h2>
            
            <form onSubmit={handleCreateGroupEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1E2522] mb-1">Group / Event Name</label>
                <input 
                  type="text" 
                  value={groupName} 
                  onChange={e => setGroupName(e.target.value)} 
                  required
                  placeholder="e.g. Apex Fintech Executive Summit 2026"
                  className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E2522] mb-1">Organizer Name</label>
                  <input 
                    type="text" 
                    value={organizer} 
                    onChange={e => setOrganizer(e.target.value)} 
                    required
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E2522] mb-1">Event Type</label>
                  <select 
                    value={eventType} 
                    onChange={e => setEventType(e.target.value as any)}
                    className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
                  >
                    <option value="Executive Retreat">Executive Retreat</option>
                    <option value="Wedding & Celebration">Wedding & Celebration</option>
                    <option value="Catering Banquet">Catering Banquet</option>
                    <option value="Film Production">Film Production</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E2522] mb-1">Arrival Date</label>
                  <input 
                    type="date" 
                    value={arrivalDate} 
                    onChange={e => setArrivalDate(e.target.value)} 
                    className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E2522] mb-1">Departure Date</label>
                  <input 
                    type="date" 
                    value={departureDate} 
                    onChange={e => setDepartureDate(e.target.value)} 
                    className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E2522] mb-1">Suites Blocked</label>
                  <input 
                    type="number" 
                    value={roomsBlocked} 
                    onChange={e => setRoomsBlocked(Number(e.target.value))} 
                    className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E2522] mb-1">Total Contract Value ($)</label>
                  <input 
                    type="number" 
                    value={totalContractValue} 
                    onChange={e => setTotalContractValue(Number(e.target.value))} 
                    className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1E2522] mb-1">Reserved Function Spaces</label>
                <input 
                  type="text" 
                  value={spacesBookedStr} 
                  onChange={e => setSpacesBookedStr(e.target.value)} 
                  className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1E2522] mb-1">BEO Function Sheet Notes</label>
                <textarea 
                  value={functionSheetNotes}
                  onChange={e => setFunctionSheetNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#FAF8F4] border border-[#D8CEBF] rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#52645D] hover:bg-[#FAF8F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1E2522] text-[#E0CDA9] hover:bg-[#2C3B34]"
                >
                  Save Contract & BEO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

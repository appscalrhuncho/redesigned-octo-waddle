import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { RoomStatus, HousekeepingTask, MaintenanceTicket } from '../../types';
import { 
  Sparkles, 
  BedDouble, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  AlertTriangle, 
  Plus, 
  Filter, 
  Check, 
  Flame, 
  ShieldAlert,
  Calendar,
  Layers
} from 'lucide-react';

export const HousekeepingBoard: React.FC = () => {
  const { 
    rooms, 
    housekeeping, 
    maintenance, 
    updateRoomStatus, 
    updateHousekeepingStatus, 
    addHousekeepingTask, 
    createMaintenanceTicket, 
    resolveMaintenanceTicket,
    todayArrivals 
  } = useHotel();

  const [activeSubTab, setActiveSubTab] = useState<'housekeeping' | 'maintenance'>('housekeeping');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewMntModalOpen, setIsNewMntModalOpen] = useState(false);

  // New Maintenance Form
  const [mntRoomId, setMntRoomId] = useState(rooms[0]?.id || '');
  const [mntCategory, setMntCategory] = useState<MaintenanceTicket['category']>('HVAC / Climate');
  const [mntIssue, setMntIssue] = useState('');
  const [mntPriority, setMntPriority] = useState<MaintenanceTicket['priority']>('High');
  const [mntTech, setMntTech] = useState('Marcus Price');

  // New Task Form
  const [hkRoomId, setHkRoomId] = useState(rooms[0]?.id || '');
  const [hkType, setHkType] = useState<HousekeepingTask['type']>('Full Turn');
  const [hkPriority, setHkPriority] = useState<HousekeepingTask['priority']>('High');
  const [hkStaff, setHkStaff] = useState('Elena Vasquez');
  const [hkNotes, setHkNotes] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const rm = rooms.find(r => r.id === mntRoomId) || rooms[0];
    createMaintenanceTicket({
      roomId: rm.id,
      roomNumber: rm.number,
      location: `Suite ${rm.number} (${rm.name})`,
      category: mntCategory,
      issue: mntIssue || 'Routine check required',
      priority: mntPriority,
      status: 'open',
      technician: mntTech
    });
    setMntIssue('');
    setIsNewMntModalOpen(false);
  };

  const handleCreateHkTask = (e: React.FormEvent) => {
    e.preventDefault();
    const rm = rooms.find(r => r.id === hkRoomId) || rooms[0];
    addHousekeepingTask({
      roomId: rm.id,
      roomNumber: rm.number,
      roomType: rm.type,
      type: hkType,
      status: 'pending',
      assignedTo: hkStaff,
      priority: hkPriority,
      estimatedMinutes: 45,
      notes: hkNotes
    });
    setHkNotes('');
    setIsNewTaskModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#1E2522] text-[#D4AF37]">
                Facility & Quality Assurance
              </span>
              <span className="text-xs text-[#7A8C84]">Real-time room turns and preventative maintenance</span>
            </div>
            <h2 className="font-serif-heading text-2xl lg:text-3xl font-medium text-[#1E2522]">
              Housekeeping & Maintenance Dispatch
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveSubTab('housekeeping')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activeSubTab === 'housekeeping' ? 'bg-[#1E2522] text-white shadow-sm' : 'text-[#55675F]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Housekeeping ({housekeeping.filter(t => t.status !== 'completed').length} Pending)
              </button>
              <button
                onClick={() => setActiveSubTab('maintenance')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activeSubTab === 'maintenance' ? 'bg-[#1E2522] text-white shadow-sm' : 'text-[#55675F]'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" /> Maintenance Tickets ({maintenance.filter(m => m.status !== 'resolved').length} Open)
              </button>
            </div>

            {activeSubTab === 'housekeeping' ? (
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1A2420] font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Dispatch Turn
              </button>
            ) : (
              <button
                onClick={() => setIsNewMntModalOpen(true)}
                className="bg-rose-700 hover:bg-rose-800 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Log Repair Ticket
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: Housekeeping Operations */}
      {activeSubTab === 'housekeeping' && (
        <div className="space-y-6">
          
          {/* Status Column Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Column 1: Pending Clean / Dirty */}
            <div className="bg-[#FAF8F4] border border-[#E3DCD1] rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7DFD2]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h3 className="font-bold text-xs text-[#1E2522] uppercase tracking-wider">Dirty / Turnover</h3>
                </div>
                <span className="text-xs font-bold text-[#8C6D1F] bg-amber-100 px-2 py-0.5 rounded-full">
                  {rooms.filter(r => r.status === 'dirty').length}
                </span>
              </div>

              <div className="space-y-3">
                {rooms.filter(r => r.status === 'dirty').map(room => {
                  const isArrivalToday = todayArrivals.some(a => a.roomId === room.id);
                  return (
                    <div key={room.id} className="bg-white border border-[#E4DCCE] rounded-2xl p-3.5 shadow-sm text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-sm text-[#1E2522]">Suite {room.number}</span>
                          <span className="text-[11px] text-[#71827B] block">{room.name}</span>
                        </div>
                        {isArrivalToday && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Rush Turn
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#6A7B74] bg-[#FAF8F4] p-2 rounded-lg border border-[#EFE8DC]">
                        {room.housekeepingNotes || 'Standard linen refresh & disinfection.'}
                      </p>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => updateRoomStatus(room.id, 'inspecting')}
                          className="flex-1 py-1.5 bg-[#1E2522] hover:bg-[#2C3B34] text-white font-semibold rounded-lg text-[11px]"
                        >
                          Start Clean
                        </button>
                        <button
                          onClick={() => updateRoomStatus(room.id, 'clean')}
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold rounded-lg text-[11px]"
                        >
                          ✓ Clean
                        </button>
                      </div>
                    </div>
                  );
                })}

                {rooms.filter(r => r.status === 'dirty').length === 0 && (
                  <p className="text-center py-8 text-xs text-[#8A9C94]">No dirty suites pending turn.</p>
                )}
              </div>
            </div>

            {/* Column 2: In Progress Cleaning */}
            <div className="bg-[#FAF8F4] border border-[#E3DCD1] rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7DFD2]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <h3 className="font-bold text-xs text-[#1E2522] uppercase tracking-wider">Cleaning In Progress</h3>
                </div>
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                  {housekeeping.filter(t => t.status === 'in_progress').length}
                </span>
              </div>

              <div className="space-y-3">
                {housekeeping.filter(t => t.status === 'in_progress').map(task => (
                  <div key={task.id} className="bg-white border border-blue-200 rounded-2xl p-3.5 shadow-sm text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-sm text-[#1E2522]">Suite {task.roomNumber}</span>
                        <span className="text-[11px] text-[#71827B] block">{task.roomType}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {task.type}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#55675F]">
                      <span>Assigned to: <strong>{task.assignedTo}</strong></span>
                      <span className="block text-[10px] text-[#869991]">Est. {task.estimatedMinutes} mins</span>
                    </div>

                    <button
                      onClick={() => updateHousekeepingStatus(task.id, 'completed')}
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-[11px] flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Ready & Inspected
                    </button>
                  </div>
                ))}

                {housekeeping.filter(t => t.status === 'in_progress').length === 0 && (
                  <p className="text-center py-8 text-xs text-[#8A9C94]">No active tasks in progress.</p>
                )}
              </div>
            </div>

            {/* Column 3: Quality Inspection */}
            <div className="bg-[#FAF8F4] border border-[#E3DCD1] rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7DFD2]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <h3 className="font-bold text-xs text-[#1E2522] uppercase tracking-wider">Supervisor Inspect</h3>
                </div>
                <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                  {rooms.filter(r => r.status === 'inspecting').length}
                </span>
              </div>

              <div className="space-y-3">
                {rooms.filter(r => r.status === 'inspecting').map(room => (
                  <div key={room.id} className="bg-white border border-[#E4DCCE] rounded-2xl p-3.5 shadow-sm text-xs space-y-2">
                    <div>
                      <span className="font-bold text-sm text-[#1E2522]">Suite {room.number}</span>
                      <span className="text-[11px] text-[#71827B] block">{room.name}</span>
                    </div>

                    <p className="text-[11px] text-[#6A7B74]">
                      Cleaning finished. Checking luxury minibar, plunge pool, and linen fragrance.
                    </p>

                    <button
                      onClick={() => updateRoomStatus(room.id, 'clean')}
                      className="w-full py-1.5 bg-[#1E2522] hover:bg-[#2C3B34] text-white font-semibold rounded-lg text-[11px]"
                    >
                      ✓ Approve Quality & Pass
                    </button>
                  </div>
                ))}

                {rooms.filter(r => r.status === 'inspecting').length === 0 && (
                  <p className="text-center py-8 text-xs text-[#8A9C94]">No rooms awaiting inspection.</p>
                )}
              </div>
            </div>

            {/* Column 4: Pristine & Ready (Clean) */}
            <div className="bg-[#FAF8F4] border border-[#E3DCD1] rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7DFD2]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="font-bold text-xs text-[#1E2522] uppercase tracking-wider">Pristine & Clean</h3>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {rooms.filter(r => r.status === 'clean').length}
                </span>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {rooms.filter(r => r.status === 'clean').map(room => (
                  <div key={room.id} className="bg-white border border-emerald-200/70 rounded-2xl p-3 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#1E2522]">Suite {room.number}</span>
                      <span className="text-[10px] text-[#6A7D75] block truncate max-w-[120px]">{room.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Ready
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-VIEW 2: Maintenance & Repairs */}
      {activeSubTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
            <h3 className="font-serif-heading text-xl font-medium text-[#1E2522] mb-4">
              Active Preventative & Repair Work Orders
            </h3>

            <div className="space-y-3">
              {maintenance.map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E4DCCE] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1E2522]">{ticket.id}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#1E2522] text-white text-[10px] font-semibold">
                        Suite {ticket.roomNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#EBE4D8] text-[#4A5D54] text-[10px] font-medium">
                        {ticket.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ticket.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                        ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-[#2C3B34] font-medium">{ticket.issue}</p>
                    <p className="text-[11px] text-[#71827B]">
                      Reported: {ticket.reportedAt} • Assigned Tech: <strong className="text-[#1E2522]">{ticket.technician}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {ticket.status !== 'resolved' ? (
                      <button
                        onClick={() => resolveMaintenanceTicket(ticket.id, 'Repairs tested and certified.')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Complete & Close
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Dispatch Housekeeping Task */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E2522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E3DCD1] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-2xl font-semibold text-[#1E2522]">
              Dispatch Housekeeping Task
            </h3>

            <form onSubmit={handleCreateHkTask} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Target Suite</label>
                <select
                  value={hkRoomId}
                  onChange={(e) => setHkRoomId(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>Suite {r.number} - {r.name} ({r.status})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Turn Type</label>
                <select
                  value={hkType}
                  onChange={(e) => setHkType(e.target.value as any)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                >
                  <option value="Full Turn">Full Turnover & Linen Reset</option>
                  <option value="Daily Refresh">Daily Refresh & Towels</option>
                  <option value="VIP Turndown">VIP Evening Turndown</option>
                  <option value="Deep Clean Inspection">Deep Clean & Supervisor Inspection</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Assigned Attendant</label>
                <select
                  value={hkStaff}
                  onChange={(e) => setHkStaff(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                >
                  <option value="Elena Vasquez">Elena Vasquez (Lead Attendant)</option>
                  <option value="Kofi Mensah">Kofi Mensah</option>
                  <option value="Sofia Rodriguez">Sofia Rodriguez (Supervisor)</option>
                  <option value="Lucas Thorne">Lucas Thorne</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Priority</label>
                <select
                  value={hkPriority}
                  onChange={(e) => setHkPriority(e.target.value as any)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Arrival Imminent)</option>
                  <option value="Urgent Rush">Urgent Rush (VIP Early Arrival)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Specific Instructions</label>
                <textarea
                  rows={2}
                  value={hkNotes}
                  onChange={(e) => setHkNotes(e.target.value)}
                  placeholder="e.g. Extra bathrobes, hypoallergenic pillows..."
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#1E2522] text-white font-semibold"
                >
                  Dispatch to Attendant
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-[#FAF8F4] border border-[#E0D8CC] text-[#2C3833]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Log Maintenance Ticket */}
      {isNewMntModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E2522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E3DCD1] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-2xl font-semibold text-[#1E2522]">
              Log Maintenance Work Order
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Location / Suite</label>
                <select
                  value={mntRoomId}
                  onChange={(e) => setMntRoomId(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>Suite {r.number} - {r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Category</label>
                <select
                  value={mntCategory}
                  onChange={(e) => setMntCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                >
                  <option value="HVAC / Climate">HVAC / Climate Control</option>
                  <option value="Plumbing">Plumbing & Outdoor Showers</option>
                  <option value="Electrical">Electrical & Lighting</option>
                  <option value="Smart Room & Tech">Smart Room, Sonos & Audio</option>
                  <option value="Pool / Jacuzzi">Pool / Jacuzzi Filters</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Issue Description</label>
                <textarea
                  required
                  rows={2}
                  value={mntIssue}
                  onChange={(e) => setMntIssue(e.target.value)}
                  placeholder="Describe the defect or repair needed..."
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Assigned Technician</label>
                <select
                  value={mntTech}
                  onChange={(e) => setMntTech(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                >
                  <option value="Marcus Price">Marcus Price (Lead Facility Tech)</option>
                  <option value="David Zhang">David Zhang (Electrical & Tech)</option>
                  <option value="Kobus Van Zyl">Kobus Van Zyl (HVAC & Water)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rose-700 text-white font-semibold"
                >
                  Log & Dispatch Work Order
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewMntModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-[#FAF8F4] border border-[#E0D8CC] text-[#2C3833]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

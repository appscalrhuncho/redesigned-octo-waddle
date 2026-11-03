import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Reservation, Room } from '../../types';
import { 
  ConciergeBell, 
  Key, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Users, 
  CreditCard, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink,
  Plus,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Tag,
  Smartphone
} from 'lucide-react';
import { DigitalCheckInModal } from '../Modals/DigitalCheckInModal';

export const FrontDeskDashboard: React.FC = () => {
  const { 
    reservations, 
    rooms, 
    currentDate, 
    checkInGuest, 
    checkOutGuest, 
    openFolioModal, 
    openDigitalKeyModal,
    openNewReservationModal,
    updateReservation,
    todayArrivals,
    todayDepartures,
    todayInHouse
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'arrivals' | 'departures' | 'inhouse' | 'all'>('arrivals');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVipOnly, setFilterVipOnly] = useState(false);
  const [upgradeTargetRes, setUpgradeTargetRes] = useState<Reservation | null>(null);
  const [digitalCheckInTargetRes, setDigitalCheckInTargetRes] = useState<Reservation | null>(null);

  // Available suites for potential upgrade
  const availableUpgrades = useMemo(() => {
    if (!upgradeTargetRes) return [];
    return rooms.filter(r => r.id !== upgradeTargetRes.roomId && r.status === 'clean');
  }, [rooms, upgradeTargetRes]);

  const displayedList = useMemo(() => {
    let list: Reservation[] = [];
    if (activeTab === 'arrivals') list = todayArrivals;
    else if (activeTab === 'departures') list = todayDepartures;
    else if (activeTab === 'inhouse') list = todayInHouse;
    else list = reservations.filter(r => r.status !== 'cancelled');

    return list.filter(r => {
      if (filterVipOnly && (r.vipTier === 'Standard' || !r.vipTier)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return r.guestName.toLowerCase().includes(q) || 
               r.id.toLowerCase().includes(q) || 
               r.roomNumber.includes(q) ||
               r.roomType.toLowerCase().includes(q);
      }
      return true;
    });
  }, [activeTab, todayArrivals, todayDepartures, todayInHouse, reservations, filterVipOnly, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Front Desk Header & Key Metrics */}
      <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#1E2522] text-[#D4AF37]">
                Operations Hub
              </span>
              <span className="text-xs text-[#7A8C84]">Date: {currentDate} • Front Desk & Concierge</span>
            </div>
            <h2 className="font-serif-heading text-2xl lg:text-3xl font-medium text-[#1E2522]">
              Front Desk & Run Sheet
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openNewReservationModal()}
              className="bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1A2420] font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Walk-In Check-In
            </button>
          </div>
        </div>

        {/* Tab Selector & Filters */}
        <div className="mt-6 pt-4 border-t border-[#EAE3D6] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'arrivals', label: "Today's Arrivals", count: todayArrivals.length, icon: ArrowDownLeft, color: 'text-blue-700' },
              { id: 'departures', label: "Today's Departures", count: todayDepartures.length, icon: ArrowUpRight, color: 'text-purple-700' },
              { id: 'inhouse', label: 'In-House Stay-Overs', count: todayInHouse.length, icon: CheckCircle2, color: 'text-emerald-700' },
              { id: 'all', label: 'All Active Records', count: reservations.length, icon: FileText, color: 'text-[#1E2522]' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-[#1E2522] text-white border-[#1E2522] shadow-sm'
                      : 'bg-[#FAF8F4] border-[#E0D8CC] text-[#55675F] hover:bg-white hover:text-[#1E2522]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : tab.color}`} />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-[#2E3C36] text-[#D4AF37]' : 'bg-[#EAE4D8] text-[#33423B]'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#889B93] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by name, suite, res ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#E0D8CC] text-xs outline-none w-56 focus:border-[#D4AF37]"
              />
            </div>

            <label className="flex items-center gap-1.5 text-xs text-[#55675F] cursor-pointer">
              <input
                type="checkbox"
                checked={filterVipOnly}
                onChange={(e) => setFilterVipOnly(e.target.checked)}
                className="accent-[#1E2522]"
              />
              <span>VIP Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Reservation Run Sheet List */}
      <div className="bg-white border border-[#E3DCD1] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1E2522] text-[#FBF9F5] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Guest & VIP Tier</th>
                <th className="py-3.5 px-4">Suite / Room</th>
                <th className="py-3.5 px-4">Dates & Nights</th>
                <th className="py-3.5 px-4">Channel & Add-ons</th>
                <th className="py-3.5 px-4">Folio Balance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8] text-[#2C3833]">
              {displayedList.map(res => {
                const isCheckInDue = res.status === 'confirmed' && res.checkInDate === currentDate;
                const isCheckOutDue = res.status === 'checked_in' && res.checkOutDate === currentDate;

                return (
                  <tr key={res.id} className="hover:bg-[#FAF8F4] transition-colors group">
                    
                    {/* Guest Column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1E2522] text-[#D4AF37] font-semibold text-xs flex items-center justify-center shrink-0">
                          {res.guestName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1E2522]">{res.guestName}</span>
                            {res.vipTier && res.vipTier !== 'Standard' && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#D4AF37]/20 text-[#8B6B15] border border-[#D4AF37]/40">
                                {res.vipTier}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#71827B] block mt-0.5">
                            {res.id} • {res.guestCountry} • {res.guestPhone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Room Column */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1E2522]">Suite {res.roomNumber}</div>
                      <span className="text-[11px] text-[#71827B] block">{res.roomType}</span>
                    </td>

                    {/* Dates Column */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#1E2522]">
                        {res.checkInDate} → {res.checkOutDate}
                      </div>
                      <span className="text-[11px] text-[#71827B] block">
                        {res.nights} Nights • {res.numGuests} Guests
                      </span>
                    </td>

                    {/* Channel & Addons Column */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-[#FAF8F4] border border-[#E0D8CC] text-[10px] text-[#4A5D54] font-medium">
                        {res.channel}
                      </span>
                      {res.selectedAddOns.length > 0 && (
                        <span className="block text-[10px] text-[#A67C1E] mt-1 font-medium truncate max-w-[180px]">
                          + {res.selectedAddOns.join(', ')}
                        </span>
                      )}
                    </td>

                    {/* Folio Balance Column */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-[#1E2522]">${res.totalAmount.toLocaleString()}</div>
                      <span className={`text-[10px] font-semibold uppercase ${
                        res.paymentStatus === 'paid' ? 'text-emerald-700' :
                        res.paymentStatus === 'partial' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {res.paymentStatus === 'paid' ? 'Paid in Full' : `Paid $${res.paidAmount}`}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block border ${
                        res.status === 'checked_in' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        res.status === 'confirmed' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                        res.status === 'checked_out' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                        'bg-gray-100 text-gray-700 border-gray-300'
                      }`}>
                        {res.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        <button
                          onClick={() => openFolioModal(res)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F4] border border-[#DCD3C5] hover:bg-[#EDE6D8] font-medium text-[#1E2522]"
                          title="View & Edit Guest Folio"
                        >
                          Folio
                        </button>

                        {/* Upgrade Assistant */}
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => setUpgradeTargetRes(res)}
                            className="px-2 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 font-medium"
                            title="Upgrade Room Assistant"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Contactless Pre-Checkin */}
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => setDigitalCheckInTargetRes(res)}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/20 border border-cyan-800 text-cyan-900 hover:bg-cyan-950/30 font-medium flex items-center gap-1"
                            title="Digital Pre-Arrival Registration"
                          >
                            <Smartphone className="w-3 h-3 text-cyan-700" /> Pre-Check-In
                          </button>
                        )}

                        {/* Check-In Button */}
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => checkInGuest(res.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#1E2522] hover:bg-[#2C3B34] text-white font-semibold flex items-center gap-1 shadow-sm"
                          >
                            <Key className="w-3 h-3 text-[#D4AF37]" /> Check In
                          </button>
                        )}

                        {/* Check-Out Button */}
                        {res.status === 'checked_in' && (
                          <button
                            onClick={() => checkOutGuest(res.id)}
                            className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold flex items-center gap-1 shadow-sm"
                          >
                            <ArrowUpRight className="w-3 h-3" /> Check Out
                          </button>
                        )}

                        {/* Digital Key Button */}
                        {res.status === 'checked_in' && (
                          <button
                            onClick={() => openDigitalKeyModal(res)}
                            className="p-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1E2522]"
                            title="Open Digital Keycard"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                );
              })}

              {displayedList.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xs text-[#7F928A]">
                    No matching records found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Assistant Modal */}
      {upgradeTargetRes && (
        <div className="fixed inset-0 z-50 bg-[#1E2522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E3DCD1] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A38020]">Front Desk Revenue Assistant</span>
                <h3 className="font-serif-heading text-2xl font-semibold text-[#1E2522]">
                  Upgrade Suite for {upgradeTargetRes.guestName}
                </h3>
              </div>
              <button 
                onClick={() => setUpgradeTargetRes(null)}
                className="text-[#7A8C84] hover:text-[#1E2522] p-1.5 rounded-full hover:bg-[#FAF8F4]"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#FAF8F4] rounded-2xl border border-[#E7DFD1] text-xs">
              <span className="text-[#71827B] block">Current Assignment:</span>
              <span className="font-bold text-sm text-[#1E2522]">Suite {upgradeTargetRes.roomNumber} ({upgradeTargetRes.roomType})</span>
              <span className="text-xs text-[#55675F] block">{upgradeTargetRes.nights} Nights • Total Folio: ${upgradeTargetRes.totalAmount}</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              <span className="text-xs font-semibold text-[#1E2522] block">Available Clean Suites for Upgrade:</span>
              {availableUpgrades.map(uRoom => {
                const currentRoom = rooms.find(r => r.id === upgradeTargetRes.roomId) || rooms[0];
                const priceDiffPerNight = Math.max(0, uRoom.seasonalPrice - currentRoom.seasonalPrice);
                const totalDiff = priceDiffPerNight * upgradeTargetRes.nights;

                return (
                  <div 
                    key={uRoom.id}
                    className="p-3.5 rounded-2xl border border-[#E4DCCE] hover:border-[#D4AF37] bg-white flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={uRoom.images[0]} alt={uRoom.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold text-sm text-[#1E2522]">Suite {uRoom.number} - {uRoom.name}</span>
                        <span className="text-[#71827B] block text-[11px]">{uRoom.type} • {uRoom.sizeSqM} m²</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {priceDiffPerNight > 0 ? (
                        <div>
                          <span className="font-bold text-sm text-emerald-700">+${totalDiff}</span>
                          <span className="text-[10px] text-[#71827B] block">(+${priceDiffPerNight}/nt)</span>
                        </div>
                      ) : (
                        <span className="font-bold text-xs text-[#8A7543]">Complimentary Tier Match</span>
                      )}

                      <button
                        onClick={() => {
                          updateReservation(upgradeTargetRes.id, {
                            roomId: uRoom.id,
                            roomNumber: uRoom.number,
                            roomType: uRoom.type,
                            totalAmount: upgradeTargetRes.totalAmount + totalDiff,
                            notes: `${upgradeTargetRes.notes ? upgradeTargetRes.notes + ' | ' : ''}Upgraded to Suite ${uRoom.number}`
                          });
                          setUpgradeTargetRes(null);
                        }}
                        className="mt-1 px-3 py-1 bg-[#1E2522] hover:bg-[#2C3B34] text-white font-semibold rounded-lg text-[11px]"
                      >
                        Apply Upgrade
                      </button>
                    </div>
                  </div>
                );
              })}

              {availableUpgrades.length === 0 && (
                <p className="text-center py-6 text-xs text-[#7A8C84]">No clean alternative suites available at this moment.</p>
              )}
            </div>

            <div className="pt-3 border-t border-[#EAE3D6] text-right">
              <button
                onClick={() => setUpgradeTargetRes(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F4] border border-[#E0D8CC] text-[#2C3833]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Pre-Arrival Check-In Modal */}
      {digitalCheckInTargetRes && (
        <DigitalCheckInModal 
          reservation={digitalCheckInTargetRes}
          onClose={() => setDigitalCheckInTargetRes(null)}
        />
      )}

    </div>
  );
};

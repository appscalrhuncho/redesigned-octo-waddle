import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Calendar, User, Phone, Mail, DollarSign, Sparkles, X, Bed, ShieldCheck } from 'lucide-react';

const NewReservationModalDialog: React.FC = () => {
  const { 
    closeNewReservationModal, 
    newReservationInitialData, 
    rooms, 
    addOns, 
    createReservation 
  } = useHotel();

  const [guestName, setGuestName] = useState(newReservationInitialData?.guestName || '');
  const [guestEmail, setGuestEmail] = useState(newReservationInitialData?.guestEmail || '');
  const [guestPhone, setGuestPhone] = useState(newReservationInitialData?.guestPhone || '+1 (555) 392-1049');
  const [guestCountry, setGuestCountry] = useState(newReservationInitialData?.guestCountry || 'United States');
  const [vipTier, setVipTier] = useState<any>(newReservationInitialData?.vipTier || 'Standard');
  
  const [selectedRoomId, setSelectedRoomId] = useState(newReservationInitialData?.roomId || rooms[0]?.id || '');
  const [checkInDate, setCheckInDate] = useState(newReservationInitialData?.checkInDate || '2026-05-18');
  const [checkOutDate, setCheckOutDate] = useState(newReservationInitialData?.checkOutDate || '2026-05-22');
  const [numGuests, setNumGuests] = useState(2);
  const [channel, setChannel] = useState<'Direct Web' | 'Phone / Front Desk' | 'VIP Corporate' | 'Luxury Retreats OTA'>('Phone / Front Desk');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [advancePayment, setAdvancePayment] = useState<number>(0);

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  // Calculate nights
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1);

  const roomTotal = (selectedRoom?.seasonalPrice || 750) * nights;
  const addOnsTotal = selectedAddOns.reduce((sum, name) => {
    const pkg = addOns.find(a => a.name === name);
    return sum + (pkg ? pkg.price : 0);
  }, 0);
  const grandTotal = roomTotal + addOnsTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !selectedRoom) return;

    createReservation({
      guestName,
      guestEmail,
      guestPhone,
      guestCountry,
      vipTier,
      roomId: selectedRoom.id,
      roomNumber: selectedRoom.number,
      roomType: selectedRoom.type,
      checkInDate,
      checkOutDate,
      numGuests,
      channel,
      totalAmount: grandTotal,
      paidAmount: advancePayment,
      paymentStatus: advancePayment >= grandTotal ? 'paid' : advancePayment > 0 ? 'partial' : 'unpaid',
      specialRequests,
      selectedAddOns
    });

    closeNewReservationModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E2522]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#E3DCD1] rounded-3xl max-w-2xl w-full p-6 lg:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7D23]">Reservation Engine</span>
            <h3 className="font-serif-heading text-2xl font-semibold text-[#1E2522]">
              New Guest Reservation
            </h3>
          </div>
          <button 
            onClick={closeNewReservationModal}
            className="text-[#7A8C84] hover:text-[#1E2522] p-1.5 rounded-full hover:bg-[#FAF8F4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Guest Information */}
          <div className="space-y-2">
            <span className="font-bold text-xs text-[#1E2522] uppercase tracking-wider block">1. Guest Details</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Baroness Evelyn Vance"
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">VIP Recognition Tier</label>
                <select
                  value={vipTier}
                  onChange={(e) => setVipTier(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                >
                  <option value="Standard">Standard Guest</option>
                  <option value="Silver">Silver Tier</option>
                  <option value="Gold">Gold Tier</option>
                  <option value="Black Diamond VIP">Black Diamond VIP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Email</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="guest@domain.com"
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Phone</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Country</label>
                <input
                  type="text"
                  value={guestCountry}
                  onChange={(e) => setGuestCountry(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          {/* Stay & Room Assignment */}
          <div className="space-y-2 pt-2 border-t border-[#EAE3D6]">
            <span className="font-bold text-xs text-[#1E2522] uppercase tracking-wider block">2. Suite & Dates</span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Suite Assigned</label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                >
                  {rooms.map(rm => (
                    <option key={rm.id} value={rm.id}>
                      Suite {rm.number} - {rm.name} (${rm.seasonalPrice}/nt)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Check-In</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Check-Out ({nights} Nights)</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Booking Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                >
                  <option value="Phone / Front Desk">Phone / Front Desk Direct</option>
                  <option value="Direct Web">Direct Web Portal</option>
                  <option value="VIP Corporate">VIP Corporate / Direct Rel</option>
                  <option value="Luxury Retreats OTA">Luxury Retreats OTA</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Guests Count</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          {/* Add-ons & Notes */}
          <div className="space-y-2 pt-2 border-t border-[#EAE3D6]">
            <span className="font-bold text-xs text-[#1E2522] uppercase tracking-wider block">3. Add-ons & Preferences</span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {addOns.map(pkg => {
                const isSelected = selectedAddOns.includes(pkg.name);
                return (
                  <button
                    type="button"
                    key={pkg.id}
                    onClick={() => {
                      setSelectedAddOns(prev => 
                        prev.includes(pkg.name) ? prev.filter(n => n !== pkg.name) : [...prev, pkg.name]
                      );
                    }}
                    className={`p-2 rounded-xl text-left border text-[11px] transition-all ${
                      isSelected 
                        ? 'bg-[#FAF6EC] border-[#D4AF37] text-[#1E2522] font-semibold' 
                        : 'bg-[#FAF8F4] border-[#E0D8CC] text-[#55675F]'
                    }`}
                  >
                    <div className="truncate font-semibold">{pkg.name}</div>
                    <span className="text-[#8F7425]">+${pkg.price}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Special Concierge Requests</label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Chilled Dom Pérignon, late check-in at 21:00..."
                className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none resize-none"
              />
            </div>
          </div>

          {/* Billing & Deposit Summary */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E4DCCE] flex justify-between items-center text-xs">
            <div>
              <span className="text-[#71827B] block">Total Estimated Folio:</span>
              <strong className="font-serif-heading text-xl text-[#1E2522]">${grandTotal.toLocaleString()}</strong>
              <span className="text-[11px] text-[#71827B] block">({nights} nights @ ${selectedRoom?.seasonalPrice}/nt + add-ons)</span>
            </div>

            <div className="text-right">
              <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Deposit Collected Now ($)</label>
              <input
                type="number"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(Number(e.target.value))}
                placeholder="0"
                className="w-32 p-2 bg-white border border-[#E0D8CC] rounded-xl font-bold text-sm text-[#1E2522] text-right outline-none"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-[#1E2522] hover:bg-[#2C3B34] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Confirm & Create Reservation
            </button>
            <button
              type="button"
              onClick={closeNewReservationModal}
              className="px-5 py-3.5 rounded-xl bg-[#FAF8F4] border border-[#E0D8CC] text-[#2C3833] font-semibold text-xs"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export const NewReservationModal: React.FC = () => {
  const { isNewReservationModalOpen } = useHotel();

  if (!isNewReservationModalOpen) return null;

  return <NewReservationModalDialog />;
};

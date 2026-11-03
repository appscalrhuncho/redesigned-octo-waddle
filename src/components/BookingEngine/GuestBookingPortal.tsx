import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Room, AddOnPackage } from '../../types';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Users, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Award, 
  Coffee, 
  Wifi, 
  Waves, 
  Sun, 
  Flame, 
  Compass, 
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Gift
} from 'lucide-react';

export const GuestBookingPortal: React.FC = () => {
  const { 
    rooms, 
    addOns, 
    currentDate, 
    createReservation, 
    setActiveView,
    openDigitalKeyModal
  } = useHotel();

  // Booking search criteria
  const [checkIn, setCheckIn] = useState('2026-05-18');
  const [checkOut, setCheckOut] = useState('2026-05-22');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Selected state
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [activePhotoIndices, setActivePhotoIndices] = useState<{ [roomId: string]: number }>({});
  
  // Guest Form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCountry, setGuestCountry] = useState('United States');
  const [specialRequests, setSpecialRequests] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'ApplePay' | 'Wire'>('Card');
  
  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Calculate nights
  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff || 1);
  }, [checkIn, checkOut]);

  // Filter available rooms
  const matchingRooms = useMemo(() => {
    return rooms.filter(r => {
      if (selectedCategory !== 'All' && r.type !== selectedCategory) return false;
      if (r.maxGuests < guestCount) return false;
      return true;
    });
  }, [rooms, selectedCategory, guestCount]);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'AZUREVIP' || promoCode.trim().toUpperCase() === 'LUXURY10') {
      setDiscountPercent(10);
    } else {
      alert('Invalid promo code. Try "AZUREVIP" for 10% off.');
    }
  };

  const handlePhotoNext = (roomId: string, max: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndices(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % max
    }));
  };

  const handlePhotoPrev = (roomId: string, max: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndices(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) - 1 + max) % max
    }));
  };

  // Pricing calculations
  const baseRoomTotal = selectedRoom ? selectedRoom.seasonalPrice * nights : 0;
  const discountAmount = Math.round(baseRoomTotal * (discountPercent / 100));
  const discountedRoomTotal = baseRoomTotal - discountAmount;
  
  const addOnsTotal = selectedAddOnIds.reduce((sum, id) => {
    const pkg = addOns.find(a => a.id === id);
    if (!pkg) return sum;
    return sum + (pkg.perPerson ? pkg.price * guestCount : pkg.price);
  }, 0);

  const tourismLevy = Math.round(discountedRoomTotal * 0.05);
  const grandTotal = discountedRoomTotal + addOnsTotal + tourismLevy;
  const depositDueNow = Math.round(grandTotal * 0.5);

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    if (!guestName || !guestEmail) {
      alert('Please fill in your name and email address.');
      return;
    }

    const newRes = createReservation({
      guestName,
      guestEmail,
      guestPhone,
      guestCountry,
      roomId: selectedRoom.id,
      roomNumber: selectedRoom.number,
      roomType: selectedRoom.type,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numGuests: guestCount,
      channel: 'Direct Web',
      totalAmount: grandTotal,
      paidAmount: depositDueNow,
      paymentStatus: 'partial',
      specialRequests: specialRequests + (discountPercent > 0 ? ` (Promo ${promoCode} - 10% applied)` : ''),
      selectedAddOns: selectedAddOnIds.map(id => addOns.find(a => a.id === id)?.name || id)
    });

    setConfirmedBooking(newRes);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="space-y-8">
      
      {/* Luxury Portal Hero Header */}
      <div className="relative rounded-[32px] overflow-hidden bg-[#1E2522] text-[#FBF9F5] min-h-[380px] flex flex-col justify-between p-6 lg:p-12 border border-[#303E38] shadow-xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1800&auto=format&fit=crop" 
            alt="Resort View"
            className="w-full h-full object-cover opacity-40" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E2522] via-[#1E2522]/60 to-transparent" />
        </div>

        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-semibold tracking-wider uppercase text-[#E5D8BA]">Direct Luxury Sanctuary Portal</span>
          </div>

          <button
            onClick={() => setActiveView('dashboard')}
            className="text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full backdrop-blur border border-white/15 transition-all"
          >
            ← Switch to Staff OS
          </button>
        </div>

        <div className="relative z-10 max-w-2xl mt-8">
          <h1 className="font-serif-heading text-4xl lg:text-6xl font-medium tracking-tight leading-[1.05]">
            Where ocean meets cliffside sanctuary.
          </h1>
          <p className="mt-3 text-sm lg:text-base text-[#D0DFD8] leading-relaxed">
            Direct bookings receive complimentary Ruinart champagne upon arrival, private sunset deck access, and priority spa reservations.
          </p>
        </div>
      </div>

      {/* Interactive Search & Date Bar */}
      <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-md -mt-12 relative z-20 mx-2 lg:mx-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <div>
            <label className="text-[11px] font-bold text-[#6D7D76] uppercase tracking-wider block mb-1.5">
              Check-In Date
            </label>
            <div className="flex items-center bg-[#FAF8F4] border border-[#E0D8CC] rounded-2xl px-3.5 py-2.5">
              <Calendar className="w-4 h-4 text-[#D4AF37] mr-2 shrink-0" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#1E2522] outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#6D7D76] uppercase tracking-wider block mb-1.5">
              Check-Out Date ({nights} Nights)
            </label>
            <div className="flex items-center bg-[#FAF8F4] border border-[#E0D8CC] rounded-2xl px-3.5 py-2.5">
              <Calendar className="w-4 h-4 text-[#D4AF37] mr-2 shrink-0" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#1E2522] outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#6D7D76] uppercase tracking-wider block mb-1.5">
              Guests
            </label>
            <div className="flex items-center justify-between bg-[#FAF8F4] border border-[#E0D8CC] rounded-2xl px-3.5 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1E2522]">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span>{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#D5CCC0] flex items-center justify-center text-xs font-bold text-[#1E2522]"
                >
                  -
                </button>
                <button
                  onClick={() => setGuestCount(Math.min(6, guestCount + 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#D5CCC0] flex items-center justify-center text-xs font-bold text-[#1E2522]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#6D7D76] uppercase tracking-wider block mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FAF8F4] border border-[#E0D8CC] text-xs font-semibold text-[#1E2522] rounded-2xl px-3.5 py-2.5 outline-none w-full cursor-pointer focus:border-[#D4AF37]"
            >
              <option value="All">All Sanctuary Collections ({rooms.length})</option>
              <option value="Cliffside Pavilion">Cliffside Pavilion</option>
              <option value="Garden Pool Villa">Garden Pool Villa</option>
              <option value="Azure Penthouse">Azure Penthouse</option>
              <option value="Oceanfront Bungalow">Oceanfront Bungalow</option>
              <option value="Heritage Courtyard Suite">Heritage Courtyard Suite</option>
              <option value="Sunset Star Deck Suite">Sunset Star Deck Suite</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Suite Showcase & Booking Drawer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Suite Showcase Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-heading text-2xl font-semibold text-[#1E2522]">
              Available Suites & Villas ({matchingRooms.length})
            </h2>
            <span className="text-xs text-[#7A8C84]">All rates include breakfast & private plunge access</span>
          </div>

          <div className="space-y-6">
            {matchingRooms.map((room) => {
              const activeIndex = activePhotoIndices[room.id] || 0;
              const isSelected = selectedRoom?.id === room.id;

              return (
                <div 
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    isSelected ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50' : 'border-[#E3DCD1]'
                  }`}
                >
                  {/* Photo Carousel Header */}
                  <div className="relative h-64 bg-[#1E2522] overflow-hidden group/img">
                    <img 
                      src={room.images[activeIndex] || room.images[0]} 
                      alt={room.name}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700" 
                    />

                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => handlePhotoPrev(room.id, room.images.length, e)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handlePhotoNext(room.id, room.images.length, e)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#1E2522]/90 backdrop-blur text-white text-xs font-semibold">
                        Suite {room.number}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/95 text-[#1E2522] text-xs font-medium">
                        {room.type}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur text-white px-3 py-1.5 rounded-xl text-right">
                      <span className="text-xl font-bold font-serif-heading">${room.seasonalPrice}</span>
                      <span className="text-[10px] opacity-80 block">/ night</span>
                    </div>
                  </div>

                  {/* Room Content */}
                  <div className="p-5 lg:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-serif-heading text-2xl font-semibold text-[#1E2522]">
                          {room.name}
                        </h3>
                        <p className="text-xs text-[#71827B]">
                          {room.sizeSqM} m² • {room.bedConfig} • Max {room.maxGuests} Guests • {room.view}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-[#D4AF37] text-[#1E2522] shadow-sm' 
                            : 'bg-[#1E2522] text-white hover:bg-[#2F3C36]'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Select Suite'}
                      </button>
                    </div>

                    {/* Amenities list */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#EBE4D8]">
                      {room.amenities.map((am, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-xl bg-[#FAF8F4] border border-[#E3DCD1] text-[11px] text-[#4A5D54]">
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Add-On Builder & Live Folio Checkout (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Add-On Package Selector */}
          <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif-heading text-xl font-medium text-[#1E2522]">
                Enhance Your Stay (Add-ons)
              </h3>
            </div>
            <p className="text-xs text-[#71827B] mb-4">
              Curated boutique excursions, transport & sanctuary wellness
            </p>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {addOns.map(pkg => {
                const isChecked = selectedAddOnIds.includes(pkg.id);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      setSelectedAddOnIds(prev => 
                        prev.includes(pkg.id) ? prev.filter(id => id !== pkg.id) : [...prev, pkg.id]
                      );
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${
                      isChecked 
                        ? 'bg-[#FAF6EC] border-[#D4AF37] ring-1 ring-[#D4AF37]' 
                        : 'bg-[#FAF8F4] border-[#E3DCD1] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={pkg.image} alt={pkg.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="font-bold text-sm text-[#1E2522]">{pkg.name}</span>
                        <p className="text-[11px] text-[#6A7C74] line-clamp-1">{pkg.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-sm text-[#1E2522]">${pkg.price}</span>
                      <span className="text-[10px] text-[#869790] block">{pkg.perPerson ? '/ person' : 'total'}</span>
                      <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ml-auto ${
                        isChecked ? 'bg-[#1E2522] border-[#1E2522] text-white' : 'border-[#C2B7A7]'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Folio Checkout Summary */}
          <div className="bg-[#1E2522] text-[#FBF9F5] rounded-3xl p-6 border border-[#33423B] shadow-xl sticky top-24">
            <h3 className="font-serif-heading text-2xl font-semibold text-white mb-1">
              Reservation Summary
            </h3>
            <p className="text-xs text-[#A2B4AC] mb-4">
              {nights} Nights: {checkIn} → {checkOut} • {guestCount} Guests
            </p>

            {selectedRoom ? (
              <form onSubmit={handleConfirmReservation} className="space-y-4">
                
                <div className="p-3.5 rounded-2xl bg-[#25322B] border border-[#384A41] text-xs space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-white">
                    <span>{selectedRoom.name}</span>
                    <span>${discountedRoomTotal.toLocaleString()}</span>
                  </div>
                  <span className="text-[11px] text-[#A6B6AF] block">
                    Suite {selectedRoom.number} ({selectedRoom.type}) @ ${selectedRoom.seasonalPrice}/night
                  </span>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-[#D4AF37] font-medium">
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}

                  {selectedAddOnIds.length > 0 && (
                    <div className="flex justify-between text-[#C5D5CD] pt-2 border-t border-[#314339]">
                      <span>Add-on Packages ({selectedAddOnIds.length})</span>
                      <span>+${addOnsTotal}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#93A59D] text-[11px]">
                    <span>Conservation & Tourism Levy (5%)</span>
                    <span>+${tourismLevy}</span>
                  </div>

                  <div className="flex justify-between text-base font-serif-heading font-bold text-white pt-2 border-t border-[#384A41]">
                    <span>Total Stay Estimated</span>
                    <span className="text-[#D4AF37]">${grandTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-[11px] text-[#A3B5AC] font-medium">
                    <span>Deposit Due Now (50%)</span>
                    <span>${depositDueNow.toLocaleString()}</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. AZUREVIP)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#25322B] border border-[#384A41] text-xs text-white placeholder-[#788C83] outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="px-3.5 py-2 rounded-xl bg-[#34443B] hover:bg-[#43574C] text-xs font-semibold text-white"
                  >
                    Apply
                  </button>
                </div>

                {/* Guest Details Form */}
                <div className="space-y-2.5 pt-2 border-t border-[#2F3E37]">
                  <span className="text-xs font-semibold text-[#D4AF37] block">Guest Details</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#25322B] border border-[#384A41] text-xs text-white placeholder-[#788C83] outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#25322B] border border-[#384A41] text-xs text-white placeholder-[#788C83] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#25322B] border border-[#384A41] text-xs text-white placeholder-[#788C83] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Country of Residence"
                      value={guestCountry}
                      onChange={(e) => setGuestCountry(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#25322B] border border-[#384A41] text-xs text-white placeholder-[#788C83] outline-none"
                    />
                  </div>

                  <textarea
                    placeholder="Dietary preferences, pillow requests, arrival notes..."
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#25322B] border border-[#384A41] text-xs text-white placeholder-[#788C83] outline-none resize-none"
                  />
                </div>

                {/* Simulated Payment Methods */}
                <div className="pt-2">
                  <span className="text-[11px] text-[#A6B7AF] block mb-2 font-medium">Payment Option</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['Card', 'ApplePay', 'Wire'] as const).map(method => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 rounded-xl font-semibold border transition-all ${
                          paymentMethod === method
                            ? 'bg-[#D4AF37] text-[#1E2522] border-[#D4AF37]'
                            : 'bg-[#25322B] text-[#D0DED7] border-[#384A41] hover:bg-[#2F3E37]'
                        }`}
                      >
                        {method === 'Card' && '💳 Card'}
                        {method === 'ApplePay' && ' Pay'}
                        {method === 'Wire' && '🏦 Wire'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1A2420] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-transform active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Hold Suite (${depositDueNow})</span>
                </button>

                <p className="text-[10px] text-center text-[#7F928A]">
                  Free cancellation up to 7 days before check-in. Instant digital voucher issued.
                </p>

              </form>
            ) : (
              <div className="text-center py-10 px-4 bg-[#233029] rounded-2xl border border-[#314138]">
                <Compass className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 opacity-80" />
                <h4 className="font-serif-heading text-lg text-white">Select a Suite to Begin</h4>
                <p className="text-xs text-[#8BA097] mt-1">
                  Choose from our Cliffside Pavilions, Villas, or Penthouses on the left.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Booking Confirmation Success Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-[#1E2522]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-[#E3DCD1] rounded-[32px] max-w-xl w-full p-6 lg:p-8 shadow-2xl space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF6EC] text-[#8C743F] border border-[#E0D8CC]">
                Reservation Confirmed • {confirmedBooking.id}
              </span>
              <h2 className="font-serif-heading text-3xl font-bold text-[#1E2522] mt-2">
                We await your arrival, {confirmedBooking.guestName}.
              </h2>
              <p className="text-xs text-[#6B7D76] mt-1">
                A luxury reservation voucher and pre-arrival guide have been sent to {confirmedBooking.guestEmail}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E5DCD0] text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-[#E7DFD3]">
                <span className="font-bold text-sm text-[#1E2522]">{confirmedBooking.roomType}</span>
                <span className="font-bold text-sm text-[#1E2522]">Suite {confirmedBooking.roomNumber}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[#5E6F68]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#91A29A] block">Check-In</span>
                  <span className="font-semibold text-[#1E2522]">{confirmedBooking.checkInDate} (from 14:00)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#91A29A] block">Check-Out</span>
                  <span className="font-semibold text-[#1E2522]">{confirmedBooking.checkOutDate} (until 11:00)</span>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E7DFD3] text-[#1E2522]">
                <span>Total Stay:</span>
                <span className="font-bold">${confirmedBooking.totalAmount.toLocaleString()} (Deposit Paid: ${confirmedBooking.paidAmount.toLocaleString()})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  openDigitalKeyModal(confirmedBooking);
                }}
                className="flex-1 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1A2420] font-bold text-xs shadow-md"
              >
                View Digital Keycard
              </button>
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setActiveView('dashboard');
                }}
                className="flex-1 py-3 rounded-xl bg-[#1E2522] hover:bg-[#2C3B34] text-white font-semibold text-xs"
              >
                Return to Hospitality OS
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { 
  Key, 
  Smartphone, 
  Sparkles, 
  Utensils, 
  Moon, 
  Sun, 
  Thermometer, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Send, 
  MessageSquare, 
  Volume2, 
  Heart, 
  Wine, 
  Compass, 
  Star,
  ChevronRight,
  LogOut,
  Sliders,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuestCompanionPortal: React.FC = () => {
  const { 
    reservations, 
    rooms, 
    menu, 
    addOns, 
    addFolioItem, 
    addServiceRequest, 
    checkOutGuest, 
    awardLoyaltyPoints,
    openFolioModal,
    formatCurrency,
    setActiveView
  } = useHotel();

  // Find in-house reservations or fallback
  const inHouseList = reservations.filter(r => r.status === 'checked_in');
  const [selectedResId, setSelectedResId] = useState<string>(inHouseList[0]?.id || reservations[0]?.id || 'RES-8421');
  
  const currentRes = reservations.find(r => r.id === selectedResId) || reservations[0];
  const currentRoom = rooms.find(r => r.id === currentRes?.roomId) || rooms[0];

  // Smart Room Controls State
  const [roomTemp, setRoomTemp] = useState<number>(20.5);
  const [lightingScene, setLightingScene] = useState<'Twilight' | 'Zen' | 'Reading' | 'Romance'>('Twilight');
  const [dndActive, setDndActive] = useState<boolean>(false);
  const [keyUnlocked, setKeyUnlocked] = useState<boolean>(false);
  const [keyFeedback, setKeyFeedback] = useState<string | null>(null);

  // Active Tab inside Guest Portal
  const [guestTab, setGuestTab] = useState<'overview' | 'dining' | 'requests' | 'experiences' | 'folio'>('overview');

  // Dining Cart & Order Tracking
  const [orderSent, setOrderSent] = useState<boolean>(false);
  const [orderStep, setOrderStep] = useState<number>(1);
  const [customRequestText, setCustomRequestText] = useState<string>('');
  const [requestCategory, setRequestCategory] = useState<'Housekeeping' | 'Dining & Wine' | 'Spa' | 'Concierge' | 'Luggage & Valet'>('Housekeeping');
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  // Express Checkout State
  const [checkoutFeedback, setCheckoutFeedback] = useState<string>('');
  const [checkoutRating, setCheckoutRating] = useState<number>(5);
  const [isCheckoutDone, setIsCheckoutDone] = useState<boolean>(false);

  const handleUnlockDoor = () => {
    setKeyUnlocked(true);
    setKeyFeedback(`Door Unlocked: Welcome to ${currentRoom.name}`);
    setTimeout(() => {
      setKeyUnlocked(false);
      setKeyFeedback(null);
    }, 4000);
  };

  const handleOrderDining = (item: typeof menu[0]) => {
    if (!currentRes) return;
    addFolioItem(currentRes.id, {
      category: 'F&B Restaurant',
      description: `In-Room Dining: ${item.name}`,
      amount: item.price,
      postedBy: 'Guest Mobile Companion'
    });
    setOrderSent(true);
    setOrderStep(1);
    const t1 = setTimeout(() => setOrderStep(2), 2500);
    const t2 = setTimeout(() => setOrderStep(3), 5500);
    const t3 = setTimeout(() => setOrderStep(4), 8500);
  };

  const handleSendServiceRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRequestText.trim() || !currentRes) return;

    addServiceRequest({
      roomNumber: currentRes.roomNumber,
      guestName: currentRes.guestName,
      category: requestCategory,
      item: customRequestText,
      notes: `Requested via in-stay guest mobile app.`
    });

    setRequestSuccess(`Request dispatched to ${requestCategory} team!`);
    setCustomRequestText('');
    setTimeout(() => setRequestSuccess(null), 4000);
  };

  const handleExpressCheckout = () => {
    if (!currentRes) return;
    checkOutGuest(currentRes.id);
    awardLoyaltyPoints(currentRes.guestId, 1200);
    setIsCheckoutDone(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  if (!currentRes) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-[#EAE3D6] bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4EBD2] text-[#8C6C1D]">
          <Smartphone className="h-6 w-6" />
        </div>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9E7D23]">Guest companion</p>
        <h1 className="mt-2 font-serif-heading text-3xl font-semibold text-[#1E2522]">No active guest stay yet</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#71827B]">
          This property workspace is ready for guests. Once a reservation is checked in, the room key, requests, dining, and folio tools will appear here.
        </p>
        <button
          onClick={() => setActiveView('dashboard')}
          className="mt-6 rounded-xl bg-[#1E3027] px-5 py-3 text-xs font-bold text-[#F4E5B6] transition-colors hover:bg-[#2B4337]"
        >
          Return to operations
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      
      {/* Top Banner & In-House Switcher */}
      <div className="bg-[#141A17] text-[#FBF9F5] rounded-2xl p-4 sm:p-5 border border-[#2D3E35] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 w-full max-w-full">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800">
              In-Stay Guest Companion
            </span>
            <span className="text-xs text-[#A6B4AE]">Mobile & Tablet Responsive View</span>
          </div>
          <h1 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#F7F4EE]">
            Guest In-Room Experience Suite
          </h1>
          <p className="text-xs text-[#8EA299]">
            Live digital key, smart suite environmental controls, room service ordering, and express checkout.
          </p>
        </div>

        {/* In-House Guest Selector for Interactive Demoing */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-[#1C2621] p-2 rounded-xl border border-[#304239] w-full md:w-auto">
          <span className="text-xs text-[#8EA299] shrink-0 font-medium">Switch In-House Guest:</span>
          <select
            value={selectedResId}
            onChange={(e) => {
              setSelectedResId(e.target.value);
              setIsCheckoutDone(false);
            }}
            className="bg-[#141A17] text-[#E0CDA9] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#3A4E43] outline-none cursor-pointer w-full sm:w-auto max-w-full truncate"
          >
            {reservations.map(r => (
              <option key={r.id} value={r.id}>
                {r.guestName} — Suite {r.roomNumber} ({r.status.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Container Formatted like a Luxury Smartphone / Tablet Screen */}
      <div className="max-w-4xl mx-auto bg-white border border-[#EAE3D6] rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden w-full max-w-full">
        
        {/* Guest Hero Header with Suite Background */}
        <div className="relative h-64 bg-[#141A17] overflow-hidden text-white flex flex-col justify-end p-6">
          <img 
            src={currentRoom.images[0]} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141A17] via-[#141A17]/60 to-transparent" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#141A17]">
                  Suite {currentRes?.roomNumber || '101'}
                </span>
                <span className="text-xs text-[#D1DDD7] font-medium">{currentRoom.name}</span>
                {currentRes?.vipTier && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-700">
                    {currentRes.vipTier}
                  </span>
                )}
              </div>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#FBF9F5]">
                Welcome, {currentRes?.guestName}
              </h2>
              <p className="text-xs text-[#A6B4AE] mt-0.5">
                Stay duration: {currentRes?.checkInDate} to {currentRes?.checkOutDate} ({currentRes?.nights} nights)
              </p>
            </div>

            {/* Quick Digital NFC Key Card Button */}
            <button
              onClick={handleUnlockDoor}
              disabled={keyUnlocked}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all ${
                keyUnlocked 
                  ? 'bg-emerald-600 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-[#D4AF37] to-[#B89327] hover:from-[#E5C358] text-[#141A17]'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>{keyUnlocked ? 'Door Unlocked (NFC Active)' : 'Tap to Unlock Suite Door'}</span>
            </button>
          </div>
        </div>

        {/* Key Unlock Feedback Bar */}
        {keyFeedback && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{keyFeedback}</span>
          </div>
        )}

        {/* Navigation Strip for Guest App */}
        <div className="bg-[#FAF8F4] border-b border-[#EAE3D6] px-4 sm:px-6 flex gap-2 overflow-x-auto no-scrollbar py-2">
          {[
            { id: 'overview', label: 'Suite & Climate', icon: Sliders },
            { id: 'dining', label: 'In-Room Dining', icon: Utensils },
            { id: 'requests', label: 'Butler Requests', icon: Sparkles },
            { id: 'experiences', label: 'Experiences & Spa', icon: Compass },
            { id: 'folio', label: 'Folio & Checkout', icon: CreditCard }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = guestTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setGuestTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-[#1E2522] text-[#E0CDA9] shadow-sm' 
                    : 'text-[#52645D] hover:bg-[#EAE3D6]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Suite Overview & Environmental Controls */}
        {guestTab === 'overview' && (
          <div className="p-6 space-y-6">
            
            {/* Smart Climate & Lighting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Climate Card */}
              <div className="p-4 bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-rose-600" />
                    <span className="font-bold text-xs text-[#1E2522]">Suite Climate Control</span>
                  </div>
                  <span className="font-serif-heading font-bold text-lg text-[#1E2522]">{roomTemp}°C</span>
                </div>
                <input 
                  type="range"
                  min="18"
                  max="26"
                  step="0.5"
                  value={roomTemp}
                  onChange={(e) => setRoomTemp(parseFloat(e.target.value))}
                  className="w-full accent-[#9E7D23] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#7A8C84] mt-1">
                  <span>18°C (Crisp Cool)</span>
                  <span>Target: {roomTemp}°C</span>
                  <span>26°C (Tropical Warm)</span>
                </div>
              </div>

              {/* Lighting Mood Scenes */}
              <div className="p-4 bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[#9E7D23]" />
                    <span className="font-bold text-xs text-[#1E2522]">Ambient Lighting Scene</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#9E7D23]">{lightingScene} Mode</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Twilight', 'Zen', 'Reading', 'Romance'] as const).map(scene => (
                    <button
                      key={scene}
                      onClick={() => setLightingScene(scene)}
                      className={`py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                        lightingScene === scene 
                          ? 'bg-[#1E2522] text-[#E0CDA9] border-[#1E2522]' 
                          : 'bg-white text-[#52645D] border-[#D8CEBF] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {scene}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Privacy DND & Housekeeping Schedule Switch */}
            <div className="p-4 bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#1E2522] block">Do Not Disturb (DND Privacy Mode)</span>
                <span className="text-[11px] text-[#7A8C84]">Notifies housekeeping and butler teams to pause room entries.</span>
              </div>
              <button
                onClick={() => setDndActive(!dndActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  dndActive 
                    ? 'bg-rose-700 text-white shadow-md' 
                    : 'bg-white border border-[#D8CEBF] text-[#52645D]'
                }`}
              >
                {dndActive ? 'DND Active (Privacy On)' : 'Enable DND'}
              </button>
            </div>

            {/* Suite Features & Amenities Showcase */}
            <div>
              <h3 className="font-serif-heading text-sm font-bold text-[#1E2522] mb-2">Suite Appointments & Included Privileges</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {currentRoom.amenities.map((amenity, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-[#EAE3D6] rounded-xl flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#9E7D23] shrink-0" />
                    <span className="text-[#3A4A43] font-medium text-[11px]">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: In-Room Dining & Wine Cellar */}
        {guestTab === 'dining' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#1E2522]">Bespoke In-Suite Dining & Sommelier Cellar</h3>
              <p className="text-xs text-[#7A8C84]">All orders are crafted fresh and charged directly to your suite master folio.</p>
            </div>

            {/* Live Order Progress Tracker */}
            {orderSent && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-amber-900">Live Kitchen & Sommelier Tracker</span>
                  <span className="text-[10px] font-semibold text-amber-800">
                    {orderStep === 1 && 'Order Received & Dispatched to Kitchen'}
                    {orderStep === 2 && 'Executive Chef Preparing on Line'}
                    {orderStep === 3 && 'Plated & En Route via Private Butler'}
                    {orderStep === 4 && 'Delivered to Suite! Bon Appétit'}
                  </span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#D4AF37] h-full transition-all duration-700" 
                    style={{ width: `${orderStep * 25}%` }}
                  />
                </div>
              </div>
            )}

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menu.map((item) => (
                <div key={item.id} className="p-3 bg-[#FAF8F4] border border-[#EAE3D6] rounded-xl flex gap-3 items-center justify-between">
                  <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#1E2522]">{item.name}</span>
                      {item.dietary.map(d => (
                        <span key={d} className="text-[9px] font-bold px-1.5 py-0.2 bg-[#EAE3D6] text-[#52645D] rounded">
                          {d}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#7A8C84] line-clamp-1">{item.description}</p>
                    <span className="font-serif-heading font-bold text-xs text-[#9E7D23]">{formatCurrency(item.price)}</span>
                  </div>
                  <button
                    onClick={() => handleOrderDining(item)}
                    className="px-3 py-1.5 bg-[#1E2522] hover:bg-[#2C3B34] text-[#E0CDA9] rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    Order
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Butler & Housekeeping Requests */}
        {guestTab === 'requests' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#1E2522]">Concierge & Butler Service Requests</h3>
              <p className="text-xs text-[#7A8C84]">Instantly dispatch requests to our round-the-clock resort operational staff.</p>
            </div>

            {requestSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{requestSuccess}</span>
              </div>
            )}

            {/* Quick 1-Tap Request Chips */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1E2522] block">Popular On-Demand Services:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: 'Extra 800TC Eucalyptus Bath Salts & Towels', cat: 'Housekeeping' as const },
                  { text: 'Pillow Menu: 2 Extra Hypoallergenic Down Pillows', cat: 'Housekeeping' as const },
                  { text: 'Chilled Ice Bucket & Crystal Wine Flutes', cat: 'Dining & Wine' as const },
                  { text: 'Electric Buggy Transfer to Sunset Clifftop Perch', cat: 'Luggage & Valet' as const },
                  { text: 'Luggage Assistance for Tomorrow Departure', cat: 'Luggage & Valet' as const }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!currentRes) return;
                      addServiceRequest({
                        roomNumber: currentRes.roomNumber,
                        guestName: currentRes.guestName,
                        category: preset.cat,
                        item: preset.text,
                        notes: 'Preset selected via guest portal.'
                      });
                      setRequestSuccess(`Dispatched: ${preset.text}`);
                      setTimeout(() => setRequestSuccess(null), 4000);
                    }}
                    className="px-3 py-1.5 bg-[#FAF8F4] hover:bg-[#EAE3D6] border border-[#D8CEBF] text-[#1E2522] text-xs rounded-xl font-medium transition-colors"
                  >
                    + {preset.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Request Input Form */}
            <form onSubmit={handleSendServiceRequest} className="p-4 bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={requestCategory}
                  onChange={(e) => setRequestCategory(e.target.value as any)}
                  className="bg-white border border-[#D8CEBF] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                >
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Dining & Wine">Dining & Wine</option>
                  <option value="Spa">Spa & Wellness</option>
                  <option value="Luggage & Valet">Luggage & Valet</option>
                  <option value="Concierge">Concierge</option>
                </select>

                <input 
                  type="text"
                  value={customRequestText}
                  onChange={(e) => setCustomRequestText(e.target.value)}
                  placeholder="Describe your special request (e.g. ice bucket, turn-down time)..."
                  className="flex-1 bg-white border border-[#D8CEBF] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#9E7D23]"
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E2522] text-[#E0CDA9] rounded-xl text-xs font-bold hover:bg-[#2C3B34] transition-colors shrink-0"
                >
                  Dispatch Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Experiences & Spa Booking */}
        {guestTab === 'experiences' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-[#1E2522]">Resort Excursions & Spa Sanctuary</h3>
              <p className="text-xs text-[#7A8C84]">Reserve bespoke catamaran charters, clifftop yoga, and sound bath therapies.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addOns.map((pkg) => (
                <div key={pkg.id} className="p-4 bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl flex flex-col justify-between">
                  <div>
                    <img src={pkg.image} alt="" className="w-full h-32 rounded-xl object-cover mb-3" />
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#1E2522]">{pkg.name}</span>
                      <span className="font-serif-heading font-bold text-sm text-[#9E7D23]">{formatCurrency(pkg.price)}</span>
                    </div>
                    <p className="text-xs text-[#52645D] leading-relaxed">{pkg.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (!currentRes) return;
                      addFolioItem(currentRes.id, {
                        category: pkg.category === 'Wellness' ? 'Spa & Wellness' : 'Excursion',
                        description: `Booked: ${pkg.name}`,
                        amount: pkg.price,
                        postedBy: 'Guest App Experience Booking'
                      });
                      setRequestSuccess(`Booked ${pkg.name}! Added to suite folio.`);
                      setTimeout(() => setRequestSuccess(null), 4000);
                    }}
                    className="mt-4 w-full py-2 bg-[#1E2522] hover:bg-[#2C3B34] text-[#E0CDA9] rounded-xl text-xs font-bold transition-colors"
                  >
                    Reserve & Add to Folio
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Live Folio & Express Checkout */}
        {guestTab === 'folio' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-heading text-lg font-bold text-[#1E2522]">Suite Master Folio & Express Checkout</h3>
                <p className="text-xs text-[#7A8C84]">Review itemized stay ledger and settle balance seamlessly.</p>
              </div>
              <button
                onClick={() => openFolioModal(currentRes)}
                className="text-xs font-bold text-[#9E7D23] hover:underline"
              >
                View Full Detailed Statement →
              </button>
            </div>

            {/* Folio Summary Box */}
            <div className="p-4 bg-[#FAF8F4] border border-[#EAE3D6] rounded-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-[#EAE3D6]">
                <span className="text-xs text-[#7A8C84]">Total Charges Incurred:</span>
                <span className="font-serif-heading font-bold text-base text-[#1E2522]">{formatCurrency(currentRes?.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#EAE3D6]">
                <span className="text-xs text-[#7A8C84]">Advance Deposits / Payments:</span>
                <span className="font-semibold text-xs text-emerald-700">-{formatCurrency(currentRes?.paidAmount || 0)}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="font-bold text-xs text-[#1E2522]">Outstanding Net Balance:</span>
                <span className="font-serif-heading font-bold text-lg text-[#9E7D23]">
                  {formatCurrency(Math.max(0, (currentRes?.totalAmount || 0) - (currentRes?.paidAmount || 0)))}
                </span>
              </div>
            </div>

            {/* Express Checkout Action */}
            {isCheckoutDone ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                <h4 className="font-serif-heading text-lg font-bold text-emerald-900">Express Checkout Complete</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you for staying at The Azure Sanctuary, {currentRes?.guestName}. Your final tax invoice has been emailed. We awarded 1,200 loyalty points to your profile. Safe travels!
                </p>
              </div>
            ) : (
              <div className="p-5 bg-white border border-[#EAE3D6] rounded-2xl space-y-4">
                <div>
                  <span className="font-bold text-xs text-[#1E2522] block">How was your stay?</span>
                  <div className="flex gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setCheckoutRating(star)}
                        className={`p-1 text-lg ${checkoutRating >= star ? 'text-[#D4AF37]' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleExpressCheckout}
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B89327] hover:from-[#E5C358] text-[#141A17] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Complete Express 1-Tap Checkout</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

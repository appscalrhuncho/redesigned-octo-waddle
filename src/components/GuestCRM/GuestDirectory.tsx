import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { GuestProfile } from '../../types';
import { 
  Users, 
  Sparkles, 
  Search, 
  Plus, 
  Award, 
  DollarSign, 
  Calendar, 
  Heart, 
  Coffee, 
  Wine, 
  MapPin, 
  Mail, 
  Phone, 
  Tag, 
  CheckCircle2, 
  Edit3, 
  FileText 
} from 'lucide-react';

export const GuestDirectory: React.FC = () => {
  const { 
    guests, 
    reservations, 
    saveGuestProfile, 
    openNewReservationModal,
    openFolioModal 
  } = useHotel();

  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(guests[0] || null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  // Guest edit form state
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editVipTier, setEditVipTier] = useState<GuestProfile['vipTier']>('Standard');
  const [editDietary, setEditDietary] = useState('');
  const [editPillow, setEditPillow] = useState('');
  const [editTemp, setEditTemp] = useState(20);
  const [editDrinks, setEditDrinks] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const filteredGuests = guests.filter(g => {
    if (selectedTier !== 'All' && g.vipTier !== selectedTier) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return g.fullName.toLowerCase().includes(q) ||
             g.email.toLowerCase().includes(q) ||
             g.phone.includes(q) ||
             g.country.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenEdit = (guest?: GuestProfile) => {
    if (guest) {
      setEditFullName(guest.fullName);
      setEditEmail(guest.email);
      setEditPhone(guest.phone);
      setEditCountry(guest.country);
      setEditVipTier(guest.vipTier);
      setEditDietary(guest.dietaryRestrictions.join(', '));
      setEditPillow(guest.pillowPreference);
      setEditTemp(guest.roomTemperatureC);
      setEditDrinks(guest.favoriteDrinks.join(', '));
      setEditNotes(guest.internalNotes);
    } else {
      setEditFullName('');
      setEditEmail('');
      setEditPhone('');
      setEditCountry('United States');
      setEditVipTier('Standard');
      setEditDietary('');
      setEditPillow('Down firm');
      setEditTemp(20);
      setEditDrinks('');
      setEditNotes('');
    }
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = saveGuestProfile({
      id: selectedGuest?.id,
      fullName: editFullName,
      email: editEmail,
      phone: editPhone,
      country: editCountry,
      vipTier: editVipTier,
      dietaryRestrictions: editDietary.split(',').map(s => s.trim()).filter(Boolean),
      pillowPreference: editPillow,
      roomTemperatureC: Number(editTemp),
      favoriteDrinks: editDrinks.split(',').map(s => s.trim()).filter(Boolean),
      internalNotes: editNotes
    });
    setSelectedGuest(saved);
    setIsEditModalOpen(false);
  };

  const handleAppendNote = () => {
    if (!newNoteText.trim() || !selectedGuest) return;
    const updatedNotes = `${selectedGuest.internalNotes ? selectedGuest.internalNotes + '\n' : ''}[${new Date().toLocaleDateString()}]: ${newNoteText.trim()}`;
    const saved = saveGuestProfile({
      id: selectedGuest.id,
      internalNotes: updatedNotes
    });
    setSelectedGuest(saved);
    setNewNoteText('');
  };

  // Get past/current stays for selected guest
  const guestStays = reservations.filter(r => r.guestId === selectedGuest?.id || r.guestName === selectedGuest?.fullName);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-[#E3DCD1] rounded-3xl p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#1E2522] text-[#D4AF37]">
                Guest Relationship Management
              </span>
              <span className="text-xs text-[#7A8C84]">Bespoke hospitality profiles, preferences & stay histories</span>
            </div>
            <h2 className="font-serif-heading text-2xl lg:text-3xl font-medium text-[#1E2522]">
              Guest Directory & VIP CRM
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenEdit()}
              className="bg-[#D4AF37] hover:bg-[#C29E2E] text-[#1A2420] font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> New Guest Profile
            </button>
          </div>
        </div>

        {/* Tier Filter Tabs & Search */}
        <div className="mt-5 pt-4 border-t border-[#EAE3D6] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Black Diamond VIP', 'Gold', 'Silver', 'Standard'].map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedTier === tier
                    ? 'bg-[#1E2522] text-white border-[#1E2522] shadow-sm'
                    : 'bg-[#FAF8F4] border-[#E0D8CC] text-[#55675F] hover:bg-white'
                }`}
              >
                {tier === 'Black Diamond VIP' ? '💎 Black Diamond VIP' : tier}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#889B93] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guest by name, email, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#E0D8CC] text-xs outline-none w-64 focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Main CRM Layout: Guest Master List (5 cols) + Guest Detail Card (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Guest List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-[#6D7D76] uppercase tracking-wider block mb-1">
            Registered Profiles ({filteredGuests.length})
          </span>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredGuests.map(g => {
              const isSelected = selectedGuest?.id === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGuest(g)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${
                    isSelected
                      ? 'bg-[#1E2522] text-white border-[#1E2522] shadow-md ring-2 ring-[#D4AF37]'
                      : 'bg-white border-[#E3DCD1] hover:bg-[#FAF8F4] text-[#1E2522]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={g.avatar} 
                      alt={g.fullName} 
                      className="w-11 h-11 rounded-full object-cover shrink-0 border border-white/20" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm">{g.fullName}</span>
                        {g.vipTier !== 'Standard' && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                            isSelected ? 'bg-[#D4AF37] text-[#1E2522]' : 'bg-[#D4AF37]/20 text-[#866718]'
                          }`}>
                            {g.vipTier}
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-[#B4C4BC]' : 'text-[#71827B]'}`}>
                        {g.country} • {g.email}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`font-bold text-sm block ${isSelected ? 'text-[#D4AF37]' : 'text-[#1E2522]'}`}>
                      ${g.totalSpend.toLocaleString()}
                    </span>
                    <span className={`text-[10px] block ${isSelected ? 'text-[#8EA298]' : 'text-[#82958D]'}`}>
                      {g.totalStays} {g.totalStays === 1 ? 'Stay' : 'Stays'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Rich Guest Profile Detail Card (7 cols) */}
        <div className="lg:col-span-7">
          {selectedGuest ? (
            <div className="bg-white border border-[#E3DCD1] rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
              
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D6]">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedGuest.avatar} 
                    alt={selectedGuest.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]" 
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-heading text-2xl font-semibold text-[#1E2522]">
                        {selectedGuest.fullName}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4AF37]/20 text-[#8B6B15] border border-[#D4AF37]/40">
                        {selectedGuest.vipTier}
                      </span>
                    </div>
                    <p className="text-xs text-[#71827B] mt-0.5">
                      ID: {selectedGuest.id} • {selectedGuest.country} • Last visit: {selectedGuest.lastVisit || 'First Stay'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(selectedGuest)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#DCD3C5] hover:bg-[#EFE8DC] text-xs font-semibold text-[#1E2522] flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => openNewReservationModal({
                      guestId: selectedGuest.id,
                      guestName: selectedGuest.fullName,
                      guestEmail: selectedGuest.email,
                      guestPhone: selectedGuest.phone,
                      guestCountry: selectedGuest.country,
                      vipTier: selectedGuest.vipTier
                    })}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1E2522] hover:bg-[#2C3B34] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> Book Next Stay
                  </button>
                </div>
              </div>

              {/* Contact Info & Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2]">
                  <span className="text-[10px] text-[#71827B] uppercase font-bold block">Lifetime Spend</span>
                  <span className="font-serif-heading text-lg font-bold text-[#1E2522]">${selectedGuest.totalSpend.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2]">
                  <span className="text-[10px] text-[#71827B] uppercase font-bold block">Completed Stays</span>
                  <span className="font-serif-heading text-lg font-bold text-[#1E2522]">{selectedGuest.totalStays} Visits</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2]">
                  <span className="text-[10px] text-[#71827B] uppercase font-bold block">Preferred Room Temp</span>
                  <span className="font-serif-heading text-lg font-bold text-[#1E2522]">{selectedGuest.roomTemperatureC}°C</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2]">
                  <span className="text-[10px] text-[#71827B] uppercase font-bold block">Pillow Type</span>
                  <span className="font-semibold text-xs text-[#1E2522] truncate block mt-1">{selectedGuest.pillowPreference}</span>
                </div>
              </div>

              {/* Preferences & Dietary Section */}
              <div className="space-y-3 text-xs">
                <h4 className="font-serif-heading text-base font-semibold text-[#1E2522]">
                  Curated Guest Preferences
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2] space-y-1">
                    <span className="font-bold text-[#1E2522] flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-[#D4AF37]" /> Dietary & Allergies
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedGuest.dietaryRestrictions.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-[#E0D8CC] text-[11px] text-[#33423B]">
                          {d}
                        </span>
                      ))}
                      {selectedGuest.dietaryRestrictions.length === 0 && (
                        <span className="text-[#7A8C84] text-[11px]">No specific dietary restrictions logged.</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2] space-y-1">
                    <span className="font-bold text-[#1E2522] flex items-center gap-1.5">
                      <Wine className="w-3.5 h-3.5 text-[#D4AF37]" /> Favorite Drinks & Beverages
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedGuest.favoriteDrinks.map((dr, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-[#E0D8CC] text-[11px] text-[#33423B]">
                          {dr}
                        </span>
                      ))}
                      {selectedGuest.favoriteDrinks.length === 0 && (
                        <span className="text-[#7A8C84] text-[11px]">Standard minibar beverage setup.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Internal Staff Notes & Append Box */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-[#1E2522] block">Internal Concierge & Staff Notes</span>
                <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7DFD2] text-[#2C3833] text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedGuest.internalNotes || 'No internal notes recorded.'}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add operational note (e.g. Requested champagne at 18:00)..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E0D8CC] text-xs outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={handleAppendNote}
                    className="px-3.5 py-2 rounded-xl bg-[#1E2522] text-white font-semibold text-xs"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Stay History List */}
              <div className="space-y-2 text-xs pt-2 border-t border-[#EAE3D6]">
                <span className="font-bold text-[#1E2522] block">Stay History ({guestStays.length})</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {guestStays.map(res => (
                    <div 
                      key={res.id}
                      className="p-3 rounded-xl bg-[#FAF8F4] border border-[#E7DFD2] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-[#1E2522]">{res.id} • Suite {res.roomNumber} ({res.roomType})</span>
                        <span className="text-[11px] text-[#71827B] block">{res.checkInDate} → {res.checkOutDate} • {res.nights} nights</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-[#1E2522]">${res.totalAmount}</span>
                        <button
                          onClick={() => openFolioModal(res)}
                          className="text-[10px] text-[#A38020] hover:underline block font-semibold"
                        >
                          View Folio →
                        </button>
                      </div>
                    </div>
                  ))}
                  {guestStays.length === 0 && (
                    <p className="text-[#869991] text-center py-4">No past reservation records found.</p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-[#E3DCD1] rounded-3xl p-6">
              <Users className="w-10 h-10 text-[#D4AF37] mx-auto mb-2 opacity-80" />
              <h3 className="font-serif-heading text-xl text-[#1E2522]">Select a Guest Profile</h3>
              <p className="text-xs text-[#7A8C84] mt-1">Click any profile from the left column to review preferences.</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal: Edit or Create Guest Profile */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E2522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E3DCD1] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-2xl font-semibold text-[#1E2522]">
              {selectedGuest ? `Edit Profile: ${selectedGuest.fullName}` : 'New Guest Profile'}
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">VIP Tier</label>
                  <select
                    value={editVipTier}
                    onChange={(e) => setEditVipTier(e.target.value as any)}
                    className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Black Diamond VIP">Black Diamond VIP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Country of Residence</label>
                <input
                  type="text"
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Dietary (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Pescatarian, Gluten Free"
                    value={editDietary}
                    onChange={(e) => setEditDietary(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Pillow Request</label>
                  <input
                    type="text"
                    placeholder="e.g. Goose down firm"
                    value={editPillow}
                    onChange={(e) => setEditPillow(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Favorite Drinks & Wine</label>
                <input
                  type="text"
                  placeholder="e.g. Dom Pérignon, Negroni"
                  value={editDrinks}
                  onChange={(e) => setEditDrinks(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6D7D76] uppercase block mb-1">Internal Concierge Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F4] border border-[#E0D8CC] rounded-xl outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#1E2522] text-white font-semibold"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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

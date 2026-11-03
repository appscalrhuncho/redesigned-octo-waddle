import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Key, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Bed, 
  Utensils, 
  ShieldCheck, 
  X,
  Plus,
  Building,
  MapPin,
  DoorOpen,
  Globe,
  Coins,
  UserCheck,
  Smartphone,
  ChevronDown,
  Cloud
} from 'lucide-react';
import { AppLogo } from './Common/AppLogo';
import { UserRole, CurrencyCode } from '../types';

export const Header: React.FC = () => {
  const { 
    currentDate, 
    setCurrentDate, 
    occupancyRate, 
    todayArrivals, 
    todayDepartures, 
    alerts, 
    dismissAlert, 
    openNewReservationModal,
    activeView,
    setActiveView,
    userRole,
    setUserRole,
    currency,
    setCurrency,
    properties,
    activeProperty,
    setActiveProperty,
    addProperty,
    deleteProperty,
    openCloudSyncModal,
    resetToDemoData,
    reservations,
    rooms,
    guests,
    openFolioModal,
    formatCurrency
  } = useHotel();

  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelLocation, setNewHotelLocation] = useState('');
  const [newHotelRoomCount, setNewHotelRoomCount] = useState('12');
  const [newHotelError, setNewHotelError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const roles: UserRole[] = [
    'General Manager',
    'Front Desk',
    'Housekeeping & Maintenance',
    'F&B & Spa POS',
    'Guest Experience & AI Concierge',
    'Revenue & Distribution',
    'Sales & Groups',
    'Guest Direct Portal'
  ];

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'AED', 'CHF'];
  const activePropertyDetails = properties.find(property => property.name === activeProperty);

  const handleAddHotel = (event: React.FormEvent) => {
    event.preventDefault();
    setNewHotelError('');
    try {
      addProperty({
        name: newHotelName,
        location: newHotelLocation,
        roomCount: Number(newHotelRoomCount)
      });
      setShowAddHotelModal(false);
      setNewHotelName('');
      setNewHotelLocation('');
      setNewHotelRoomCount('12');
    } catch (error) {
      setNewHotelError(error instanceof Error ? error.message : 'Could not create this hotel workspace.');
    }
  };

  // Global search filtering
  const searchResults = searchQuery.trim() ? {
    reservations: reservations.filter(r => 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomNumber.includes(searchQuery)
    ).slice(0, 3),
    guests: guests.filter(g => 
      g.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery)
    ).slice(0, 3),
    rooms: rooms.filter(r => 
      r.number.includes(searchQuery) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3)
  } : null;

  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' || a.type === 'exception' || a.unread).length;

  return (
    <>
    <header className="brand-dark-shell sticky top-0 z-40 bg-[#080C11]/95 backdrop-blur-xl text-[#E8F0F4] border-b border-[#263540] px-3 sm:px-6 lg:px-8 py-3 shadow-[0_8px_30px_rgba(8,12,17,0.28)] w-full max-w-full">
      <div className="max-w-[1680px] mx-auto flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Left: Brand Identity & Property Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 relative min-w-0">
          <div className="cursor-pointer shrink-0" onClick={() => setActiveView('dashboard')}>
            <AppLogo size={36} animate />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
                className="font-serif-heading text-base sm:text-lg lg:text-xl tracking-wide font-semibold text-[#F7F4EE] hover:text-[#B8FF00] transition-colors flex items-center gap-1.5 text-left max-w-[125px] xs:max-w-[180px] sm:max-w-[260px]"
              >
                <span className="truncate">{activeProperty}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8EA299] shrink-0" />
              </button>

              {showPropertyDropdown && (
                <div 
                  className="absolute top-14 left-0 sm:left-4 w-[calc(100vw-1.5rem)] max-w-sm bg-[#101820] border border-[#263540] rounded-2xl shadow-2xl p-2.5 z-50 text-xs backdrop-blur-xl"
                  onMouseLeave={() => setShowPropertyDropdown(false)}
                >
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#1E2B35] mb-1.5">
                    <span className="text-[10px] text-[#8EA299] uppercase tracking-wider font-bold">
                      Hotel Portfolio ({properties.length} {properties.length === 1 ? 'property' : 'properties'})
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">Independent Workspaces</span>
                  </div>

                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {properties.map(p => {
                      const isDefault = p.name === 'The Azure Sanctuary (Cliffside)';
                      const isActive = activeProperty === p.name;
                      return (
                        <div
                          key={p.id}
                          className={`w-full group rounded-xl flex items-center justify-between p-1.5 transition-colors ${
                            isActive ? 'bg-[#192733] border border-[#B8FF00]/40 text-[#B8FF00]' : 'text-[#D1DDD7] hover:bg-[#15222B] border border-transparent'
                          }`}
                        >
                          <button
                            onClick={() => {
                              setActiveProperty(p.name);
                              setShowPropertyDropdown(false);
                            }}
                            className="flex-1 text-left flex items-center gap-2.5 min-w-0 px-1 py-0.5"
                          >
                            <Building className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#B8FF00]' : 'text-[#8EA299]'}`} />
                            <div className="min-w-0 flex-1 text-left">
                              <span className="block truncate font-semibold text-white">{p.name}</span>
                              <span className="block truncate text-[10px] font-normal text-[#8EA299]">{p.location}</span>
                            </div>
                            <span className="text-[10px] text-[#A6B4AE] shrink-0 font-medium bg-[#0B1218] px-1.5 py-0.5 rounded border border-[#202E38] mr-1">
                              {p.roomCount} keys
                            </span>
                          </button>
                          {!isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Remove hotel workspace "${p.name}"?`)) {
                                  deleteProperty(p.name);
                                }
                              }}
                              title="Remove workspace"
                              className="opacity-60 group-hover:opacity-100 p-1 hover:text-rose-400 text-[#8EA299] transition-opacity"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-[#1E2B35] mt-2 pt-2 space-y-1.5">
                    <button
                      onClick={() => {
                        setShowPropertyDropdown(false);
                        setNewHotelError('');
                        setShowAddHotelModal(true);
                      }}
                      className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-white bg-[#19232B] hover:bg-[#202F3A] transition-colors"
                    >
                      <Plus className="h-4 w-4 text-[#B8FF00]" />
                      <span>Add another hotel workspace</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowPropertyDropdown(false);
                        openCloudSyncModal();
                      }}
                      className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-[11px] text-[#00DDF2] hover:bg-[#12222B] transition-colors"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Cloud className="h-3.5 w-3.5 text-[#00DDF2]" />
                        <span>Keep workspaces synced across devices</span>
                      </span>
                      <span className="text-[10px] font-bold text-[#B8FF00]">↗ View plan</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#8EA299] tracking-wider uppercase flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>{properties.length} {properties.length === 1 ? 'Hotel' : 'Hotels'} · {rooms.length} Suites</span>
              <span className="hidden xs:inline">•</span>
              <span className="text-[#C8FF45] font-semibold truncate max-w-[120px] sm:max-w-none">{activePropertyDetails?.location || 'Portfolio workspace'}</span>
              <span className="hidden sm:inline">•</span>
              <button 
                onClick={() => openCloudSyncModal()}
                className="text-[#00DDF2] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                title="View SaaS Cloud Architecture & Sync Plan"
              >
                <span className="hidden sm:inline">Local prototype</span>
                <span className="text-[#B8FF00] font-bold">↗ View plan</span>
              </button>
            </p>
          </div>
        </div>

        {/* Center: Search Bar & Global Date Simulation */}
        <div className="hidden xl:flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <div className="flex items-center bg-[#19221E] border border-[#2D3E35] rounded-full px-3.5 py-1.5 focus-within:border-[#D4AF37] transition-colors w-64">
              <Search className="w-3.5 h-3.5 text-[#8EA299] mr-2 shrink-0" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search guest, room, res #..."
                className="bg-transparent text-xs text-[#FBF9F5] placeholder-[#6E8078] outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#8EA299] hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Search Popover */}
            {isSearchOpen && searchResults && (
              <div 
                className="absolute top-full left-0 mt-2 w-84 bg-[#1A2420] border border-[#3A4A43] rounded-2xl shadow-2xl p-3 z-50 text-xs text-[#E1E8E4]"
                onMouseLeave={() => setIsSearchOpen(false)}
              >
                <div className="flex justify-between items-center pb-2 border-b border-[#2A3831] mb-2">
                  <span className="font-semibold text-[#D4AF37] uppercase text-[10px] tracking-wider">Quick Search Results</span>
                  <button onClick={() => setIsSearchOpen(false)} className="text-[#889B93] hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {searchResults.reservations.length > 0 && (
                  <div className="mb-2.5">
                    <span className="text-[10px] text-[#7A8C84] uppercase tracking-wider block mb-1">Reservations</span>
                    {searchResults.reservations.map(res => (
                      <div 
                        key={res.id}
                        onClick={() => {
                          openFolioModal(res);
                          setIsSearchOpen(false);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#25332C] cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <span className="font-medium text-white">{res.guestName}</span>
                          <span className="text-[#A1B2AB] block text-[11px]">{res.id} • Suite {res.roomNumber} ({res.status.replace('_', ' ')})</span>
                        </div>
                        <span className="text-[#D4AF37] font-semibold">{formatCurrency(res.totalAmount)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.guests.length > 0 && (
                  <div className="mb-2.5">
                    <span className="text-[10px] text-[#7A8C84] uppercase tracking-wider block mb-1">Guest Profiles</span>
                    {searchResults.guests.map(g => (
                      <div 
                        key={g.id}
                        onClick={() => {
                          setActiveView('guest_crm');
                          setIsSearchOpen(false);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#25332C] cursor-pointer flex items-center gap-2"
                      >
                        <img src={g.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <span className="font-medium text-white">{g.fullName}</span>
                          <span className="text-[#A1B2AB] block text-[10px]">{g.vipTier} • {g.country}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Operational Date Simulator */}
          <div className="flex items-center gap-2 bg-[#19221E] border border-[#2D3E35] rounded-full px-3 py-1 text-xs">
            <span className="text-[#8EA299] text-[11px]">System Date:</span>
            <input 
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-transparent text-[#F7F4EE] text-xs outline-none cursor-pointer font-medium"
            />
          </div>
        </div>

        {/* Right: Currency, Role Persona Switcher, Alerts & Fast Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Currency Switcher */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              aria-label="Currency"
              className="bg-[#19221E] text-[#D1DDD7] border border-[#2D3E35] rounded-xl px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold hover:border-[#D4AF37] transition-colors outline-none cursor-pointer"
            >
              {currencies.map(c => (
                <option key={c} value={c} className="bg-[#1A2420] text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Persona Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1 sm:gap-1.5 bg-[#202C26] hover:bg-[#2B3B33] text-[#E0CDA9] border border-[#3A4E43] rounded-xl px-2 sm:px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="hidden md:inline">{userRole}</span>
              <span className="md:hidden">Role</span>
              <ChevronDown className="w-3 h-3 text-[#8EA299] shrink-0" />
            </button>

            {showRoleDropdown && (
              <div 
                className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-xs bg-[#1A2420] border border-[#3A4E43] rounded-xl shadow-2xl p-2 z-50 text-xs"
                onMouseLeave={() => setShowRoleDropdown(false)}
              >
                <div className="px-2 py-1 border-b border-[#293930] mb-1">
                  <span className="text-[10px] text-[#8EA299] uppercase tracking-wider font-semibold">Active Role Switcher</span>
                  <p className="text-[10px] text-[#A6B4AE]">Select stakeholder workspace perspective</p>
                </div>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r);
                      setShowRoleDropdown(false);
                      if (r === 'Guest Direct Portal') setActiveView('guest_portal');
                      else if (r === 'Front Desk') setActiveView('frontdesk');
                      else if (r === 'Housekeeping & Maintenance') setActiveView('housekeeping');
                      else if (r === 'F&B & Spa POS') setActiveView('pos');
                      else if (r === 'Guest Experience & AI Concierge') setActiveView('concierge_ai');
                      else if (r === 'Revenue & Distribution') setActiveView('analytics');
                      else if (r === 'Sales & Groups') setActiveView('sales_events');
                      else setActiveView('dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      userRole === r ? 'bg-[#2B3B33] text-[#D4AF37] font-semibold' : 'text-[#D1DDD7] hover:bg-[#223029]'
                    }`}
                  >
                    <span>{r}</span>
                    {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Activity Alerts & Exception Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
              className="relative p-1.5 sm:p-2 rounded-xl bg-[#19221E] hover:bg-[#24312B] border border-[#2D3E35] text-[#D1DDD7] transition-colors"
              title="Operational Alerts & Exceptions"
            >
              <Bell className="w-4 h-4" />
              {criticalAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-[#141A17] font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                  {criticalAlertsCount}
                </span>
              )}
            </button>

            {showAlertsDropdown && (
              <div 
                className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-sm bg-[#1A2420] border border-[#3A4E43] rounded-2xl shadow-2xl p-3 z-50 text-xs text-[#E1E8E4]"
                onMouseLeave={() => setShowAlertsDropdown(false)}
              >
                <div className="flex justify-between items-center pb-2 border-b border-[#2A3831] mb-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-semibold text-[#D4AF37] uppercase text-[11px] tracking-wider">Operational Events & Alerts</span>
                  </div>
                  <button onClick={() => setShowAlertsDropdown(false)} className="text-[#889B93] hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                  {alerts.length === 0 ? (
                    <p className="text-center text-[#7A8C84] py-4">No unread alerts. All systems running smooth.</p>
                  ) : (
                    alerts.map(a => (
                      <div 
                        key={a.id}
                        className={`p-2.5 rounded-xl border flex gap-2.5 items-start justify-between ${
                          a.severity === 'critical'
                            ? 'bg-rose-950/40 border-rose-800/60 text-rose-100'
                            : a.severity === 'warning'
                            ? 'bg-amber-950/40 border-amber-800/60 text-amber-100'
                            : 'bg-[#223029] border-[#314239] text-[#E1E8E4]'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-semibold text-xs text-white truncate">{a.title}</span>
                            <span className="text-[10px] text-[#8EA299] shrink-0 ml-1">{a.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-[#B8C9C1] leading-relaxed">{a.description}</p>
                          {a.actionLabel && (
                            <button 
                              onClick={() => {
                                if (a.actionPayload === 'REQ-101') setActiveView('concierge_ai');
                                else if (a.actionPayload === 'CHN-02') setActiveView('channels');
                                setShowAlertsDropdown(false);
                              }}
                              className="mt-2 text-[10px] font-semibold px-2.5 py-1 rounded bg-[#D4AF37] text-[#141A17] hover:bg-[#E5C358] transition-colors"
                            >
                              {a.actionLabel} →
                            </button>
                          )}
                        </div>
                        <button 
                          onClick={() => dismissAlert(a.id)}
                          className="text-[#8EA299] hover:text-white p-0.5 shrink-0"
                          title="Dismiss"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fast Action: New Reservation */}
          <button
            onClick={() => openNewReservationModal()}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#B8FF00] to-[#00DDF2] hover:from-[#C8FF45] hover:to-[#53EAF4] text-[#081015] font-semibold px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Reservation</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetToDemoData}
            title="Reset system to pristine luxury demo state"
            className="hidden xs:flex p-1.5 sm:p-2 rounded-xl bg-[#0C1218] hover:bg-[#17232B] border border-[#263540] text-[#9AAAB3] hover:text-[#00DDF2] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
    {showAddHotelModal && (
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-[#07100C]/70 p-4 backdrop-blur-sm"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowAddHotelModal(false);
        }}
      >
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#DCE5EB] bg-[#F4F7FA] shadow-2xl">
          <div className="brand-dark-shell bg-[#0B1016] px-6 py-5 text-[#E8F0F4]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8FF00]">Portfolio setup</span>
                <h2 className="mt-1 font-serif-heading text-2xl font-semibold">Add a hotel workspace</h2>
                <p className="mt-1 text-xs text-[#A8B7AF]">Give each property its own rooms, guests, reservations, and operations.</p>
              </div>
              <button
                onClick={() => setShowAddHotelModal(false)}
                aria-label="Close add hotel form"
                className="rounded-xl p-2 text-[#A8B7AF] transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <form onSubmit={handleAddHotel} className="space-y-4 p-6">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#304139]">Hotel or property name</span>
              <div className="flex items-center gap-2 rounded-xl border border-[#D8CEBF] bg-white px-3.5">
                <Building className="h-4 w-4 text-[#9E7D23]" />
                <input
                  autoFocus
                  required
                  maxLength={80}
                  value={newHotelName}
                  onChange={event => setNewHotelName(event.target.value)}
                  placeholder="e.g. Azure Alpine Lodge"
                  className="w-full bg-transparent py-3 text-sm text-[#1E2522] outline-none placeholder:text-[#A3AAA5]"
                />
              </div>
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#304139]">City or destination</span>
                <div className="flex items-center gap-2 rounded-xl border border-[#D8CEBF] bg-white px-3.5">
                  <MapPin className="h-4 w-4 text-[#9E7D23]" />
                  <input
                    required
                    maxLength={80}
                    value={newHotelLocation}
                    onChange={event => setNewHotelLocation(event.target.value)}
                    placeholder="e.g. Zermatt, Switzerland"
                    className="w-full bg-transparent py-3 text-sm text-[#1E2522] outline-none placeholder:text-[#A3AAA5]"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#304139]">Number of rooms</span>
                <div className="flex items-center gap-2 rounded-xl border border-[#D8CEBF] bg-white px-3.5">
                  <DoorOpen className="h-4 w-4 text-[#9E7D23]" />
                  <input
                    required
                    type="number"
                    min="1"
                    max="250"
                    value={newHotelRoomCount}
                    onChange={event => setNewHotelRoomCount(event.target.value)}
                    className="w-full bg-transparent py-3 text-sm text-[#1E2522] outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="rounded-xl border border-[#B8FF00]/40 bg-[#B8FF00]/10 p-3.5 text-xs text-[#2A4400]">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#1F3300] block">Independent Property Workspace</span>
                  <p className="text-[11px] leading-relaxed text-[#355205]">
                    This creates a separate workspace with {newHotelRoomCount || '12'} starter suites and zero initial operating history. Demo data on your existing hotel is fully preserved.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openCloudSyncModal()}
                  className="shrink-0 text-[11px] font-bold text-[#006E7D] hover:underline flex items-center gap-1"
                >
                  <span>↗ View plan</span>
                </button>
              </div>
            </div>
            {newHotelError && <p role="alert" className="text-xs font-medium text-rose-700">{newHotelError}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddHotelModal(false)}
                className="rounded-xl border border-[#DCE5EB] px-4 py-2.5 text-xs font-semibold text-[#34444E] transition-colors hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#B8FF00] px-4 py-2.5 text-xs font-bold text-[#081015] transition-colors hover:bg-[#C8FF45]"
              >
                Create hotel workspace
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export type RoomType = 
  | 'Cliffside Pavilion'
  | 'Garden Pool Villa'
  | 'Azure Penthouse'
  | 'Oceanfront Bungalow'
  | 'Heritage Courtyard Suite'
  | 'Sunset Star Deck Suite';

export type RoomStatus = 'clean' | 'dirty' | 'inspecting' | 'maintenance' | 'out_of_order';

export interface Room {
  id: string; // e.g. "R101"
  number: string; // "101"
  name: string; // "The Acacia Bower"
  type: RoomType;
  floor: number;
  basePrice: number;
  seasonalPrice: number;
  maxGuests: number;
  bedConfig: string;
  sizeSqM: number;
  dimensions?: string;
  view: string;
  amenities: string[];
  features: string[];
  images: string[];
  floorPlanUrl?: string;
  status: RoomStatus;
  housekeepingNotes?: string;
  assignedStaff?: string;
  isBlocked?: boolean;
  blockReason?: string;
  cta?: boolean; // Closed to Arrival
  ctd?: boolean; // Closed to Departure
  minStayNights?: number;
}

export type ReservationStatus = 
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'hold'
  | 'no_show'
  | 'waitlist';

export type BookingChannel = 'Direct Web' | 'Concierge Walk-in' | 'Tablet Portal' | 'Booking.com' | 'Expedia' | 'Airbnb' | 'Luxury Retreats OTA' | 'VIP Corporate' | 'GDS';

export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'refunded' | 'failed';

export type FolioType = 'Folio A (Guest Personal)' | 'Folio B (Company / Corporate)' | 'Folio C (Group Master)';

export interface FolioItem {
  id: string;
  folioType?: FolioType;
  category: 'Room Charge' | 'F&B Restaurant' | 'Bar & Wine' | 'Spa & Wellness' | 'Excursion' | 'Tax & Tourism Levy' | 'Payment / Deposit' | 'Discount / Credit' | 'Ancillary / Transport' | 'Damage / Loss';
  description: string;
  amount: number;
  date: string;
  time: string;
  postedBy: string;
  paymentMethod?: 'Card' | 'Cash' | 'Wire' | 'Room Charge' | 'Voucher' | 'Apple Pay' | 'Tokenized Card';
  taxRate?: number;
  referenceId?: string;
}

export interface AddOnPackage {
  id: string;
  name: string;
  category: 'Wellness' | 'Dining' | 'Adventure' | 'Transport' | 'Celebration';
  price: number;
  perPerson?: boolean;
  description: string;
  image: string;
  duration?: string;
  tags?: string[];
}

export interface Reservation {
  id: string; // "RES-8421"
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  checkInDate: string; // "YYYY-MM-DD"
  checkOutDate: string; // "YYYY-MM-DD"
  nights: number;
  numGuests: number;
  status: ReservationStatus;
  channel: BookingChannel;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  estimatedArrivalTime?: string;
  flightNumber?: string;
  vipTier?: 'Standard' | 'Silver' | 'Gold' | 'Black Diamond VIP';
  selectedAddOns: string[];
  folio: FolioItem[];
  digitalKeyIssued?: boolean;
  isPreRegistered?: boolean;
  regCardSigned?: boolean;
  notes?: string;
  createdAt: string;
  companyName?: string;
  groupCode?: string;
}

export interface GuestProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  avatar: string;
  vipTier: 'Standard' | 'Silver' | 'Gold' | 'Black Diamond VIP';
  loyaltyPoints: number;
  totalStays: number;
  totalSpend: number;
  dietaryRestrictions: string[];
  pillowPreference: string;
  roomTemperatureC: number;
  favoriteDrinks: string[];
  allergies?: string[];
  anniversaryDate?: string;
  birthday?: string;
  tags: string[];
  internalNotes: string;
  lastVisit?: string;
  preferredLanguage?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'All-Day Dining' | 'Chef Tasting Menu' | 'Artisan Cocktails' | 'Cellar Wines' | 'Spa Sanctuary';
  price: number;
  description: string;
  dietary: ('GF' | 'Vegan' | 'Vegetarian' | 'Nut Free' | 'Signature')[];
  image: string;
  prepTimeMinutes: number;
  availableModifiers: string[];
}

export interface RestaurantTable {
  id: string;
  number: string;
  zone: 'Main Dining Terrace' | 'Cliffside Perch' | 'Wine Cellar Vault' | 'Poolside Pavilion';
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'bill_printed';
  activeReservationId?: string;
  currentGuestName?: string;
  serverName?: string;
}

export interface POSOrder {
  id: string;
  tableId?: string;
  roomNumber?: string;
  guestName?: string;
  items: {
    menuItem: MenuItem;
    quantity: number;
    selectedModifiers: string[];
    notes?: string;
  }[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  status: 'open' | 'sent_to_kitchen' | 'ready' | 'served' | 'settled';
  timestamp: string;
  chargedToRoom: boolean;
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  type: 'Full Turn' | 'Daily Refresh' | 'VIP Turndown' | 'Deep Clean Inspection';
  status: 'pending' | 'in_progress' | 'inspected' | 'completed';
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent Rush';
  estimatedMinutes: number;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface MaintenanceTicket {
  id: string;
  roomId: string;
  roomNumber: string;
  location: string;
  category: 'HVAC / Climate' | 'Plumbing' | 'Electrical' | 'Smart Room & Tech' | 'Furnishings' | 'Pool / Jacuzzi';
  issue: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'open' | 'in_progress' | 'resolved';
  reportedAt: string;
  technician: string;
  resolutionNotes?: string;
  blocksInventory?: boolean;
}

export interface DailyMetric {
  date: string;
  dayLabel: string;
  occupancyPercent: number;
  adr: number; // Average Daily Rate ($)
  revPar: number; // Revenue Per Available Room ($)
  trevPar?: number; // Total Revenue Per Available Room ($)
  totalRoomRevenue: number;
  totalFBRevenue: number;
  totalSpaRevenue: number;
  totalExcursionsRevenue: number;
  arrivalsCount: number;
  departuresCount: number;
}

export interface ActivityAlert {
  id: string;
  type: 'booking' | 'checkin' | 'checkout' | 'housekeeping' | 'pos' | 'maintenance' | 'vip' | 'exception' | 'rate_parity';
  severity?: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  actionLabel?: string;
  actionPayload?: string;
  unread?: boolean;
}

export interface ServiceRequest {
  id: string;
  roomNumber: string;
  guestName: string;
  category: 'Housekeeping' | 'Dining & Wine' | 'Spa' | 'Concierge' | 'Luggage & Valet' | 'Engineering';
  item: string;
  notes: string;
  status: 'received' | 'in_progress' | 'completed';
  requestedAt: string;
  assignedStaff?: string;
}

export interface GuestMessage {
  id: string;
  sender: 'guest' | 'hotel' | 'system';
  senderName: string;
  channel: 'Portal Chat' | 'WhatsApp' | 'SMS' | 'OTA' | 'Email';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  guestId: string;
  guestName: string;
  roomNumber?: string;
  channel: 'Portal Chat' | 'WhatsApp' | 'SMS' | 'OTA' | 'Email';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: GuestMessage[];
}

export interface ChannelItem {
  id: string;
  name: string;
  type: 'OTA' | 'Direct' | 'GDS' | 'Metasearch';
  status: 'connected' | 'syncing' | 'paused' | 'error';
  commissionRate: number;
  activeRatePlan: string;
  syncedRoomsCount: number;
  parityStatus: 'in_parity' | 'violation';
  currentOtaPrice: number;
  directPrice: number;
  lastSyncedAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  actions: string[];
  enabled: boolean;
  lastExecuted?: string;
  executionCount: number;
}

export interface GroupEvent {
  id: string;
  groupName: string;
  eventType: 'Wedding & Celebration' | 'Executive Retreat' | 'Catering Banquet' | 'Film Production';
  organizer: string;
  contactEmail: string;
  contactPhone: string;
  arrivalDate: string;
  departureDate: string;
  roomsBlocked: number;
  attendeesCount: number;
  totalContractValue: number;
  depositPaid: number;
  status: 'Proposal' | 'Contract Signed' | 'In-House' | 'Completed';
  spacesBooked: string[];
  functionSheetNotes: string;
}

export type UserRole = 
  | 'General Manager'
  | 'Front Desk'
  | 'Housekeeping & Maintenance'
  | 'F&B & Spa POS'
  | 'Guest Experience & AI Concierge'
  | 'Revenue & Distribution'
  | 'Sales & Groups'
  | 'Guest Direct Portal';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED' | 'CHF';

export interface HotelProperty {
  id: string;
  name: string;
  location: string;
  roomCount: number;
  createdAt: string;
}

export type TenantTier = 'Boutique Starter' | 'Portfolio Pro' | 'Global Enterprise';
export type TenantBillingStatus = 'active' | 'trialing' | 'past_due';
export type TenantBillingCycle = 'monthly' | 'annual';
export type TenantRole = 'Owner' | 'Operations Director' | 'General Manager' | 'Front Office Lead' | 'Housekeeping & Staff';

export interface TenantMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: TenantRole;
  assignedPropertyIds: string[]; // ['all'] or array of property ids
  status: 'active' | 'invited';
  lastActive?: string;
  title?: string;
}

export interface TenantInvoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'refunded';
  plan: string;
  period: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  tier: TenantTier;
  billingStatus: TenantBillingStatus;
  billingCycle: TenantBillingCycle;
  planPrice: number;
  roomQuota: number;
  propertyQuota: number;
  customDomain?: string;
  billingEmail: string;
  paymentMethod: {
    brand: 'visa' | 'mastercard' | 'amex';
    last4: string;
    expDate: string;
  };
  features: string[];
  properties: HotelProperty[];
  members: TenantMember[];
  invoices: TenantInvoice[];
  createdAt: string;
}


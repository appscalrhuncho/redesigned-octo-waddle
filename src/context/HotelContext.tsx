import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Room, 
  Reservation, 
  GuestProfile, 
  AddOnPackage, 
  MenuItem, 
  RestaurantTable, 
  HousekeepingTask, 
  MaintenanceTicket, 
  DailyMetric, 
  ActivityAlert, 
  RoomStatus, 
  FolioItem,
  FolioType,
  ChannelItem,
  AutomationRule,
  ServiceRequest,
  MessageThread,
  GroupEvent,
  UserRole,
  CurrencyCode,
  HotelProperty
} from '../types';
import {
  INITIAL_ROOMS,
  INITIAL_GUESTS,
  INITIAL_ADDONS,
  INITIAL_RESERVATIONS,
  INITIAL_MENU,
  INITIAL_TABLES,
  INITIAL_HOUSEKEEPING_TASKS,
  INITIAL_MAINTENANCE,
  METRICS_DATA,
  INITIAL_ALERTS,
  INITIAL_CHANNELS,
  INITIAL_AUTOMATION_RULES,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_MESSAGE_THREADS,
  INITIAL_GROUP_EVENTS
} from '../data/mockData';

interface HotelContextType {
  // Data entities
  properties: HotelProperty[];
  rooms: Room[];
  reservations: Reservation[];
  guests: GuestProfile[];
  addOns: AddOnPackage[];
  menu: MenuItem[];
  tables: RestaurantTable[];
  housekeeping: HousekeepingTask[];
  maintenance: MaintenanceTicket[];
  metrics: DailyMetric[];
  alerts: ActivityAlert[];
  channels: ChannelItem[];
  automationRules: AutomationRule[];
  serviceRequests: ServiceRequest[];
  messageThreads: MessageThread[];
  groupEvents: GroupEvent[];

  // Global app state
  currentDate: string;
  activeView: string;
  userRole: UserRole;
  currency: CurrencyCode;
  activeProperty: string;
  
  // Modals & Drawers
  isNewReservationModalOpen: boolean;
  newReservationDefaults: Partial<Reservation> | null;
  isFolioModalOpen: boolean;
  activeFolioReservation: Reservation | null;
  isDigitalKeyModalOpen: boolean;
  activeDigitalKeyReservation: Reservation | null;
  isDigitalCheckInModalOpen: boolean;
  activeCheckInReservation: Reservation | null;
  selectedGuestForDrawer: GuestProfile | null;
  
  // Actions
  setActiveView: (view: string) => void;
  setUserRole: (role: UserRole) => void;
  setCurrency: (curr: CurrencyCode) => void;
  setActiveProperty: (prop: string) => void;
  addProperty: (property: { name: string; location: string; roomCount: number }) => void;
  setCurrentDate: (date: string) => void;
  
  // Reservation actions
  createReservation: (data: Partial<Reservation>) => Reservation;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  checkInGuest: (resId: string) => void;
  checkOutGuest: (resId: string) => void;
  cancelReservation: (resId: string) => void;
  submitDigitalCheckIn: (resId: string, details: { idVerified?: boolean; signed?: boolean; eta?: string; flight?: string }) => void;
  
  // Room inventory & restrictions
  updateRoomStatus: (roomId: string, status: RoomStatus) => void;
  updateRoomRestrictions: (roomId: string, updates: { cta?: boolean; ctd?: boolean; minStayNights?: number; isBlocked?: boolean; blockReason?: string }) => void;
  
  // Folio & Commerce
  addFolioItem: (resId: string, item: Omit<FolioItem, 'id' | 'date' | 'time'>) => void;
  transferFolioItem: (resId: string, itemId: string, targetFolio: FolioType) => void;
  settleFolio: (resId: string, amount: number, method: FolioItem['paymentMethod'], folioType?: FolioType) => void;
  
  // Housekeeping & Maintenance
  updateHousekeepingStatus: (taskId: string, status: HousekeepingTask['status']) => void;
  addHousekeepingTask: (task: Omit<HousekeepingTask, 'id'>) => void;
  createMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'reportedAt'>) => void;
  resolveMaintenanceTicket: (ticketId: string, notes?: string) => void;
  
  // F&B & Services
  updateTableStatus: (tableId: string, status: RestaurantTable['status'], guestName?: string) => void;
  addServiceRequest: (req: Omit<ServiceRequest, 'id' | 'requestedAt' | 'status'>) => void;
  updateServiceRequestStatus: (reqId: string, status: ServiceRequest['status']) => void;
  
  // Guest CRM & Loyalty
  saveGuestProfile: (guest: Partial<GuestProfile>) => GuestProfile;
  awardLoyaltyPoints: (guestId: string, points: number) => void;
  
  // Messaging & Communications
  sendGuestMessage: (threadId: string, content: string, sender?: 'hotel' | 'guest' | 'system') => void;
  
  // Distribution Channels & Rate Parity
  updateChannelPrice: (channelId: string, newPrice: number) => void;
  resolveParityViolation: (channelId: string) => void;
  toggleChannelStatus: (channelId: string) => void;
  
  // Automation Engine
  toggleAutomationRule: (ruleId: string) => void;
  runAutomationRule: (ruleId: string) => void;
  
  // Sales & Groups
  addGroupEvent: (event: Omit<GroupEvent, 'id'>) => void;
  updateGroupEvent: (id: string, updates: Partial<GroupEvent>) => void;
  
  // Alerts
  addAlert: (alert: Omit<ActivityAlert, 'id' | 'timestamp'>) => void;
  dismissAlert: (id: string) => void;
  
  // Modals helpers
  openNewReservationModal: (defaults?: Partial<Reservation>) => void;
  closeNewReservationModal: () => void;
  openFolioModal: (res: Reservation) => void;
  closeFolioModal: () => void;
  openDigitalKeyModal: (res: Reservation) => void;
  closeDigitalKeyModal: () => void;
  openDigitalCheckInModal: (res: Reservation) => void;
  closeDigitalCheckInModal: () => void;
  setSelectedGuestForDrawer: (guest: GuestProfile | null) => void;
  resetToDemoData: () => void;
  
  // Currency helpers
  formatCurrency: (amountUSD: number) => string;
  convertPrice: (amountUSD: number) => number;
  
  // Operational helpers
  todayArrivals: Reservation[];
  todayDepartures: Reservation[];
  todayInHouse: Reservation[];
  occupancyRate: number;
  todayRevenue: number;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROOMS: 'hotel_rooms_v2',
  RESERVATIONS: 'hotel_reservations_v2',
  GUESTS: 'hotel_guests_v2',
  METRICS: 'hotel_metrics_v1',
  HOUSEKEEPING: 'hotel_housekeeping_v2',
  MAINTENANCE: 'hotel_maintenance_v2',
  TABLES: 'hotel_tables_v2',
  ALERTS: 'hotel_alerts_v2',
  CHANNELS: 'hotel_channels_v2',
  AUTOMATIONS: 'hotel_automations_v2',
  SERVICES: 'hotel_services_v2',
  MESSAGES: 'hotel_messages_v2',
  GROUPS: 'hotel_groups_v2',
  CURRENT_DATE: 'hotel_current_date_v2',
  USER_ROLE: 'hotel_user_role_v2',
  CURRENCY: 'hotel_currency_v2',
  PROPERTY: 'hotel_property_v2'
};

const DEFAULT_PROPERTY_NAME = 'The Azure Sanctuary (Cliffside)';
const PROPERTIES_STORAGE_KEY = 'hotel_properties_v1';

const slugifyProperty = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'hotel';

const getWorkspaceStorageKey = (key: string, propertyName: string) =>
  `${key}::${slugifyProperty(propertyName)}`;

const readStoredProperties = (): HotelProperty[] => {
  try {
    const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as HotelProperty[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const activeName = localStorage.getItem(STORAGE_KEYS.PROPERTY) || DEFAULT_PROPERTY_NAME;
    const locationMatch = activeName.match(/\(([^)]+)\)/);
    return [{
      id: slugifyProperty(activeName),
      name: activeName,
      location: locationMatch?.[1] || 'Location not set',
      roomCount: INITIAL_ROOMS.length,
      createdAt: new Date().toISOString()
    }];
  } catch {
    return [{
      id: slugifyProperty(DEFAULT_PROPERTY_NAME),
      name: DEFAULT_PROPERTY_NAME,
      location: 'Cliffside',
      roomCount: INITIAL_ROOMS.length,
      createdAt: new Date().toISOString()
    }];
  }
};

const readWorkspaceState = <T,>(key: string, propertyName: string, fallback: T): T => {
  try {
    const scopedValue = localStorage.getItem(getWorkspaceStorageKey(key, propertyName));
    if (scopedValue !== null) return JSON.parse(scopedValue) as T;
    // One-time compatibility path for data saved before portfolio scoping.
    const legacyValue = localStorage.getItem(key);
    return legacyValue !== null ? JSON.parse(legacyValue) as T : fallback;
  } catch {
    return fallback;
  }
};

const CURRENCY_RATES: Record<CurrencyCode, { rate: number; symbol: string; prefix: boolean }> = {
  USD: { rate: 1.0, symbol: '$', prefix: true },
  EUR: { rate: 0.92, symbol: '€', prefix: true },
  GBP: { rate: 0.79, symbol: '£', prefix: true },
  JPY: { rate: 154.5, symbol: '¥', prefix: true },
  AED: { rate: 3.67, symbol: ' AED', prefix: false },
  CHF: { rate: 0.91, symbol: ' CHF', prefix: false }
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<HotelProperty[]>(readStoredProperties);
  const [activeProperty, setActivePropertyState] = useState<string>(() => {
    try {
      const savedName = localStorage.getItem(STORAGE_KEYS.PROPERTY);
      const matchingProperty = properties.find(property => property.name === savedName);
      return matchingProperty?.name || properties[0]?.name || DEFAULT_PROPERTY_NAME;
    } catch {
      return DEFAULT_PROPERTY_NAME;
    }
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.ROOMS, activeProperty, INITIAL_ROOMS);
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.RESERVATIONS, activeProperty, INITIAL_RESERVATIONS);
  });

  const [guests, setGuests] = useState<GuestProfile[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.GUESTS, activeProperty, INITIAL_GUESTS);
  });

  const [metrics, setMetrics] = useState<DailyMetric[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.METRICS, activeProperty, METRICS_DATA);
  });

  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.HOUSEKEEPING, activeProperty, INITIAL_HOUSEKEEPING_TASKS);
  });

  const [maintenance, setMaintenance] = useState<MaintenanceTicket[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.MAINTENANCE, activeProperty, INITIAL_MAINTENANCE);
  });

  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.TABLES, activeProperty, INITIAL_TABLES);
  });

  const [alerts, setAlerts] = useState<ActivityAlert[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.ALERTS, activeProperty, INITIAL_ALERTS);
  });

  const [channels, setChannels] = useState<ChannelItem[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.CHANNELS, activeProperty, INITIAL_CHANNELS);
  });

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.AUTOMATIONS, activeProperty, INITIAL_AUTOMATION_RULES);
  });

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.SERVICES, activeProperty, INITIAL_SERVICE_REQUESTS);
  });

  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.MESSAGES, activeProperty, INITIAL_MESSAGE_THREADS);
  });

  const [groupEvents, setGroupEvents] = useState<GroupEvent[]>(() => {
    return readWorkspaceState(STORAGE_KEYS.GROUPS, activeProperty, INITIAL_GROUP_EVENTS);
  });

  const [currentDate, setCurrentDateState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_DATE) || '2026-05-15';
    } catch {
      return '2026-05-15';
    }
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.USER_ROLE) as UserRole) || 'General Manager';
    } catch {
      return 'General Manager';
    }
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode) || 'USD';
    } catch {
      return 'USD';
    }
  });

  // Modal states
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);
  const [newReservationDefaults, setNewReservationDefaults] = useState<Partial<Reservation> | null>(null);
  const [isFolioModalOpen, setIsFolioModalOpen] = useState(false);
  const [activeFolioReservation, setActiveFolioReservation] = useState<Reservation | null>(null);
  const [isDigitalKeyModalOpen, setIsDigitalKeyModalOpen] = useState(false);
  const [activeDigitalKeyReservation, setActiveDigitalKeyReservation] = useState<Reservation | null>(null);
  const [isDigitalCheckInModalOpen, setIsDigitalCheckInModalOpen] = useState(false);
  const [activeCheckInReservation, setActiveCheckInReservation] = useState<Reservation | null>(null);
  const [selectedGuestForDrawer, setSelectedGuestForDrawer] = useState<GuestProfile | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(properties));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.ROOMS, activeProperty), JSON.stringify(rooms));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.RESERVATIONS, activeProperty), JSON.stringify(reservations));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.GUESTS, activeProperty), JSON.stringify(guests));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.METRICS, activeProperty), JSON.stringify(metrics));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.HOUSEKEEPING, activeProperty), JSON.stringify(housekeeping));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.MAINTENANCE, activeProperty), JSON.stringify(maintenance));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.TABLES, activeProperty), JSON.stringify(tables));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.ALERTS, activeProperty), JSON.stringify(alerts));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.CHANNELS, activeProperty), JSON.stringify(channels));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.AUTOMATIONS, activeProperty), JSON.stringify(automationRules));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.SERVICES, activeProperty), JSON.stringify(serviceRequests));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.MESSAGES, activeProperty), JSON.stringify(messageThreads));
      localStorage.setItem(getWorkspaceStorageKey(STORAGE_KEYS.GROUPS, activeProperty), JSON.stringify(groupEvents));
    } catch (e) {
      console.error(e);
    }
  }, [properties, activeProperty, rooms, reservations, guests, metrics, housekeeping, maintenance, tables, alerts, channels, automationRules, serviceRequests, messageThreads, groupEvents]);

  const setCurrentDate = (date: string) => {
    setCurrentDateState(date);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_DATE, date);
    } catch (e) {
      console.error(e);
    }
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    } catch (e) {
      console.error(e);
    }
  };

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, curr);
    } catch (e) {
      console.error(e);
    }
  };

  const setActiveProperty = (prop: string) => {
    if (!properties.some(property => property.name === prop) || prop === activeProperty) return;
    try {
      const workspaceData: Record<string, unknown> = {
        [STORAGE_KEYS.ROOMS]: rooms,
        [STORAGE_KEYS.RESERVATIONS]: reservations,
        [STORAGE_KEYS.GUESTS]: guests,
        [STORAGE_KEYS.METRICS]: metrics,
        [STORAGE_KEYS.HOUSEKEEPING]: housekeeping,
        [STORAGE_KEYS.MAINTENANCE]: maintenance,
        [STORAGE_KEYS.TABLES]: tables,
        [STORAGE_KEYS.ALERTS]: alerts,
        [STORAGE_KEYS.CHANNELS]: channels,
        [STORAGE_KEYS.AUTOMATIONS]: automationRules,
        [STORAGE_KEYS.SERVICES]: serviceRequests,
        [STORAGE_KEYS.MESSAGES]: messageThreads,
        [STORAGE_KEYS.GROUPS]: groupEvents
      };
      Object.entries(workspaceData).forEach(([key, value]) => {
        localStorage.setItem(getWorkspaceStorageKey(key, activeProperty), JSON.stringify(value));
      });
      localStorage.setItem(STORAGE_KEYS.PROPERTY, prop);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const addProperty = ({ name, location, roomCount }: { name: string; location: string; roomCount: number }) => {
    const normalizedName = name.trim();
    const normalizedLocation = location.trim();
    if (!normalizedName) throw new Error('Enter a hotel or property name.');
    if (!normalizedLocation) throw new Error('Enter a city or destination.');
    if (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > 250) {
      throw new Error('Choose a room count between 1 and 250.');
    }
    if (properties.some(property =>
      property.name.toLowerCase() === normalizedName.toLowerCase() ||
      slugifyProperty(property.name) === slugifyProperty(normalizedName)
    )) {
      throw new Error('A hotel with this name already exists in your portfolio.');
    }

    const slug = `${slugifyProperty(normalizedName)}-${Date.now().toString(36)}`;
    const newProperty: HotelProperty = {
      id: slug,
      name: normalizedName,
      location: normalizedLocation,
      roomCount,
      createdAt: new Date().toISOString()
    };
    const propertyRooms = Array.from({ length: roomCount }, (_, index) => {
      const template = INITIAL_ROOMS[index % INITIAL_ROOMS.length];
      const floor = Math.floor(index / 20) + 1;
      const number = `${floor}${String((index % 20) + 1).padStart(2, '0')}`;
      return {
        ...template,
        id: `${slug}-${number}`,
        number,
        name: `${template.type} ${number}`,
        floor,
        view: `${normalizedLocation} outlook`,
        status: 'clean' as const,
        housekeepingNotes: undefined,
        assignedStaff: undefined
      };
    });
    const cleanTables = INITIAL_TABLES.map(table => ({
      ...table,
      status: 'available' as const,
      activeReservationId: undefined,
      currentGuestName: undefined,
      serverName: undefined
    }));
    const newProperties = [...properties, newProperty];

    try {
      const newWorkspaceData: Record<string, unknown> = {
        [STORAGE_KEYS.ROOMS]: propertyRooms,
        [STORAGE_KEYS.RESERVATIONS]: [],
        [STORAGE_KEYS.GUESTS]: [],
        [STORAGE_KEYS.METRICS]: [],
        [STORAGE_KEYS.HOUSEKEEPING]: [],
        [STORAGE_KEYS.MAINTENANCE]: [],
        [STORAGE_KEYS.TABLES]: cleanTables,
        [STORAGE_KEYS.ALERTS]: [],
        [STORAGE_KEYS.CHANNELS]: [],
        [STORAGE_KEYS.AUTOMATIONS]: INITIAL_AUTOMATION_RULES.map(rule => ({ ...rule, actions: [...rule.actions] })),
        [STORAGE_KEYS.SERVICES]: [],
        [STORAGE_KEYS.MESSAGES]: [],
        [STORAGE_KEYS.GROUPS]: []
      };
      Object.entries(newWorkspaceData).forEach(([key, value]) => {
        localStorage.setItem(getWorkspaceStorageKey(key, normalizedName), JSON.stringify(value));
      });
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(newProperties));
      localStorage.setItem(STORAGE_KEYS.PROPERTY, normalizedName);
      setProperties(newProperties);
      setActivePropertyState(normalizedName);
      window.location.reload();
    } catch (error) {
      console.error('Unable to create hotel workspace:', error);
      throw error;
    }
  };

  const convertPrice = (amountUSD: number): number => {
    const rateInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    return Math.round(amountUSD * rateInfo.rate);
  };

  const formatCurrency = (amountUSD: number): string => {
    const rateInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = amountUSD * rateInfo.rate;
    const formattedNum = converted.toLocaleString(undefined, {
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2
    });
    return rateInfo.prefix ? `${rateInfo.symbol}${formattedNum}` : `${formattedNum}${rateInfo.symbol}`;
  };

  const addAlert = (alert: Omit<ActivityAlert, 'id' | 'timestamp'>) => {
    const newAlert: ActivityAlert = {
      ...alert,
      id: `ALT-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: true
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 24)]);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const updateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
    const room = rooms.find(r => r.id === roomId);
    addAlert({
      type: 'housekeeping',
      severity: 'info',
      title: `Suite ${room?.number || roomId} Status Updated`,
      description: `Room status changed to ${status.replace('_', ' ').toUpperCase()}.`
    });
  };

  const updateRoomRestrictions = (roomId: string, updates: { cta?: boolean; ctd?: boolean; minStayNights?: number; isBlocked?: boolean; blockReason?: string }) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, ...updates } : r));
    addAlert({
      type: 'exception',
      severity: 'info',
      title: `Inventory Restrictions Updated`,
      description: `Updated availability & minimum stay rules for Room ${roomId}.`
    });
  };

  const createReservation = (data: Partial<Reservation>): Reservation => {
    const resId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const room = rooms.find(r => r.id === data.roomId) || rooms[0];
    
    let guestId = data.guestId;
    let guestName = data.guestName || 'Guest';
    let guestEmail = data.guestEmail || 'guest@example.com';
    let guestPhone = data.guestPhone || '+1 555-0100';

    if (!guestId) {
      const existing = guests.find(g => g.email.toLowerCase() === guestEmail.toLowerCase());
      if (existing) {
        guestId = existing.id;
        guestName = existing.fullName;
      } else {
        const newGuest = saveGuestProfile({
          fullName: guestName,
          email: guestEmail,
          phone: guestPhone,
          country: data.guestCountry || 'United States',
          vipTier: data.vipTier || 'Standard',
          totalStays: 1,
          totalSpend: data.totalAmount || 0,
          loyaltyPoints: Math.round((data.totalAmount || 500) * 5),
          tags: ['New Direct Guest'],
          internalNotes: 'Created via direct reservation engine.'
        });
        guestId = newGuest.id;
      }
    }

    const checkIn = data.checkInDate || currentDate;
    const checkOut = data.checkOutDate || '2026-05-18';
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    
    const roomCharge = (data.totalAmount ? data.totalAmount * 0.9 : room.seasonalPrice * nights);
    const taxAmount = Math.round(roomCharge * 0.05);
    const total = roomCharge + taxAmount + (data.selectedAddOns?.length || 0) * 120;
    const paid = data.paidAmount !== undefined ? data.paidAmount : (data.paymentStatus === 'paid' ? total : total * 0.5);

    const initialFolio: FolioItem[] = [
      {
        id: `FOL-${Date.now()}-1`,
        folioType: 'Folio A (Guest Personal)',
        category: 'Room Charge',
        description: `${room.name} (${nights} nights @ $${room.seasonalPrice}/nt)`,
        amount: roomCharge,
        date: checkIn,
        time: '14:00',
        postedBy: 'Booking Engine',
        taxRate: 5
      },
      {
        id: `FOL-${Date.now()}-2`,
        folioType: 'Folio A (Guest Personal)',
        category: 'Tax & Tourism Levy',
        description: 'Boutique Conservation & Tourism Levy (5%)',
        amount: taxAmount,
        date: checkIn,
        time: '14:00',
        postedBy: 'System Auto-Post'
      }
    ];

    if (paid > 0) {
      initialFolio.push({
        id: `FOL-${Date.now()}-3`,
        folioType: 'Folio A (Guest Personal)',
        category: 'Payment / Deposit',
        description: `Advance Deposit Payment (${data.paymentStatus === 'paid' ? 'Full Guarantee' : '50% Hold Deposit'})`,
        amount: -paid,
        date: checkIn,
        time: '14:05',
        postedBy: 'Payment Gateway',
        paymentMethod: 'Card'
      });
    }

    const newRes: Reservation = {
      id: resId,
      guestId: guestId || `G-${Date.now()}`,
      guestName: guestName,
      guestEmail: guestEmail,
      guestPhone: guestPhone,
      guestCountry: data.guestCountry || 'International',
      roomId: room.id,
      roomNumber: room.number,
      roomType: room.type,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      numGuests: data.numGuests || 2,
      status: data.status || 'confirmed',
      channel: data.channel || 'Direct Web',
      totalAmount: total,
      paidAmount: paid,
      paymentStatus: paid >= total ? 'paid' : (paid > 0 ? 'partial' : 'pending'),
      specialRequests: data.specialRequests || '',
      estimatedArrivalTime: data.estimatedArrivalTime || '15:00',
      vipTier: data.vipTier || 'Standard',
      selectedAddOns: data.selectedAddOns || [],
      folio: initialFolio,
      digitalKeyIssued: false,
      isPreRegistered: false,
      regCardSigned: false,
      notes: data.notes || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReservations(prev => [newRes, ...prev]);

    addAlert({
      type: 'booking',
      severity: 'info',
      title: 'New Reservation Confirmed',
      description: `${newRes.guestName} booked ${room.name} (${nights} nights, $${total.toLocaleString()}).`
    });

    return newRes;
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const checkInGuest = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    updateReservation(resId, {
      status: 'checked_in',
      digitalKeyIssued: true,
      regCardSigned: true
    });

    setRooms(prev => prev.map(r => r.id === res.roomId ? { ...r, status: 'clean' } : r));

    addAlert({
      type: 'checkin',
      severity: 'info',
      title: 'Guest Checked In',
      description: `${res.guestName} checked into ${res.roomType} (${res.roomNumber}). Digital key & registration verified.`
    });
  };

  const submitDigitalCheckIn = (resId: string, details: { idVerified?: boolean; signed?: boolean; eta?: string; flight?: string }) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    updateReservation(resId, {
      isPreRegistered: true,
      regCardSigned: details.signed ?? true,
      estimatedArrivalTime: details.eta || res.estimatedArrivalTime,
      flightNumber: details.flight || res.flightNumber
    });

    addAlert({
      type: 'checkin',
      severity: 'info',
      title: 'Pre-Arrival Digital Check-In Completed',
      description: `${res.guestName} completed passport scan, ETA ${details.eta || '15:00'}, and digital registration card.`
    });
  };

  const checkOutGuest = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    updateReservation(resId, {
      status: 'checked_out',
      digitalKeyIssued: false
    });

    setRooms(prev => prev.map(r => r.id === res.roomId ? { ...r, status: 'dirty' } : r));

    addHousekeepingTask({
      roomId: res.roomId,
      roomNumber: res.roomNumber,
      roomType: res.roomType,
      type: 'Full Turn',
      status: 'pending',
      assignedTo: 'Elena Vasquez',
      priority: 'High',
      estimatedMinutes: 45,
      notes: `Departure turn following checkout of ${res.guestName}.`
    });

    addAlert({
      type: 'checkout',
      severity: 'info',
      title: 'Guest Checked Out',
      description: `${res.guestName} departed Suite ${res.roomNumber}. Housekeeping full turn dispatched.`
    });
  };

  const cancelReservation = (resId: string) => {
    updateReservation(resId, { status: 'cancelled' });
    addAlert({
      type: 'booking',
      severity: 'warning',
      title: 'Reservation Cancelled',
      description: `Reservation ${resId} was cancelled.`
    });
  };

  const addFolioItem = (resId: string, item: Omit<FolioItem, 'id' | 'date' | 'time'>) => {
    const newItem: FolioItem = {
      ...item,
      folioType: item.folioType || 'Folio A (Guest Personal)',
      id: `FOL-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      date: currentDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setReservations(prev => prev.map(r => {
      if (r.id === resId) {
        const updatedFolio = [...r.folio, newItem];
        const newTotal = updatedFolio
          .filter(f => f.category !== 'Payment / Deposit' && f.category !== 'Discount / Credit')
          .reduce((sum, f) => sum + f.amount, 0);
        
        const newPaid = updatedFolio
          .filter(f => f.category === 'Payment / Deposit')
          .reduce((sum, f) => sum + Math.abs(f.amount), 0);

        return {
          ...r,
          folio: updatedFolio,
          totalAmount: newTotal,
          paidAmount: newPaid,
          paymentStatus: newPaid >= newTotal ? 'paid' : (newPaid > 0 ? 'partial' : 'pending')
        };
      }
      return r;
    }));

    addAlert({
      type: 'pos',
      severity: 'info',
      title: 'Folio Charge Posted',
      description: `$${Math.abs(item.amount).toFixed(2)} (${item.description}) posted to ${item.folioType || 'Folio A'}.`
    });
  };

  const transferFolioItem = (resId: string, itemId: string, targetFolio: FolioType) => {
    setReservations(prev => prev.map(r => {
      if (r.id === resId) {
        return {
          ...r,
          folio: r.folio.map(f => f.id === itemId ? { ...f, folioType: targetFolio } : f)
        };
      }
      return r;
    }));

    addAlert({
      type: 'pos',
      severity: 'info',
      title: 'Folio Item Transferred',
      description: `Item re-routed to ${targetFolio}.`
    });
  };

  const settleFolio = (resId: string, amount: number, method: FolioItem['paymentMethod'] = 'Card', folioType: FolioType = 'Folio A (Guest Personal)') => {
    addFolioItem(resId, {
      folioType,
      category: 'Payment / Deposit',
      description: `Folio Settlement Payment (${method})`,
      amount: -Math.abs(amount),
      postedBy: 'Front Desk Cashier',
      paymentMethod: method
    });
  };

  const updateHousekeepingStatus = (taskId: string, status: HousekeepingTask['status']) => {
    setHousekeeping(prev => prev.map(t => {
      if (t.id === taskId) {
        const isComp = status === 'completed';
        if (isComp) {
          setRooms(rPrev => rPrev.map(r => r.id === t.roomId ? { ...r, status: 'clean' } : r));
        } else if (status === 'inspected') {
          setRooms(rPrev => rPrev.map(r => r.id === t.roomId ? { ...r, status: 'inspecting' } : r));
        }
        return {
          ...t,
          status,
          completedAt: isComp ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t.completedAt
        };
      }
      return t;
    }));
  };

  const addHousekeepingTask = (task: Omit<HousekeepingTask, 'id'>) => {
    const newTask: HousekeepingTask = {
      ...task,
      id: `HK-${Date.now()}`
    };
    setHousekeeping(prev => [newTask, ...prev]);
  };

  const createMaintenanceTicket = (ticket: Omit<MaintenanceTicket, 'id' | 'reportedAt'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `MNT-${Math.floor(100 + Math.random() * 900)}`,
      reportedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
    setMaintenance(prev => [newTicket, ...prev]);
    
    setRooms(prev => prev.map(r => r.id === ticket.roomId ? { ...r, status: 'maintenance' } : r));

    addAlert({
      type: 'maintenance',
      severity: ticket.priority === 'Emergency' ? 'critical' : 'warning',
      title: 'New Maintenance Work Order',
      description: `${ticket.category} issue logged for Suite ${ticket.roomNumber}.`
    });
  };

  const resolveMaintenanceTicket = (ticketId: string, notes?: string) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id === ticketId) {
        setRooms(rPrev => rPrev.map(r => r.id === m.roomId ? { ...r, status: 'clean' } : r));
        return {
          ...m,
          status: 'resolved',
          resolutionNotes: notes || 'Resolved and verified by lead engineer.'
        };
      }
      return m;
    }));

    addAlert({
      type: 'maintenance',
      severity: 'info',
      title: 'Work Order Resolved',
      description: `Maintenance ticket ${ticketId} resolved successfully.`
    });
  };

  const updateTableStatus = (tableId: string, status: RestaurantTable['status'], guestName?: string) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status, currentGuestName: guestName || t.currentGuestName } : t));
  };

  const addServiceRequest = (req: Omit<ServiceRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newReq: ServiceRequest = {
      ...req,
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      status: 'received',
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setServiceRequests(prev => [newReq, ...prev]);
    addAlert({
      type: 'vip',
      severity: 'info',
      title: `Guest Service Request (${req.category})`,
      description: `Suite ${req.roomNumber} (${req.guestName}) requested: ${req.item}`
    });
  };

  const updateServiceRequestStatus = (reqId: string, status: ServiceRequest['status']) => {
    setServiceRequests(prev => prev.map(s => s.id === reqId ? { ...s, status } : s));
  };

  const saveGuestProfile = (guestData: Partial<GuestProfile>): GuestProfile => {
    let saved: GuestProfile;
    if (guestData.id && guests.some(g => g.id === guestData.id)) {
      saved = {
        ...guests.find(g => g.id === guestData.id)!,
        ...guestData
      } as GuestProfile;
      setGuests(prev => prev.map(g => g.id === saved.id ? saved : g));
    } else {
      saved = {
        id: `G${Math.floor(100 + Math.random() * 900)}`,
        fullName: guestData.fullName || 'New Guest',
        email: guestData.email || '',
        phone: guestData.phone || '',
        country: guestData.country || 'United States',
        avatar: guestData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        vipTier: guestData.vipTier || 'Standard',
        loyaltyPoints: guestData.loyaltyPoints || 500,
        totalStays: guestData.totalStays || 1,
        totalSpend: guestData.totalSpend || 0,
        dietaryRestrictions: guestData.dietaryRestrictions || [],
        pillowPreference: guestData.pillowPreference || 'Standard feather',
        roomTemperatureC: guestData.roomTemperatureC || 20.0,
        favoriteDrinks: guestData.favoriteDrinks || [],
        tags: guestData.tags || ['Direct Guest'],
        internalNotes: guestData.internalNotes || '',
        lastVisit: currentDate
      };
      setGuests(prev => [saved, ...prev]);
    }
    return saved;
  };

  const awardLoyaltyPoints = (guestId: string, points: number) => {
    setGuests(prev => prev.map(g => {
      if (g.id === guestId) {
        const newPoints = g.loyaltyPoints + points;
        let newTier = g.vipTier;
        if (newPoints >= 25000) newTier = 'Black Diamond VIP';
        else if (newPoints >= 10000) newTier = 'Gold';
        else if (newPoints >= 4000) newTier = 'Silver';

        return { ...g, loyaltyPoints: newPoints, vipTier: newTier };
      }
      return g;
    }));
  };

  const sendGuestMessage = (threadId: string, content: string, sender: 'hotel' | 'guest' | 'system' = 'hotel') => {
    const newMsg: { id: string; sender: 'hotel' | 'guest' | 'system'; senderName: string; channel: 'Portal Chat' | 'WhatsApp' | 'SMS' | 'OTA' | 'Email'; content: string; timestamp: string; read: boolean } = {
      id: `M-${Date.now()}`,
      sender,
      senderName: sender === 'hotel' ? 'Azure Sanctuary Concierge' : 'Guest',
      channel: 'Portal Chat',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setMessageThreads(prev => prev.map(th => {
      if (th.id === threadId) {
        return {
          ...th,
          lastMessage: content,
          lastMessageTime: newMsg.timestamp,
          messages: [...th.messages, newMsg]
        };
      }
      return th;
    }));
  };

  const updateChannelPrice = (channelId: string, newPrice: number) => {
    setChannels(prev => prev.map(ch => ch.id === channelId ? { ...ch, currentOtaPrice: newPrice } : ch));
  };

  const resolveParityViolation = (channelId: string) => {
    setChannels(prev => prev.map(ch => ch.id === channelId ? { ...ch, currentOtaPrice: ch.directPrice, parityStatus: 'in_parity' } : ch));
    addAlert({
      type: 'rate_parity',
      severity: 'info',
      title: 'Rate Parity Restored',
      description: `Synchronized channel rate with Direct BAR Best Rate Guarantee.`
    });
  };

  const toggleChannelStatus = (channelId: string) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        const nextStatus = ch.status === 'connected' ? 'paused' : 'connected';
        return { ...ch, status: nextStatus };
      }
      return ch;
    }));
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  };

  const runAutomationRule = (ruleId: string) => {
    const rule = automationRules.find(r => r.id === ruleId);
    if (!rule) return;

    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { 
      ...r, 
      lastExecuted: `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      executionCount: r.executionCount + 1
    } : r));

    addAlert({
      type: 'exception',
      severity: 'info',
      title: `Automation Executed: ${rule.name}`,
      description: `Trigger executed: ${rule.actions[0]}`
    });
  };

  const addGroupEvent = (event: Omit<GroupEvent, 'id'>) => {
    const newEvent: GroupEvent = {
      ...event,
      id: `GRP-${Date.now()}`
    };
    setGroupEvents(prev => [newEvent, ...prev]);
    addAlert({
      type: 'booking',
      severity: 'info',
      title: 'Group Event Contract Created',
      description: `${event.groupName} (${event.roomsBlocked} rooms, $${event.totalContractValue.toLocaleString()}).`
    });
  };

  const updateGroupEvent = (id: string, updates: Partial<GroupEvent>) => {
    setGroupEvents(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const openNewReservationModal = (defaults?: Partial<Reservation>) => {
    setNewReservationDefaults(defaults || null);
    setIsNewReservationModalOpen(true);
  };

  const closeNewReservationModal = () => {
    setIsNewReservationModalOpen(false);
    setNewReservationDefaults(null);
  };

  const openFolioModal = (res: Reservation) => {
    setActiveFolioReservation(res);
    setIsFolioModalOpen(true);
  };

  const closeFolioModal = () => {
    setIsFolioModalOpen(false);
    setActiveFolioReservation(null);
  };

  const openDigitalKeyModal = (res: Reservation) => {
    setActiveDigitalKeyReservation(res);
    setIsDigitalKeyModalOpen(true);
  };

  const closeDigitalKeyModal = () => {
    setIsDigitalKeyModalOpen(false);
    setActiveDigitalKeyReservation(null);
  };

  const openDigitalCheckInModal = (res: Reservation) => {
    setActiveCheckInReservation(res);
    setIsDigitalCheckInModalOpen(true);
  };

  const closeDigitalCheckInModal = () => {
    setIsDigitalCheckInModalOpen(false);
    setActiveCheckInReservation(null);
  };

  const resetToDemoData = () => {
    setRooms(INITIAL_ROOMS);
    setReservations(INITIAL_RESERVATIONS);
    setGuests(INITIAL_GUESTS);
    setMetrics(METRICS_DATA);
    setHousekeeping(INITIAL_HOUSEKEEPING_TASKS);
    setMaintenance(INITIAL_MAINTENANCE);
    setTables(INITIAL_TABLES);
    setAlerts(INITIAL_ALERTS);
    setChannels(INITIAL_CHANNELS);
    setAutomationRules(INITIAL_AUTOMATION_RULES);
    setServiceRequests(INITIAL_SERVICE_REQUESTS);
    setMessageThreads(INITIAL_MESSAGE_THREADS);
    setGroupEvents(INITIAL_GROUP_EVENTS);
    setCurrentDate('2026-05-15');
    setCurrencyState('USD');
    setUserRoleState('General Manager');
    addAlert({
      type: 'booking',
      severity: 'info',
      title: 'Demo Data Reset',
      description: 'The resort hospitality system has been refreshed with pristine luxury demo records.'
    });
  };

  // Operational metrics
  const todayArrivals = reservations.filter(r => r.checkInDate === currentDate && r.status !== 'cancelled');
  const todayDepartures = reservations.filter(r => r.checkOutDate === currentDate && r.status !== 'cancelled');
  const todayInHouse = reservations.filter(r => {
    if (r.status !== 'checked_in') return false;
    const inDate = new Date(r.checkInDate);
    const outDate = new Date(r.checkOutDate);
    const cur = new Date(currentDate);
    return cur >= inDate && cur <= outDate;
  });

  const occupancyRate = rooms.length
    ? Math.min(100, Math.round((todayInHouse.length / rooms.length) * 100))
    : 0;
  const todayMetric = metrics.find(metric => metric.date === currentDate);
  const todayRevenue = todayMetric
    ? todayMetric.totalRoomRevenue + todayMetric.totalFBRevenue + todayMetric.totalSpaRevenue + todayMetric.totalExcursionsRevenue
    : 0;

  return (
    <HotelContext.Provider
      value={{
        properties,
        rooms,
        reservations,
        guests,
        addOns: INITIAL_ADDONS,
        menu: INITIAL_MENU,
        tables,
        housekeeping,
        maintenance,
        metrics,
        alerts,
        channels,
        automationRules,
        serviceRequests,
        messageThreads,
        groupEvents,

        currentDate,
        activeView,
        userRole,
        currency,
        activeProperty,

        isNewReservationModalOpen,
        newReservationDefaults,
        isFolioModalOpen,
        activeFolioReservation,
        isDigitalKeyModalOpen,
        activeDigitalKeyReservation,
        isDigitalCheckInModalOpen,
        activeCheckInReservation,
        selectedGuestForDrawer,
        
        setActiveView,
        setUserRole,
        setCurrency,
        setActiveProperty,
        addProperty,
        setCurrentDate,

        createReservation,
        updateReservation,
        checkInGuest,
        checkOutGuest,
        cancelReservation,
        submitDigitalCheckIn,
        updateRoomStatus,
        updateRoomRestrictions,
        addFolioItem,
        transferFolioItem,
        settleFolio,
        updateHousekeepingStatus,
        addHousekeepingTask,
        createMaintenanceTicket,
        resolveMaintenanceTicket,
        updateTableStatus,
        addServiceRequest,
        updateServiceRequestStatus,
        saveGuestProfile,
        awardLoyaltyPoints,
        sendGuestMessage,
        updateChannelPrice,
        resolveParityViolation,
        toggleChannelStatus,
        toggleAutomationRule,
        runAutomationRule,
        addGroupEvent,
        updateGroupEvent,
        addAlert,
        dismissAlert,

        openNewReservationModal,
        closeNewReservationModal,
        openFolioModal,
        closeFolioModal,
        openDigitalKeyModal,
        closeDigitalKeyModal,
        openDigitalCheckInModal,
        closeDigitalCheckInModal,
        setSelectedGuestForDrawer,
        resetToDemoData,

        formatCurrency,
        convertPrice,

        todayArrivals,
        todayDepartures,
        todayInHouse,
        occupancyRate,
        todayRevenue
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};

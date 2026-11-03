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
  ChannelItem,
  AutomationRule,
  ServiceRequest,
  MessageThread,
  GroupEvent
} from '../types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'R101',
    number: '101',
    name: 'The Acacia Bower',
    type: 'Cliffside Pavilion',
    floor: 1,
    basePrice: 480,
    seasonalPrice: 620,
    maxGuests: 2,
    bedConfig: '1 King Bed',
    sizeSqM: 65,
    view: 'Panoramic Ocean & Canopy',
    amenities: ['Private Heated Plunge Pool', 'Outdoor Rain Shower', 'Fireplace', 'Bang & Olufsen Audio', 'Espresso Bar', 'Dyson Supersonic'],
    features: ['Sunset facing terrace', 'Direct private path to cove', 'Freestanding copper tub'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'clean',
    housekeepingNotes: 'Turned over and inspected. Fresh eucalyptus in steam room.',
    assignedStaff: 'Elena V.'
  },
  {
    id: 'R102',
    number: '102',
    name: 'The Baobab Sanctuary',
    type: 'Cliffside Pavilion',
    floor: 1,
    basePrice: 520,
    seasonalPrice: 680,
    maxGuests: 2,
    bedConfig: '1 King Bed',
    sizeSqM: 70,
    view: 'Cliff Edge & Coastal Horizon',
    amenities: ['Infinity Edge Dipping Pool', 'Outdoor Star Bed', 'Walk-in Wine Cellar', 'Custom Linens 800TC', 'Sonos Soundscape'],
    features: ['Cantilevered glass balcony', 'Telescope on deck', 'Artisan ceramic vanity'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'clean',
    housekeepingNotes: 'Ready for VIP check-in.',
    assignedStaff: 'Elena V.'
  },
  {
    id: 'R103',
    number: '103',
    name: 'Palmetto Palms Villa',
    type: 'Garden Pool Villa',
    floor: 1,
    basePrice: 750,
    seasonalPrice: 940,
    maxGuests: 4,
    bedConfig: '2 King Suites',
    sizeSqM: 120,
    view: 'Private Tropical Botanical Garden',
    amenities: ['12m Heated Lap Pool', 'Al Fresco Dining Pavilion', 'Outdoor Kitchen & Braai', 'Dedicated Butler Service', 'Sub-Zero Pantry'],
    features: ['Walled botanical courtyard', 'Private herb garden', 'Dual master baths'],
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'clean',
    housekeepingNotes: 'Pool treated this morning.',
    assignedStaff: 'Kofi M.'
  },
  {
    id: 'R104',
    number: '104',
    name: 'The Orchid Glade',
    type: 'Garden Pool Villa',
    floor: 1,
    basePrice: 780,
    seasonalPrice: 990,
    maxGuests: 4,
    bedConfig: '1 King + 2 Queen Twins',
    sizeSqM: 125,
    view: 'Lush Forest Stream & Orchid House',
    amenities: ['Private Mineral Springs Pool', 'Yoga Deck', 'Fire Pit Lounge', 'Chef Induction Range', 'Smart Lighting presets'],
    features: ['Zen fountain garden', 'Indoor/outdoor living walls', 'Aromatherapy shower'],
    images: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'dirty',
    housekeepingNotes: 'Guest departed 10:45 AM. Scheduled full linen turn.',
    assignedStaff: 'Kofi M.'
  },
  {
    id: 'R201',
    number: '201',
    name: 'The Celeste Penthouse',
    type: 'Azure Penthouse',
    floor: 2,
    basePrice: 1350,
    seasonalPrice: 1780,
    maxGuests: 4,
    bedConfig: '2 Super King Master Suites',
    sizeSqM: 190,
    view: '360° Ocean, Headland & Mountain Vista',
    amenities: ['Rooftop Hydrotherapy Pool', 'Private Sommelier Wine Vault', 'Bespoke Cocktail Bar', 'Sauna & Steam Suite', 'Chauffeured EV'],
    features: ['Wrap-around sky deck', 'Retractable glass roof over bed', 'Grand piano lounge'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'clean',
    housekeepingNotes: 'Champagne stocked at 8°C. White orchids placed.',
    assignedStaff: 'Sofia R.'
  },
  {
    id: 'R202',
    number: '202',
    name: 'The Solstice Loft',
    type: 'Azure Penthouse',
    floor: 2,
    basePrice: 1200,
    seasonalPrice: 1550,
    maxGuests: 3,
    bedConfig: '1 King + 1 Daybed Suite',
    sizeSqM: 160,
    view: 'Panoramic Sunken Bay & Lighthouse',
    amenities: ['Stargazer Whirlpool Spa', 'Vinyl Library & McIntosh Hi-Fi', 'Private Tasting Nook', 'Double Marble Vanity'],
    features: ['Double-height lofted ceilings', 'Exposed cedar beams', 'Private elevator access'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'inspecting',
    housekeepingNotes: 'Supervisor final inspection in progress.',
    assignedStaff: 'Sofia R.'
  },
  {
    id: 'R301',
    number: '301',
    name: 'The Coral Tide',
    type: 'Oceanfront Bungalow',
    floor: 1,
    basePrice: 620,
    seasonalPrice: 820,
    maxGuests: 2,
    bedConfig: '1 King Bed',
    sizeSqM: 85,
    view: 'Direct Turquoise Reef & White Sand',
    amenities: ['Private Beach Boardwalk', 'Reef Snorkel Kit & Kayak', 'Hammock Perch', 'Subtropical Outdoor Spa'],
    features: ['Direct sand step-down', 'Outdoor driftwood bathtub', 'Handcrafted teak furnishings'],
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'clean',
    assignedStaff: 'Lucas T.'
  },
  {
    id: 'R302',
    number: '302',
    name: 'The Nautilus Haven',
    type: 'Oceanfront Bungalow',
    floor: 1,
    basePrice: 650,
    seasonalPrice: 850,
    maxGuests: 3,
    bedConfig: '1 King + 1 Rollaway',
    sizeSqM: 90,
    view: 'Crashing Waves & Sunset Cove',
    amenities: ['Private Saltwater Jacuzzi', 'Paddleboards', 'Beach Fire Pit', 'Custom Artisanal Minibar'],
    features: ['Wave-watching daybed', 'Coral stone fireplace', 'Linen canopy bed'],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'clean',
    assignedStaff: 'Lucas T.'
  },
  {
    id: 'R401',
    number: '401',
    name: 'The Jasmine Cloister',
    type: 'Heritage Courtyard Suite',
    floor: 1,
    basePrice: 420,
    seasonalPrice: 560,
    maxGuests: 2,
    bedConfig: '1 Queen Canopy Bed',
    sizeSqM: 55,
    view: 'Historic Fountain & Jasmine Arches',
    amenities: ['Heated Terracotta Floors', 'Clawfoot Soaking Tub', 'French Press & Rare Teas', 'Library Nook'],
    features: ['Private stone courtyard', 'Antique Persian rugs', 'Handmade brass fixtures'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'clean',
    assignedStaff: 'Elena V.'
  },
  {
    id: 'R402',
    number: '402',
    name: 'The Olive Grove Suite',
    type: 'Heritage Courtyard Suite',
    floor: 1,
    basePrice: 440,
    seasonalPrice: 590,
    maxGuests: 2,
    bedConfig: '1 King Bed',
    sizeSqM: 60,
    view: 'Century-Old Olive Trees & Herb Garden',
    amenities: ['Sunken Reading Lounge', 'Rainfall Glass Shower', 'Curated Art Collection', 'Acoustic Record Player'],
    features: ['Hand-plastered lime walls', 'Sunlit breakfast patio', 'Wrought iron gates'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'maintenance',
    housekeepingNotes: 'HVAC filter replacement underway. Available at 4:00 PM.',
    assignedStaff: 'Marcus P.'
  },
  {
    id: 'R501',
    number: '501',
    name: 'The Polaris Deck',
    type: 'Sunset Star Deck Suite',
    floor: 2,
    basePrice: 890,
    seasonalPrice: 1150,
    maxGuests: 2,
    bedConfig: '1 Celestial King Star Bed',
    sizeSqM: 105,
    view: 'Unobstructed Night Sky & Coastal Ridge',
    amenities: ['Motorized Roll-Out Star Bed', 'Private Cedar Sauna', 'Astrometry Guide & Laser', 'Champagne Cooler'],
    features: ['Open-air sleeping terrace', 'Double sun loungers', 'Bespoke fire table'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'clean',
    assignedStaff: 'Sofia R.'
  },
  {
    id: 'R502',
    number: '502',
    name: 'The Orion Vista',
    type: 'Sunset Star Deck Suite',
    floor: 2,
    basePrice: 920,
    seasonalPrice: 1190,
    maxGuests: 2,
    bedConfig: '1 King Bed + Open Sky Lounge',
    sizeSqM: 110,
    view: 'Western Horizon Sunset & Constellations',
    amenities: ['Private Infinity Jacuzzi', 'Deep Soaking Slate Tub', 'Curated Gin Bar', 'Stargazing Nightcap Service'],
    features: ['Dual level observation deck', 'Heated stone benches', 'Custom cashmere throws'],
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200&auto=format&fit=crop'
    ],
    status: 'clean',
    assignedStaff: 'Sofia R.'
  }
];

export const INITIAL_GUESTS: GuestProfile[] = [
  {
    id: 'G101',
    fullName: 'Victoria Sterling',
    email: 'v.sterling@heritage-assets.co.uk',
    phone: '+44 7700 900142',
    country: 'United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    vipTier: 'Black Diamond VIP',
    loyaltyPoints: 34500,
    totalStays: 7,
    totalSpend: 24850,
    dietaryRestrictions: ['Pescatarian', 'Dairy Free'],
    pillowPreference: 'Goose down firm + silk sleep mask',
    roomTemperatureC: 19.5,
    favoriteDrinks: ['Dom Pérignon 2012', 'Botanical Gin & Tonic (Fever Tree)'],
    allergies: ['Shellfish', 'Echinacea'],
    anniversaryDate: '2026-05-18',
    tags: ['VIP Top Tier', 'Prefers Quiet Zone', 'Spa Enthusiast', 'Wine Collector'],
    internalNotes: 'Prefers greeting by General Manager upon arrival. Enjoys early morning private yoga on deck.',
    lastVisit: '2025-11-14'
  },
  {
    id: 'G102',
    fullName: 'Julian & Mateo Rossi',
    email: 'j.rossi@architettura-milano.it',
    phone: '+39 02 8820 411',
    country: 'Italy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    vipTier: 'Gold',
    loyaltyPoints: 18200,
    totalStays: 4,
    totalSpend: 14200,
    dietaryRestrictions: ['Vegetarian'],
    pillowPreference: 'Memory foam contour',
    roomTemperatureC: 20.0,
    favoriteDrinks: ['Negroni Sbagliato', 'Sparkling San Pellegrino'],
    tags: ['Architectural Enthusiast', 'Food & Wine Lover', 'Honeymoon'],
    internalNotes: 'Celebrating 5th anniversary. Requested fresh wildflowers in suite.',
    lastVisit: '2026-01-20'
  },
  {
    id: 'G103',
    fullName: 'Dr. Alistair & Claire Vance',
    email: 'avance@stanford.edu',
    phone: '+1 415 555 0198',
    country: 'United States',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    vipTier: 'Silver',
    loyaltyPoints: 9400,
    totalStays: 2,
    totalSpend: 8600,
    dietaryRestrictions: ['Gluten Free'],
    pillowPreference: 'Hypoallergenic organic buckwheat',
    roomTemperatureC: 19.0,
    favoriteDrinks: ['Espresso double shot', 'Barolo 2018'],
    tags: ['Repeat Guest', 'Early Riser', 'Bird Watching'],
    internalNotes: 'Always books the Dawn Nature Walk with Senior Naturalist.',
    lastVisit: '2025-08-10'
  },
  {
    id: 'G104',
    fullName: 'Yuki & Kenzo Takahashi',
    email: 'yuki.takahashi@tokyomedia.jp',
    phone: '+81 90 1234 5678',
    country: 'Japan',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    vipTier: 'Gold',
    loyaltyPoints: 15600,
    totalStays: 3,
    totalSpend: 11900,
    dietaryRestrictions: ['No cilantro'],
    pillowPreference: 'Feather soft',
    roomTemperatureC: 21.0,
    favoriteDrinks: ['Sencha Green Tea', 'Japanese Whiskey Highball'],
    tags: ['Photography', 'Sunset Deck Preference', 'Quiet'],
    internalNotes: 'Requested early 6:00 AM breakfast setup on veranda.',
    lastVisit: '2025-10-02'
  },
  {
    id: 'G105',
    fullName: 'Amara & Nnamdi Okafor',
    email: 'amara.okafor@lagoscapital.ng',
    phone: '+234 803 123 4567',
    country: 'Nigeria',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    vipTier: 'Black Diamond VIP',
    loyaltyPoints: 42000,
    totalStays: 5,
    totalSpend: 31400,
    dietaryRestrictions: ['Halal', 'No pork'],
    pillowPreference: 'Extra firm king pillows (4 count)',
    roomTemperatureC: 18.5,
    favoriteDrinks: ['Fresh Passionfruit Mocktail', 'Domaine Leflaive Puligny-Montrachet'],
    tags: ['VIP', 'Villa Bookings', 'Private Dining Required'],
    internalNotes: 'Always books the Palmetto Palms Villa. Traveling with private security detail.',
    lastVisit: '2026-03-12'
  }
];

export const INITIAL_ADDONS: AddOnPackage[] = [
  {
    id: 'PKG-01',
    name: 'Private Helicopter Coastal Transfer',
    category: 'Transport',
    price: 450,
    perPerson: true,
    description: 'Chauffeured pickup from international airport directly to cliffside helipad with chilled Ruinart champagne.',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop',
    duration: '25 min flight'
  },
  {
    id: 'PKG-02',
    name: 'Sanctuary 90-Min Botanical Stone Ritual',
    category: 'Wellness',
    price: 240,
    perPerson: true,
    description: 'Indigenous marula and baobab oil massage with warm coastal volcanic stones in an open-air ocean pavilion.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
    duration: '90 minutes'
  },
  {
    id: 'PKG-03',
    name: 'Chef’s 7-Course Degustation & Reserve Pairing',
    category: 'Dining',
    price: 185,
    perPerson: true,
    description: 'Candlelit dining on the private cliff promontory with custom wine flight selected by Master Sommelier.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop',
    duration: '3 hours'
  },
  {
    id: 'PKG-04',
    name: 'Sunset Catamaran & Marine Safari Charter',
    category: 'Adventure',
    price: 380,
    perPerson: false,
    description: 'Private 42ft catamaran cruise to dolphin sanctuary with artisanal oysters, sashimi, and vintage sparkling wine.',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=600&auto=format&fit=crop',
    duration: '3.5 hours'
  },
  {
    id: 'PKG-05',
    name: 'Anniversary & Romance Bespoke Turndown',
    category: 'Celebration',
    price: 160,
    perPerson: false,
    description: '100 garden roses, iced Laurent-Perrier Brut, house-made chocolate truffles, and aromatic lavender bath bath prep.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop',
    duration: 'Set upon evening turn'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'RES-8421',
    guestId: 'G101',
    guestName: 'Victoria Sterling',
    guestEmail: 'v.sterling@heritage-assets.co.uk',
    guestPhone: '+44 7700 900142',
    guestCountry: 'United Kingdom',
    roomId: 'R201',
    roomNumber: '201',
    roomType: 'Azure Penthouse',
    checkInDate: '2026-05-14',
    checkOutDate: '2026-05-18',
    nights: 4,
    numGuests: 2,
    status: 'checked_in',
    channel: 'Direct Web',
    totalAmount: 7620,
    paidAmount: 7620,
    paymentStatus: 'paid',
    specialRequests: 'Celebrating birthday on 16th. Champagne in room on arrival. Silk sleep masks requested.',
    estimatedArrivalTime: '14:30',
    vipTier: 'Black Diamond VIP',
    selectedAddOns: ['Private Helicopter Coastal Transfer', 'Chef’s 7-Course Degustation & Reserve Pairing'],
    digitalKeyIssued: true,
    folio: [
      {
        id: 'FOL-01',
        category: 'Room Charge',
        description: 'Azure Penthouse (4 nights @ $1,780/nt)',
        amount: 7120,
        date: '2026-05-14',
        time: '15:00',
        postedBy: 'System Auto-Post'
      },
      {
        id: 'FOL-02',
        category: 'Tax & Tourism Levy',
        description: 'Boutique Conservation & Tourism Levy (5%)',
        amount: 356,
        date: '2026-05-14',
        time: '15:00',
        postedBy: 'System Auto-Post'
      },
      {
        id: 'FOL-03',
        category: 'Excursion',
        description: 'Private Helicopter Coastal Transfer (2 pax)',
        amount: 900,
        date: '2026-05-14',
        time: '14:40',
        postedBy: 'Concierge Desk'
      },
      {
        id: 'FOL-04',
        category: 'Payment / Deposit',
        description: 'Pre-paid Online via Amex Platinum ****4092',
        amount: -8376,
        date: '2026-05-02',
        time: '11:15',
        postedBy: 'Stripe Gateway',
        paymentMethod: 'Card'
      },
      {
        id: 'FOL-05',
        category: 'Bar & Wine',
        description: 'Dom Pérignon 2012 Vintage Bottle to Penthouse',
        amount: 340,
        date: '2026-05-14',
        time: '19:20',
        postedBy: 'Room Service POS'
      }
    ],
    notes: 'GM greeting completed. Guest thrilled with suite view.',
    createdAt: '2026-05-02'
  },
  {
    id: 'RES-8422',
    guestId: 'G102',
    guestName: 'Julian Rossi',
    guestEmail: 'j.rossi@architettura-milano.it',
    guestPhone: '+39 02 8820 411',
    guestCountry: 'Italy',
    roomId: 'R101',
    roomNumber: '101',
    roomType: 'Cliffside Pavilion',
    checkInDate: '2026-05-15',
    checkOutDate: '2026-05-19',
    nights: 4,
    numGuests: 2,
    status: 'confirmed',
    channel: 'Direct Web',
    totalAmount: 3120,
    paidAmount: 1560,
    paymentStatus: 'partial',
    specialRequests: 'High floor or best sunset angle. Extra feather pillows.',
    estimatedArrivalTime: '15:00',
    vipTier: 'Gold',
    selectedAddOns: ['Sanctuary 90-Min Botanical Stone Ritual'],
    digitalKeyIssued: false,
    folio: [
      {
        id: 'FOL-10',
        category: 'Room Charge',
        description: 'Cliffside Pavilion (4 nights @ $620/nt)',
        amount: 2480,
        date: '2026-05-15',
        time: '14:00',
        postedBy: 'System Auto-Post'
      },
      {
        id: 'FOL-11',
        category: 'Tax & Tourism Levy',
        description: 'Tourism & Environmental Levy (5%)',
        amount: 124,
        date: '2026-05-15',
        time: '14:00',
        postedBy: 'System Auto-Post'
      },
      {
        id: 'FOL-12',
        category: 'Spa & Wellness',
        description: 'Sanctuary 90-Min Botanical Stone Ritual (2 pax)',
        amount: 480,
        date: '2026-05-15',
        time: '14:00',
        postedBy: 'Concierge Desk'
      },
      {
        id: 'FOL-13',
        category: 'Payment / Deposit',
        description: '50% Booking Deposit via Visa ****8812',
        amount: -1560,
        date: '2026-05-04',
        time: '09:22',
        postedBy: 'Online Booking Engine',
        paymentMethod: 'Card'
      }
    ],
    notes: 'Arrival transfer confirmed with driver Marcus.',
    createdAt: '2026-05-04'
  },
  {
    id: 'RES-8423',
    guestId: 'G105',
    guestName: 'Amara Okafor',
    guestEmail: 'amara.okafor@lagoscapital.ng',
    guestPhone: '+234 803 123 4567',
    guestCountry: 'Nigeria',
    roomId: 'R103',
    roomNumber: '103',
    roomType: 'Garden Pool Villa',
    checkInDate: '2026-05-13',
    checkOutDate: '2026-05-17',
    nights: 4,
    numGuests: 4,
    status: 'checked_in',
    channel: 'VIP Corporate',
    totalAmount: 4620,
    paidAmount: 4620,
    paymentStatus: 'paid',
    specialRequests: 'Private chef for breakfast every morning. 4 extra towels at pool.',
    estimatedArrivalTime: '13:00',
    vipTier: 'Black Diamond VIP',
    selectedAddOns: ['Sunset Catamaran & Marine Safari Charter'],
    digitalKeyIssued: true,
    folio: [
      {
        id: 'FOL-20',
        category: 'Room Charge',
        description: 'Garden Pool Villa (4 nights @ $940/nt)',
        amount: 3760,
        date: '2026-05-13',
        time: '14:00',
        postedBy: 'System Auto-Post'
      },
      {
        id: 'FOL-21',
        category: 'Excursion',
        description: 'Sunset Catamaran & Marine Safari Charter',
        amount: 380,
        date: '2026-05-14',
        time: '17:00',
        postedBy: 'Concierge Desk'
      },
      {
        id: 'FOL-22',
        category: 'F&B Restaurant',
        description: 'Poolside Lunch & Artisanal Cocktails',
        amount: 220,
        date: '2026-05-14',
        time: '13:40',
        postedBy: 'Pool Bar POS'
      },
      {
        id: 'FOL-23',
        category: 'Payment / Deposit',
        description: 'Full Pre-Payment Wire Transfer Ref #W-99201',
        amount: -4620,
        date: '2026-05-01',
        time: '16:00',
        postedBy: 'Finance Dept',
        paymentMethod: 'Wire'
      }
    ],
    notes: 'Chef Pierre assigned for morning in-villa service.',
    createdAt: '2026-05-01'
  },
  {
    id: 'RES-8424',
    guestId: 'G103',
    guestName: 'Dr. Alistair Vance',
    guestEmail: 'avance@stanford.edu',
    guestPhone: '+1 415 555 0198',
    guestCountry: 'United States',
    roomId: 'R301',
    roomNumber: '301',
    roomType: 'Oceanfront Bungalow',
    checkInDate: '2026-05-15',
    checkOutDate: '2026-05-18',
    nights: 3,
    numGuests: 2,
    status: 'confirmed',
    channel: 'Direct Web',
    totalAmount: 2680,
    paidAmount: 2680,
    paymentStatus: 'paid',
    specialRequests: 'Ground level access, quiet bungalow preferred.',
    estimatedArrivalTime: '16:00',
    vipTier: 'Silver',
    selectedAddOns: [],
    digitalKeyIssued: false,
    folio: [
      {
        id: 'FOL-30',
        category: 'Room Charge',
        description: 'Oceanfront Bungalow (3 nights @ $820/nt)',
        amount: 2460,
        date: '2026-05-15',
        time: '15:00',
        postedBy: 'System Auto-Post'
      },
      {
        id: 'FOL-31',
        category: 'Tax & Tourism Levy',
        description: 'Levy (5%)',
        amount: 123,
        date: '2026-05-15',
        time: '15:00',
        postedBy: 'System Auto-Post'
      },
      {
        id: 'FOL-32',
        category: 'Payment / Deposit',
        description: 'Payment via Apple Pay ****3910',
        amount: -2583,
        date: '2026-05-08',
        time: '10:45',
        postedBy: 'Online Booking Engine',
        paymentMethod: 'Card'
      }
    ],
    notes: 'Binoculars and coastal nature guide placed on study desk.',
    createdAt: '2026-05-08'
  },
  {
    id: 'RES-8425',
    guestId: 'G104',
    guestName: 'Yuki Takahashi',
    guestEmail: 'yuki.takahashi@tokyomedia.jp',
    guestPhone: '+81 90 1234 5678',
    guestCountry: 'Japan',
    roomId: 'R501',
    roomNumber: '501',
    roomType: 'Sunset Star Deck Suite',
    checkInDate: '2026-05-16',
    checkOutDate: '2026-05-20',
    nights: 4,
    numGuests: 2,
    status: 'confirmed',
    channel: 'Luxury Retreats OTA',
    totalAmount: 4890,
    paidAmount: 2445,
    paymentStatus: 'partial',
    specialRequests: 'Tripod and telescope lens cleaner if available.',
    estimatedArrivalTime: '17:30',
    vipTier: 'Gold',
    selectedAddOns: ['Chef’s 7-Course Degustation & Reserve Pairing'],
    digitalKeyIssued: false,
    folio: [
      {
        id: 'FOL-40',
        category: 'Room Charge',
        description: 'Sunset Star Deck Suite (4 nights @ $1,150/nt)',
        amount: 4600,
        date: '2026-05-16',
        time: '16:00',
        postedBy: 'System Auto-Post'
      },
      {
        id: 'FOL-41',
        category: 'Payment / Deposit',
        description: 'OTA Channel Pre-Authorization Ref #OTA-7712',
        amount: -2445,
        date: '2026-05-09',
        time: '14:10',
        postedBy: 'OTA Integration',
        paymentMethod: 'Card'
      }
    ],
    createdAt: '2026-05-09'
  }
];

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'MENU-01',
    name: 'Wild Honeycomb & Sourdough French Toast',
    category: 'Breakfast',
    price: 24,
    description: 'Estate brioche, whipped salted butter, wild mountain honeycomb, and vanilla bean mascarpone.',
    dietary: ['Vegetarian', 'Signature'],
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=400&auto=format&fit=crop',
    prepTimeMinutes: 12,
    availableModifiers: ['Extra Honeycomb', 'Crispy Prosciutto on side', 'Gluten Free Brioche']
  },
  {
    id: 'MENU-02',
    name: 'Poached Organic Eggs on Crushed Avocado',
    category: 'Breakfast',
    price: 22,
    description: 'Sourdough toast, heirloom radish, lemon oil, dukkah spice, and micro herbs.',
    dietary: ['Vegetarian', 'Nut Free'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop',
    prepTimeMinutes: 10,
    availableModifiers: ['Add Smoked Salmon +$8', 'Add Truffle Poached Egg +$6', 'No Chili']
  },
  {
    id: 'MENU-03',
    name: 'Line-Caught Kingfish Ceviche',
    category: 'All-Day Dining',
    price: 29,
    description: 'Tiger’s milk, shaved coconut, finger lime pearls, plantain crisps, and coriander oil.',
    dietary: ['GF', 'Signature'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=400&auto=format&fit=crop',
    prepTimeMinutes: 14,
    availableModifiers: ['Extra Plantain Crisps', 'Mild Spice', 'Extra Lime']
  },
  {
    id: 'MENU-04',
    name: 'Charred Wagyu Bavette (250g)',
    category: 'All-Day Dining',
    price: 54,
    description: 'MBS 8+ Wagyu, chimichurri rojo, bone marrow butter, and roasted baby heirloom carrots.',
    dietary: ['GF'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop',
    prepTimeMinutes: 20,
    availableModifiers: ['Rare', 'Medium Rare', 'Medium', 'Truffle Jus +$6']
  },
  {
    id: 'MENU-05',
    name: 'Woodfired Lobster Tail & Saffron Risotto',
    category: 'Chef Tasting Menu',
    price: 68,
    description: 'Butter-basted Atlantic lobster, carnaroli rice, preserved lemon, and crispy tarragon.',
    dietary: ['GF', 'Signature'],
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=400&auto=format&fit=crop',
    prepTimeMinutes: 22,
    availableModifiers: ['Add Kaluga Caviar (10g) +$35', 'Shaved Truffle +$18']
  },
  {
    id: 'MENU-06',
    name: 'The Azure Botanical Spritz',
    category: 'Artisan Cocktails',
    price: 21,
    description: 'Locally distilled botanical gin, elderflower liqueur, sparkling mineral water, cucumber ribbon, and garden rosemary.',
    dietary: ['Signature'],
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400&auto=format&fit=crop',
    prepTimeMinutes: 4,
    availableModifiers: ['Light Ice', 'Extra Botanical Gin', 'No Rosemary']
  },
  {
    id: 'MENU-07',
    name: 'Smoked Fig & Bourbon Old Fashioned',
    category: 'Artisan Cocktails',
    price: 24,
    description: 'Single barrel bourbon, house-infused roasted fig reduction, black walnut bitters, and cedar smoke.',
    dietary: ['Signature'],
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=400&auto=format&fit=crop',
    prepTimeMinutes: 5,
    availableModifiers: ['Hand-Carved Ice Cube', 'Rye Bourbon Substitute']
  },
  {
    id: 'MENU-08',
    name: 'Domaine Dujac Morey-Saint-Denis 2020',
    category: 'Cellar Wines',
    price: 180,
    description: 'Bottle (750ml). Exquisite Pinot Noir from Burgundy with notes of wild cherries, forest floor, and delicate spice.',
    dietary: ['Vegan', 'Signature'],
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400&auto=format&fit=crop',
    prepTimeMinutes: 3,
    availableModifiers: ['Decanted in Advance', 'Serve Chilled at 16°C']
  }
];

export const INITIAL_TABLES: RestaurantTable[] = [
  { id: 'T01', number: '1', zone: 'Cliffside Perch', seats: 2, status: 'occupied', activeReservationId: 'RES-8421', currentGuestName: 'Victoria Sterling', serverName: 'Antoine' },
  { id: 'T02', number: '2', zone: 'Cliffside Perch', seats: 2, status: 'reserved', currentGuestName: 'Julian Rossi (19:30)', serverName: 'Antoine' },
  { id: 'T03', number: '3', zone: 'Cliffside Perch', seats: 4, status: 'available', serverName: 'Antoine' },
  { id: 'T04', number: '4', zone: 'Main Dining Terrace', seats: 4, status: 'available', serverName: 'Isabelle' },
  { id: 'T05', number: '5', zone: 'Main Dining Terrace', seats: 6, status: 'occupied', activeReservationId: 'RES-8423', currentGuestName: 'Amara Okafor', serverName: 'Isabelle' },
  { id: 'T06', number: '6', zone: 'Main Dining Terrace', seats: 2, status: 'available', serverName: 'Isabelle' },
  { id: 'T07', number: '7', zone: 'Wine Cellar Vault', seats: 8, status: 'reserved', currentGuestName: 'Private Tasting (20:00)', serverName: 'Antoine' },
  { id: 'T08', number: '8', zone: 'Poolside Pavilion', seats: 4, status: 'available', serverName: 'Mateo' },
  { id: 'T09', number: '9', zone: 'Poolside Pavilion', seats: 2, status: 'available', serverName: 'Mateo' }
];

export const INITIAL_HOUSEKEEPING_TASKS: HousekeepingTask[] = [
  {
    id: 'HK-101',
    roomId: 'R104',
    roomNumber: '104',
    roomType: 'Garden Pool Villa',
    type: 'Full Turn',
    status: 'pending',
    assignedTo: 'Kofi Mensah',
    priority: 'High',
    estimatedMinutes: 50,
    notes: 'Guest checked out 10:45 AM. Next arrival arriving 15:00 PM.'
  },
  {
    id: 'HK-102',
    roomId: 'R202',
    roomNumber: '202',
    roomType: 'Azure Penthouse',
    type: 'Deep Clean Inspection',
    status: 'in_progress',
    assignedTo: 'Sofia Rodriguez',
    priority: 'Urgent Rush',
    estimatedMinutes: 30,
    notes: 'Pre-arrival VIP inspection. Checking wine cellar temperature and terrace hot tub.'
  },
  {
    id: 'HK-103',
    roomId: 'R201',
    roomNumber: '201',
    roomType: 'Azure Penthouse',
    type: 'VIP Turndown',
    status: 'pending',
    assignedTo: 'Sofia Rodriguez',
    priority: 'Medium',
    estimatedMinutes: 25,
    notes: 'Turndown scheduled for 18:30. Lavender pillow mist and ice bucket replenishment.'
  },
  {
    id: 'HK-104',
    roomId: 'R101',
    roomNumber: '101',
    roomType: 'Cliffside Pavilion',
    type: 'Daily Refresh',
    status: 'completed',
    assignedTo: 'Elena Vasquez',
    priority: 'Medium',
    estimatedMinutes: 30,
    notes: 'Completed at 11:30 AM. Fresh towels and minibar restocked.',
    completedAt: '11:30'
  },
  {
    id: 'HK-105',
    roomId: 'R301',
    roomNumber: '301',
    roomType: 'Oceanfront Bungalow',
    type: 'Full Turn',
    status: 'completed',
    assignedTo: 'Lucas Thorne',
    priority: 'High',
    estimatedMinutes: 45,
    notes: 'Boardwalk cleared of sand, fresh linen dressed.',
    completedAt: '12:15'
  }
];

export const INITIAL_MAINTENANCE: MaintenanceTicket[] = [
  {
    id: 'MNT-402',
    roomId: 'R402',
    roomNumber: '402',
    location: 'Suite 402 - Living Area',
    category: 'HVAC / Climate',
    issue: 'Air handling unit sensor showing 1.5°C discrepancy on smart thermostat',
    priority: 'High',
    status: 'in_progress',
    reportedAt: 'Today, 09:15 AM',
    technician: 'Marcus Price',
    resolutionNotes: 'Replacing temperature sensor module. ETA 15:30.'
  },
  {
    id: 'MNT-403',
    roomId: 'R103',
    roomNumber: '103',
    location: 'Palmetto Palms Villa Deck',
    category: 'Pool / Jacuzzi',
    issue: 'Infinity waterfall pump filter pressure light triggered',
    priority: 'Medium',
    status: 'open',
    reportedAt: 'Today, 11:00 AM',
    technician: 'Marcus Price'
  },
  {
    id: 'MNT-404',
    roomId: 'R201',
    roomNumber: '201',
    location: 'Celeste Penthouse Roof Deck',
    category: 'Smart Room & Tech',
    issue: 'Motorized skylight shade remote pairing re-calibration',
    priority: 'Low',
    status: 'resolved',
    reportedAt: 'Yesterday, 16:30',
    technician: 'David Zhang',
    resolutionNotes: 'Re-paired RF receiver and updated firmware.'
  }
];

export const METRICS_DATA: DailyMetric[] = [
  { date: '2026-05-09', dayLabel: 'Sat May 9', occupancyPercent: 92, adr: 890, revPar: 818.8, totalRoomRevenue: 9825, totalFBRevenue: 3420, totalSpaRevenue: 1450, totalExcursionsRevenue: 1200, arrivalsCount: 4, departuresCount: 2 },
  { date: '2026-05-10', dayLabel: 'Sun May 10', occupancyPercent: 83, adr: 840, revPar: 697.2, totalRoomRevenue: 8366, totalFBRevenue: 2890, totalSpaRevenue: 980, totalExcursionsRevenue: 760, arrivalsCount: 2, departuresCount: 3 },
  { date: '2026-05-11', dayLabel: 'Mon May 11', occupancyPercent: 75, adr: 780, revPar: 585.0, totalRoomRevenue: 7020, totalFBRevenue: 2150, totalSpaRevenue: 740, totalExcursionsRevenue: 450, arrivalsCount: 1, departuresCount: 2 },
  { date: '2026-05-12', dayLabel: 'Tue May 12', occupancyPercent: 75, adr: 790, revPar: 592.5, totalRoomRevenue: 7110, totalFBRevenue: 2420, totalSpaRevenue: 890, totalExcursionsRevenue: 600, arrivalsCount: 2, departuresCount: 2 },
  { date: '2026-05-13', dayLabel: 'Wed May 13', occupancyPercent: 83, adr: 820, revPar: 680.6, totalRoomRevenue: 8167, totalFBRevenue: 2980, totalSpaRevenue: 1120, totalExcursionsRevenue: 850, arrivalsCount: 3, departuresCount: 2 },
  { date: '2026-05-14', dayLabel: 'Thu May 14', occupancyPercent: 92, adr: 910, revPar: 837.2, totalRoomRevenue: 10046, totalFBRevenue: 3850, totalSpaRevenue: 1680, totalExcursionsRevenue: 1400, arrivalsCount: 3, departuresCount: 1 },
  { date: '2026-05-15', dayLabel: 'Fri May 15 (Today)', occupancyPercent: 100, adr: 960, revPar: 960.0, totalRoomRevenue: 11520, totalFBRevenue: 4420, totalSpaRevenue: 2100, totalExcursionsRevenue: 1950, arrivalsCount: 4, departuresCount: 2 },
  { date: '2026-05-16', dayLabel: 'Sat May 16', occupancyPercent: 100, adr: 990, revPar: 990.0, totalRoomRevenue: 11880, totalFBRevenue: 4700, totalSpaRevenue: 2400, totalExcursionsRevenue: 2100, arrivalsCount: 2, departuresCount: 1 },
  { date: '2026-05-17', dayLabel: 'Sun May 17', occupancyPercent: 92, adr: 880, revPar: 809.6, totalRoomRevenue: 9715, totalFBRevenue: 3300, totalSpaRevenue: 1200, totalExcursionsRevenue: 900, arrivalsCount: 2, departuresCount: 3 }
];

export const INITIAL_ALERTS: ActivityAlert[] = [
  {
    id: 'ALT-01',
    type: 'vip',
    severity: 'info',
    title: 'VIP Arrival Notice',
    description: 'Black Diamond guest Victoria Sterling checked into Celeste Penthouse Suite 201.',
    timestamp: '14:45'
  },
  {
    id: 'ALT-02',
    type: 'exception',
    severity: 'critical',
    title: 'SLA Escalation Alert',
    description: 'Suite 104 requested luggage assistance 28 mins ago — SLA threshold approaching.',
    timestamp: '15:02',
    actionLabel: 'Dispatch Concierge',
    actionPayload: 'REQ-101'
  },
  {
    id: 'ALT-03',
    type: 'rate_parity',
    severity: 'warning',
    title: 'Rate Parity Violation Detected',
    description: 'Expedia is listing Oceanfront Bungalow at $580 ($40 below direct BAR of $620).',
    timestamp: '13:10',
    actionLabel: 'Auto-Fix Parity',
    actionPayload: 'CHN-02'
  },
  {
    id: 'ALT-04',
    type: 'pos',
    severity: 'info',
    title: 'Room Charge Posted',
    description: '$340.00 Dom Pérignon bottle charged to Suite 201 folio.',
    timestamp: '19:22'
  },
  {
    id: 'ALT-05',
    type: 'housekeeping',
    severity: 'info',
    title: 'Room Inspected & Ready',
    description: 'Suite 101 marked Clean and Inspected by Elena V.',
    timestamp: '11:35'
  }
];

export const INITIAL_CHANNELS: ChannelItem[] = [
  {
    id: 'CHN-01',
    name: 'Direct Booking Engine',
    type: 'Direct',
    status: 'connected',
    commissionRate: 0,
    activeRatePlan: 'Direct BAR Best Rate Guarantee',
    syncedRoomsCount: 12,
    parityStatus: 'in_parity',
    currentOtaPrice: 620,
    directPrice: 620,
    lastSyncedAt: '2 mins ago'
  },
  {
    id: 'CHN-02',
    name: 'Booking.com',
    type: 'OTA',
    status: 'connected',
    commissionRate: 15,
    activeRatePlan: 'Standard Flex Rate',
    syncedRoomsCount: 12,
    parityStatus: 'in_parity',
    currentOtaPrice: 620,
    directPrice: 620,
    lastSyncedAt: '5 mins ago'
  },
  {
    id: 'CHN-03',
    name: 'Expedia Group',
    type: 'OTA',
    status: 'connected',
    commissionRate: 18,
    activeRatePlan: 'Expedia Partner Network',
    syncedRoomsCount: 10,
    parityStatus: 'violation',
    currentOtaPrice: 580,
    directPrice: 620,
    lastSyncedAt: '12 mins ago'
  },
  {
    id: 'CHN-04',
    name: 'Luxury Retreats / Airbnb Luxe',
    type: 'OTA',
    status: 'connected',
    commissionRate: 12,
    activeRatePlan: 'Villa Signature Collection',
    syncedRoomsCount: 6,
    parityStatus: 'in_parity',
    currentOtaPrice: 940,
    directPrice: 940,
    lastSyncedAt: '18 mins ago'
  },
  {
    id: 'CHN-05',
    name: 'GDS Sabre / Amadeus',
    type: 'GDS',
    status: 'connected',
    commissionRate: 10,
    activeRatePlan: 'Corporate Global Negotiated',
    syncedRoomsCount: 12,
    parityStatus: 'in_parity',
    currentOtaPrice: 620,
    directPrice: 620,
    lastSyncedAt: '1 hour ago'
  }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'AUTO-01',
    name: 'VIP Pre-Arrival Concierge Protocol',
    trigger: 'WHEN guest arrives tomorrow AND guest is VIP',
    condition: 'guest.vipTier in ["Gold", "Black Diamond VIP"]',
    actions: [
      'Notify chief concierge and duty manager',
      'Alert housekeeping supervisor to rush room inspection',
      'Send personalized pre-arrival welcome SMS & digital key invitation',
      'Pre-allocate complimentary champagne & orchid arrangement',
      'Surface penthouse suite upgrade option if available'
    ],
    enabled: true,
    lastExecuted: 'Today at 08:30 AM',
    executionCount: 24
  },
  {
    id: 'AUTO-02',
    name: 'F&B Dinner Folio & Loyalty Sync',
    trigger: 'WHEN guest orders dining at restaurant or room service',
    condition: 'order.total > 0',
    actions: [
      'Post itemized charges with service tax automatically to room folio',
      'Dispatch digital KDS ticket to executive kitchen line',
      'Update guest lifetime dining spend tally in CRM profile',
      'Calculate & credit 5 loyalty points per dollar spent',
      'Recommend paired sommelier cellar dessert wine'
    ],
    enabled: true,
    lastExecuted: '19:22 PM',
    executionCount: 142
  },
  {
    id: 'AUTO-03',
    name: 'Express Check-Out Turnover Dispatch',
    trigger: 'WHEN guest completes express digital check-out',
    condition: 'reservation.status == "checked_out"',
    actions: [
      'Instantly change room status to "Dirty / Turnover"',
      'Auto-generate High Priority "Full Turn" Housekeeping Task',
      'Lock digital NFC mobile key access to room door',
      'Generate final itemized digital folio receipt & email to guest',
      'Trigger post-stay Net Promoter Score (NPS) feedback prompt'
    ],
    enabled: true,
    lastExecuted: '10:45 AM',
    executionCount: 88
  },
  {
    id: 'AUTO-04',
    name: 'High Occupancy Dynamic Rate Surge',
    trigger: 'WHEN hotel projected occupancy for date exceeds 85%',
    condition: 'occupancy >= 85',
    actions: [
      'Increase Best Available Rate (BAR) by +15% dynamically across direct & OTAs',
      'Enforce 2-night minimum length of stay (MLOS) on premium suites',
      'Close lower discounted promotional rate codes',
      'Alert Revenue Manager of yield surge trigger'
    ],
    enabled: true,
    lastExecuted: 'Yesterday at 17:00 PM',
    executionCount: 19
  }
];

export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'REQ-101',
    roomNumber: '104',
    guestName: 'Julian Vance',
    category: 'Housekeeping',
    item: '2 Extra Hypoallergenic Down Pillows & Eucalyptus Bath Salts',
    notes: 'Please deliver before 17:00. Guest is relaxing on terrace.',
    status: 'in_progress',
    requestedAt: '14:35',
    assignedStaff: 'Elena Vasquez'
  },
  {
    id: 'REQ-102',
    roomNumber: '201',
    guestName: 'Victoria Sterling',
    category: 'Dining & Wine',
    item: 'Chilled Ice Bucket & Crystal Flutes for Private Cellar Champagne',
    notes: 'Guest has 2 guests joining at 18:00.',
    status: 'received',
    requestedAt: '15:10',
    assignedStaff: 'Chef Sommelier'
  },
  {
    id: 'REQ-103',
    roomNumber: '301',
    guestName: 'Dr. Alistair Finch',
    category: 'Luggage & Valet',
    item: 'Electric Buggy Transfer to Beach Cove & Snorkel Equipment',
    notes: '2 sets of fins (size 43 & 39).',
    status: 'completed',
    requestedAt: '12:40',
    assignedStaff: 'Lucas Thorne'
  },
  {
    id: 'REQ-104',
    roomNumber: '102',
    guestName: 'Harrison Chen',
    category: 'Spa',
    item: 'In-Villa Sunset Sound Bath & Couples Massage Booking (18:00)',
    notes: 'Allergies: No lavender oil, preference for organic coconut balm.',
    status: 'in_progress',
    requestedAt: '13:15',
    assignedStaff: 'Spa Master Maya'
  }
];

export const INITIAL_MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'TH-01',
    guestId: 'GST-001',
    guestName: 'Victoria Sterling',
    roomNumber: '201',
    channel: 'WhatsApp',
    lastMessage: 'Thank you! Could we also book the sunset yacht charter for Saturday evening?',
    lastMessageTime: '14:52',
    unreadCount: 1,
    messages: [
      {
        id: 'M-1',
        sender: 'hotel',
        senderName: 'Azure Sanctuary Concierge',
        channel: 'WhatsApp',
        content: 'Dear Ms. Sterling, welcome back to The Azure Sanctuary. Your Celeste Penthouse is dressed to your preferred 20.5°C with vintage Krug champagne chilled.',
        timestamp: '14:30',
        read: true
      },
      {
        id: 'M-2',
        sender: 'guest',
        senderName: 'Victoria Sterling',
        channel: 'WhatsApp',
        content: 'Everything is breathtaking as always. Thank you! Could we also book the sunset yacht charter for Saturday evening?',
        timestamp: '14:52',
        read: false
      }
    ]
  },
  {
    id: 'TH-02',
    guestId: 'GST-003',
    guestName: 'Julian Vance',
    roomNumber: '104',
    channel: 'Portal Chat',
    lastMessage: 'Could we request late checkout at 14:00 on Sunday? Flight departs at 18:00.',
    lastMessageTime: '13:40',
    unreadCount: 0,
    messages: [
      {
        id: 'M-3',
        sender: 'guest',
        senderName: 'Julian Vance',
        channel: 'Portal Chat',
        content: 'Could we request late checkout at 14:00 on Sunday? Flight departs at 18:00.',
        timestamp: '13:40',
        read: true
      },
      {
        id: 'M-4',
        sender: 'hotel',
        senderName: 'Front Desk Duty Manager',
        channel: 'Portal Chat',
        content: 'Certainly, Mr. Vance! As a Gold Tier member, we have approved complimentary late checkout until 14:00 for Suite 104.',
        timestamp: '13:45',
        read: true
      }
    ]
  },
  {
    id: 'TH-03',
    guestId: 'GST-002',
    guestName: 'Claire Beauchamp',
    roomNumber: '101',
    channel: 'SMS',
    lastMessage: 'Our driver arrived at the airport on time. See you soon!',
    lastMessageTime: '11:15',
    unreadCount: 0,
    messages: [
      {
        id: 'M-5',
        sender: 'guest',
        senderName: 'Claire Beauchamp',
        channel: 'SMS',
        content: 'Our driver arrived at the airport on time. See you soon!',
        timestamp: '11:15',
        read: true
      }
    ]
  }
];

export const INITIAL_GROUP_EVENTS: GroupEvent[] = [
  {
    id: 'GRP-2026-01',
    groupName: 'Apex Capital Global Partners Executive Summit',
    eventType: 'Executive Retreat',
    organizer: 'Evelyn St. Clair (VP Operations)',
    contactEmail: 'e.stclair@apexcap.com',
    contactPhone: '+1 (415) 890-3412',
    arrivalDate: '2026-05-18',
    departureDate: '2026-05-22',
    roomsBlocked: 6,
    attendeesCount: 14,
    totalContractValue: 34500,
    depositPaid: 17250,
    status: 'Contract Signed',
    spacesBooked: ['Cliffside Pavilion Terrace', 'Wine Cellar Vault Private Boardroom', 'Private Catamaran Fleet'],
    functionSheetNotes: 'BEO #884: AV projector setup with fiber 1Gbps uplink in Vault, private chef tasting menu on May 19th with pairing, all billing routed to Master Corporate Folio.'
  },
  {
    id: 'GRP-2026-02',
    groupName: 'The Harrison & Sterling Vow Renewal',
    eventType: 'Wedding & Celebration',
    organizer: 'Marcus Sterling',
    contactEmail: 'm.sterling@sterlingholdings.co.uk',
    contactPhone: '+44 20 7946 0912',
    arrivalDate: '2026-05-28',
    departureDate: '2026-06-01',
    roomsBlocked: 8,
    attendeesCount: 22,
    totalContractValue: 48900,
    depositPaid: 25000,
    status: 'In-House',
    spacesBooked: ['The Azure Amphitheatre', 'Main Dining Terrace', 'Poolside Pavilion'],
    functionSheetNotes: 'BEO #891: Champagne toast at 17:30 sunset, live acoustic harpist on clifftop deck, floral arches with white orchids and jasmine.'
  }
];


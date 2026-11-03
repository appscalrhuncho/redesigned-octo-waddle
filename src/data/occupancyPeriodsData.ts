export interface PeriodOccupancyMetric {
  id: string;
  label: string;
  subLabel: string;
  periodType: 'day' | 'week' | 'month';
  occupancyPercent: number;
  adr: number;
  revPar: number;
  roomNightsAvailable: number;
  roomNightsSold: number;
  totalRevenue: number;
  status: 'actual' | 'forecast';
  primaryFactor?: string;
  recommendedAction?: string;
}

export const WEEKLY_OCCUPANCY_DATA: PeriodOccupancyMetric[] = [
  {
    id: 'W16',
    label: 'Week 16',
    subLabel: 'Apr 13 – 19',
    periodType: 'week',
    occupancyPercent: 88,
    adr: 820,
    revPar: 721.6,
    roomNightsAvailable: 84,
    roomNightsSold: 74,
    totalRevenue: 60680,
    status: 'actual',
    primaryFactor: 'Easter / Spring Break Influx'
  },
  {
    id: 'W17',
    label: 'Week 17',
    subLabel: 'Apr 20 – 26',
    periodType: 'week',
    occupancyPercent: 82,
    adr: 810,
    revPar: 664.2,
    roomNightsAvailable: 84,
    roomNightsSold: 69,
    totalRevenue: 55890,
    status: 'actual',
    primaryFactor: 'Boutique Culinary Weekend'
  },
  {
    id: 'W18',
    label: 'Week 18',
    subLabel: 'Apr 27 – May 3',
    periodType: 'week',
    occupancyPercent: 71, // Drops below standard 80% goal
    adr: 760,
    revPar: 539.6,
    roomNightsAvailable: 84,
    roomNightsSold: 60,
    totalRevenue: 45600,
    status: 'actual',
    primaryFactor: 'Midweek Mid-Season Lull',
    recommendedAction: 'Trigger OTA flash promotion and corporate retreat outreach'
  },
  {
    id: 'W19',
    label: 'Week 19',
    subLabel: 'May 4 – 10',
    periodType: 'week',
    occupancyPercent: 76, // Drops below standard 80% goal
    adr: 790,
    revPar: 600.4,
    roomNightsAvailable: 84,
    roomNightsSold: 64,
    totalRevenue: 50560,
    status: 'actual',
    primaryFactor: 'Pre-Festival Transition Window',
    recommendedAction: 'Release 2 restricted suites to Luxury Retreats OTA channel'
  },
  {
    id: 'W20',
    label: 'Week 20',
    subLabel: 'May 11 – 17 (Current)',
    periodType: 'week',
    occupancyPercent: 89,
    adr: 885,
    revPar: 787.65,
    roomNightsAvailable: 84,
    roomNightsSold: 75,
    totalRevenue: 66375,
    status: 'actual',
    primaryFactor: 'Mediterranean Wellness Summit & Weekend Penthouse Buyout'
  },
  {
    id: 'W21',
    label: 'Week 21',
    subLabel: 'May 18 – 24 (Forecast)',
    periodType: 'week',
    occupancyPercent: 94,
    adr: 940,
    revPar: 883.6,
    roomNightsAvailable: 84,
    roomNightsSold: 79,
    totalRevenue: 74260,
    status: 'forecast',
    primaryFactor: 'Regatta & International Yacht Week'
  },
  {
    id: 'W22',
    label: 'Week 22',
    subLabel: 'May 25 – 31 (Forecast)',
    periodType: 'week',
    occupancyPercent: 78, // Drops below 80%
    adr: 850,
    revPar: 663.0,
    roomNightsAvailable: 84,
    roomNightsSold: 66,
    totalRevenue: 56100,
    status: 'forecast',
    primaryFactor: 'Post-Holiday Booking Lag',
    recommendedAction: 'Apply early-bird dinner inclusion incentive'
  },
  {
    id: 'W23',
    label: 'Week 23',
    subLabel: 'Jun 1 – 7 (Forecast)',
    periodType: 'week',
    occupancyPercent: 92,
    adr: 960,
    revPar: 883.2,
    roomNightsAvailable: 84,
    roomNightsSold: 77,
    totalRevenue: 73920,
    status: 'forecast',
    primaryFactor: 'Summer High Season Opening'
  }
];

export const MONTHLY_OCCUPANCY_DATA: PeriodOccupancyMetric[] = [
  {
    id: 'M01',
    label: 'Jan 2026',
    subLabel: 'Winter Off-Peak',
    periodType: 'month',
    occupancyPercent: 62, // Alert below goal
    adr: 680,
    revPar: 421.6,
    roomNightsAvailable: 372,
    roomNightsSold: 231,
    totalRevenue: 157080,
    status: 'actual',
    primaryFactor: 'Post-Holiday Seasonal Trough',
    recommendedAction: 'Long-stay executive digital nomad packages & spa detox retreats'
  },
  {
    id: 'M02',
    label: 'Feb 2026',
    subLabel: 'Shoulder Season',
    periodType: 'month',
    occupancyPercent: 68, // Alert below goal
    adr: 720,
    revPar: 489.6,
    roomNightsAvailable: 336,
    roomNightsSold: 228,
    totalRevenue: 164160,
    status: 'actual',
    primaryFactor: 'Valentine Romance Surge offset by weak mid-weeks',
    recommendedAction: 'Valentine 3-night minimum with complimentary private wine cellar tasting'
  },
  {
    id: 'M03',
    label: 'Mar 2026',
    subLabel: 'Early Spring',
    periodType: 'month',
    occupancyPercent: 74, // Alert below goal
    adr: 750,
    revPar: 555.0,
    roomNightsAvailable: 372,
    roomNightsSold: 275,
    totalRevenue: 206250,
    status: 'actual',
    primaryFactor: 'Spring Equinox & European School Holidays',
    recommendedAction: 'Extend corporate wellness buyout outreach'
  },
  {
    id: 'M04',
    label: 'Apr 2026',
    subLabel: 'Spring Season',
    periodType: 'month',
    occupancyPercent: 84,
    adr: 815,
    revPar: 684.6,
    roomNightsAvailable: 360,
    roomNightsSold: 302,
    totalRevenue: 246130,
    status: 'actual',
    primaryFactor: 'Easter Festival & Mediterranean Reopening'
  },
  {
    id: 'M05',
    label: 'May 2026',
    subLabel: 'Peak Spring (Current)',
    periodType: 'month',
    occupancyPercent: 88,
    adr: 885,
    revPar: 778.8,
    roomNightsAvailable: 372,
    roomNightsSold: 327,
    totalRevenue: 289395,
    status: 'actual',
    primaryFactor: 'International Summits & Luxury Buyouts'
  },
  {
    id: 'M06',
    label: 'Jun 2026',
    subLabel: 'Summer Peak (Forecast)',
    periodType: 'month',
    occupancyPercent: 95,
    adr: 1040,
    revPar: 988.0,
    roomNightsAvailable: 360,
    roomNightsSold: 342,
    totalRevenue: 355680,
    status: 'forecast',
    primaryFactor: 'Ultra-Luxury High Season Bookings'
  },
  {
    id: 'M07',
    label: 'Jul 2026',
    subLabel: 'High Summer (Forecast)',
    periodType: 'month',
    occupancyPercent: 98,
    adr: 1150,
    revPar: 1127.0,
    roomNightsAvailable: 372,
    roomNightsSold: 365,
    totalRevenue: 419750,
    status: 'forecast',
    primaryFactor: 'Max Capacity Yachting & Private Island Charters'
  },
  {
    id: 'M08',
    label: 'Aug 2026',
    subLabel: 'Peak Summer (Forecast)',
    periodType: 'month',
    occupancyPercent: 96,
    adr: 1120,
    revPar: 1075.2,
    roomNightsAvailable: 372,
    roomNightsSold: 357,
    totalRevenue: 399840,
    status: 'forecast',
    primaryFactor: 'European Summer Holidays'
  },
  {
    id: 'M09',
    label: 'Sep 2026',
    subLabel: 'Late Summer (Forecast)',
    periodType: 'month',
    occupancyPercent: 86,
    adr: 890,
    revPar: 765.4,
    roomNightsAvailable: 360,
    roomNightsSold: 310,
    totalRevenue: 275900,
    status: 'forecast',
    primaryFactor: 'Wine Harvest & Culinary Excursions'
  },
  {
    id: 'M10',
    label: 'Oct 2026',
    subLabel: 'Autumn Shoulder (Forecast)',
    periodType: 'month',
    occupancyPercent: 78, // Alert below 80%
    adr: 790,
    revPar: 616.2,
    roomNightsAvailable: 372,
    roomNightsSold: 290,
    totalRevenue: 229100,
    status: 'forecast',
    primaryFactor: 'Fall Conference Season Lag',
    recommendedAction: 'Host Regional Executive Retreats with bespoke buyout rates'
  },
  {
    id: 'M11',
    label: 'Nov 2026',
    subLabel: 'Late Autumn (Forecast)',
    periodType: 'month',
    occupancyPercent: 65, // Alert below goal
    adr: 710,
    revPar: 461.5,
    roomNightsAvailable: 360,
    roomNightsSold: 234,
    totalRevenue: 166140,
    status: 'forecast',
    primaryFactor: 'Off-Peak Thermal Wellness Transition',
    recommendedAction: 'Launch Winter Sanctuary Wellness Residency package'
  },
  {
    id: 'M12',
    label: 'Dec 2026',
    subLabel: 'Festive Holidays (Forecast)',
    periodType: 'month',
    occupancyPercent: 92,
    adr: 980,
    revPar: 901.6,
    roomNightsAvailable: 372,
    roomNightsSold: 342,
    totalRevenue: 335160,
    status: 'forecast',
    primaryFactor: 'Festive Season & New Year Gala Buyouts'
  }
];

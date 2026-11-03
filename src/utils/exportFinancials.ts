import { DailyMetric, Room, Reservation } from '../types';

export interface FinancialExportOptions {
  metrics: DailyMetric[];
  rooms: Room[];
  reservations: Reservation[];
  periodLabel?: string;
  departmentFilter?: 'all' | 'rooms' | 'fb' | 'spa' | 'excursions';
  reportType?: string;
  preparedBy?: string;
}

/**
 * Cleanly escapes and formats CSV values
 */
function escapeCSV(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Exports detailed financial and occupancy data to a downloadable CSV file
 */
export function exportFinancialCSV({
  metrics,
  rooms,
  reservations,
  periodLabel = 'May 9 – May 17, 2026',
  departmentFilter = 'all',
  reportType = 'Periodic Financial & Occupancy Audit',
  preparedBy = 'Director of Finance / Revenue Strategy'
}: FinancialExportOptions): void {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  // Calculate Totals and Averages
  const totalRoomRev = metrics.reduce((sum, m) => sum + m.totalRoomRevenue, 0);
  const totalFBRev = metrics.reduce((sum, m) => sum + m.totalFBRevenue, 0);
  const totalSpaRev = metrics.reduce((sum, m) => sum + m.totalSpaRevenue, 0);
  const totalExcRev = metrics.reduce((sum, m) => sum + m.totalExcursionsRevenue, 0);
  const grossRev = totalRoomRev + totalFBRev + totalSpaRev + totalExcRev;
  
  const avgAdr = metrics.length ? Math.round(metrics.reduce((sum, m) => sum + m.adr, 0) / metrics.length) : 0;
  const avgOcc = metrics.length ? Math.round(metrics.reduce((sum, m) => sum + m.occupancyPercent, 0) / metrics.length) : 0;
  const avgRevPar = Math.round((avgAdr * (avgOcc / 100)) * 10) / 10;
  const totalArrivals = metrics.reduce((sum, m) => sum + m.arrivalsCount, 0);
  const totalDepartures = metrics.reduce((sum, m) => sum + m.departuresCount, 0);
  const totalKeys = rooms.length;
  const availableRoomNights = totalKeys * metrics.length;
  const occupiedRoomNights = Math.round(availableRoomNights * (avgOcc / 100));

  // Channel Calculations
  const directCount = reservations.filter(r => r.channel === 'Direct Web').length;
  const otaCount = reservations.filter(r => r.channel === 'Luxury Retreats OTA' || r.channel === 'Booking.com' || r.channel === 'Expedia').length;
  const vipCount = reservations.filter(r => r.channel === 'VIP Corporate' || r.channel === 'Concierge Walk-in').length;
  const totalBookings = Math.max(1, reservations.length);

  const lines: string[] = [];

  // ==========================================
  // SECTION 1: HEADER & METADATA
  // ==========================================
  lines.push(`"THE AZURE SANCTUARY — BOUTIQUE LUXURY RESORT & SANCTUARY"`);
  lines.push(`"REPORT TITLE:","${reportType}"`);
  lines.push(`"REPORTING CYCLE:","${periodLabel}"`);
  lines.push(`"DEPARTMENT SCOPE:","${departmentFilter.toUpperCase()}"`);
  lines.push(`"EXPORTED AT:","${timestamp}"`);
  lines.push(`"PREPARED BY:","${preparedBy}"`);
  lines.push(`"CURRENCY:","USD ($)"`);
  lines.push('');

  // ==========================================
  // SECTION 2: EXECUTIVE SUMMARY KPI AUDIT
  // ==========================================
  lines.push(`"=== EXECUTIVE FINANCIAL & OCCUPANCY SUMMARY ==="`);
  lines.push(`"KPI Metric","Value","Unit / Notes"`);
  lines.push(`"Gross Total Revenue",${escapeCSV(grossRev)},"USD ($)"`);
  lines.push(`"Suite Accommodation Revenue",${escapeCSV(totalRoomRev)},"${Math.round((totalRoomRev / grossRev) * 100)}% of total"`);
  lines.push(`"Food & Beverage Revenue",${escapeCSV(totalFBRev)},"${Math.round((totalFBRev / grossRev) * 100)}% of total"`);
  lines.push(`"Sanctuary Spa & Wellness Revenue",${escapeCSV(totalSpaRev)},"${Math.round((totalSpaRev / grossRev) * 100)}% of total"`);
  lines.push(`"Marine Safari & Excursion Revenue",${escapeCSV(totalExcRev)},"${Math.round((totalExcRev / grossRev) * 100)}% of total"`);
  lines.push(`"Average Daily Rate (ADR)",${escapeCSV(avgAdr)},"USD ($) per occupied key"`);
  lines.push(`"Mean Occupancy Rate",${escapeCSV(avgOcc)},"%"`);
  lines.push(`"RevPAR (Revenue Per Available Room)",${escapeCSV(avgRevPar)},"USD ($)"`);
  lines.push(`"Total Inventory Keys",${escapeCSV(totalKeys)},"Suites & Villas"`);
  lines.push(`"Total Available Room Nights",${escapeCSV(availableRoomNights)},"Nights"`);
  lines.push(`"Total Occupied Room Nights",${escapeCSV(occupiedRoomNights)},"Nights"`);
  lines.push(`"Total Guest Arrivals",${escapeCSV(totalArrivals)},"Pax / Parties"`);
  lines.push(`"Total Guest Departures",${escapeCSV(totalDepartures)},"Pax / Parties"`);
  lines.push('');

  // ==========================================
  // SECTION 3: DAILY FINANCIAL & OCCUPANCY LEDGER
  // ==========================================
  lines.push(`"=== DAILY FINANCIAL & OCCUPANCY LEDGER ==="`);
  lines.push(`"Date","Day Label","Occupancy (%)","ADR ($)","RevPAR ($)","Suite Rev ($)","F&B Rev ($)","Spa Rev ($)","Excursions Rev ($)","Gross Total ($)","Arrivals","Departures"`);
  
  metrics.forEach(m => {
    const dayTotal = m.totalRoomRevenue + m.totalFBRevenue + m.totalSpaRevenue + m.totalExcursionsRevenue;
    lines.push([
      escapeCSV(m.date),
      escapeCSV(m.dayLabel),
      escapeCSV(m.occupancyPercent),
      escapeCSV(m.adr),
      escapeCSV(m.revPar),
      escapeCSV(m.totalRoomRevenue),
      escapeCSV(m.totalFBRevenue),
      escapeCSV(m.totalSpaRevenue),
      escapeCSV(m.totalExcursionsRevenue),
      escapeCSV(dayTotal),
      escapeCSV(m.arrivalsCount),
      escapeCSV(m.departuresCount)
    ].join(','));
  });

  // Totals Row
  lines.push([
    `"TOTAL / CYCLE AVERAGE"`,
    `"${metrics.length} Days"`,
    escapeCSV(avgOcc),
    escapeCSV(avgAdr),
    escapeCSV(avgRevPar),
    escapeCSV(totalRoomRev),
    escapeCSV(totalFBRev),
    escapeCSV(totalSpaRev),
    escapeCSV(totalExcRev),
    escapeCSV(grossRev),
    escapeCSV(totalArrivals),
    escapeCSV(totalDepartures)
  ].join(','));
  lines.push('');

  // ==========================================
  // SECTION 4: CHANNEL YIELD & COMMISSION ANALYSIS
  // ==========================================
  lines.push(`"=== CHANNEL YIELD & DISTRIBUTION AUDIT ==="`);
  lines.push(`"Channel Name","Booking Count","Share of Volume (%)","Est. Revenue ($)","Commission Tier (%)","Net Retained Margin (%)"`);
  
  const directShare = Math.round((directCount / totalBookings) * 100);
  const otaShare = Math.round((otaCount / totalBookings) * 100);
  const vipShare = Math.round((vipCount / totalBookings) * 100);
  
  const directRev = Math.round(grossRev * (directShare / 100));
  const otaRev = Math.round(grossRev * (otaShare / 100));
  const vipRev = Math.round(grossRev * (vipShare / 100));

  lines.push(`"Direct Web & Resident Portal",${escapeCSV(directCount)},${escapeCSV(directShare)},${escapeCSV(directRev)},"0%","100%"`);
  lines.push(`"VIP Corporate & Bespoke Concierge",${escapeCSV(vipCount)},${escapeCSV(vipShare)},${escapeCSV(vipRev)},"0%","100%"`);
  lines.push(`"Luxury Retreats & Partner OTAs",${escapeCSV(otaCount)},${escapeCSV(otaShare)},${escapeCSV(otaRev)},"15%","85%"`);
  lines.push('');

  // ==========================================
  // SECTION 5: INVENTORY KEYS & SUITE PERFORMANCE
  // ==========================================
  lines.push(`"=== SUITE CATEGORY INVENTORY & PRICING AUDIT ==="`);
  lines.push(`"Suite Number","Suite Name","Category","Base Price ($/nt)","Seasonal Price ($/nt)","Max Guests","Status"`);
  
  rooms.forEach(r => {
    lines.push([
      escapeCSV(r.number),
      escapeCSV(r.name),
      escapeCSV(r.type),
      escapeCSV(r.basePrice),
      escapeCSV(r.seasonalPrice),
      escapeCSV(r.maxGuests),
      escapeCSV(r.status.toUpperCase())
    ].join(','));
  });

  lines.push('');
  lines.push(`"--- END OF OFFICIAL AUDIT REPORT ---"`);

  // Construct CSV Blob & Trigger Download
  const csvContent = lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const sanitizedPeriod = periodLabel.replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `Azure_Sanctuary_Financial_Report_${sanitizedPeriod}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

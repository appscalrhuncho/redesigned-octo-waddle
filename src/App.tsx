/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageSquare, Sparkles, SlidersHorizontal } from 'lucide-react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OperationsCommandCenter } from './components/CommandCenter/OperationsCommandCenter';
import { AvailabilityGrid } from './components/TimelineMatrix/AvailabilityGrid';
import { FrontDeskDashboard } from './components/FrontDesk/FrontDeskDashboard';
import { GuestBookingPortal } from './components/BookingEngine/GuestBookingPortal';
import { GuestCompanionPortal } from './components/GuestExperience/GuestCompanionPortal';
import { AIConciergeChat } from './components/AIConcierge/AIConciergeChat';
import { RestaurantAndSpaPOS } from './components/POS/RestaurantAndSpaPOS';
import { HousekeepingBoard } from './components/Housekeeping/HousekeepingBoard';
import { GuestDirectory } from './components/GuestCRM/GuestDirectory';
import { ChannelManager } from './components/Distribution/ChannelManager';
import { GroupEventsManager } from './components/SalesEvents/GroupEventsManager';
import { RevenueDashboard } from './components/Analytics/RevenueDashboard';
import { NewReservationModal } from './components/Modals/NewReservationModal';
import { GuestFolioModal } from './components/Modals/GuestFolioModal';
import { DigitalKeyModal } from './components/Modals/DigitalKeyModal';

const HotelAppContent: React.FC = () => {
  const { activeView, setActiveView, openNewReservationModal } = useHotel();
  const isGuestExperience = ['booking_portal', 'booking', 'guest_portal'].includes(activeView);

  return (
    <div className="min-h-screen bg-[#F3F6F9] text-[#111A22] flex flex-col font-sans-body selection:bg-[#B8FF00]/30 selection:text-[#081015]">
      
      {/* Global brand header */}
      <Header />

      {/* SaaS Workspace Shell */}
      <div className="flex-1 lg:flex max-w-[1680px] w-full mx-auto">
        <Navigation />

        {/* Main Viewport Container */}
        <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-5 lg:py-7">
          {(activeView === 'dashboard') && <OperationsCommandCenter />}
          {(activeView === 'matrix' || activeView === 'timeline') && <AvailabilityGrid />}
          {(activeView === 'frontdesk' || activeView === 'front_desk') && <FrontDeskDashboard />}
          {(activeView === 'booking_portal' || activeView === 'booking') && <GuestBookingPortal />}
          {activeView === 'guest_portal' && <GuestCompanionPortal />}
          {activeView === 'concierge_ai' && <AIConciergeChat />}
          {activeView === 'pos' && <RestaurantAndSpaPOS />}
          {activeView === 'housekeeping' && <HousekeepingBoard />}
          {(activeView === 'guest_crm' || activeView === 'crm') && <GuestDirectory />}
          {activeView === 'channels' && <ChannelManager />}
          {activeView === 'sales_events' && <GroupEventsManager />}
          {activeView === 'analytics' && <RevenueDashboard />}
        </main>
      </div>

      {/* Global Floating Modals */}
      <NewReservationModal />
      <GuestFolioModal />
      <DigitalKeyModal />

      {/* Footer Branding */}
      <footer className="py-6 border-t border-[#DCE5EB] bg-[#F3F6F9] text-center text-xs text-[#647580]">
        <p className="max-w-7xl mx-auto px-4">
          Hotel Portfolio OS • Multi-property operations, guest experience & revenue intelligence
        </p>
      </footer>

      {!isGuestExperience && (
        <div className="brand-dark-shell fixed bottom-5 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-1.5 rounded-2xl border border-[#263540] bg-[#0C1218]/95 p-1.5 shadow-[0_14px_40px_rgba(8,12,17,0.32)] backdrop-blur-xl">
          <button
            onClick={() => setActiveView('concierge_ai')}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#C8FF45] transition-colors hover:bg-[#17232B]"
          >
            <MessageSquare className="h-4 w-4 text-[#B8FF00]" />
            <span>Ask Aura</span>
          </button>
          <button
            onClick={() => setActiveView('concierge_ai')}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#D1DDD7] transition-colors hover:bg-[#17232B]"
          >
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span>Guest request</span>
          </button>
          <button
            onClick={() => setActiveView('housekeeping')}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#D1DDD7] transition-colors hover:bg-[#17232B]"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Dispatch turn</span>
          </button>
          <button
            onClick={() => setActiveView('channels')}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#D1DDD7] transition-colors hover:bg-[#17232B]"
          >
            <SlidersHorizontal className="h-4 w-4 text-sky-300" />
            <span>Adjust rates</span>
          </button>
          <button
            onClick={() => openNewReservationModal()}
            aria-label="Create new reservation"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[#B8FF00] text-[#081015] transition-colors hover:bg-[#C8FF45]"
          >
            <span className="text-xl leading-none">+</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <HotelAppContent />
    </HotelProvider>
  );
}

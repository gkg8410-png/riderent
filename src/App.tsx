import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { CustomerHome } from './components/customer/CustomerHome';
import { CarSearchPage } from './components/customer/CarSearchPage';
import { CarDetailPage } from './components/customer/CarDetailPage';
import { BookingCheckoutModal } from './components/customer/BookingCheckoutModal';
import { CustomerBookings } from './components/customer/CustomerBookings';
import { CustomerFavorites } from './components/customer/CustomerFavorites';
import { CustomerChatModal } from './components/customer/CustomerChatModal';
import { CustomerSupportModal } from './components/customer/CustomerSupportModal';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { OwnerVehicleList } from './components/owner/OwnerVehicleList';
import { AddVehicleModal } from './components/owner/AddVehicleModal';
import { OwnerCalendarModal } from './components/owner/OwnerCalendarModal';
import { OwnerEarnings } from './components/owner/OwnerEarnings';
import { AdminPortal } from './components/admin/AdminPortal';
import { PlayStoreArchitectureModal } from './components/common/PlayStoreArchitectureModal';
import { PWAInstallModal } from './components/common/PWAInstallModal';
import { Vehicle, BookingPricingBreakdown } from './types';
import {
  ShieldCheck,
  PhoneCall,
  Clock,
  Car,
  MapPin,
  Heart,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, vehicles } = useApp();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('explore');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  // Search prefill filters
  const [searchPrefill, setSearchPrefill] = useState<{
    category?: string;
    city?: string;
    startDate?: string;
    endDate?: string;
  } | undefined>(undefined);

  // Modals
  const [checkoutData, setCheckoutData] = useState<{
    vehicle: Vehicle;
    startDate: string;
    endDate: string;
    withDelivery: boolean;
    pricing: BookingPricingBreakdown;
    couponCode?: string;
  } | null>(null);

  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showPlayStoreModal, setShowPlayStoreModal] = useState<boolean>(false);
  const [showAPKModal, setShowAPKModal] = useState<boolean>(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);
  const [calendarCarId, setCalendarCarId] = useState<string | null>(null);

  // Handlers
  const handleSelectCar = (carId: string) => {
    setSelectedCarId(carId);
    setCurrentTab('car-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (query: {
    city: string;
    category?: string;
    startDate: string;
    endDate: string;
  }) => {
    setSearchPrefill(query);
    setCurrentTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = (data: {
    vehicle: Vehicle;
    startDate: string;
    endDate: string;
    withDelivery: boolean;
    pricing: BookingPricingBreakdown;
    couponCode?: string;
  }) => {
    setCheckoutData(data);
  };

  const handleBookingSuccess = (bookingId: string) => {
    setCheckoutData(null);
    setSelectedCarId(null);
    setCurrentTab('bookings');
  };

  // Find vehicle for detail view if active
  const selectedVehicle = vehicles.find((v) => v.id === selectedCarId);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f1ea] text-[#1a1a1a] font-sans antialiased selection:bg-[#ff5d22] selection:text-white">
      {/* Sticky Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab !== 'car-detail') setSelectedCarId(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPlayStoreGuide={() => setShowPlayStoreModal(true)}
        onOpenSupportModal={() => setShowSupportModal(true)}
        onOpenAPKModal={() => setShowAPKModal(true)}
      />

      {/* Android Installation Banner */}
      <div className="bg-[#1a1a1a] border-b-2 border-[#ff5d22] px-4 py-2.5 text-xs text-[#f4f1ea]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
              Android App Ready:
            </span>
            <span className="text-[11px] text-[#ff5d22] font-bold">1-Tap Direct Install</span>
            <span className="hidden md:inline text-[10px] text-[#f4f1ea]/60">
              • Zero Parse Errors • WebAPK & Signed APK
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAPKModal(true)}
              className="px-3.5 py-1.5 bg-[#ff5d22] hover:bg-white hover:text-[#1a1a1a] text-white text-[11px] font-bold uppercase tracking-wider border border-white/20 shadow-[2px_2px_0px_#f4f1ea] transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Install on Android / Get APK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* CUSTOMER VIEWS */}
        {currentUser.role === 'CUSTOMER' && (
          <>
            {currentTab === 'explore' && (
              <CustomerHome
                onSelectCar={handleSelectCar}
                onSelectCategory={(catId) => {
                  setSearchPrefill({ category: catId });
                  setCurrentTab('search');
                }}
                onSearch={handleHeroSearch}
              />
            )}

            {currentTab === 'search' && (
              <CarSearchPage
                onSelectCar={handleSelectCar}
                initialCategory={searchPrefill?.category}
                initialCity={searchPrefill?.city}
                initialStartDate={searchPrefill?.startDate}
                initialEndDate={searchPrefill?.endDate}
              />
            )}

            {currentTab === 'car-detail' && selectedVehicle && (
              <CarDetailPage
                vehicle={selectedVehicle}
                onBack={() => setCurrentTab('explore')}
                onProceedToBooking={handleProceedToCheckout}
              />
            )}

            {currentTab === 'bookings' && (
              <CustomerBookings
                onOpenChat={(bookingId) => setActiveChatBookingId(bookingId)}
                onOpenSupport={() => setShowSupportModal(true)}
                onExploreCars={() => setCurrentTab('explore')}
              />
            )}

            {currentTab === 'favourites' && (
              <CustomerFavorites
                onSelectCar={handleSelectCar}
                onExploreCars={() => setCurrentTab('explore')}
              />
            )}
          </>
        )}

        {/* OWNER / HOST VIEWS */}
        {currentUser.role === 'OWNER' && (
          <>
            {currentTab === 'owner-dashboard' && (
              <OwnerDashboard
                onAddNewCar={() => setShowAddVehicleModal(true)}
                onOpenCalendar={(carId) => setCalendarCarId(carId)}
                onOpenChat={(bookingId) => setActiveChatBookingId(bookingId)}
                onNavigateToFleet={() => setCurrentTab('owner-vehicles')}
                onNavigateToEarnings={() => setCurrentTab('owner-earnings')}
              />
            )}

            {(currentTab === 'owner-vehicles' || currentTab === 'owner-bookings') && (
              <OwnerVehicleList
                onAddNewCar={() => setShowAddVehicleModal(true)}
                onOpenCalendar={(carId) => setCalendarCarId(carId)}
              />
            )}

            {currentTab === 'owner-earnings' && <OwnerEarnings />}
          </>
        )}

        {/* ADMIN VIEWS */}
        {currentUser.role === 'ADMIN' && <AdminPortal />}
      </main>

      {/* Global Modals */}
      {checkoutData && (
        <BookingCheckoutModal
          vehicle={checkoutData.vehicle}
          startDate={checkoutData.startDate}
          endDate={checkoutData.endDate}
          withDelivery={checkoutData.withDelivery}
          pricing={checkoutData.pricing}
          couponCode={checkoutData.couponCode}
          onClose={() => setCheckoutData(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {activeChatBookingId && (
        <CustomerChatModal
          bookingId={activeChatBookingId}
          onClose={() => setActiveChatBookingId(null)}
        />
      )}

      {showSupportModal && (
        <CustomerSupportModal onClose={() => setShowSupportModal(false)} />
      )}

      {showPlayStoreModal && (
        <PlayStoreArchitectureModal onClose={() => setShowPlayStoreModal(false)} />
      )}

      <PWAInstallModal
        isOpen={showAPKModal}
        onClose={() => setShowAPKModal(false)}
      />

      {showAddVehicleModal && (
        <AddVehicleModal
          onClose={() => setShowAddVehicleModal(false)}
          onSuccess={(newCarId) => {
            setCurrentTab('owner-vehicles');
          }}
        />
      )}

      {calendarCarId && (
        <OwnerCalendarModal
          carId={calendarCarId}
          onClose={() => setCalendarCarId(null)}
        />
      )}

      {/* Trust & Guarantee Platform Footer */}
      <footer className="bg-[#1a1a1a] text-[#f4f1ea] mt-16 border-t-2 border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-[#f4f1ea]/15 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ff5d22]/20 text-[#ff5d22] border border-[#ff5d22]/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-bold text-sm tracking-tight">RTO & Parivahan Verified</strong>
                <p className="text-[#f4f1ea]/70 text-[11px] mt-0.5 leading-relaxed">
                  100% legal self-drive registrations with active commercial insurance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ff5d22]/20 text-[#ff5d22] border border-[#ff5d22]/40 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-bold text-sm tracking-tight">24/7 Roadside Assistance</strong>
                <p className="text-[#f4f1ea]/70 text-[11px] mt-0.5 leading-relaxed">
                  Instant towing and mechanical rescue across all Indian National Highways.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ff5d22]/20 text-[#ff5d22] border border-[#ff5d22]/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-bold text-sm tracking-tight">Fastag Enabled Cars</strong>
                <p className="text-[#f4f1ea]/70 text-[11px] mt-0.5 leading-relaxed">
                  Seamless toll gate crossing without stopping; settlements at trip close.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ff5d22]/20 text-[#ff5d22] border border-[#ff5d22]/40 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block font-bold text-sm tracking-tight">Instant Host Coordination</strong>
                <p className="text-[#f4f1ea]/70 text-[11px] mt-0.5 leading-relaxed">
                  Controlled in-app chat protects privacy until physical vehicle handover.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#f4f1ea]/80">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#ff5d22] text-white flex items-center justify-center font-black text-xs">
                RR
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-white font-bold tracking-tight">RideRent Mobility</span>
                <span className="text-[10px] uppercase font-mono tracking-widest opacity-60">Series 04</span>
              </div>
              <span className="text-[#f4f1ea]/40 hidden sm:inline">•</span>
              <span className="text-[11px] text-[#f4f1ea]/60">© {new Date().getFullYear()} Technologies Pvt. Ltd.</span>
            </div>

            <div className="flex items-center gap-5 text-[10px] font-bold tracking-[0.15em] uppercase">
              <button
                onClick={() => setShowAPKModal(true)}
                className="hover:text-[#ff5d22] text-[#ff5d22] font-mono transition cursor-pointer flex items-center gap-1"
              >
                <span>Install App (APK)</span>
              </button>
              <button
                onClick={() => setShowSupportModal(true)}
                className="hover:text-[#ff5d22] transition cursor-pointer"
              >
                Grievance Officer
              </button>
              <button
                onClick={() => setShowPlayStoreModal(true)}
                className="hover:text-[#ff5d22] transition cursor-pointer"
              >
                Play Store Specs
              </button>
              <div className="flex items-center gap-1.5 ml-2">
                <div className="w-2 h-2 rounded-full bg-[#ff5d22]"></div>
                <div className="w-2 h-2 rounded-full bg-white opacity-30"></div>
                <div className="w-2 h-2 rounded-full bg-white opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

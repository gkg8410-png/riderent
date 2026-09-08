import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INDIAN_CITIES } from '../../config/appConfig';
import { UserRole } from '../../types';
import {
  Car,
  MapPin,
  Heart,
  Calendar,
  Shield,
  Smartphone,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Download,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenPlayStoreGuide: () => void;
  onOpenSupportModal: () => void;
  onOpenAPKModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenPlayStoreGuide,
  onOpenSupportModal,
  onOpenAPKModal,
}) => {
  const {
    currentUser,
    allUsers,
    switchRole,
    switchUser,
    selectedCity,
    setSelectedCity,
    favourites,
    bookings,
    vehicles,
    resetToDemoData,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);

  // Active bookings count for current user
  const userActiveBookings = bookings.filter(
    (b) => b.customerId === currentUser.id && ['CONFIRMED', 'ACTIVE'].includes(b.status)
  ).length;

  // Pending vehicle approvals for admin
  const pendingApprovalsCount = vehicles.filter((v) => v.status === 'PENDING_APPROVAL').length;

  return (
    <header className="sticky top-0 z-40 bg-[#f4f1ea] border-b-2 border-[#1a1a1a] shadow-xs">
      {/* Top Banner Notice: Role Switcher & Live Demo Bar */}
      <div className="bg-[#1a1a1a] text-[#f4f1ea] text-xs px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#ff5d22]"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4f1ea]/80">
            Marketplace Engine • Series 04
          </span>
          <span className="hidden sm:inline text-xs text-[#f4f1ea]/40">|</span>
          <span className="hidden sm:inline text-[11px] text-[#f4f1ea]/80 font-mono">
            PERSPECTIVE: <strong className="text-white uppercase tracking-wider">{currentUser.role}</strong> ({currentUser.name})
          </span>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[#f4f1ea]/50 text-[10px] uppercase font-bold tracking-widest hidden md:inline">Perspective:</span>
          {(['CUSTOMER', 'OWNER', 'ADMIN'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => {
                switchRole(role);
                if (role === 'ADMIN') setCurrentTab('admin');
                else if (role === 'OWNER') setCurrentTab('owner-dashboard');
                else setCurrentTab('explore');
              }}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors duration-150 border border-transparent cursor-pointer ${
                currentUser.role === role
                  ? 'bg-[#ff5d22] text-white shadow-xs'
                  : 'bg-[#2a2a2a] text-[#f4f1ea]/80 hover:bg-white hover:text-[#1a1a1a]'
              }`}
            >
              {role === 'CUSTOMER' ? 'Customer' : role === 'OWNER' ? 'Car Host' : 'Admin Portal'}
              {role === 'ADMIN' && pendingApprovalsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-white text-[#1a1a1a] font-mono text-[9px] font-bold">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          ))}

          <button
            onClick={resetToDemoData}
            title="Reset to fresh demo dataset"
            className="ml-1.5 p-1 text-[#f4f1ea]/60 hover:text-[#ff5d22] hover:bg-white/10 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 bg-[#f4f1ea]">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              if (currentUser.role === 'ADMIN') setCurrentTab('admin');
              else if (currentUser.role === 'OWNER') setCurrentTab('owner-dashboard');
              else setCurrentTab('explore');
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 bg-[#1a1a1a] text-[#f4f1ea] flex items-center justify-center border border-[#1a1a1a] group-hover:bg-[#ff5d22] transition-colors">
              <Car className="w-5 h-5 text-[#f4f1ea]" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tighter text-[#1a1a1a] leading-none uppercase">
                Ride<span className="text-[#ff5d22]">—</span>Rent
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#1a1a1a]/50">
                P2P Fleet / India
              </span>
            </div>
          </button>

          {/* City Selector (for Customers and General browsing) */}
          {currentUser.role === 'CUSTOMER' && (
            <div className="relative hidden md:flex items-center">
              <MapPin className="w-3.5 h-3.5 text-[#ff5d22] absolute left-3 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="pl-8 pr-8 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1a1a1a] bg-white border border-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#ff5d22] cursor-pointer appearance-none"
              >
                <option value="All Cities">All Cities (India)</option>
                {INDIAN_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#1a1a1a] absolute right-2.5 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Center Navigation Links based on active role */}
        <nav className="hidden lg:flex items-center gap-1">
          {currentUser.role === 'CUSTOMER' && (
            <>
              <button
                onClick={() => setCurrentTab('explore')}
                className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition cursor-pointer ${
                  currentTab === 'explore'
                    ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                    : 'text-[#1a1a1a] hover:underline decoration-2 underline-offset-4'
                }`}
              >
                Explore Cars
              </button>
              <button
                onClick={() => setCurrentTab('search')}
                className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition cursor-pointer ${
                  currentTab === 'search'
                    ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                    : 'text-[#1a1a1a] hover:underline decoration-2 underline-offset-4'
                }`}
              >
                Search & Filter
              </button>
              <button
                onClick={() => setCurrentTab('bookings')}
                className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest relative transition cursor-pointer ${
                  currentTab === 'bookings'
                    ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                    : 'text-[#1a1a1a] hover:underline decoration-2 underline-offset-4'
                }`}
              >
                My Bookings
                {userActiveBookings > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-[#ff5d22] text-white text-[10px] font-black">
                    {userActiveBookings}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentTab('favourites')}
                className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'favourites'
                    ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                    : 'text-[#1a1a1a] hover:underline decoration-2 underline-offset-4'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-[#ff5d22] fill-[#ff5d22]" />
                <span>Saved ({favourites.length})</span>
              </button>
            </>
          )}

          {currentUser.role === 'OWNER' && (
            <>
              <button
                onClick={() => setCurrentTab('owner-dashboard')}
                className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition cursor-pointer ${
                  currentTab === 'owner-dashboard'
                    ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                    : 'text-[#1a1a1a] hover:underline decoration-2 underline-offset-4'
                }`}
              >
                Host Dashboard
              </button>
              <button
                onClick={() => setCurrentTab('owner-vehicles')}
                className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition cursor-pointer ${
                  currentTab === 'owner-vehicles'
                    ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                    : 'text-[#1a1a1a] hover:underline decoration-2 underline-offset-4'
                }`}
              >
                My Fleet
              </button>
              <button
                onClick={() => setCurrentTab('owner-bookings')}
                className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition cursor-pointer ${
                  currentTab === 'owner-bookings'
                    ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                    : 'text-[#1a1a1a] hover:underline decoration-2 underline-offset-4'
                }`}
              >
                Rental Calendar
              </button>
              <button
                onClick={() => setCurrentTab('owner-earnings')}
                className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition cursor-pointer ${
                  currentTab === 'owner-earnings'
                    ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                    : 'text-[#1a1a1a] hover:underline decoration-2 underline-offset-4'
                }`}
              >
                Earnings & Payouts
              </button>
            </>
          )}

          {currentUser.role === 'ADMIN' && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1a1a1a] text-[#f4f1ea] border border-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5 text-[#ff5d22]" />
                Admin Console
              </div>
            </>
          )}
        </nav>

        {/* Right action items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Android APK & WebAPK Install Button */}
          <button
            onClick={onOpenAPKModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#ff5d22] hover:bg-[#1a1a1a] text-white border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
            title="Download Android APK / Install 1-Tap WebAPK"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Get Android APK</span>
            <span className="sm:hidden">APK</span>
          </button>

          {/* Android Play Store & Flutter App Architecture preview */}
          <button
            onClick={onOpenPlayStoreGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-white hover:bg-[#1a1a1a] hover:text-[#f4f1ea] text-[#1a1a1a] border border-[#1a1a1a] transition cursor-pointer"
            title="Google Play Store & Flutter Monorepo Architecture"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#ff5d22]" />
            <span className="hidden sm:inline">Play Store Specs</span>
          </button>

          {/* Support Ticket Quick Button */}
          <button
            onClick={onOpenSupportModal}
            className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] hover:underline decoration-2 underline-offset-4 transition cursor-pointer"
          >
            Support
          </button>

          {/* User Profile & Demo Account Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-2.5 bg-white hover:bg-[#f4f1ea] border border-[#1a1a1a] transition cursor-pointer"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a] hidden sm:inline font-mono">
                {currentUser.name.split(' ')[0]}
              </span>
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="w-7 h-7 object-cover border border-[#1a1a1a]"
              />
              <ChevronDown className="w-3 h-3 text-[#1a1a1a] mr-1" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#f4f1ea] border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-[#1a1a1a]">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#1a1a1a]/60">Signed in as</p>
                  <p className="text-sm font-black text-[#1a1a1a] truncate">{currentUser.name}</p>
                  <p className="text-xs text-[#1a1a1a]/70 truncate font-mono">{currentUser.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-[#1a1a1a] text-white">
                    ROLE: {currentUser.role}
                  </span>
                </div>

                <div className="py-1">
                  <p className="px-4 py-1.5 text-[9px] uppercase font-black tracking-widest text-[#1a1a1a]/50">
                    Switch Test Personas
                  </p>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowUserMenu(false);
                        if (u.role === 'ADMIN') setCurrentTab('admin');
                        else if (u.role === 'OWNER') setCurrentTab('owner-dashboard');
                        else setCurrentTab('explore');
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-white transition cursor-pointer ${
                        currentUser.id === u.id ? 'bg-white font-bold border-l-4 border-[#ff5d22]' : ''
                      }`}
                    >
                      <div>
                        <p className="font-bold text-[#1a1a1a]">{u.name}</p>
                        <p className="text-[10px] text-[#1a1a1a]/60 uppercase">{u.role} • {u.city}</p>
                      </div>
                      {currentUser.id === u.id && (
                        <span className="w-2 h-2 rounded-full bg-[#ff5d22]"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

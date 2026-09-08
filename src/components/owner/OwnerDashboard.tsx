import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  TrendingUp,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  Plus,
  Star,
  Users,
  Wallet,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

interface OwnerDashboardProps {
  onAddNewCar: () => void;
  onOpenCalendar: (carId: string) => void;
  onOpenChat: (bookingId: string) => void;
  onNavigateToFleet: () => void;
  onNavigateToEarnings: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onAddNewCar,
  onOpenCalendar,
  onOpenChat,
  onNavigateToFleet,
  onNavigateToEarnings,
}) => {
  const { currentUser, vehicles, bookings, reviews } = useApp();

  // Filter vehicles owned by current user
  const myVehicles = vehicles.filter((v) => v.ownerId === currentUser.id);
  const activeVehicles = myVehicles.filter((v) => v.status === 'ACTIVE');
  const pendingVehicles = myVehicles.filter((v) => v.status === 'PENDING_APPROVAL');

  // Filter bookings for current owner's vehicles
  const myBookings = bookings.filter((b) => b.ownerId === currentUser.id);
  const upcomingBookings = myBookings.filter((b) =>
    ['CONFIRMED', 'ACTIVE', 'OWNER_PENDING', 'OWNER_ACCEPTED'].includes(b.status)
  );

  // Financial calculations
  const totalCompletedBookings = myBookings.filter((b) => b.status === 'COMPLETED');
  const totalEarnings = totalCompletedBookings.reduce(
    (sum, b) => sum + (b.pricing.ownerEarning || 0),
    0
  );
  const pendingEarnings = upcomingBookings.reduce(
    (sum, b) => sum + (b.pricing.ownerEarning || 0),
    0
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner with KYC Status */}
      <div className="bg-[#1a1a1a] text-[#f4f1ea] border-2 border-[#1a1a1a] p-6 sm:p-8 shadow-[6px_6px_0px_#1a1a1a] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#ff5d22] text-white border border-[#ff5d22]">
              Partner Fleet Terminal
            </span>
            {currentUser.ownerStatus === 'VERIFIED' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#1a1a1a] bg-white px-2 py-0.5 border border-[#1a1a1a] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff5d22]" />
                KYC Dossier Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#1a1a1a] bg-[#f4f1ea] px-2 py-0.5 border border-[#1a1a1a] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#ff5d22]" />
                KYC Audit Pending
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#f4f1ea]/80 mt-1 max-w-xl">
            You oversee {myVehicles.length} registered motorcars in {currentUser.city}. Maintain blacked-out calendar availability to optimize daily yields.
          </p>
        </div>

        <button
          onClick={onAddNewCar}
          className="self-start md:self-auto px-5 py-3 bg-[#ff5d22] hover:bg-white hover:text-[#1a1a1a] text-white font-mono font-bold uppercase tracking-widest text-xs flex items-center gap-2 border-2 border-white shadow-[3px_3px_0px_#ffffff] transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>List New Vehicle</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <div className="bg-white p-5 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest">
              Earned Payouts
            </span>
            <div className="w-8 h-8 border border-[#1a1a1a] bg-[#f4f1ea] text-[#1a1a1a] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4 text-[#ff5d22]" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-[#1a1a1a]">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase">Net after platform fee</p>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white p-5 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest">
              Escrow Receivable
            </span>
            <div className="w-8 h-8 border border-[#1a1a1a] bg-[#f4f1ea] text-[#1a1a1a] flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4 text-[#1a1a1a]" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-[#1a1a1a]">
            ₹{pendingEarnings.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase">
            {upcomingBookings.length} scheduled trips
          </p>
        </div>

        {/* Active Fleet */}
        <div className="bg-white p-5 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest">
              Fleet Capacity
            </span>
            <div className="w-8 h-8 border border-[#1a1a1a] bg-[#f4f1ea] text-[#1a1a1a] flex items-center justify-center font-bold">
              <Car className="w-4 h-4 text-[#1a1a1a]" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-[#1a1a1a]">{activeVehicles.length}</p>
          <p className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase">
            {pendingVehicles.length > 0
              ? `${pendingVehicles.length} under review`
              : 'All listings live'}
          </p>
        </div>

        {/* Host Rating */}
        <div className="bg-white p-5 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest">
              Partner Rating
            </span>
            <div className="w-8 h-8 border border-[#1a1a1a] bg-[#f4f1ea] text-[#ff5d22] flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-[#ff5d22]" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-[#1a1a1a]">4.92 ★</p>
          <p className="text-[10px] font-mono text-[#ff5d22] uppercase tracking-wider font-bold">Top Verified Tier</p>
        </div>
      </div>

      {/* Upcoming Trips Table */}
      <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1a1a1a]">Active & Forthcoming Schedules</h2>
            <p className="text-xs font-mono text-[#1a1a1a]/70">
              Imminent rentals. Inspect FASTag recharge balance and vehicle condition with guest.
            </p>
          </div>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="text-center py-8 text-[#1a1a1a]/50 text-xs font-mono">
            No active trips booked in current queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#1a1a1a] text-[#1a1a1a] font-mono font-bold uppercase text-[10px]">
                  <th className="pb-3">Docket ID</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Traveler</th>
                  <th className="pb-3">Timeline</th>
                  <th className="pb-3">Host Net</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Escrow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/20">
                {upcomingBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-[#f4f1ea]">
                    <td className="py-3 font-mono font-bold text-[#1a1a1a]">{bk.id}</td>
                    <td className="py-3 font-bold text-[#1a1a1a]">{bk.vehicleName}</td>
                    <td className="py-3">
                      <p className="font-bold text-[#1a1a1a]">{bk.customerName}</p>
                      <p className="text-[10px] font-mono text-[#1a1a1a]/60">{bk.customerPhone}</p>
                    </td>
                    <td className="py-3 font-mono text-xs text-[#1a1a1a]/80">
                      {bk.startDate} → {bk.endDate} ({bk.pricing.days}d)
                    </td>
                    <td className="py-3 font-mono font-bold text-[#ff5d22]">
                      ₹{bk.pricing.ownerEarning.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 border border-[#1a1a1a] text-[10px] font-mono font-bold bg-[#f4f1ea] text-[#1a1a1a] uppercase">
                        {bk.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onOpenChat(bk.id)}
                        className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#ff5d22] text-white font-mono font-bold uppercase text-[10px] tracking-wider border border-[#1a1a1a] inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fleet Quick View */}
      <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1a1a1a]">Your Registered Fleet</h2>
            <p className="text-xs font-mono text-[#1a1a1a]/70">Manage tariffs, blackout schedules, and live status</p>
          </div>
          <button
            onClick={onNavigateToFleet}
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff5d22] hover:text-[#1a1a1a] flex items-center gap-1 cursor-pointer"
          >
            Manage Fleet ({myVehicles.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myVehicles.map((car) => (
            <div
              key={car.id}
              className="p-4 border-2 border-[#1a1a1a] bg-[#f4f1ea] shadow-[3px_3px_0px_#1a1a1a] space-y-3"
            >
              <div className="h-32 border-2 border-[#1a1a1a] overflow-hidden bg-white">
                <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#1a1a1a] truncate">{car.name}</h4>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 border border-[#1a1a1a] uppercase ${
                      car.status === 'ACTIVE'
                        ? 'bg-white text-[#1a1a1a]'
                        : car.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-100 text-amber-950'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {car.status}
                  </span>
                </div>
                <p className="text-[10px] text-[#1a1a1a]/70 font-mono mt-0.5 uppercase tracking-wider">{car.numberPlate}</p>
                <p className="text-sm font-mono font-bold text-[#ff5d22] mt-1">
                  ₹{car.pricePerDay.toLocaleString('en-IN')} <span className="text-[10px] text-[#1a1a1a]/70">/day</span>
                </p>
              </div>

              <div className="pt-2 border-t border-[#1a1a1a]">
                <button
                  onClick={() => onOpenCalendar(car.id)}
                  className="w-full py-2 bg-white border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] font-mono font-bold uppercase text-[10px] tracking-wider transition cursor-pointer shadow-[2px_2px_0px_#1a1a1a]"
                >
                  Block Calendar Dates
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

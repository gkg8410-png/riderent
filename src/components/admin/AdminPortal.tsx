import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle, User, Booking, SupportTicket, Coupon } from '../../types';
import {
  ShieldCheck,
  TrendingUp,
  Car,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sliders,
  Tag,
  LifeBuoy,
  FileText,
  DollarSign,
  Search,
  Eye,
  Check,
  X,
  MessageSquare,
  Shield,
  Layers,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    vehicles,
    allUsers,
    bookings,
    tickets,
    coupons,
    auditLogs,
    platformSettings,
    approveVehicle,
    rejectVehicle,
    updateUserVerification,
    resolveSupportTicket,
    updatePlatformSettings,
    createCoupon,
    deleteCoupon,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'OVERVIEW' | 'APPROVALS' | 'USERS' | 'BOOKINGS' | 'SETTINGS' | 'COUPONS' | 'SUPPORT' | 'AUDIT'
  >('OVERVIEW');

  // Rejection modal state
  const [rejectingVehicleId, setRejectingVehicleId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Registration Certificate (RC) copy unclear');

  // Support ticket response state
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // New coupon state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [newCouponVal, setNewCouponVal] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(3000);
  const [newCouponMax, setNewCouponMax] = useState(1500);
  const [newCouponDesc, setNewCouponDesc] = useState('Festive 15% discount');

  // Settings form
  const [commPercent, setCommPercent] = useState(platformSettings.commissionPercentage);
  const [taxPercent, setTaxPercent] = useState(platformSettings.taxPercentage);
  const [platformFee, setPlatformFee] = useState(platformSettings.defaultPlatformFee);
  const [autoApprove, setAutoApprove] = useState(platformSettings.autoApproveVehicles);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Stats
  const totalGMV = bookings.reduce((sum, b) => sum + b.pricing.totalPayable, 0);
  const totalPlatformRevenue = bookings.reduce((sum, b) => sum + (b.pricing.platformRevenue || 0), 0);
  const pendingApprovals = vehicles.filter((v) => v.status === 'PENDING_APPROVAL');
  const activeVehicles = vehicles.filter((v) => v.status === 'ACTIVE');
  const openTickets = tickets.filter((t) => t.status === 'OPEN');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      commissionPercentage: Number(commPercent),
      taxPercentage: Number(taxPercent),
      defaultPlatformFee: Number(platformFee),
      autoApproveVehicles: autoApprove,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    createCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponVal),
      minBookingAmount: Number(newCouponMin),
      maxDiscount: Number(newCouponMax),
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      usageLimit: 500,
      isActive: true,
      description: newCouponDesc,
    });
    setNewCouponCode('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner */}
      <div className="bg-[#1a1a1a] text-[#f4f1ea] border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#ff5d22] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff5d22] text-[#1a1a1a] flex items-center justify-center font-black border border-white">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">RideRent Master Administrative Chambers</h1>
            <p className="text-xs font-mono text-[#f4f1ea]/70">
              Protocol verification, vehicle dossier accreditation, and escrow clearinghouse
            </p>
          </div>
        </div>

        {pendingApprovals.length > 0 && (
          <div className="px-3.5 py-1.5 bg-[#ff5d22] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border border-white shadow-[2px_2px_0px_#ffffff]">
            <AlertCircle className="w-4 h-4 text-white" />
            <span>{pendingApprovals.length} Dossiers Awaiting Audit</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white p-1.5 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] overflow-x-auto text-xs font-mono font-bold uppercase gap-1">
        <button
          onClick={() => setActiveAdminTab('OVERVIEW')}
          className={`px-3.5 py-2 transition whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'OVERVIEW'
              ? 'bg-[#1a1a1a] text-white'
              : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveAdminTab('APPROVALS')}
          className={`px-3.5 py-2 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeAdminTab === 'APPROVALS'
              ? 'bg-[#1a1a1a] text-white'
              : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
          }`}
        >
          <span>Vehicle Audits</span>
          {pendingApprovals.length > 0 && (
            <span className="px-1.5 py-0.2 bg-[#ff5d22] text-white text-[10px] font-mono font-bold">
              {pendingApprovals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('USERS')}
          className={`px-3.5 py-2 transition whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'USERS'
              ? 'bg-[#1a1a1a] text-white'
              : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
          }`}
        >
          Entities & KYC ({allUsers.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('BOOKINGS')}
          className={`px-3.5 py-2 transition whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'BOOKINGS'
              ? 'bg-[#1a1a1a] text-white'
              : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
          }`}
        >
          Charters ({bookings.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('SETTINGS')}
          className={`px-3.5 py-2 transition whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'SETTINGS'
              ? 'bg-[#1a1a1a] text-white'
              : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
          }`}
        >
          Tariffs & Platform Rules
        </button>

        <button
          onClick={() => setActiveAdminTab('COUPONS')}
          className={`px-3.5 py-2 transition whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'COUPONS'
              ? 'bg-[#1a1a1a] text-white'
              : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
          }`}
        >
          Promos ({coupons.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('SUPPORT')}
          className={`px-3.5 py-2 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeAdminTab === 'SUPPORT'
              ? 'bg-[#1a1a1a] text-white'
              : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
          }`}
        >
          <span>Grievance Desk</span>
          {openTickets.length > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px]">
              {openTickets.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('AUDIT')}
          className={`px-3.5 py-2 transition whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'AUDIT'
              ? 'bg-[#1a1a1a] text-white'
              : 'text-[#1a1a1a] hover:bg-[#f4f1ea]'
          }`}
        >
          Immutable Ledger ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeAdminTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest block">
                Gross Marketplace Value
              </span>
              <p className="text-2xl font-mono font-bold text-[#1a1a1a]">
                ₹{totalGMV.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] font-mono text-[#ff5d22] uppercase">
                Across {bookings.length} reservations
              </p>
            </div>

            <div className="p-5 bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest block">
                Platform Brokerage Revenue
              </span>
              <p className="text-2xl font-mono font-bold text-[#ff5d22]">
                ₹{totalPlatformRevenue.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase">
                {platformSettings.commissionPercentage}% brokerage + Roadside fee
              </p>
            </div>

            <div className="p-5 bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest block">
                Accredited Fleet
              </span>
              <p className="text-2xl font-mono font-bold text-[#1a1a1a]">{activeVehicles.length}</p>
              <p className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase">
                {pendingApprovals.length} dossiers awaiting review
              </p>
            </div>

            <div className="p-5 bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest block">
                Enrolled Entities
              </span>
              <p className="text-2xl font-mono font-bold text-[#1a1a1a]">{allUsers.length}</p>
              <p className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase">Travelers & verified hosts</p>
            </div>
          </div>

          {/* Quick Approvals Preview */}
          {pendingApprovals.length > 0 && (
            <div className="bg-[#f4f1ea] border-2 border-[#1a1a1a] p-6 shadow-[4px_4px_0px_#1a1a1a] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-[#1a1a1a] text-base">Regulatory Action: Pending Vehicle Dossiers</h3>
                  <p className="text-xs font-mono text-[#1a1a1a]/70">
                    Host certificates necessitate compliance review prior to public discovery.
                  </p>
                </div>
                <button
                  onClick={() => setActiveAdminTab('APPROVALS')}
                  className="px-4 py-2 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
                >
                  Audit Dossiers ({pendingApprovals.length})
                </button>
              </div>
            </div>
          )}

          {/* Recent Bookings Table */}
          <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">Recent Platform Charter Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b-2 border-[#1a1a1a] text-[#1a1a1a] font-bold uppercase text-[10px]">
                    <th className="pb-3">Reference ID</th>
                    <th className="pb-3">Vehicle</th>
                    <th className="pb-3">Traveler</th>
                    <th className="pb-3">Host</th>
                    <th className="pb-3">Total Paid</th>
                    <th className="pb-3">Platform Cut</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]/20">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-[#f4f1ea]">
                      <td className="py-3 font-bold text-[#1a1a1a]">{b.id}</td>
                      <td className="py-3 font-sans font-bold text-[#1a1a1a]">{b.vehicleName}</td>
                      <td className="py-3 text-[#1a1a1a]">{b.customerName}</td>
                      <td className="py-3 text-[#1a1a1a]">{b.ownerName}</td>
                      <td className="py-3 font-bold text-[#1a1a1a]">
                        ₹{b.pricing.totalPayable.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 font-bold text-[#ff5d22]">
                        ₹{(b.pricing.platformRevenue || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 border border-[#1a1a1a] text-[9px] font-bold uppercase ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-950'
                              : b.status === 'COMPLETED'
                              ? 'bg-sky-100 text-sky-950'
                              : 'bg-rose-100 text-rose-950'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VEHICLE APPROVALS */}
      {activeAdminTab === 'APPROVALS' && (
        <div className="space-y-4">
          <div className="border-b-2 border-[#1a1a1a] pb-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a]">Vehicle Accreditation Registry</h2>
            <p className="text-xs font-mono text-[#1a1a1a]/70">
              Verify Registration Certificates (RC), Insurance policies, and vehicular telemetry before granting live status
            </p>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="bg-white border-2 border-[#1a1a1a] p-12 text-center space-y-2 shadow-[4px_4px_0px_#1a1a1a]">
              <CheckCircle className="w-12 h-12 text-[#ff5d22] mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">No Vehicles Pending Approval</h3>
              <p className="text-xs font-mono text-[#1a1a1a]/70">
                All submitted vehicular submissions have been audited and accredited.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((car) => (
                <div
                  key={car.id}
                  className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-20 bg-[#f4f1ea] shrink-0 border-2 border-[#1a1a1a] overflow-hidden">
                        <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold uppercase bg-[#ff5d22] text-white px-2 py-0.5 border border-[#1a1a1a]">
                            {car.category}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#1a1a1a] bg-[#f4f1ea] px-2 py-0.5 border border-[#1a1a1a]">
                            {car.numberPlate}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-lg text-[#1a1a1a] mt-1">{car.name}</h3>
                        <p className="text-xs font-mono text-[#1a1a1a]/70">
                          Host: <strong className="text-[#1a1a1a]">{car.ownerName}</strong> ({car.city})
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[10px] uppercase text-[#1a1a1a]/60 block">Proposed Tariff</span>
                      <strong className="text-lg font-bold text-[#1a1a1a]">
                        ₹{car.pricePerDay.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-xs text-[#1a1a1a]/60"> /day</span>
                      <span className="text-[10px] text-[#1a1a1a]/60 block">
                        Deposit: ₹{car.securityDeposit.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Documents Checklist */}
                  <div className="p-4 bg-[#f4f1ea] border border-[#1a1a1a] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-[9px] font-bold text-[#1a1a1a]/70 uppercase block">
                        Registration Certificate (RC)
                      </span>
                      <p className="font-bold text-[#1a1a1a]">
                        {car.documents.find((d) => d.type === 'RC')?.documentNumber || car.numberPlate}
                      </p>
                      <span className="text-[10px] text-emerald-800 uppercase font-bold">
                        ✓ Valid Parivahan Verification
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-[#1a1a1a]/70 uppercase block">
                        Commercial Insurance Policy
                      </span>
                      <p className="font-bold text-[#1a1a1a]">
                        {car.documents.find((d) => d.type === 'Insurance')?.documentNumber || 'HDFC-ERGO-99201'}
                      </p>
                      <span className="text-[10px] text-emerald-800 uppercase font-bold">
                        ✓ Comprehensive Cover Verified
                      </span>
                    </div>
                  </div>

                  {/* Approve / Reject Controls */}
                  <div className="flex justify-end gap-2 pt-2 border-t-2 border-[#1a1a1a]">
                    <button
                      onClick={() => setRejectingVehicleId(car.id)}
                      className="px-4 py-2 bg-white hover:bg-rose-100 text-rose-900 font-mono font-bold uppercase text-xs border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
                    >
                      Reject with Advisory
                    </button>
                    <button
                      onClick={() => approveVehicle(car.id)}
                      className="px-5 py-2 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-mono font-bold uppercase text-xs border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
                    >
                      Accredit & Publish Live
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rejection Modal */}
          {rejectingVehicleId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/80 p-4">
              <div className="bg-white border-2 border-[#1a1a1a] max-w-md w-full p-6 space-y-4 shadow-[8px_8px_0px_#1a1a1a]">
                <h3 className="font-serif font-bold text-base text-[#1a1a1a]">Specify Compliance Rejection Advisory</h3>
                <p className="text-xs font-mono text-[#1a1a1a]/70">
                  The host partner will receive this notification in their portal to supply corrected paperwork.
                </p>

                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none"
                >
                  <option value="Registration Certificate (RC) copy unclear or mismatched">
                    Registration Certificate (RC) copy unclear or mismatched
                  </option>
                  <option value="Commercial insurance policy has expired">
                    Commercial insurance policy has expired
                  </option>
                  <option value="Vehicle photos do not clearly display exterior condition">
                    Vehicle photos do not clearly display exterior condition
                  </option>
                  <option value="Proposed security deposit does not comply with guidelines">
                    Proposed security deposit does not comply with guidelines
                  </option>
                  <option value="Other compliance defect">Other compliance defect</option>
                </select>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#1a1a1a]">
                  <button
                    onClick={() => setRejectingVehicleId(null)}
                    className="px-4 py-2 bg-white text-[#1a1a1a] border border-[#1a1a1a] font-mono font-bold uppercase text-xs hover:bg-[#f4f1ea] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      rejectVehicle(rejectingVehicleId, rejectReason);
                      setRejectingVehicleId(null);
                    }}
                    className="px-4 py-2 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-mono font-bold uppercase text-xs border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USERS & KYC */}
      {activeAdminTab === 'USERS' && (
        <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-4">
          <div className="border-b-2 border-[#1a1a1a] pb-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a]">User Entities & KYC Validation</h2>
            <p className="text-xs font-mono text-[#1a1a1a]/70">
              Inspect registered accounts and host partner compliance verifications
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b-2 border-[#1a1a1a] text-[#1a1a1a] font-bold uppercase text-[10px]">
                  <th className="pb-3">Entity</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Jurisdiction</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">KYC Clearance</th>
                  <th className="pb-3 text-right">Sanction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/20">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f4f1ea]">
                    <td className="py-3 flex items-center gap-2.5 font-sans">
                      <img
                        src={
                          u.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                        }
                        alt=""
                        className="w-8 h-8 rounded-none border border-[#1a1a1a] object-cover"
                      />
                      <div>
                        <strong className="font-bold text-[#1a1a1a]">{u.name}</strong>
                        <p className="text-[10px] text-[#1a1a1a]/60 font-mono">{u.id}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 border border-[#1a1a1a] text-[9px] font-bold bg-[#f4f1ea] text-[#1a1a1a]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-[#1a1a1a]">{u.city}</td>
                    <td className="py-3 text-[#1a1a1a]">
                      <p>{u.email}</p>
                      <p className="text-[10px] text-[#1a1a1a]/60">{u.phone}</p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 border border-[#1a1a1a] text-[9px] font-bold uppercase ${
                          u.isVerified
                            ? 'bg-emerald-100 text-emerald-950'
                            : 'bg-amber-100 text-amber-950'
                        }`}
                      >
                        {u.ownerStatus || (u.isVerified ? 'VERIFIED' : 'PENDING')}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => updateUserVerification(u.id, !u.isVerified, u.isVerified ? 'PENDING' : 'VERIFIED')}
                          className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer ${
                            u.isVerified
                              ? 'bg-rose-100 text-rose-950 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200'
                          }`}
                        >
                          {u.isVerified ? 'Revoke KYC' : 'Authorize KYC'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BOOKINGS */}
      {activeAdminTab === 'BOOKINGS' && (
        <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-4">
          <div className="border-b-2 border-[#1a1a1a] pb-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a]">Master Charter Ledger</h2>
            <p className="text-xs font-mono text-[#1a1a1a]/70">Complete audit log of all peer-to-peer reservations</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b-2 border-[#1a1a1a] text-[#1a1a1a] font-bold uppercase text-[10px]">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Traveler</th>
                  <th className="pb-3">Dates</th>
                  <th className="pb-3">Gross Total</th>
                  <th className="pb-3">Settlement</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/20">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#f4f1ea]">
                    <td className="py-3 font-bold text-[#1a1a1a]">{b.id}</td>
                    <td className="py-3 font-sans font-bold text-[#1a1a1a]">{b.vehicleName}</td>
                    <td className="py-3 text-[#1a1a1a]">{b.customerName}</td>
                    <td className="py-3 text-[#1a1a1a]">
                      {b.startDate} → {b.endDate}
                    </td>
                    <td className="py-3 font-bold text-[#1a1a1a]">
                      ₹{b.pricing.totalPayable.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span className="text-[11px] text-[#1a1a1a]">
                        {b.paymentMethod} ({b.paymentStatus})
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 border border-[#1a1a1a] text-[9px] font-bold uppercase ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-950'
                            : b.status === 'COMPLETED'
                            ? 'bg-sky-100 text-sky-950'
                            : 'bg-rose-100 text-rose-950'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS */}
      {activeAdminTab === 'SETTINGS' && (
        <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] max-w-2xl space-y-6">
          <div className="border-b-2 border-[#1a1a1a] pb-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a]">Tariffs, Levies & Automated Policies</h2>
            <p className="text-xs font-mono text-[#1a1a1a]/70">
              Configure commissions, tax compliance, and automated vehicle approval policies
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#1a1a1a] uppercase text-[10px]">
                  Platform Commission (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={commPercent}
                  onChange={(e) => setCommPercent(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] font-bold focus:outline-none focus:border-[#ff5d22]"
                />
                <span className="text-[10px] text-[#1a1a1a]/60">Deducted from owner rental earnings</span>
              </div>

              <div>
                <label className="font-bold text-[#1a1a1a] uppercase text-[10px]">
                  Goods & Services Tax (GST %)
                </label>
                <input
                  type="number"
                  min={0}
                  max={28}
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] font-bold focus:outline-none focus:border-[#ff5d22]"
                />
                <span className="text-[10px] text-[#1a1a1a]/60">Standard 18% in India</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-[#1a1a1a] uppercase text-[10px]">
                Default Facilitation / Roadside Fee (₹)
              </label>
              <input
                type="number"
                min={0}
                step={50}
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] font-bold focus:outline-none focus:border-[#ff5d22]"
              />
            </div>

            <div className="p-4 bg-[#f4f1ea] border border-[#1a1a1a]">
              <label className="flex items-center justify-between font-bold text-[#1a1a1a] cursor-pointer font-mono">
                <div>
                  <span className="uppercase">Auto-Approve New Vehicles</span>
                  <span className="block text-[10px] text-[#1a1a1a]/70 font-normal">
                    When disabled, all listings enter PENDING_APPROVAL for document audit.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="w-4 h-4 border border-[#1a1a1a] accent-[#ff5d22] cursor-pointer"
                />
              </label>
            </div>

            {settingsSaved && (
              <p className="text-emerald-800 font-bold font-mono flex items-center gap-1">
                <Check className="w-4 h-4" /> Parameters recorded to live platform memory!
              </p>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-mono font-bold uppercase tracking-widest border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] transition cursor-pointer"
            >
              Save Configuration
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: COUPONS */}
      {activeAdminTab === 'COUPONS' && (
        <div className="space-y-6">
          {/* Coupon Generator */}
          <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#1a1a1a]">Create Promotional Voucher</h2>
            <form onSubmit={handleCreateCouponSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#1a1a1a]">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI25"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] uppercase font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#1a1a1a]">Discount Type</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] font-semibold focus:outline-none"
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FIXED">Flat (₹)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#1a1a1a]">Value</label>
                <input
                  type="number"
                  value={newCouponVal}
                  onChange={(e) => setNewCouponVal(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#1a1a1a]">Max Discount (₹)</label>
                <input
                  type="number"
                  value={newCouponMax}
                  onChange={(e) => setNewCouponMax(Number(e.target.value))}
                  className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] font-bold focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold uppercase text-[#1a1a1a]">Description</label>
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-mono font-bold uppercase text-xs border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
                >
                  Publish Promo
                </button>
              </div>
            </form>
          </div>

          {/* Existing Coupons Table */}
          <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">Active Platform Promos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="p-4 border-2 border-[#1a1a1a] bg-[#f4f1ea] shadow-[3px_3px_0px_#1a1a1a] space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-[#1a1a1a] text-sm">{c.code}</span>
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      className="text-rose-700 hover:text-rose-900 font-bold text-[10px] uppercase cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-[#1a1a1a]/80 text-[11px] font-sans">{c.description}</p>
                  <div className="text-[10px] text-[#1a1a1a]/60 flex justify-between pt-1 border-t border-[#1a1a1a]">
                    <span>Claimed {c.usageCount} times</span>
                    <span>Threshold ₹{c.minBookingAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SUPPORT DESK */}
      {activeAdminTab === 'SUPPORT' && (
        <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-4">
          <div className="border-b-2 border-[#1a1a1a] pb-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a]">Customer Grievance Inquiries</h2>
            <p className="text-xs font-mono text-[#1a1a1a]/70">Support arbitrations and incident investigations</p>
          </div>
          {tickets.length === 0 ? (
            <p className="text-xs font-mono text-[#1a1a1a]/50 py-6 text-center">No grievances filed.</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-4 bg-[#f4f1ea] border border-[#1a1a1a] space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1a1a1a]">{t.id}</span>
                      <span className="text-[#1a1a1a]/60">• {t.userName} ({t.userRole})</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 border border-[#1a1a1a] text-[9px] font-bold uppercase ${
                        t.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-950'
                          : 'bg-amber-100 text-amber-950'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">{t.subject}</h4>
                  <p className="text-[#1a1a1a]/80 font-sans">{t.description}</p>

                  {t.adminResponse ? (
                    <div className="p-2.5 bg-white border border-[#1a1a1a] text-[#1a1a1a] text-[11px]">
                      <strong>Arbitration Finding:</strong> {t.adminResponse}
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Type resolution reply..."
                        value={resolvingTicketId === t.id ? adminReplyText : ''}
                        onChange={(e) => {
                          setResolvingTicketId(t.id);
                          setAdminReplyText(e.target.value);
                        }}
                        className="flex-1 p-2 bg-white border border-[#1a1a1a] text-xs font-sans focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (resolvingTicketId === t.id && adminReplyText.trim()) {
                            resolveSupportTicket(t.id, adminReplyText.trim());
                            setResolvingTicketId(null);
                            setAdminReplyText('');
                          }
                        }}
                        className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#ff5d22] text-white font-mono font-bold uppercase text-xs border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 8: AUDIT LOGS */}
      {activeAdminTab === 'AUDIT' && (
        <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-4">
          <div className="border-b-2 border-[#1a1a1a] pb-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a1a]">Immutable Administrative Audit Log</h2>
            <p className="text-xs font-mono text-[#1a1a1a]/70">
              Cryptographic append-only journal of vehicle approvals, KYC changes, and platform alterations
            </p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#f4f1ea] border border-[#1a1a1a] text-xs flex items-start justify-between gap-4 font-mono"
              >
                <div>
                  <span className="font-bold text-[#1a1a1a] bg-white border border-[#1a1a1a] px-1.5 py-0.5 text-[9px] mr-2">
                    {log.action}
                  </span>
                  <span className="text-[#1a1a1a]">{log.details}</span>
                </div>
                <span className="text-[10px] text-[#1a1a1a]/50 shrink-0">
                  {new Date(log.timestamp).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

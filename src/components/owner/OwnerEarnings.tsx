import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  TrendingUp,
  Building2,
  QrCode,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';

export const OwnerEarnings: React.FC = () => {
  const { currentUser, bookings } = useApp();

  const [payoutRequested, setPayoutRequested] = useState(false);

  const myBookings = bookings.filter((b) => b.ownerId === currentUser.id);
  const completedBookings = myBookings.filter((b) => b.status === 'COMPLETED');
  const activeBookings = myBookings.filter((b) =>
    ['CONFIRMED', 'ACTIVE', 'OWNER_PENDING', 'OWNER_ACCEPTED'].includes(b.status)
  );

  const totalEarned = completedBookings.reduce(
    (acc, b) => acc + (b.pricing.ownerEarning || 0),
    0
  );
  const pendingClearance = activeBookings.reduce(
    (acc, b) => acc + (b.pricing.ownerEarning || 0),
    0
  );
  const totalCommissionDeducted = completedBookings.reduce(
    (acc, b) => acc + (b.pricing.rentalCost - b.pricing.ownerEarning),
    0
  );

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      setPayoutRequested(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="border-b-2 border-[#1a1a1a] pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] tracking-tight">Revenue & Disbursement Ledger</h1>
        <p className="text-xs font-mono text-[#1a1a1a]/70">
          Transparent double-entry record of gross booking receipts, platform retainers, and bank transfers
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest">
              Disbursed Yield
            </span>
            <div className="w-8 h-8 border border-[#1a1a1a] bg-[#f4f1ea] text-[#1a1a1a] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4 text-[#ff5d22]" />
            </div>
          </div>
          <p className="text-3xl font-mono font-bold text-[#1a1a1a]">
            ₹{totalEarned.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase">Settled to verified bank</p>
        </div>

        <div className="p-6 bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest">
              Escrow In-Flight
            </span>
            <div className="w-8 h-8 border border-[#1a1a1a] bg-[#f4f1ea] text-[#1a1a1a] flex items-center justify-center font-bold">
              <Clock className="w-4 h-4 text-[#1a1a1a]" />
            </div>
          </div>
          <p className="text-3xl font-mono font-bold text-[#1a1a1a]">
            ₹{pendingClearance.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase">
            Discharges upon trip sign-off
          </p>
        </div>

        <div className="p-6 bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase tracking-widest">
              Platform Brokerage
            </span>
            <div className="w-8 h-8 border border-[#1a1a1a] bg-[#f4f1ea] text-[#1a1a1a] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-[#ff5d22]" />
            </div>
          </div>
          <p className="text-3xl font-mono font-bold text-[#1a1a1a]">
            ₹{totalCommissionDeducted.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase">
            Subsidizes 24/7 host recovery cover
          </p>
        </div>
      </div>

      {/* Linked Bank Account / UPI */}
      <div className="bg-[#f4f1ea] p-6 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] flex items-center justify-center shadow-[2px_2px_0px_#1a1a1a]">
            <Building2 className="w-6 h-6 text-[#ff5d22]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">
              {currentUser.bankDetails?.bankName || 'HDFC Bank'} • Escrow Payout Terminal
            </h3>
            <p className="text-xs text-[#1a1a1a]/80 font-mono">
              A/C: {currentUser.bankDetails?.accountNumber || '50100492818172'} (IFSC:{' '}
              {currentUser.bankDetails?.ifscCode || 'HDFC0000060'})
            </p>
            <p className="text-[10px] font-mono text-[#1a1a1a]/60 uppercase tracking-wider">
              UPI VPA: {currentUser.bankDetails?.upiId || 'vikram.m@okhdfcbank'}
            </p>
          </div>
        </div>

        <button
          onClick={handleRequestPayout}
          disabled={payoutRequested || totalEarned === 0}
          className="px-5 py-3 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-mono font-bold text-xs uppercase tracking-widest border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] transition cursor-pointer disabled:opacity-50"
        >
          {payoutRequested ? (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-white" />
              Transfer Initiated!
            </span>
          ) : (
            'Request Instant NEFT'
          )}
        </button>
      </div>

      {/* Payout History Ledger */}
      <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-[6px_6px_0px_#1a1a1a] space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">Trip Settlement Dossier & Breakdown</h3>

        {myBookings.length === 0 ? (
          <p className="text-xs font-mono text-[#1a1a1a]/50 py-6 text-center">No settlement logs recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#1a1a1a] text-[#1a1a1a] font-mono font-bold uppercase text-[10px]">
                  <th className="pb-3">Reference ID</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Gross Tariff</th>
                  <th className="pb-3">Platform Fee</th>
                  <th className="pb-3">Net Host Pay</th>
                  <th className="pb-3">Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/20 font-mono">
                {myBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#f4f1ea]">
                    <td className="py-3 font-bold text-[#1a1a1a]">{b.id}</td>
                    <td className="py-3 font-sans font-bold text-[#1a1a1a]">{b.vehicleName}</td>
                    <td className="py-3 text-[#1a1a1a]/70">
                      {b.startDate} → {b.endDate}
                    </td>
                    <td className="py-3 text-[#1a1a1a]">
                      ₹{b.pricing.rentalCost.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-[#1a1a1a]/60">
                      -₹{(b.pricing.rentalCost - b.pricing.ownerEarning).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 font-bold text-[#ff5d22]">
                      ₹{b.pricing.ownerEarning.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 border border-[#1a1a1a] text-[9px] font-bold uppercase ${
                          b.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-950'
                            : 'bg-amber-100 text-amber-950'
                        }`}
                      >
                        {b.status === 'COMPLETED' ? 'DISBURSED' : 'HOLD_ESCROW'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

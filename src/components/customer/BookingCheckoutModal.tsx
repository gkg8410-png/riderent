import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle, BookingPricingBreakdown } from '../../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

interface BookingCheckoutModalProps {
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  withDelivery: boolean;
  pricing: BookingPricingBreakdown;
  couponCode?: string;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  vehicle,
  startDate,
  endDate,
  withDelivery,
  pricing,
  couponCode,
  onClose,
  onSuccess,
}) => {
  const { currentUser, createBooking } = useApp();

  // Form states
  const [driverName, setDriverName] = useState(currentUser.name);
  const [driverPhone, setDriverPhone] = useState(currentUser.phone);
  const [dlNumber, setDlNumber] = useState('DL-1420110023451');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState(`${currentUser.name.toLowerCase().replace(/\s+/g, '')}@okaxis`);

  // Processing states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{ id: string } | null>(null);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setErrorMsg('Please accept the rental terms and conditions.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Simulate network latency & server-side double booking check
    setTimeout(() => {
      const res = createBooking(
        vehicle.id,
        startDate,
        endDate,
        withDelivery,
        pricing,
        paymentMethod,
        couponCode
      );

      setIsSubmitting(false);

      if (res.success && res.bookingId) {
        setBookingResult({ id: res.bookingId });
      } else {
        setErrorMsg(res.error || 'Booking could not be confirmed.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border-2 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] max-w-lg w-full overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#f4f1ea] p-5 flex items-center justify-between border-b-2 border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff5d22] text-white flex items-center justify-center font-black text-xs border border-white">
              RR
            </div>
            <div>
              <h3 className="font-serif font-bold text-base tracking-wide text-white">Instant Reserve Dispatch</h3>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#f4f1ea]/70">
                Secured via Escrow Settlement protocol
              </p>
            </div>
          </div>
          {!bookingResult && (
            <button
              onClick={onClose}
              className="w-8 h-8 bg-[#f4f1ea] hover:bg-[#ff5d22] hover:text-white flex items-center justify-center text-[#1a1a1a] border border-[#1a1a1a] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Success Confirmation View */}
        {bookingResult ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-[#f4f1ea] border-2 border-[#1a1a1a] text-[#ff5d22] flex items-center justify-center mx-auto shadow-[4px_4px_0px_#1a1a1a]">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff5d22] block">
                Settlement Complete • Registry Confirmed
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">{vehicle.name}</h2>
              <p className="text-xs font-mono font-bold text-[#1a1a1a]/60">
                Booking ID: <span className="text-[#1a1a1a] bg-[#f4f1ea] px-1.5 py-0.5 border border-[#1a1a1a]">{bookingResult.id}</span>
              </p>
            </div>

            <div className="bg-[#f4f1ea] p-4 border border-[#1a1a1a] text-left text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">Dates:</span>
                <span className="font-bold text-[#1a1a1a]">
                  {startDate} to {endDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">Host:</span>
                <span className="font-bold text-[#1a1a1a]">{vehicle.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">Pickup Location:</span>
                <span className="font-bold text-[#1a1a1a]">{vehicle.pickupLocation}</span>
              </div>
              <div className="flex justify-between border-t border-[#1a1a1a]/20 pt-2 font-black text-sm">
                <span>Total Settled:</span>
                <span className="text-[#ff5d22]">
                  ₹{pricing.totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#1a1a1a]/70 font-medium">
              Host <strong className="text-[#1a1a1a]">{vehicle.ownerName}</strong> has been notified. Coordinate pickup directly in the in-app chat.
            </p>

            <button
              onClick={() => {
                onSuccess(bookingResult.id);
                onClose();
              }}
              className="w-full py-3 bg-[#1a1a1a] hover:bg-[#ff5d22] text-white font-mono font-black text-xs uppercase tracking-widest border border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] transition cursor-pointer"
            >
              Access Active Bookings
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
            {/* Booking Summary Pill */}
            <div className="p-3.5 bg-[#f4f1ea] border border-[#1a1a1a] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wide text-[#1a1a1a]">{vehicle.name}</h4>
                <p className="text-[10px] font-mono text-[#1a1a1a]/70">
                  {startDate} → {endDate} ({pricing.days} days)
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-black text-[#ff5d22]">
                  ₹{pricing.totalPayable.toLocaleString('en-IN')}
                </span>
                <span className="block text-[9px] font-mono uppercase text-[#1a1a1a]/50">all charges included</span>
              </div>
            </div>

            {/* Driver Information */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1a1a1a]/70 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#ff5d22]" />
                Driver Credentials (KYC Clearance)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/60 block">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full mt-0.5 p-2 bg-[#f4f1ea] border border-[#1a1a1a] font-medium text-xs focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/60 block">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full mt-0.5 p-2 bg-[#f4f1ea] border border-[#1a1a1a] font-mono text-xs focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/60 block">
                  Driving License Number
                </label>
                <input
                  type="text"
                  required
                  value={dlNumber}
                  onChange={(e) => setDlNumber(e.target.value)}
                  placeholder="e.g. MH0220190012345"
                  className="w-full mt-0.5 p-2 bg-[#f4f1ea] border border-[#1a1a1a] font-mono uppercase text-xs focus:outline-none focus:border-[#ff5d22]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2 border-t border-[#1a1a1a]/20">
              <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1a1a1a]/70 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#ff5d22]" />
                Select Payment Channel
              </h4>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'UPI'
                      ? 'border-2 border-[#1a1a1a] bg-[#1a1a1a] text-[#f4f1ea] shadow-[2px_2px_0px_#1a1a1a]'
                      : 'border border-[#1a1a1a] bg-[#f4f1ea] hover:bg-white text-[#1a1a1a]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#ff5d22]" />
                  <span className="text-[10px] font-mono font-bold uppercase">UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-2.5 border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'Card'
                      ? 'border-2 border-[#1a1a1a] bg-[#1a1a1a] text-[#f4f1ea] shadow-[2px_2px_0px_#1a1a1a]'
                      : 'border border-[#1a1a1a] bg-[#f4f1ea] hover:bg-white text-[#1a1a1a]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#ff5d22]" />
                  <span className="text-[10px] font-mono font-bold uppercase">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NetBanking')}
                  className={`p-2.5 border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'NetBanking'
                      ? 'border-2 border-[#1a1a1a] bg-[#1a1a1a] text-[#f4f1ea] shadow-[2px_2px_0px_#1a1a1a]'
                      : 'border border-[#1a1a1a] bg-[#f4f1ea] hover:bg-white text-[#1a1a1a]'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#ff5d22]" />
                  <span className="text-[10px] font-mono font-bold uppercase">Net Banking</span>
                </button>
              </div>

              {/* UPI Field */}
              {paymentMethod === 'UPI' && (
                <div className="p-3 bg-[#f4f1ea] border border-[#1a1a1a] space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#1a1a1a]/60 uppercase">
                    UPI Virtual ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full p-2 bg-white border border-[#1a1a1a] text-xs font-mono font-bold focus:outline-none"
                  />
                  <p className="text-[10px] text-[#1a1a1a]/60">
                    Supports Google Pay, PhonePe, Paytm, BHIM UPI
                  </p>
                </div>
              )}

              {/* Card Simulation */}
              {paymentMethod === 'Card' && (
                <div className="p-3 bg-[#f4f1ea] border border-[#1a1a1a] space-y-2">
                  <input
                    type="text"
                    readOnly
                    value="•••• •••• •••• 4242 (Simulated Corporate Card)"
                    className="w-full p-2 bg-white border border-[#1a1a1a] text-xs font-mono"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="12/28"
                      className="w-1/2 p-2 bg-white border border-[#1a1a1a] text-xs text-center font-mono"
                    />
                    <input
                      type="password"
                      readOnly
                      value="888"
                      className="w-1/2 p-2 bg-white border border-[#1a1a1a] text-xs text-center font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rental Terms Acceptance */}
            <div className="pt-2 border-t border-[#1a1a1a]/20">
              <label className="flex items-start gap-2 text-[11px] text-[#1a1a1a]/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 border-2 border-[#1a1a1a] accent-[#ff5d22] cursor-pointer"
                />
                <span>
                  I confirm holding a valid Indian DL, agree to return vehicle in original condition, adhere to the 120 km/h speed limit, and accept RideRent's{' '}
                  <strong className="text-[#1a1a1a] font-bold">{vehicle.cancellationPolicy} Protocol</strong>.
                </span>
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-[#1a1a1a] text-xs text-[#1a1a1a] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#ff5d22]" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-black text-xs uppercase tracking-widest border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Clearing Double-Booking Check & Escrow...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Settle ₹{pricing.totalPayable.toLocaleString('en-IN')} & Confirm</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

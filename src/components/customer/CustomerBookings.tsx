import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { calculateCancellationRefund } from '../../utils/pricingAndBooking';
import {
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  XCircle,
  Star,
  FileText,
  AlertCircle,
  CheckCircle2,
  Car,
  ChevronRight,
  Receipt,
  HelpCircle,
} from 'lucide-react';

interface CustomerBookingsProps {
  onOpenChat: (bookingId: string) => void;
  onOpenSupport: () => void;
  onExploreCars: () => void;
}

export const CustomerBookings: React.FC<CustomerBookingsProps> = ({
  onOpenChat,
  onOpenSupport,
  onExploreCars,
}) => {
  const { currentUser, bookings, vehicles, cancelBooking, addReview } = useApp();

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');

  // Modal states
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of travel schedule');
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [viewingReceipt, setViewingReceipt] = useState<Booking | null>(null);

  // Filter bookings for this customer
  const userBookings = bookings.filter((b) => b.customerId === currentUser.id);

  const upcomingBookings = userBookings.filter((b) =>
    ['CONFIRMED', 'ACTIVE', 'OWNER_PENDING', 'OWNER_ACCEPTED'].includes(b.status)
  );
  const completedBookings = userBookings.filter((b) => b.status === 'COMPLETED');
  const cancelledBookings = userBookings.filter((b) =>
    ['CANCELLED', 'REFUNDED', 'OWNER_REJECTED'].includes(b.status)
  );

  const currentList =
    activeTab === 'UPCOMING'
      ? upcomingBookings
      : activeTab === 'COMPLETED'
      ? completedBookings
      : cancelledBookings;

  const handleConfirmCancel = () => {
    if (!cancellingBooking) return;
    cancelBooking(cancellingBooking.id, cancelReason);
    setCancellingBooking(null);
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingBooking) return;
    addReview(reviewingBooking.id, reviewingBooking.vehicleId, reviewRating, reviewComment);
    setReviewingBooking(null);
    setReviewComment('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#1a1a1a] pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1a1a1a] tracking-tight">Rental Log & Reservations</h1>
          <p className="text-xs font-mono text-[#1a1a1a]/70">
            Active charters, upcoming journeys, and verified past settlements
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#f4f1ea] p-1 border-2 border-[#1a1a1a] text-xs font-mono font-bold uppercase">
          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === 'UPCOMING'
                ? 'bg-[#1a1a1a] text-[#f4f1ea] shadow-[2px_2px_0px_#ff5d22]'
                : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
            }`}
          >
            Active & Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === 'COMPLETED'
                ? 'bg-[#1a1a1a] text-[#f4f1ea] shadow-[2px_2px_0px_#ff5d22]'
                : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
            }`}
          >
            Completed ({completedBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('CANCELLED')}
            className={`px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === 'CANCELLED'
                ? 'bg-[#1a1a1a] text-[#f4f1ea] shadow-[2px_2px_0px_#ff5d22]'
                : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
            }`}
          >
            Cancelled ({cancelledBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {currentList.length === 0 ? (
        <div className="bg-white border-2 border-[#1a1a1a] p-12 text-center space-y-4 shadow-[4px_4px_0px_#1a1a1a]">
          <div className="w-12 h-12 border-2 border-[#1a1a1a] bg-[#f4f1ea] text-[#1a1a1a] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#1a1a1a]">
            <Car className="w-6 h-6 text-[#ff5d22]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">
            No {activeTab.toLowerCase()} bookings found
          </h3>
          <p className="text-xs font-mono text-[#1a1a1a]/70 max-w-sm mx-auto">
            {activeTab === 'UPCOMING'
              ? 'You do not have any active or confirmed upcoming car rentals at this moment.'
              : 'No past booking records in this registry section.'}
          </p>
          {activeTab === 'UPCOMING' && (
            <button
              onClick={onExploreCars}
              className="px-4 py-2.5 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white text-xs font-mono font-bold uppercase tracking-widest border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
            >
              Explore Available Fleet
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((bk) => {
            const vehicle = vehicles.find((v) => v.id === bk.vehicleId);
            return (
              <div
                key={bk.id}
                className="bg-white border-2 border-[#1a1a1a] p-5 shadow-[4px_4px_0px_#1a1a1a] transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1a1a1a]/15">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#1a1a1a] bg-[#f4f1ea] px-2 py-1 border border-[#1a1a1a]">
                      {bk.id}
                    </span>
                    <span className="text-xs font-mono text-[#1a1a1a]/60">
                      Dispatched on {new Date(bk.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border border-[#1a1a1a] self-start sm:self-auto ${
                      bk.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-950'
                        : bk.status === 'COMPLETED'
                        ? 'bg-[#f4f1ea] text-[#1a1a1a]'
                        : bk.status === 'CANCELLED'
                        ? 'bg-rose-100 text-rose-950'
                        : 'bg-amber-100 text-amber-950'
                    }`}
                  >
                    {bk.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Car Image & Info */}
                  <div className="sm:col-span-4 flex items-center gap-3">
                    <div className="w-20 h-16 bg-[#f4f1ea] overflow-hidden shrink-0 border-2 border-[#1a1a1a]">
                      <img
                        src={bk.vehicleImage}
                        alt={bk.vehicleName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1a1a1a] uppercase tracking-tight">{bk.vehicleName}</h4>
                      <p className="text-xs text-[#ff5d22] font-mono font-bold">{bk.vehicleNumberPlate}</p>
                      <p className="text-[11px] text-[#1a1a1a]/60 font-mono">Host: {bk.ownerName}</p>
                    </div>
                  </div>

                  {/* Dates & Duration */}
                  <div className="sm:col-span-3 text-xs space-y-1 font-mono">
                    <div className="flex items-center gap-1.5 text-[#1a1a1a] font-bold">
                      <Calendar className="w-3.5 h-3.5 text-[#ff5d22]" />
                      <span>
                        {bk.startDate} → {bk.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#1a1a1a]/70">
                      Duration: {bk.pricing.days} {bk.pricing.days === 1 ? 'day' : 'days'}
                    </p>
                    <p className="text-[11px] text-[#1a1a1a]/70 flex items-center gap-1 font-sans">
                      <MapPin className="w-3 h-3 text-[#ff5d22]" />
                      {bk.pickupLocation}
                    </p>
                  </div>

                  {/* Price & Deposit */}
                  <div className="sm:col-span-2 text-xs space-y-0.5 font-mono">
                    <span className="text-[10px] uppercase font-bold text-[#1a1a1a]/50">Total Paid</span>
                    <p className="text-base font-black text-[#1a1a1a]">
                      ₹{bk.pricing.totalPayable.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-[#1a1a1a]/70 block">
                      Incl. ₹{bk.pricing.securityDeposit.toLocaleString('en-IN')} deposit
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="sm:col-span-3 flex flex-wrap sm:flex-col gap-2 justify-end font-mono">
                    {activeTab === 'UPCOMING' && (
                      <>
                        <button
                          onClick={() => onOpenChat(bk.id)}
                          className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#ff5d22] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Host</span>
                        </button>

                        <button
                          onClick={() => setCancellingBooking(bk)}
                          className="px-3 py-1.5 bg-[#f4f1ea] hover:bg-rose-50 text-rose-700 border border-[#1a1a1a] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Trip</span>
                        </button>
                      </>
                    )}

                    {activeTab === 'COMPLETED' && (
                      <>
                        {!bk.isReviewed ? (
                          <button
                            onClick={() => setReviewingBooking(bk)}
                            className="px-3 py-1.5 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Review Host</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-[#1a1a1a] text-center flex items-center justify-center gap-1 bg-[#f4f1ea] py-1 border border-[#1a1a1a]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Reviewed
                          </span>
                        )}
                        <button
                          onClick={() => setViewingReceipt(bk)}
                          className="px-3 py-1.5 bg-[#f4f1ea] hover:bg-white text-[#1a1a1a] text-xs font-bold uppercase tracking-wider border border-[#1a1a1a] flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Tax Invoice</span>
                        </button>
                      </>
                    )}

                    {activeTab === 'CANCELLED' && bk.refundAmount !== undefined && (
                      <div className="p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-[11px] text-[#1a1a1a]/80 text-right">
                        <span>Refund Processed: </span>
                        <strong className="text-[#ff5d22]">
                          ₹{bk.refundAmount.toLocaleString('en-IN')}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Policy Calculation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/80 p-4">
          <div className="bg-white border-2 border-[#1a1a1a] max-w-md w-full p-6 space-y-4 shadow-[8px_8px_0px_#1a1a1a]">
            <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">Cancel Booking Charter</h3>
            <p className="text-xs font-mono text-[#1a1a1a]/70">
              Cancellation for <strong className="text-[#1a1a1a]">{cancellingBooking.vehicleName}</strong> (ID: {cancellingBooking.id})
            </p>

            {/* Dynamic policy preview */}
            {(() => {
              const v = vehicles.find((item) => item.id === cancellingBooking.vehicleId);
              if (!v) return null;
              const refundCalc = calculateCancellationRefund(cancellingBooking, v);
              return (
                <div className="p-4 bg-[#f4f1ea] border border-[#1a1a1a] text-xs space-y-2 font-mono">
                  <div className="flex justify-between font-bold text-[#1a1a1a]">
                    <span>Applied Policy:</span>
                    <span className="text-[#ff5d22]">{refundCalc.policyApplied}</span>
                  </div>
                  <p className="text-[#1a1a1a]/70 font-sans">{refundCalc.explanation}</p>
                  <div className="flex justify-between font-black text-sm text-[#1a1a1a] pt-2 border-t border-[#1a1a1a]/20">
                    <span>Eligible Refund:</span>
                    <span className="text-[#ff5d22]">
                      ₹{refundCalc.refundableAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div>
              <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase block">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-mono focus:outline-none"
              >
                <option value="Change of travel schedule">Change of travel schedule</option>
                <option value="Booked another car on RideRent">Booked another car on RideRent</option>
                <option value="Flight or train delayed/cancelled">Flight or train delayed/cancelled</option>
                <option value="Found alternative ride">Found alternative ride</option>
                <option value="Other personal reason">Other personal reason</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2 font-mono">
              <button
                onClick={() => setCancellingBooking(null)}
                className="w-1/2 py-2.5 bg-[#f4f1ea] hover:bg-white text-[#1a1a1a] font-bold text-xs uppercase border border-[#1a1a1a] transition cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-[#1a1a1a] text-white font-bold text-xs uppercase border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/80 p-4">
          <form
            onSubmit={handleConfirmReview}
            className="bg-white border-2 border-[#1a1a1a] max-w-md w-full p-6 space-y-4 shadow-[8px_8px_0px_#1a1a1a]"
          >
            <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">Leave Host & Car Review</h3>
            <p className="text-xs font-mono text-[#1a1a1a]/70">
              Trip experience for <strong className="text-[#1a1a1a]">{reviewingBooking.vehicleName}</strong>
            </p>

            {/* Star selector */}
            <div className="flex justify-center gap-2 py-2 bg-[#f4f1ea] border border-[#1a1a1a]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-2xl transition hover:scale-125 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= reviewRating
                        ? 'fill-[#ff5d22] text-[#ff5d22]'
                        : 'text-[#1a1a1a]/20'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase block">Trip Narrative</label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Cleanliness, handover punctuality, AC performance, highway pickup..."
                className="w-full mt-1 p-3 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-sans focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2 font-mono">
              <button
                type="button"
                onClick={() => setReviewingBooking(null)}
                className="w-1/2 py-2.5 bg-[#f4f1ea] text-[#1a1a1a] font-bold text-xs uppercase border border-[#1a1a1a] hover:bg-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-bold text-xs uppercase border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
              >
                Post Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/80 p-4">
          <div className="bg-white border-2 border-[#1a1a1a] max-w-lg w-full p-6 space-y-4 shadow-[8px_8px_0px_#1a1a1a]">
            <div className="flex justify-between items-start pb-3 border-b-2 border-[#1a1a1a]">
              <div>
                <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">Tax Invoice / Fiscal Receipt</h3>
                <p className="text-xs text-[#1a1a1a]/60 font-mono">Invoice #{viewingReceipt.id}-INV</p>
              </div>
              <span className="px-2 py-1 bg-[#1a1a1a] text-[#f4f1ea] font-mono font-bold text-xs border border-[#1a1a1a]">
                ESCROW SETTLED
              </span>
            </div>

            <div className="text-xs space-y-2 text-[#1a1a1a]/80 font-mono">
              <div className="flex justify-between">
                <span>Rented Vehicle:</span>
                <strong className="text-[#1a1a1a]">{viewingReceipt.vehicleName}</strong>
              </div>
              <div className="flex justify-between">
                <span>License Plate:</span>
                <span className="font-bold text-[#ff5d22]">{viewingReceipt.vehicleNumberPlate}</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Period:</span>
                <span>
                  {viewingReceipt.startDate} to {viewingReceipt.endDate} ({viewingReceipt.pricing.days} days)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Base Rental:</span>
                <span>₹{viewingReceipt.pricing.rentalCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Facilitation:</span>
                <span>₹{viewingReceipt.pricing.platformFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>₹{viewingReceipt.pricing.taxGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Refundable Deposit:</span>
                <span>₹{viewingReceipt.pricing.securityDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#1a1a1a] pt-2 border-t-2 border-[#1a1a1a]">
                <span>Grand Total Settled:</span>
                <span className="text-[#ff5d22]">
                  ₹{viewingReceipt.pricing.totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setViewingReceipt(null)}
                className="px-5 py-2 bg-[#1a1a1a] text-white font-mono uppercase text-xs font-bold border border-[#1a1a1a] hover:bg-[#ff5d22] transition cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

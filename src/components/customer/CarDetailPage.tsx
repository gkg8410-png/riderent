import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculatePricingBreakdown, checkVehicleAvailability, calculateDays } from '../../utils/pricingAndBooking';
import { CANCELLATION_POLICIES } from '../../config/appConfig';
import { Coupon, Vehicle } from '../../types';
import {
  Star,
  MapPin,
  ShieldCheck,
  Calendar,
  Fuel,
  Users,
  Award,
  Clock,
  Heart,
  ChevronLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Info,
  Car as CarIcon,
} from 'lucide-react';

interface CarDetailPageProps {
  carId?: string;
  vehicle?: Vehicle;
  onBack: () => void;
  onBookNow?: (bookingDetails: {
    vehicleId: string;
    startDate: string;
    endDate: string;
    withDelivery: boolean;
    pricing: any;
    couponCode?: string;
  }) => void;
  onProceedToBooking?: (data: {
    vehicle: Vehicle;
    startDate: string;
    endDate: string;
    withDelivery: boolean;
    pricing: any;
    couponCode?: string;
  }) => void;
  onContactHost?: (hostName: string, carName: string) => void;
}

export const CarDetailPage: React.FC<CarDetailPageProps> = ({
  carId,
  vehicle: propVehicle,
  onBack,
  onBookNow,
  onProceedToBooking,
  onContactHost,
}) => {
  const { vehicles, bookings, reviews, favourites, toggleFavourite, coupons, platformSettings } =
    useApp();

  const car = propVehicle || vehicles.find((v) => v.id === carId);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking calculator state
  const todayStr = new Date().toISOString().split('T')[0];
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  const defaultEndStr = threeDaysLater.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [withDelivery, setWithDelivery] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  if (!car) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm font-bold text-slate-700">Vehicle not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Return to Browse
        </button>
      </div>
    );
  }

  // Reviews for this vehicle
  const carReviews = reviews.filter((r) => r.vehicleId === car.id);

  // Server-side style availability check
  const availResult = checkVehicleAvailability(car, startDate, endDate, bookings);

  // Dynamic pricing calculation
  const pricing = calculatePricingBreakdown(
    car,
    startDate,
    endDate,
    withDelivery,
    appliedCoupon,
    platformSettings.commissionPercentage,
    platformSettings.taxPercentage,
    platformSettings.defaultPlatformFee
  );

  const days = calculateDays(startDate, endDate);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const found = coupons.find(
      (c) => c.code.toUpperCase() === couponInput.trim().toUpperCase() && c.isActive
    );

    if (!found) {
      setCouponMessage({ type: 'error', text: 'Invalid or expired coupon code.' });
      setAppliedCoupon(null);
      return;
    }

    if (pricing.rentalCost < found.minBookingAmount) {
      setCouponMessage({
        type: 'error',
        text: `Coupon requires minimum rental value of ₹${found.minBookingAmount.toLocaleString(
          'en-IN'
        )}.`,
      });
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(found);
    setCouponMessage({
      type: 'success',
      text: `Applied! ${found.description}`,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMessage(null);
  };

  const isFav = favourites.includes(car.id);
  const policyInfo = CANCELLATION_POLICIES[car.cancellationPolicy || 'Flexible'];

  return (
    <div className="space-y-8 pb-20">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#1a1a1a] hover:bg-[#ff5d22] hover:text-white bg-white px-3.5 py-2 border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Archive Index
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavourite(car.id)}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-2 bg-white border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] hover:bg-[#f4f1ea] transition cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${isFav ? 'text-[#ff5d22] fill-[#ff5d22]' : 'text-[#1a1a1a]'}`}
            />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: car.name, url: window.location.href });
              }
            }}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-2 bg-white border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] hover:bg-[#f4f1ea] text-[#1a1a1a] transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Details on Left, Booking Box on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7-8 cols */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative h-[320px] sm:h-[440px] w-full overflow-hidden bg-[#1a1a1a] border-2 border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a]">
              <img
                src={car.images[activeImageIndex] || car.images[0]}
                alt={car.name}
                className="w-full h-full object-cover object-center"
              />
              <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-[#1a1a1a] text-[#ff5d22] border border-[#1a1a1a]">
                {car.category}
              </span>
              <span className="absolute bottom-4 right-4 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1a1a1a] text-[#f4f1ea]">
                Plate {activeImageIndex + 1} / {car.images.length}
              </span>
            </div>

            {/* Thumbnails */}
            {car.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-16 w-24 overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#ff5d22] shadow-[3px_3px_0px_#1a1a1a]'
                        : 'border-[#1a1a1a]/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Header Information */}
          <div className="bg-white p-6 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1a1a1a] bg-[#f4f1ea] px-2 py-0.5 border border-[#1a1a1a]">
                    {car.brand} • {car.year}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#1a1a1a] bg-[#f4f1ea] px-2 py-0.5 border border-[#1a1a1a]">
                    {(car.numberPlate || '').replace(/^([A-Z]{2}\s*\d{2})\s*[A-Z]{1,2}/, '$1 ••')}
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1a1a] tracking-tight">
                  {car.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#1a1a1a]/70 mt-1 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#ff5d22]" />
                  <span>
                    {car.city} — {car.pickupLocation}
                  </span>
                </p>
              </div>

              {/* Rating badge */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-sm font-black font-mono text-[#1a1a1a] bg-[#f4f1ea] px-3 py-1.5 border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a]">
                  <Star className="w-4 h-4 text-[#ff5d22] fill-[#ff5d22]" />
                  <span>{car.rating}</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1a1a1a]/60 mt-1">
                  {car.reviewCount} reviews • {car.totalTrips} runs
                </span>
              </div>
            </div>

            {/* Verified Host Card */}
            <div className="flex items-center justify-between p-4 bg-[#f4f1ea] border border-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white overflow-hidden shrink-0 border border-[#1a1a1a]">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                    alt={car.ownerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#1a1a1a]">{car.ownerName}</h4>
                    {car.ownerVerified && (
                      <span className="inline-flex items-center text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 border border-emerald-800">
                        <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-700" />
                        Verified Host
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#1a1a1a]/70">Host rating {car.ownerRating} ★ • Rapid courier response</p>
                </div>
              </div>

              <button
                onClick={() => onContactHost(car.ownerName, car.name)}
                className="px-3.5 py-1.5 text-xs font-black uppercase tracking-wider bg-white hover:bg-[#ff5d22] hover:text-white text-[#1a1a1a] border border-[#1a1a1a] transition cursor-pointer"
              >
                Dispatch Query
              </button>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div className="bg-white p-6 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">Technical Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#f4f1ea] border border-[#1a1a1a]">
                <Fuel className="w-4 h-4 text-[#ff5d22] mb-1" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#1a1a1a]/60 block">Fuel Type</span>
                <p className="text-xs font-black text-[#1a1a1a] uppercase">{car.fuelType}</p>
              </div>

              <div className="p-3.5 bg-[#f4f1ea] border border-[#1a1a1a]">
                <CarIcon className="w-4 h-4 text-[#ff5d22] mb-1" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#1a1a1a]/60 block">Transmission</span>
                <p className="text-xs font-black text-[#1a1a1a] uppercase">{car.transmission}</p>
              </div>

              <div className="p-3.5 bg-[#f4f1ea] border border-[#1a1a1a]">
                <Users className="w-4 h-4 text-[#ff5d22] mb-1" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#1a1a1a]/60 block">Capacity</span>
                <p className="text-xs font-black text-[#1a1a1a]">{car.seatingCapacity} Passengers</p>
              </div>

              <div className="p-3.5 bg-[#f4f1ea] border border-[#1a1a1a]">
                <Award className="w-4 h-4 text-[#ff5d22] mb-1" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#1a1a1a]/60 block">Odometer</span>
                <p className="text-xs font-mono font-bold text-[#1a1a1a]">
                  {car.kilometersDriven.toLocaleString('en-IN')} KM
                </p>
              </div>
            </div>

            {/* Features Tags */}
            <div className="pt-2">
              <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1a1a1a]/70 mb-2">Key Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f4f1ea] text-[#1a1a1a] text-xs font-medium border border-[#1a1a1a]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff5d22]" />
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="pt-3 border-t border-[#1a1a1a]/20">
              <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1a1a1a]/70 mb-1.5">Archival Description</h4>
              <p className="text-xs sm:text-sm text-[#1a1a1a]/80 leading-relaxed font-serif">{car.description}</p>
            </div>
          </div>

          {/* Cancellation Policy & Rental Guidelines */}
          <div className="bg-white p-6 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">Cancellation Protocol & Terms</h3>

            <div className="p-4 bg-[#f4f1ea] border-2 border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff5d22]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#1a1a1a]">
                  {policyInfo.name} Protocol
                </span>
              </div>
              <p className="text-xs text-[#1a1a1a]/80 mt-1">{policyInfo.desc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1a1a1a]/80">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff5d22] shrink-0 mt-0.5" />
                <span>Original Government Driving License & Aadhaar verification required at handover.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff5d22] shrink-0 mt-0.5" />
                <span>Speed limit capped at 120 km/h for highway safety as per MoRTH guidelines.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff5d22] shrink-0 mt-0.5" />
                <span>Return with same fuel level or pay difference during checkout inspection.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff5d22] shrink-0 mt-0.5" />
                <span>Fastag installed. Tolls deducted from refundable security deposit after trip.</span>
              </div>
            </div>
          </div>

          {/* Verified Customer Reviews */}
          <div className="bg-white p-6 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">
                Verified Reviews ({carReviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#1a1a1a] bg-[#f4f1ea] px-2 py-1 border border-[#1a1a1a]">
                <Star className="w-3.5 h-3.5 fill-[#ff5d22] text-[#ff5d22]" />
                <span>{car.rating} Average Rating</span>
              </div>
            </div>

            {carReviews.length === 0 ? (
              <p className="text-xs text-[#1a1a1a]/50 py-4 font-mono">No review entries recorded yet for this vehicle.</p>
            ) : (
              <div className="space-y-4">
                {carReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-[#f4f1ea] border border-[#1a1a1a] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#1a1a1a] overflow-hidden border border-[#1a1a1a]">
                          <img
                            src={
                              rev.customerAvatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                            }
                            alt={rev.customerName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs font-bold text-[#1a1a1a]">{rev.customerName}</span>
                      </div>
                      <div className="flex text-[#ff5d22] text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#ff5d22] text-[#ff5d22]" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#1a1a1a]/80 leading-relaxed font-serif">{rev.comment}</p>

                    {/* Host response if any */}
                    {rev.ownerResponse && (
                      <div className="mt-2 pl-3 border-l-2 border-[#ff5d22] text-[11px] text-[#1a1a1a] bg-white p-2 border border-[#1a1a1a]">
                        <span className="font-bold uppercase tracking-wider text-[10px]">Host Response:</span>{' '}
                        {rev.ownerResponse.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4-5 cols: Sticky Booking & Price Calculator */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white p-6 border-2 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] space-y-5">
            {/* Price Header */}
            <div className="flex items-baseline justify-between pb-3 border-b-2 border-[#1a1a1a]">
              <div>
                <span className="font-mono text-3xl font-black text-[#1a1a1a]">
                  ₹{car.pricePerDay.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-mono text-[#1a1a1a]/60"> /day</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1a1a1a] bg-[#f4f1ea] px-2 py-0.5 border border-[#1a1a1a]">
                Direct Dispatch
              </span>
            </div>

            {/* Date Pickers */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#f4f1ea] border border-[#1a1a1a]">
                  <label className="text-[9px] font-mono font-black uppercase tracking-widest text-[#1a1a1a]/60 block">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono font-bold text-[#1a1a1a] mt-1 focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-[#f4f1ea] border border-[#1a1a1a]">
                  <label className="text-[9px] font-mono font-black uppercase tracking-widest text-[#1a1a1a]/60 block">
                    Return Date
                  </label>
                  <input
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono font-bold text-[#1a1a1a] mt-1 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Delivery Toggle */}
              {car.deliveryAvailable && (
                <label className="flex items-center justify-between p-3 bg-[#f4f1ea] border border-[#1a1a1a] cursor-pointer">
                  <div className="text-xs">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-[#1a1a1a] block">Doorstep Delivery</span>
                    <span className="text-[10px] text-[#1a1a1a]/60">
                      Delivered to home/airport (+₹{car.deliveryFee})
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={withDelivery}
                    onChange={(e) => setWithDelivery(e.target.checked)}
                    className="w-4 h-4 border-2 border-[#1a1a1a] accent-[#ff5d22] cursor-pointer"
                  />
                </label>
              )}
            </div>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#1a1a1a]/50 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon (FIRSTDRIVE)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full pl-8 pr-2 py-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-mono font-bold uppercase focus:outline-none"
                  />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="px-3 py-2 bg-[#1a1a1a] text-[#f4f1ea] hover:bg-[#ff5d22] text-xs font-mono font-bold uppercase border border-[#1a1a1a] transition cursor-pointer"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#1a1a1a] text-[#f4f1ea] hover:bg-[#ff5d22] text-xs font-black uppercase tracking-wider border border-[#1a1a1a] transition cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </form>

              {couponMessage && (
                <p
                  className={`text-[10px] font-mono font-bold ${
                    couponMessage.type === 'success' ? 'text-emerald-700' : 'text-[#ff5d22]'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Availability Alert (Double-booking protection check) */}
            {!availResult.isAvailable && (
              <div className="p-3 bg-amber-50 border border-[#1a1a1a] text-xs text-[#1a1a1a] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#ff5d22]" />
                <span className="font-medium">{availResult.reason}</span>
              </div>
            )}

            {/* Itemized Price Breakdown */}
            <div className="pt-3 border-t-2 border-[#1a1a1a] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#1a1a1a]/80">
                <span>
                  Rental ({days} {days === 1 ? 'day' : 'days'} × ₹
                  {car.pricePerDay.toLocaleString('en-IN')})
                </span>
                <span>₹{(car.pricePerDay * days).toLocaleString('en-IN')}</span>
              </div>

              {pricing.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Duration Discount ({pricing.discountPercentage}% off)</span>
                  <span>-₹{pricing.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {withDelivery && (
                <div className="flex justify-between text-[#1a1a1a]/80">
                  <span>Doorstep Delivery Fee</span>
                  <span>₹{car.deliveryFee.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#1a1a1a]/80">
                <span className="flex items-center gap-1">
                  Platform Facilitation Fee
                  <Info className="w-3 h-3 text-[#1a1a1a]/40" title="Includes 24/7 roadside assistance" />
                </span>
                <span>₹{pricing.platformFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-[#1a1a1a]/80">
                <span>Taxes & GST (18%)</span>
                <span>₹{pricing.taxGst.toLocaleString('en-IN')}</span>
              </div>

              {pricing.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Coupon Discount</span>
                  <span>-₹{pricing.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#1a1a1a] pt-2 border-t border-[#1a1a1a]/20 font-bold">
                <span className="flex items-center gap-1">
                  Refundable Security Deposit
                  <Info className="w-3 h-3 text-[#1a1a1a]/40" title="100% refunded after trip inspection" />
                </span>
                <span>₹{pricing.securityDeposit.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-base font-black text-[#1a1a1a] pt-2 border-t-2 border-[#1a1a1a]">
                <span className="uppercase font-sans tracking-wide">Total Payable</span>
                <span className="text-[#ff5d22]">
                  ₹{pricing.totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Instant Book CTA */}
            <button
              disabled={!availResult.isAvailable}
              onClick={() => {
                const bookingPayload = {
                  vehicle: car,
                  vehicleId: car.id,
                  startDate,
                  endDate,
                  withDelivery,
                  pricing,
                  couponCode: appliedCoupon?.code,
                };
                if (onProceedToBooking) {
                  onProceedToBooking(bookingPayload);
                } else if (onBookNow) {
                  onBookNow(bookingPayload);
                }
              }}
              className={`w-full py-3.5 font-black text-sm flex items-center justify-center gap-2 border-2 border-[#1a1a1a] uppercase tracking-widest transition cursor-pointer ${
                availResult.isAvailable
                  ? 'bg-[#ff5d22] hover:bg-[#1a1a1a] text-white shadow-[4px_4px_0px_#1a1a1a]'
                  : 'bg-[#f4f1ea] text-[#1a1a1a]/40 border-[#1a1a1a]/40 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{availResult.isAvailable ? 'Proceed to Instant Reserve' : 'Dates Unavailable'}</span>
            </button>

            <p className="text-[10px] font-mono text-center text-[#1a1a1a]/60">
              Details verified on subsequent confirmation step. No auto-debit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

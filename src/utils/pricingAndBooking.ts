import { Vehicle, BookingPricingBreakdown, Coupon, Booking } from '../types';
import { APP_CONFIG, CANCELLATION_POLICIES } from '../config/appConfig';

/**
 * Calculate difference in days between two ISO date strings (YYYY-MM-DD)
 */
export function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

/**
 * Check if two date ranges [start1, end1] and [start2, end2] overlap
 */
export function doDatesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  return start1 <= end2 && end1 >= start2;
}

/**
 * Server/State Double-Booking Validation
 * Returns true if vehicle is completely free of conflicts and blocked dates
 */
export function checkVehicleAvailability(
  vehicle: Vehicle,
  startDate: string,
  endDate: string,
  existingBookings: Booking[],
  excludeBookingId?: string
): { isAvailable: boolean; reason?: string } {
  if (vehicle.status !== 'ACTIVE') {
    return { isAvailable: false, reason: `Vehicle is currently ${vehicle.status.toLowerCase().replace('_', ' ')}` };
  }

  // 1. Check owner blocked dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const cur = new Date(start);

  while (cur <= end) {
    const curStr = cur.toISOString().split('T')[0];
    if (vehicle.blockedDates && vehicle.blockedDates.includes(curStr)) {
      return { isAvailable: false, reason: `Vehicle owner has blocked dates on ${curStr}` };
    }
    cur.setDate(cur.getDate() + 1);
  }

  // 2. Check overlap with active bookings
  const conflictingBooking = existingBookings.find((b) => {
    if (b.vehicleId !== vehicle.id) return false;
    if (excludeBookingId && b.id === excludeBookingId) return false;
    // Disregard cancelled or rejected bookings
    if (['CANCELLED', 'REFUNDED', 'OWNER_REJECTED'].includes(b.status)) return false;

    return doDatesOverlap(startDate, endDate, b.startDate, b.endDate);
  });

  if (conflictingBooking) {
    return {
      isAvailable: false,
      reason: `Vehicle is already reserved from ${conflictingBooking.startDate} to ${conflictingBooking.endDate} (Booking ${conflictingBooking.id}).`,
    };
  }

  return { isAvailable: true };
}

/**
 * Calculate transparent, dynamic pricing with discounts, GST, and security deposit
 */
export function calculatePricingBreakdown(
  vehicle: Vehicle,
  startDate: string,
  endDate: string,
  withDelivery: boolean,
  appliedCoupon: Coupon | null,
  commissionPercent: number = APP_CONFIG.commissionPercentage,
  taxPercent: number = APP_CONFIG.taxPercentage,
  platformFeeAmount: number = APP_CONFIG.defaultPlatformFee
): BookingPricingBreakdown {
  const days = calculateDays(startDate, endDate);
  const baseRatePerDay = vehicle.pricePerDay;
  const rawRentalCost = baseRatePerDay * days;

  let discountPercentage = 0;
  if (days >= 30) {
    discountPercentage = vehicle.monthlyPriceDiscountPercent || 30;
  } else if (days >= 7) {
    discountPercentage = vehicle.weeklyPriceDiscountPercent || 15;
  }

  const discountAmount = Math.round((rawRentalCost * discountPercentage) / 100);
  const rentalCost = rawRentalCost - discountAmount;
  const deliveryFee = withDelivery && vehicle.deliveryAvailable ? vehicle.deliveryFee : 0;

  // Validate coupon
  let couponDiscount = 0;
  if (appliedCoupon && appliedCoupon.isActive) {
    const subtotalForCoupon = rentalCost;
    if (subtotalForCoupon >= appliedCoupon.minBookingAmount) {
      if (appliedCoupon.discountType === 'PERCENT') {
        const calculated = Math.round((subtotalForCoupon * appliedCoupon.discountValue) / 100);
        couponDiscount = Math.min(calculated, appliedCoupon.maxDiscount);
      } else {
        couponDiscount = Math.min(appliedCoupon.discountValue, subtotalForCoupon);
      }
    }
  }

  const taxableAmount = Math.max(0, rentalCost + platformFeeAmount + deliveryFee - couponDiscount);
  const taxGst = Math.round((taxableAmount * taxPercent) / 100);
  const securityDeposit = vehicle.securityDeposit;

  const totalPayable = taxableAmount + taxGst + securityDeposit;

  // Platform commission is calculated from net rental cost (not tax, not deposit)
  const platformCommissionFromOwner = Math.round((rentalCost * commissionPercent) / 100);
  const ownerEarning = rentalCost - platformCommissionFromOwner + deliveryFee;
  const platformRevenue = platformCommissionFromOwner + platformFeeAmount;

  return {
    days,
    baseRatePerDay,
    discountPercentage,
    discountAmount,
    rentalCost,
    deliveryFee,
    platformFee: platformFeeAmount,
    taxGst,
    couponDiscount,
    securityDeposit,
    totalPayable,
    ownerEarning,
    platformRevenue,
  };
}

/**
 * Calculate refund amount according to selected cancellation policy
 */
export function calculateCancellationRefund(
  booking: Booking,
  vehicle: Vehicle,
  currentTime: Date = new Date()
): { refundableAmount: number; policyApplied: string; explanation: string } {
  const policyName = vehicle.cancellationPolicy || 'Flexible';
  const policyConfig = CANCELLATION_POLICIES[policyName];

  const pickupDateTime = new Date(`${booking.startDate}T09:00:00`);
  const hoursUntilPickup = (pickupDateTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

  // Security deposit is ALWAYS 100% refundable upon cancellation prior to trip start
  const deposit = booking.pricing.securityDeposit;
  const rentalAndFees = booking.pricing.totalPayable - deposit;

  let feeRefundPercentage = 0;

  if (hoursUntilPickup >= policyConfig.fullRefundHours) {
    feeRefundPercentage = 100;
  } else if (hoursUntilPickup > 0) {
    feeRefundPercentage = policyConfig.partialRefundPercent;
  } else {
    feeRefundPercentage = 0;
  }

  const feeRefund = Math.round((rentalAndFees * feeRefundPercentage) / 100);
  const totalRefund = feeRefund + deposit;

  let explanation = '';
  if (feeRefundPercentage === 100) {
    explanation = `Full refund applied (${policyName} policy: canceled more than ${policyConfig.fullRefundHours} hours prior to pickup). 100% rental + 100% deposit returned.`;
  } else if (feeRefundPercentage > 0) {
    explanation = `${policyConfig.partialRefundPercent}% refund applied on rental charges under ${policyName} policy. 100% deposit returned.`;
  } else {
    explanation = `Pickup time has passed or within non-refundable window under ${policyName} policy. Security deposit returned in full.`;
  }

  return {
    refundableAmount: totalRefund,
    policyApplied: policyName,
    explanation,
  };
}

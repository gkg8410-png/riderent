export type UserRole = 'CUSTOMER' | 'OWNER' | 'ADMIN';

export type OwnerVerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export type VehicleStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED' | 'INACTIVE' | 'SOLD';

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';
export type Transmission = 'Automatic' | 'Manual';
export type VehicleCategory = 'Hatchback' | 'Sedan' | 'SUV' | 'Luxury' | 'EV' | '7-Seater';

export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_PROCESSING'
  | 'CONFIRMED'
  | 'OWNER_PENDING'
  | 'OWNER_ACCEPTED'
  | 'OWNER_REJECTED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'DISPUTED';

export type PaymentStatus = 'CREATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'ON_HOLD';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
export type CancellationPolicyType = 'Flexible' | 'Moderate' | 'Strict';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
  ownerStatus?: OwnerVerificationStatus;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
    upiId?: string;
  };
}

export interface VehicleDocument {
  id: string;
  type: 'RC' | 'Insurance' | 'PUC' | 'Owner_ID';
  documentNumber: string;
  fileUrl: string;
  verified: boolean;
  expiryDate?: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerRating: number;
  ownerVerified: boolean;
  name: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  fuelType: FuelType;
  transmission: Transmission;
  seatingCapacity: number;
  numberPlate: string;
  color: string;
  kilometersDriven: number;
  category: VehicleCategory;
  description: string;
  features: string[];
  city: string;
  pickupLocation: string;
  deliveryAvailable: boolean;
  deliveryFee: number;
  pricePerDay: number;
  weeklyPriceDiscountPercent: number; // e.g. 15% discount for 7+ days
  monthlyPriceDiscountPercent: number; // e.g. 35% discount for 30+ days
  securityDeposit: number;
  minRentalDays: number;
  maxRentalDays: number;
  cancellationPolicy: CancellationPolicyType;
  status: VehicleStatus;
  images: string[];
  documents: VehicleDocument[];
  blockedDates: string[]; // YYYY-MM-DD
  rating: number;
  reviewCount: number;
  totalTrips: number;
  createdAt: string;
  rejectionReason?: string;
}

export interface BookingPricingBreakdown {
  days: number;
  baseRatePerDay: number;
  discountPercentage: number;
  discountAmount: number;
  rentalCost: number;
  deliveryFee: number;
  platformFee: number;
  taxGst: number; // 18%
  couponDiscount: number;
  securityDeposit: number;
  totalPayable: number;
  ownerEarning: number;
  platformRevenue: number;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  vehicleNumberPlate: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  ownerId: string;
  ownerName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  pickupLocation: string;
  withDelivery: boolean;
  pricing: BookingPricingBreakdown;
  couponCode?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  paymentTransactionId?: string;
  cancellationReason?: string;
  refundAmount?: number;
  createdAt: string;
  isReviewed?: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  vehicleId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  ownerResponse?: {
    comment: string;
    createdAt: string;
  };
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  category: 'Payment' | 'Booking' | 'Vehicle' | 'Refund' | 'Account' | 'Other';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  adminResponse?: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minBookingAmount: number;
  maxDiscount: number;
  startDate: string;
  expiryDate: string;
  usageCount: number;
  usageLimit: number;
  isActive: boolean;
  description: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  tag: string;
  actionText: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'VEHICLE' | 'USER' | 'BOOKING' | 'SETTINGS' | 'DISPUTE';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface PlatformSettings {
  platformName: string;
  currency: string;
  currencySymbol: string;
  country: string;
  timezone: string;
  commissionPercentage: number;
  taxPercentage: number;
  defaultPlatformFee: number;
  minRentalDurationDays: number;
  maxRentalDurationDays: number;
  supportEmail: string;
  supportPhone: string;
  autoApproveVehicles: boolean;
  allowCashfreeRazorpayMock: boolean;
}

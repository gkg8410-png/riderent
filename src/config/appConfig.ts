import { PlatformSettings, VehicleCategory, FuelType, Transmission } from '../types';

export const APP_CONFIG: PlatformSettings = {
  platformName: 'RideRent',
  currency: 'INR',
  currencySymbol: '₹',
  country: 'India',
  timezone: 'Asia/Kolkata',
  commissionPercentage: 12, // 12% platform fee/commission
  taxPercentage: 18, // 18% GST in India
  defaultPlatformFee: 499, // Flat ₹499 facilitation charge
  minRentalDurationDays: 1,
  maxRentalDurationDays: 90,
  supportEmail: 'support@riderent.in',
  supportPhone: '+91 8000 743 373',
  autoApproveVehicles: false, // Strict admin verification
  allowCashfreeRazorpayMock: true,
};

export const INDIAN_CITIES = [
  'Mumbai',
  'Bengaluru',
  'Delhi NCR',
  'Pune',
  'Hyderabad',
  'Goa',
  'Chennai',
  'Jaipur',
  'Kolkata',
  'Ahmedabad',
];

export const VEHICLE_CATEGORIES: { id: VehicleCategory; label: string; iconName: string; desc: string }[] = [
  { id: 'SUV', label: 'SUV & 4x4', iconName: 'Compass', desc: 'Rugged & spacious for getaways' },
  { id: 'Sedan', label: 'Sedan', iconName: 'Car', desc: 'Comfortable executive cruisers' },
  { id: 'Hatchback', label: 'Hatchback', iconName: 'Key', desc: 'Agile city commuters' },
  { id: 'EV', label: 'Electric (EV)', iconName: 'Zap', desc: 'Zero emissions, smart tech' },
  { id: '7-Seater', label: '7-Seater MPV', iconName: 'Users', desc: 'Big family holiday rides' },
  { id: 'Luxury', label: 'Luxury', iconName: 'Crown', desc: 'Premium German prestige' },
];

export const FUEL_TYPES: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];
export const TRANSMISSIONS: Transmission[] = ['Automatic', 'Manual'];

export const CANCELLATION_POLICIES = {
  Flexible: {
    name: 'Flexible',
    desc: 'Full refund up to 24 hours prior to pickup. 50% refund thereafter.',
    fullRefundHours: 24,
    partialRefundPercent: 50,
  },
  Moderate: {
    name: 'Moderate',
    desc: 'Full refund up to 72 hours prior to pickup. 50% refund between 72-24h, no refund <24h.',
    fullRefundHours: 72,
    partialRefundPercent: 50,
  },
  Strict: {
    name: 'Strict',
    desc: '50% refund up to 7 days before pickup. No refund within 7 days.',
    fullRefundHours: 168,
    partialRefundPercent: 50,
  },
};

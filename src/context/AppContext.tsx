import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Vehicle,
  Booking,
  Review,
  Coupon,
  PromoBanner,
  AuditLog,
  SupportTicket,
  ChatMessage,
  PlatformSettings,
  BookingPricingBreakdown,
  VehicleStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TICKETS,
} from '../data/mockData';
import { APP_CONFIG } from '../config/appConfig';
import { checkVehicleAvailability, calculateCancellationRefund } from '../utils/pricingAndBooking';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  vehicles: Vehicle[];
  bookings: Booking[];
  reviews: Review[];
  coupons: Coupon[];
  banners: PromoBanner[];
  auditLogs: AuditLog[];
  tickets: SupportTicket[];
  messages: ChatMessage[];
  favourites: string[];
  platformSettings: PlatformSettings;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  toggleFavourite: (vehicleId: string) => void;
  createBooking: (
    vehicleId: string,
    startDate: string,
    endDate: string,
    withDelivery: boolean,
    pricing: BookingPricingBreakdown,
    paymentMethod: 'UPI' | 'Card' | 'NetBanking',
    couponCode?: string
  ) => { success: boolean; bookingId?: string; error?: string };
  cancelBooking: (bookingId: string, reason: string) => { success: boolean; refundAmount: number; error?: string };
  addVehicle: (vehicleData: Partial<Vehicle>) => { success: boolean; vehicleId: string };
  toggleVehicleActive: (vehicleId: string) => void;
  blockVehicleDates: (vehicleId: string, dates: string[]) => void;
  approveVehicle: (vehicleId: string) => void;
  rejectVehicle: (vehicleId: string, reason: string) => void;
  addReview: (bookingId: string, vehicleId: string, rating: number, comment: string) => void;
  respondToReview: (reviewId: string, comment: string) => void;
  sendMessage: (bookingId: string, text: string) => void;
  createSupportTicket: (category: SupportTicket['category'], subject: string, description: string, priority: SupportTicket['priority']) => void;
  resolveSupportTicket: (ticketId: string, adminResponse: string) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  updateUserVerification: (userId: string, isVerified: boolean, ownerStatus?: User['ownerStatus']) => void;
  createCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  deleteCoupon: (id: string) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'riderent_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence with localStorage fallback
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default: Rahul Sharma (Customer)
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [banners] = useState<PromoBanner[]>(INITIAL_BANNERS);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'messages');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'msg_1',
            bookingId: 'BK-2026-8801',
            senderId: 'user_cust_1',
            senderName: 'Rahul Sharma',
            senderRole: 'CUSTOMER',
            message: 'Hi Vikram, can I pickup the Thar around 9:30 AM at Bandra West?',
            timestamp: '2026-09-02T15:00:00.000Z',
            read: true,
          },
          {
            id: 'msg_2',
            bookingId: 'BK-2026-8801',
            senderId: 'user_owner_1',
            senderName: 'Vikram Malhotra',
            senderRole: 'OWNER',
            message: 'Sure Rahul! 9:30 AM is perfect. The car will be fully washed with full fuel tank.',
            timestamp: '2026-09-02T15:10:00.000Z',
            read: true,
          },
        ];
  });

  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'favs');
    return saved ? JSON.parse(saved) : ['veh_1', 'veh_4'];
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'settings');
    return saved ? JSON.parse(saved) : APP_CONFIG;
  });

  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'favs', JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  // Quick switch role
  const switchRole = (role: UserRole) => {
    const candidate = allUsers.find((u) => u.role === role);
    if (candidate) {
      setCurrentUser(candidate);
    }
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const toggleFavourite = (vehicleId: string) => {
    setFavourites((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
  };

  // Central Booking Engine with rigorous Double-Booking Prevention
  const createBooking = (
    vehicleId: string,
    startDate: string,
    endDate: string,
    withDelivery: boolean,
    pricing: BookingPricingBreakdown,
    paymentMethod: 'UPI' | 'Card' | 'NetBanking',
    couponCode?: string
  ): { success: boolean; bookingId?: string; error?: string } => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) {
      return { success: false, error: 'Vehicle not found' };
    }

    // Double booking verification
    const availCheck = checkVehicleAvailability(vehicle, startDate, endDate, bookings);
    if (!availCheck.isAvailable) {
      return { success: false, error: availCheck.reason || 'This vehicle is not available for these dates.' };
    }

    const newBookingId = `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentTxnId = `pay_rzp_${Date.now().toString().slice(-8)}`;

    const newBooking: Booking = {
      id: newBookingId,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleImage: vehicle.images[0] || '',
      vehicleNumberPlate: vehicle.numberPlate,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerEmail: currentUser.email,
      ownerId: vehicle.ownerId,
      ownerName: vehicle.ownerName,
      startDate,
      endDate,
      pickupLocation: vehicle.pickupLocation,
      withDelivery,
      pricing,
      couponCode,
      status: 'CONFIRMED',
      paymentStatus: 'SUCCESS',
      paymentMethod,
      paymentTransactionId: paymentTxnId,
      createdAt: new Date().toISOString(),
    };

    // Increment coupon usage
    if (couponCode) {
      setCoupons((prev) =>
        prev.map((c) => (c.code === couponCode ? { ...c, usageCount: c.usageCount + 1 } : c))
      );
    }

    // Update vehicle total trips
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, totalTrips: (v.totalTrips || 0) + 1 } : v))
    );

    setBookings((prev) => [newBooking, ...prev]);

    // Add Audit Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminId: 'SYSTEM',
      adminName: 'RideRent Engine',
      action: 'BOOKING_CONFIRMED',
      targetType: 'BOOKING',
      targetId: newBookingId,
      details: `Booking created for ${vehicle.name} from ${startDate} to ${endDate} by ${currentUser.name}. Total ₹${pricing.totalPayable}.`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    return { success: true, bookingId: newBookingId };
  };

  const cancelBooking = (
    bookingId: string,
    reason: string
  ): { success: boolean; refundAmount: number; error?: string } => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, refundAmount: 0, error: 'Booking not found' };

    const vehicle = vehicles.find((v) => v.id === booking.vehicleId);
    if (!vehicle) return { success: false, refundAmount: 0, error: 'Vehicle record not found' };

    const { refundableAmount, explanation } = calculateCancellationRefund(booking, vehicle);

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'CANCELLED',
              cancellationReason: `${reason} (${explanation})`,
              refundAmount: refundableAmount,
              paymentStatus: refundableAmount > 0 ? 'REFUNDED' : b.paymentStatus,
            }
          : b
      )
    );

    // Audit log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser.role === 'ADMIN' ? currentUser.id : 'CUSTOMER',
      adminName: currentUser.name,
      action: 'BOOKING_CANCELLED',
      targetType: 'BOOKING',
      targetId: bookingId,
      details: `Cancellation by ${currentUser.name}. Policy calculated refund: ₹${refundableAmount}. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    return { success: true, refundAmount: refundableAmount };
  };

  const addVehicle = (vehicleData: Partial<Vehicle>): { success: boolean; vehicleId: string } => {
    const newId = `veh_${Date.now().toString().slice(-6)}`;
    const status: VehicleStatus = platformSettings.autoApproveVehicles ? 'ACTIVE' : 'PENDING_APPROVAL';

    const newVehicle: Vehicle = {
      id: newId,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerPhone: currentUser.phone,
      ownerRating: 5.0,
      ownerVerified: currentUser.ownerStatus === 'VERIFIED',
      name: vehicleData.name || 'New Vehicle',
      brand: vehicleData.brand || 'Brand',
      model: vehicleData.model || 'Model',
      variant: vehicleData.variant || '',
      year: vehicleData.year || 2024,
      fuelType: vehicleData.fuelType || 'Petrol',
      transmission: vehicleData.transmission || 'Automatic',
      seatingCapacity: vehicleData.seatingCapacity || 5,
      numberPlate: vehicleData.numberPlate || 'MH 00 XX 0000',
      color: vehicleData.color || 'White',
      kilometersDriven: vehicleData.kilometersDriven || 10000,
      category: vehicleData.category || 'SUV',
      description: vehicleData.description || '',
      features: vehicleData.features || ['Air Conditioning', 'Bluetooth Audio'],
      city: vehicleData.city || currentUser.city,
      pickupLocation: vehicleData.pickupLocation || 'Central City Hub',
      deliveryAvailable: vehicleData.deliveryAvailable ?? true,
      deliveryFee: vehicleData.deliveryFee ?? 400,
      pricePerDay: vehicleData.pricePerDay || 2500,
      weeklyPriceDiscountPercent: vehicleData.weeklyPriceDiscountPercent || 15,
      monthlyPriceDiscountPercent: vehicleData.monthlyPriceDiscountPercent || 30,
      securityDeposit: vehicleData.securityDeposit || 4000,
      minRentalDays: vehicleData.minRentalDays || 1,
      maxRentalDays: vehicleData.maxRentalDays || 30,
      cancellationPolicy: vehicleData.cancellationPolicy || 'Flexible',
      status,
      images: vehicleData.images && vehicleData.images.length > 0 ? vehicleData.images : [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80',
      ],
      documents: vehicleData.documents || [],
      blockedDates: [],
      rating: 5.0,
      reviewCount: 0,
      totalTrips: 0,
      createdAt: new Date().toISOString(),
    };

    setVehicles((prev) => [newVehicle, ...prev]);

    // Audit log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'VEHICLE_SUBMITTED',
      targetType: 'VEHICLE',
      targetId: newId,
      details: `Owner ${currentUser.name} listed ${newVehicle.name} (${newVehicle.numberPlate}). Status: ${status}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    return { success: true, vehicleId: newId };
  };

  const toggleVehicleActive = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          const nextStatus: VehicleStatus = v.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...v, status: nextStatus };
        }
        return v;
      })
    );
  };

  const blockVehicleDates = (vehicleId: string, dates: string[]) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, blockedDates: dates } : v))
    );
  };

  const approveVehicle = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: 'ACTIVE', rejectionReason: undefined } : v))
    );
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'VEHICLE_APPROVED',
      targetType: 'VEHICLE',
      targetId: vehicleId,
      details: `Admin ${currentUser.name} approved vehicle ${vehicleId} to ACTIVE`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const rejectVehicle = (vehicleId: string, reason: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: 'REJECTED', rejectionReason: reason } : v))
    );
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'VEHICLE_REJECTED',
      targetType: 'VEHICLE',
      targetId: vehicleId,
      details: `Admin ${currentUser.name} rejected vehicle ${vehicleId}. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addReview = (bookingId: string, vehicleId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      bookingId,
      vehicleId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerAvatar: currentUser.avatarUrl,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Mark booking as reviewed
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, isReviewed: true } : b))
    );

    // Update vehicle average rating
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          const currentReviews = reviews.filter((r) => r.vehicleId === vehicleId);
          const newCount = currentReviews.length + 1;
          const newAvg = Number(
            ((currentReviews.reduce((sum, r) => sum + r.rating, 0) + rating) / newCount).toFixed(2)
          );
          return { ...v, rating: newAvg, reviewCount: newCount };
        }
        return v;
      })
    );
  };

  const respondToReview = (reviewId: string, comment: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              ownerResponse: {
                comment,
                createdAt: new Date().toISOString(),
              },
            }
          : r
      )
    );
  };

  const sendMessage = (bookingId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      bookingId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      message: text,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const createSupportTicket = (
    category: SupportTicket['category'],
    subject: string,
    description: string,
    priority: SupportTicket['priority']
  ) => {
    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      category,
      priority,
      subject,
      description,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const resolveSupportTicket = (ticketId: string, adminResponse: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'RESOLVED',
              adminResponse,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const updatePlatformSettings = (newSettings: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateUserVerification = (
    userId: string,
    isVerified: boolean,
    ownerStatus?: User['ownerStatus']
  ) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            isVerified,
            ownerStatus: ownerStatus !== undefined ? ownerStatus : u.ownerStatus,
          };
        }
        return u;
      })
    );
  };

  const createCoupon = (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup_${Date.now()}`,
      usageCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setVehicles(INITIAL_VEHICLES);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setCoupons(INITIAL_COUPONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setTickets(INITIAL_TICKETS);
    setFavourites(['veh_1', 'veh_4']);
    setPlatformSettings(APP_CONFIG);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        vehicles,
        bookings,
        reviews,
        coupons,
        banners,
        auditLogs,
        tickets,
        messages,
        favourites,
        platformSettings,
        selectedCity,
        setSelectedCity,
        switchRole,
        switchUser,
        toggleFavourite,
        createBooking,
        cancelBooking,
        addVehicle,
        toggleVehicleActive,
        blockVehicleDates,
        approveVehicle,
        rejectVehicle,
        addReview,
        respondToReview,
        sendMessage,
        createSupportTicket,
        resolveSupportTicket,
        updatePlatformSettings,
        updateUserVerification,
        createCoupon,
        deleteCoupon,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

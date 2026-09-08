import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VEHICLE_CATEGORIES, INDIAN_CITIES } from '../../config/appConfig';
import { Vehicle, VehicleCategory } from '../../types';
import {
  Search,
  Calendar,
  MapPin,
  Heart,
  Star,
  Users,
  Fuel,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface CustomerHomeProps {
  onSelectCar: (carId: string) => void;
  onNavigateToSearch: (filters?: { category?: VehicleCategory; city?: string }) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onSelectCar,
  onNavigateToSearch,
}) => {
  const {
    vehicles,
    favourites,
    toggleFavourite,
    selectedCity,
    setSelectedCity,
    banners,
    currentUser,
  } = useApp();

  // Search input state
  const [searchCity, setSearchCity] = useState<string>(
    selectedCity === 'All Cities' ? 'Mumbai' : selectedCity
  );
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState<string>(todayStr);
  const [returnDate, setReturnDate] = useState<string>(tomorrowStr);

  const activeVehicles = vehicles.filter((v) => v.status === 'ACTIVE');

  // Filter vehicles for featured sections
  const popularVehicles = activeVehicles.slice(0, 4);
  const evAndLuxuryVehicles = activeVehicles.filter(
    (v) => v.category === 'EV' || v.category === 'Luxury'
  );

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity !== 'All Cities') {
      setSelectedCity(searchCity);
    }
    onNavigateToSearch({ city: searchCity });
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section - Artistic Flair Editorial Canvas */}
      <section className="relative rounded-none border-2 border-[#1a1a1a] overflow-hidden bg-[#1a1a1a] text-[#f4f1ea] shadow-[6px_6px_0px_#1a1a1a]">
        {/* Background Image with Architectural Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80"
            alt="Scenic Highway Car Rental"
            className="w-full h-full object-cover object-center opacity-25 grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-dot-grid opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 sm:py-20 text-center">
          {/* Curated Marker */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1 border border-[#f4f1ea]/30 bg-[#1a1a1a]/70 text-[#f4f1ea] text-[10px] font-black uppercase tracking-[0.25em] mb-6 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff5d22]"></div>
            <span>Curated Fleet Archive • Section 01</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-editorial italic tracking-tight text-[#f4f1ea] mb-6 leading-[0.95]">
            The Weight <br className="hidden sm:inline" />
            <span className="font-sans font-black not-italic tracking-tighter uppercase text-white">of the Open Road</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#f4f1ea]/75 font-medium mb-10 leading-relaxed tracking-wide">
            Verified self-drive machines rented directly from trusted Indian hosts. Clean titles, zero counter delays, and guaranteed double-booking prevention.
          </p>

          {/* Interactive Hero Search Form - Architectural Box */}
          <form
            onSubmit={handleHeroSearch}
            className="bg-[#f4f1ea] text-[#1a1a1a] p-4 sm:p-5 shadow-[6px_6px_0px_#ff5d22] max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-3 text-left border-2 border-[#1a1a1a]"
          >
            {/* Location selector */}
            <div className="sm:col-span-4 flex flex-col justify-center px-3.5 py-2.5 bg-white border border-[#1a1a1a] transition">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1a1a]/60 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ff5d22]" />
                Pickup City
              </label>
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="mt-0.5 bg-transparent font-black text-xs uppercase tracking-wider text-[#1a1a1a] focus:outline-none cursor-pointer"
              >
                <option value="All Cities">All Cities (India)</option>
                {INDIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Date */}
            <div className="sm:col-span-3 flex flex-col justify-center px-3.5 py-2.5 bg-white border border-[#1a1a1a] transition">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1a1a]/60 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#ff5d22]" />
                Trip Start
              </label>
              <input
                type="date"
                min={todayStr}
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="mt-0.5 bg-transparent font-bold text-xs text-[#1a1a1a] focus:outline-none cursor-pointer font-mono"
              />
            </div>

            {/* Return Date */}
            <div className="sm:col-span-3 flex flex-col justify-center px-3.5 py-2.5 bg-white border border-[#1a1a1a] transition">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1a1a]/60 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ff5d22]" />
                Trip Return
              </label>
              <input
                type="date"
                min={pickupDate}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="mt-0.5 bg-transparent font-bold text-xs text-[#1a1a1a] focus:outline-none cursor-pointer font-mono"
              />
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 flex items-center">
              <button
                type="submit"
                className="w-full h-full py-3 px-4 bg-[#1a1a1a] hover:bg-[#ff5d22] text-[#f4f1ea] hover:text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 border border-[#1a1a1a] transition-colors duration-200 cursor-pointer shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick micro guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-wider text-[#f4f1ea]/70 font-mono">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff5d22]"></div>
              RTO & Parivahan Approved
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff5d22]"></div>
              Atomic Calendar Locking
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff5d22]"></div>
              18% GST Compliant
            </span>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b-2 border-[#1a1a1a] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/50 block">Archive Classification</span>
            <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight uppercase">
              Curated Segments
            </h2>
          </div>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-black uppercase tracking-widest text-[#1a1a1a] hover:text-[#ff5d22] flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4 cursor-pointer"
          >
            Full Catalog ({activeVehicles.length})
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {VEHICLE_CATEGORIES.map((cat) => {
            const count = activeVehicles.filter((v) => v.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigateToSearch({ category: cat.id })}
                className="group p-4 bg-white hover:bg-[#1a1a1a] hover:text-[#f4f1ea] border-2 border-[#1a1a1a] text-left transition-all duration-150 shadow-[2px_2px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_#ff5d22] flex flex-col justify-between cursor-pointer"
              >
                <div className="w-8 h-8 bg-[#f4f1ea] group-hover:bg-[#ff5d22] text-[#1a1a1a] group-hover:text-white flex items-center justify-center font-mono font-bold text-[10px] border border-[#1a1a1a] mb-4">
                  {(cat.id || '').slice(0, 3)}
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] group-hover:text-white">
                    {cat.label}
                  </h3>
                  <p className="text-[10px] font-mono text-[#1a1a1a]/50 group-hover:text-[#f4f1ea]/70 mt-1">{count} Available</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured / Popular Cars */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b-2 border-[#1a1a1a] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/50 block">Fleet Spotlight</span>
            <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight uppercase">
              Popular Rides in India
            </h2>
          </div>
          <button
            onClick={() => onNavigateToSearch()}
            className="text-[11px] font-black uppercase tracking-widest text-[#1a1a1a] hover:text-[#ff5d22] flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4 cursor-pointer"
          >
            See All ({activeVehicles.length})
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularVehicles.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isFav={favourites.includes(car.id)}
              onToggleFav={() => toggleFavourite(car.id)}
              onSelect={() => onSelectCar(car.id)}
            />
          ))}
        </div>
      </section>

      {/* Promotional Banners */}
      {banners.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map((ban) => (
            <div
              key={ban.id}
              className="relative border-2 border-[#1a1a1a] bg-[#1a1a1a] text-[#f4f1ea] p-6 sm:p-8 flex flex-col justify-between min-h-[220px] shadow-[4px_4px_0px_#1a1a1a] overflow-hidden"
            >
              <img
                src={ban.imageUrl}
                alt={ban.title}
                className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/85 to-transparent" />
              <div className="relative z-10">
                <span className="inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] bg-[#ff5d22] text-white mb-3 font-mono border border-[#1a1a1a]">
                  {ban.tag}
                </span>
                <h3 className="text-xl font-editorial italic font-normal text-white">{ban.title}</h3>
                <p className="text-xs text-[#f4f1ea]/75 mt-1 max-w-sm">{ban.subtitle}</p>
              </div>
              <div className="relative z-10 mt-4">
                <button
                  onClick={() => onNavigateToSearch()}
                  className="px-4 py-2 bg-[#f4f1ea] hover:bg-[#ff5d22] text-[#1a1a1a] hover:text-white font-black text-[10px] uppercase tracking-widest border border-[#1a1a1a] shadow-xs transition cursor-pointer"
                >
                  {ban.actionText}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Luxury & Electric Fleet */}
      {evAndLuxuryVehicles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b-2 border-[#1a1a1a] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/50 block">High Performance Archive</span>
              <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight uppercase">
                Electric & Executive Luxury
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {evAndLuxuryVehicles.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                isFav={favourites.includes(car.id)}
                onToggleFav={() => toggleFavourite(car.id)}
                onSelect={() => onSelectCar(car.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Trust & Safety Features */}
      <section className="bg-[#f4f1ea] border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] p-6 sm:p-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#1a1a1a]/60 block font-mono">
            Infrastructure & Safeguards
          </span>
          <h2 className="text-2xl font-editorial italic font-normal text-[#1a1a1a] mt-1">
            Why Drivers Choose RideRent
          </h2>
          <p className="text-xs text-[#1a1a1a]/70 mt-1 max-w-md mx-auto">
            Built specifically for India's roads, commercial RTO compliances, and host security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-5 border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a]">
            <div className="w-8 h-8 bg-[#1a1a1a] text-[#ff5d22] flex items-center justify-center font-bold mb-3 border border-[#1a1a1a]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1a1a1a]">Admin Verification</h3>
            <p className="text-xs text-[#1a1a1a]/75 mt-1 leading-relaxed">
              Every vehicle registration certificate (RC) and insurance is checked by our team before approval.
            </p>
          </div>

          <div className="bg-white p-5 border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a]">
            <div className="w-8 h-8 bg-[#1a1a1a] text-[#ff5d22] flex items-center justify-center font-bold mb-3 border border-[#1a1a1a]">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1a1a1a]">No Double-Booking</h3>
            <p className="text-xs text-[#1a1a1a]/75 mt-1 leading-relaxed">
              Atomic date validation ensures that when a reservation is confirmed, the vehicle is locked.
            </p>
          </div>

          <div className="bg-white p-5 border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a]">
            <div className="w-8 h-8 bg-[#1a1a1a] text-[#ff5d22] flex items-center justify-center font-bold mb-3 border border-[#1a1a1a]">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1a1a1a]">Transparent Pricing</h3>
            <p className="text-xs text-[#1a1a1a]/75 mt-1 leading-relaxed">
              Clear breakdown of daily tariff, GST (18%), refundable security deposit, and tiered refund policies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export const CarCard: React.FC<{
  car: Vehicle;
  isFav: boolean;
  onToggleFav: () => void;
  onSelect: () => void;
}> = ({ car, isFav, onToggleFav, onSelect }) => {
  return (
    <div className="bg-white border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] hover:shadow-[5px_5px_0px_#ff5d22] transition-all duration-150 flex flex-col justify-between group">
      <div>
        {/* Car Image with Badges */}
        <div className="relative h-44 w-full bg-[#f4f1ea] overflow-hidden border-b-2 border-[#1a1a1a]">
          <img
            src={car.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600'}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Category tag */}
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-[#1a1a1a] text-white font-mono border border-white/20">
            {car.category}
          </span>

          {/* Favourite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav();
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 bg-white border border-[#1a1a1a] flex items-center justify-center shadow-xs hover:bg-[#f4f1ea] transition cursor-pointer"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFav ? 'text-[#ff5d22] fill-[#ff5d22]' : 'text-[#1a1a1a]'
              }`}
            />
          </button>

          {/* Delivery available badge */}
          {car.deliveryAvailable && (
            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider bg-white text-[#1a1a1a] border border-[#1a1a1a] font-mono">
              Home Drop
            </span>
          )}

          {/* Plate / Code */}
          <span className="absolute bottom-2 right-2 text-[8px] font-bold font-mono uppercase bg-[#1a1a1a] text-[#f4f1ea] px-1.5 py-0.5 tracking-wider">
            {(car.numberPlate || (car as any).plateNumber || '').slice(0, 7)}
          </span>
        </div>

        {/* Details Content */}
        <div className="p-3.5 space-y-2">
          <div className="flex items-start justify-between gap-1">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wide text-[#1a1a1a] leading-snug line-clamp-1 group-hover:text-[#ff5d22] transition">
                {car.name}
              </h3>
              <p className="text-[10px] text-[#1a1a1a]/60 font-mono">
                {car.city} • {car.variant || car.model}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-black text-[#1a1a1a] bg-[#f4f1ea] px-1.5 py-0.5 border border-[#1a1a1a]">
              <Star className="w-3 h-3 text-[#ff5d22] fill-[#ff5d22]" />
              <span>{car.rating}</span>
            </div>
          </div>

          {/* Specs Micro Bar */}
          <div className="flex items-center gap-3 pt-1.5 text-[10px] font-mono text-[#1a1a1a]/70 border-t border-[#1a1a1a]/15">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#1a1a1a]/60" />
              {car.seatingCapacity}S
            </span>
            <span className="flex items-center gap-1">
              <Fuel className="w-3 h-3 text-[#1a1a1a]/60" />
              {car.fuelType}
            </span>
            <span className="truncate uppercase">{car.transmission}</span>
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-3.5 pt-2 flex items-center justify-between border-t border-[#1a1a1a]/15 bg-[#f4f1ea]/40">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-[#1a1a1a] font-mono">
              ₹{car.pricePerDay.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#1a1a1a]/60">/day</span>
          </div>
          <p className="text-[9px] text-[#ff5d22] font-mono font-bold">
            {car.weeklyPriceDiscountPercent}% off &gt;7d
          </p>
        </div>

        <button
          onClick={onSelect}
          className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#ff5d22] text-[#f4f1ea] hover:text-white font-black text-[10px] uppercase tracking-widest border border-[#1a1a1a] transition cursor-pointer shadow-2xs"
        >
          View Car
        </button>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { INDIAN_CITIES, VEHICLE_CATEGORIES, FUEL_TYPES, TRANSMISSIONS } from '../../config/appConfig';
import { VehicleCategory, FuelType, Transmission } from '../../types';
import { CarCard } from './CustomerHome';
import { checkVehicleAvailability } from '../../utils/pricingAndBooking';
import {
  SlidersHorizontal,
  Search,
  Calendar,
  MapPin,
  X,
  RotateCcw,
} from 'lucide-react';

interface CarSearchPageProps {
  initialCategory?: VehicleCategory;
  initialCity?: string;
  onSelectCar: (carId: string) => void;
}

export const CarSearchPage: React.FC<CarSearchPageProps> = ({
  initialCategory,
  initialCity,
  onSelectCar,
}) => {
  const { vehicles, bookings, favourites, toggleFavourite, selectedCity } = useApp();

  // Filter states
  const [cityFilter, setCityFilter] = useState<string>(
    initialCity || (selectedCity !== 'All Cities' ? selectedCity : 'All')
  );
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory || 'ALL');

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 3);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(nextWeekStr);
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [selectedFuels, setSelectedFuels] = useState<FuelType[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<Transmission[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [deliveryOnly, setDeliveryOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>(
    'recommended'
  );
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Toggle helpers
  const toggleFuel = (fuel: FuelType) => {
    setSelectedFuels((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel]
    );
  };

  const toggleTransmission = (t: Transmission) => {
    setSelectedTransmissions((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const toggleSeat = (s: number) => {
    setSelectedSeats((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const clearFilters = () => {
    setCityFilter('All');
    setCategoryFilter('ALL');
    setMaxPrice(12000);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
    setSelectedSeats([]);
    setDeliveryOnly(false);
  };

  // Filtered & Sorted list
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((car) => {
        // Must be active
        if (car.status !== 'ACTIVE') return false;

        // City filter
        if (cityFilter !== 'All' && car.city !== cityFilter) return false;

        // Category filter
        if (categoryFilter !== 'ALL' && car.category !== categoryFilter) return false;

        // Price filter
        if (car.pricePerDay > maxPrice) return false;

        // Fuel filter
        if (selectedFuels.length > 0 && !selectedFuels.includes(car.fuelType)) return false;

        // Transmission filter
        if (
          selectedTransmissions.length > 0 &&
          !selectedTransmissions.includes(car.transmission)
        )
          return false;

        // Seats filter
        if (selectedSeats.length > 0 && !selectedSeats.includes(car.seatingCapacity))
          return false;

        // Delivery only
        if (deliveryOnly && !car.deliveryAvailable) return false;

        // Double-booking date validation
        if (startDate && endDate) {
          const avail = checkVehicleAvailability(car, startDate, endDate, bookings);
          if (!avail.isAvailable) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.pricePerDay - b.pricePerDay;
        if (sortBy === 'price_high') return b.pricePerDay - a.pricePerDay;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.totalTrips || 0) - (a.totalTrips || 0); // Recommended
      });
  }, [
    vehicles,
    bookings,
    cityFilter,
    categoryFilter,
    maxPrice,
    selectedFuels,
    selectedTransmissions,
    selectedSeats,
    deliveryOnly,
    startDate,
    endDate,
    sortBy,
  ]);

  return (
    <div className="space-y-6 pb-16">
      {/* Search Header Bar */}
      <div className="bg-white p-4 sm:p-5 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* City */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-bold text-[#1a1a1a]">
            <MapPin className="w-3.5 h-3.5 text-[#ff5d22]" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-bold text-xs uppercase tracking-wider text-[#1a1a1a]"
            >
              <option value="All">All Cities (India)</option>
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-mono font-bold text-[#1a1a1a]">
            <Calendar className="w-3.5 h-3.5 text-[#ff5d22]" />
            <input
              type="date"
              value={startDate}
              min={todayStr}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            />
            <span className="text-[#1a1a1a]/40 uppercase font-sans text-[10px]">to</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Sort and Mobile Filters toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] text-[#f4f1ea] text-xs font-black uppercase tracking-wider border border-[#1a1a1a]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff5d22]" />
            Filters
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#1a1a1a]/60 uppercase font-mono text-[10px] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-[#f4f1ea] border border-[#1a1a1a] font-bold text-xs uppercase tracking-wider text-[#1a1a1a] focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Car Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Sidebar Filters */}
        <aside
          className={`${
            showMobileFilters ? 'block' : 'hidden'
          } lg:block lg:col-span-1 bg-white p-5 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] space-y-6 self-start`}
        >
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff5d22]" />
              <h3 className="font-black text-xs uppercase tracking-widest text-[#1a1a1a]">Archive Filters</h3>
            </div>
            <button
              onClick={clearFilters}
              className="text-[10px] text-[#1a1a1a]/60 hover:text-[#ff5d22] font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1a1a]/70">
              Vehicle Segment
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-[#1a1a1a] transition cursor-pointer ${
                  categoryFilter === 'ALL'
                    ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                    : 'bg-[#f4f1ea] text-[#1a1a1a] hover:bg-white'
                }`}
              >
                All
              </button>
              {VEHICLE_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-[#1a1a1a] transition cursor-pointer ${
                    categoryFilter === c.id
                      ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                      : 'bg-[#f4f1ea] text-[#1a1a1a] hover:bg-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1a1a]/70">
                Max Daily Rate
              </label>
              <span className="font-mono font-black text-[#ff5d22]">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={1500}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#ff5d22] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#1a1a1a]/50">
              <span>₹1,500</span>
              <span>₹15,000+</span>
            </div>
          </div>

          {/* Fuel Types */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1a1a]/70">
              Fuel Propellant
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FUEL_TYPES.map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => toggleFuel(fuel)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border border-[#1a1a1a] transition cursor-pointer ${
                    selectedFuels.includes(fuel)
                      ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                      : 'bg-[#f4f1ea] text-[#1a1a1a] hover:bg-white'
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1a1a]/70">
              Transmission
            </label>
            <div className="flex gap-2">
              {TRANSMISSIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTransmission(t)}
                  className={`flex-1 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border border-[#1a1a1a] transition cursor-pointer ${
                    selectedTransmissions.includes(t)
                      ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                      : 'bg-[#f4f1ea] text-[#1a1a1a] hover:bg-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Seating Capacity */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1a1a1a]/70">
              Seats
            </label>
            <div className="flex gap-2">
              {[4, 5, 7].map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSeat(s)}
                  className={`flex-1 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border border-[#1a1a1a] transition cursor-pointer ${
                    selectedSeats.includes(s)
                      ? 'bg-[#1a1a1a] text-[#f4f1ea]'
                      : 'bg-[#f4f1ea] text-[#1a1a1a] hover:bg-white'
                  }`}
                >
                  {s} Seats
                </button>
              ))}
            </div>
          </div>

          {/* Home Delivery toggle */}
          <div className="pt-3 border-t border-[#1a1a1a]/20">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#1a1a1a]">
              <input
                type="checkbox"
                checked={deliveryOnly}
                onChange={(e) => setDeliveryOnly(e.target.checked)}
                className="w-4 h-4 rounded-none border-2 border-[#1a1a1a] accent-[#ff5d22] cursor-pointer"
              />
              <span className="text-[11px] uppercase tracking-wider">Home Delivery Available</span>
            </label>
          </div>
        </aside>

        {/* Cars Result Grid */}
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#1a1a1a]/70 px-1 font-mono">
            <span>
              ARCHIVE: <strong className="text-[#1a1a1a] font-bold">{filteredVehicles.length}</strong> ENTRIES
              {cityFilter !== 'All' && ` [${cityFilter.toUpperCase()}]`}
            </span>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-[#f4f1ea] border border-[#1a1a1a] text-[#ff5d22] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wide text-[#1a1a1a]">
                No Vehicles Match Filter Specifications
              </h3>
              <p className="text-xs text-[#1a1a1a]/70 max-w-md mx-auto">
                Try widening your rate criteria, selecting "All Cities", or changing your dates to avoid conflicts.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[#1a1a1a] text-[#f4f1ea] hover:bg-[#ff5d22] hover:text-white text-xs font-black uppercase tracking-widest border border-[#1a1a1a] transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredVehicles.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isFav={favourites.includes(car.id)}
                  onToggleFav={() => toggleFavourite(car.id)}
                  onSelect={() => onSelectCar(car.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

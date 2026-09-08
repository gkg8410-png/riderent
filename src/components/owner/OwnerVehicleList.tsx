import React from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle } from '../../types';
import {
  Plus,
  Car,
  Calendar,
  AlertCircle,
  Power,
  PowerOff,
  CheckCircle2,
  Clock,
  MapPin,
  Fuel,
} from 'lucide-react';

interface OwnerVehicleListProps {
  onAddNewCar: () => void;
  onOpenCalendar: (carId: string) => void;
}

export const OwnerVehicleList: React.FC<OwnerVehicleListProps> = ({
  onAddNewCar,
  onOpenCalendar,
}) => {
  const { currentUser, vehicles, toggleVehicleActive } = useApp();

  const myVehicles = vehicles.filter((v) => v.ownerId === currentUser.id);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#1a1a1a] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] tracking-tight">Fleet Inventory Roster</h1>
          <p className="text-xs font-mono text-[#1a1a1a]/70">
            Regulate active availability, evaluate vehicle dossier approvals, and calibrate day tariffs
          </p>
        </div>

        <button
          onClick={onAddNewCar}
          className="px-5 py-3 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-mono font-bold uppercase tracking-widest text-xs flex items-center gap-2 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Vehicle</span>
        </button>
      </div>

      {myVehicles.length === 0 ? (
        <div className="bg-white border-2 border-[#1a1a1a] p-12 text-center space-y-4 shadow-[6px_6px_0px_#1a1a1a]">
          <div className="w-12 h-12 border-2 border-[#1a1a1a] bg-[#f4f1ea] text-[#ff5d22] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#1a1a1a]">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">No vehicles listed in your fleet</h3>
          <p className="text-xs font-mono text-[#1a1a1a]/70 max-w-sm mx-auto">
            Monetize idle vehicular assets by registering your certified car on RideRent.
          </p>
          <button
            onClick={onAddNewCar}
            className="px-5 py-2.5 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white text-xs font-mono font-bold uppercase tracking-widest border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
          >
            List First Motorcar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myVehicles.map((car) => (
            <div
              key={car.id}
              className="bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] flex flex-col justify-between"
            >
              <div>
                {/* Image and Status */}
                <div className="relative h-48 bg-[#f4f1ea] border-b-2 border-[#1a1a1a] overflow-hidden">
                  <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] ${
                      car.status === 'ACTIVE'
                        ? 'bg-white text-[#1a1a1a]'
                        : car.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-100 text-amber-950'
                        : car.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-950'
                        : 'bg-neutral-800 text-white'
                    }`}
                  >
                    {car.status.replace('_', ' ')}
                  </span>

                  <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#1a1a1a] text-white font-mono text-xs border border-white">
                    {car.numberPlate}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">{car.name}</h3>
                    <p className="text-xs font-mono text-[#1a1a1a]/70 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#ff5d22]" />
                      {car.city} • {car.pickupLocation}
                    </p>
                  </div>

                  {/* Specs Pill bar */}
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-[#1a1a1a]">
                    <span className="px-2 py-0.5 bg-[#f4f1ea] border border-[#1a1a1a]">{car.fuelType}</span>
                    <span className="px-2 py-0.5 bg-[#f4f1ea] border border-[#1a1a1a]">{car.transmission}</span>
                    <span className="px-2 py-0.5 bg-[#f4f1ea] border border-[#1a1a1a]">
                      {car.seatingCapacity} Berths
                    </span>
                    <span className="px-2 py-0.5 bg-[#f4f1ea] border border-[#1a1a1a]">
                      Deposit: ₹{car.securityDeposit.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Pricing Overview */}
                  <div className="flex justify-between items-baseline p-3 bg-[#f4f1ea] border border-[#1a1a1a] text-xs">
                    <div>
                      <span className="text-[9px] font-mono uppercase font-bold text-[#1a1a1a]/60 block">
                        Base Daily Tariff
                      </span>
                      <strong className="text-base font-mono font-bold text-[#1a1a1a]">
                        ₹{car.pricePerDay.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] font-mono text-[#1a1a1a]/60"> /day</span>
                    </div>

                    <div className="text-right font-mono text-[10px] text-[#1a1a1a]/70">
                      <span className="block">
                        Weekly: {car.weeklyPriceDiscountPercent}% off
                      </span>
                      <span className="block">
                        Monthly: {car.monthlyPriceDiscountPercent}% off
                      </span>
                    </div>
                  </div>

                  {/* Rejection Alert if any */}
                  {car.status === 'REJECTED' && car.rejectionReason && (
                    <div className="p-3 bg-rose-50 border border-rose-900 text-xs text-rose-900 space-y-1 font-mono">
                      <span className="font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        Auditor Review Feedback:
                      </span>
                      <p>{car.rejectionReason}</p>
                    </div>
                  )}

                  {/* Blocked Dates Info */}
                  {car.blockedDates && car.blockedDates.length > 0 && (
                    <p className="text-[10px] font-mono text-[#1a1a1a] bg-white p-2 border border-[#1a1a1a]">
                      <strong>{car.blockedDates.length} dates blocked</strong> for maintenance/personal use.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => onOpenCalendar(car.id)}
                  className="flex-1 py-2 bg-white hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] border border-[#1a1a1a] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[2px_2px_0px_#1a1a1a]"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Block Dates</span>
                </button>

                <button
                  onClick={() => toggleVehicleActive(car.id)}
                  disabled={car.status === 'PENDING_APPROVAL' || car.status === 'REJECTED'}
                  className={`flex-1 py-2 font-mono font-bold text-xs uppercase tracking-wider border border-[#1a1a1a] flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[2px_2px_0px_#1a1a1a] ${
                    car.status === 'ACTIVE'
                      ? 'bg-rose-100 hover:bg-rose-200 text-rose-900'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {car.status === 'ACTIVE' ? (
                    <>
                      <PowerOff className="w-3.5 h-3.5" />
                      <span>Pause Listing</span>
                    </>
                  ) : (
                    <>
                      <Power className="w-3.5 h-3.5" />
                      <span>Activate Listing</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

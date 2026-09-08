import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, AlertCircle, Check, Trash2 } from 'lucide-react';

interface OwnerCalendarModalProps {
  carId: string;
  onClose: () => void;
}

export const OwnerCalendarModal: React.FC<OwnerCalendarModalProps> = ({ carId, onClose }) => {
  const { vehicles, bookings, blockVehicleDates } = useApp();

  const car = vehicles.find((v) => v.id === carId);
  const [blockedList, setBlockedList] = useState<string[]>(car?.blockedDates || []);
  const [newBlockDate, setNewBlockDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!car) return null;

  // Find confirmed bookings for this car to prevent owner blocking dates already booked by travelers
  const carBookings = bookings.filter(
    (b) => b.vehicleId === car.id && ['CONFIRMED', 'ACTIVE'].includes(b.status)
  );

  const handleAddBlock = () => {
    setErrorMsg(null);
    if (!newBlockDate) return;

    // Check if conflicting with an active booking
    const hasBooking = carBookings.some(
      (b) => newBlockDate >= b.startDate && newBlockDate <= b.endDate
    );
    if (hasBooking) {
      setErrorMsg(`Cannot block ${newBlockDate} because a confirmed customer booking is active.`);
      return;
    }

    if (blockedList.includes(newBlockDate)) {
      setErrorMsg(`${newBlockDate} is already blocked.`);
      return;
    }

    const updated = [...blockedList, newBlockDate].sort();
    setBlockedList(updated);
    blockVehicleDates(car.id, updated);
  };

  const handleRemoveBlock = (dateStr: string) => {
    const updated = blockedList.filter((d) => d !== dateStr);
    setBlockedList(updated);
    blockVehicleDates(car.id, updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-xs p-4">
      <div className="bg-white border-2 border-[#1a1a1a] max-w-md w-full p-6 space-y-5 shadow-[8px_8px_0px_#1a1a1a] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1a1a1a]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff5d22] block">
              Fleet Calendar Dispatch
            </span>
            <h3 className="font-serif font-bold text-lg text-[#1a1a1a]">Maintenance Blackout Window</h3>
            <p className="text-xs font-mono text-[#1a1a1a]/70">{car.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#f4f1ea] hover:bg-[#ff5d22] hover:text-white flex items-center justify-center text-[#1a1a1a] border border-[#1a1a1a] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-mono text-[#1a1a1a]/80">
          Blackout dates lock your vehicular asset from traveler bookings for servicing, personal itineraries, or routine inspections.
        </p>

        {/* Add Block Date input */}
        <div className="flex gap-2">
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={newBlockDate}
            onChange={(e) => setNewBlockDate(e.target.value)}
            className="flex-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-mono font-bold focus:outline-none focus:border-[#ff5d22] cursor-pointer"
          />
          <button
            onClick={handleAddBlock}
            className="px-4 py-2 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-mono font-bold uppercase tracking-wider text-xs border border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
          >
            Blackout Date
          </button>
        </div>

        {errorMsg && (
          <p className="text-[11px] font-mono text-rose-900 bg-rose-50 p-2 border border-rose-900">
            {errorMsg}
          </p>
        )}

        {/* Existing Active Customer Bookings */}
        {carBookings.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#1a1a1a]/70 block">
              Active Guest Itineraries
            </span>
            {carBookings.map((b) => (
              <div
                key={b.id}
                className="p-2.5 bg-[#f4f1ea] border border-[#1a1a1a] text-xs flex justify-between items-center text-[#1a1a1a] font-mono"
              >
                <span>
                  {b.startDate} → {b.endDate}
                </span>
                <span className="font-bold">{b.customerName}</span>
              </div>
            ))}
          </div>
        )}

        {/* Blocked Dates List */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-mono uppercase font-bold text-[#1a1a1a]/70 block">
            Owner Withheld Dates ({blockedList.length})
          </span>

          {blockedList.length === 0 ? (
            <p className="text-xs font-mono text-[#1a1a1a]/50 py-3 text-center">
              No dates currently blacked out. The asset is entirely available for booking.
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {blockedList.map((dt) => (
                <div
                  key={dt}
                  className="flex items-center justify-between p-2.5 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-mono"
                >
                  <span className="font-bold text-[#1a1a1a]">{dt}</span>
                  <button
                    onClick={() => handleRemoveBlock(dt)}
                    className="text-rose-700 hover:text-rose-900 p-1 transition cursor-pointer"
                    title="Unblock date"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#1a1a1a] hover:bg-[#ff5d22] text-white font-mono font-bold uppercase tracking-widest text-xs border border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] transition cursor-pointer"
        >
          Confirm Schedule
        </button>
      </div>
    </div>
  );
};

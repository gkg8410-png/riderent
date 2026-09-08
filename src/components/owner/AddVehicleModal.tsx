import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INDIAN_CITIES, VEHICLE_CATEGORIES, FUEL_TYPES, TRANSMISSIONS } from '../../config/appConfig';
import { VehicleCategory, FuelType, Transmission, CancellationPolicyType } from '../../types';
import {
  X,
  Car,
  FileText,
  Upload,
  CheckCircle,
  Plus,
  ShieldCheck,
  Fuel,
  Info,
} from 'lucide-react';

interface AddVehicleModalProps {
  onClose: () => void;
  onSuccess: (vehicleId: string) => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ onClose, onSuccess }) => {
  const { addVehicle, currentUser, platformSettings } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [brand, setBrand] = useState('Mahindra');
  const [model, setModel] = useState('Scorpio-N');
  const [variant, setVariant] = useState('Z8L 4x4 Diesel AT');
  const [year, setYear] = useState(2024);
  const [category, setCategory] = useState<VehicleCategory>('SUV');
  const [numberPlate, setNumberPlate] = useState('MH 02 GA 8811');
  const [color, setColor] = useState('Deep Forest Green');

  // Specs
  const [fuelType, setFuelType] = useState<FuelType>('Diesel');
  const [transmission, setTransmission] = useState<Transmission>('Automatic');
  const [seatingCapacity, setSeatingCapacity] = useState(7);
  const [kilometersDriven, setKilometersDriven] = useState(15000);
  const [city, setCity] = useState(currentUser.city || 'Mumbai');
  const [pickupLocation, setPickupLocation] = useState('Andheri West / Airport Terminal 2');
  const [description, setDescription] = useState(
    'Meticulously maintained top-end 4x4 luxury SUV with sunroof, ventilated leather seats, and Sony 12-speaker audio. Sanitized before every trip.'
  );

  // Pricing
  const [pricePerDay, setPricePerDay] = useState(3600);
  const [weeklyDiscount, setWeeklyDiscount] = useState(15);
  const [monthlyDiscount, setMonthlyDiscount] = useState(30);
  const [securityDeposit, setSecurityDeposit] = useState(5000);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(400);
  const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicyType>('Flexible');

  // Photos & Documents
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&fit=crop&q=80',
  ]);
  const [rcNumber, setRcNumber] = useState('MH02GA8811');
  const [insuranceNumber, setInsuranceNumber] = useState('ICICI-LOMBARD-449102');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addVehicle({
      name: `${brand} ${model} ${variant}`,
      brand,
      model,
      variant,
      year,
      category,
      numberPlate: numberPlate.toUpperCase(),
      color,
      fuelType,
      transmission,
      seatingCapacity,
      kilometersDriven,
      city,
      pickupLocation,
      description,
      pricePerDay,
      weeklyPriceDiscountPercent: weeklyDiscount,
      monthlyPriceDiscountPercent: monthlyDiscount,
      securityDeposit,
      deliveryAvailable,
      deliveryFee,
      cancellationPolicy,
      images: imageUrls,
      features: [
        'Automatic Climate Control',
        'Sunroof',
        'Apple CarPlay',
        'Cruise Control',
        'Fastag Installed',
        'Rear Parking Camera',
      ],
      documents: [
        {
          id: `doc_${Date.now()}_1`,
          type: 'RC',
          documentNumber: rcNumber,
          fileUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600',
          verified: false,
          expiryDate: '2039-01-01',
        },
        {
          id: `doc_${Date.now()}_2`,
          type: 'Insurance',
          documentNumber: insuranceNumber,
          fileUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
          verified: false,
          expiryDate: '2027-01-01',
        },
      ],
    });

    onSuccess(res.vehicleId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border-2 border-[#1a1a1a] max-w-xl w-full overflow-hidden shadow-[8px_8px_0px_#1a1a1a] my-8 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-[#1a1a1a] text-[#f4f1ea] p-5 flex items-center justify-between border-b-2 border-[#1a1a1a]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff5d22] block">
              Fleet Registration Dossier
            </span>
            <h3 className="font-serif font-bold text-base text-white">Enroll New Vehicle onto Platform</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#f4f1ea] hover:bg-[#ff5d22] hover:text-white flex items-center justify-center text-[#1a1a1a] border border-[#1a1a1a] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b-2 border-[#1a1a1a] text-xs font-mono font-bold uppercase bg-[#f4f1ea]">
          <div
            className={`flex-1 py-2.5 text-center ${
              step === 1 ? 'text-[#1a1a1a] border-b-2 border-[#ff5d22] bg-white' : 'text-[#1a1a1a]/50'
            }`}
          >
            1. Identity
          </div>
          <div
            className={`flex-1 py-2.5 text-center ${
              step === 2 ? 'text-[#1a1a1a] border-b-2 border-[#ff5d22] bg-white' : 'text-[#1a1a1a]/50'
            }`}
          >
            2. Specs
          </div>
          <div
            className={`flex-1 py-2.5 text-center ${
              step === 3 ? 'text-[#1a1a1a] border-b-2 border-[#ff5d22] bg-white' : 'text-[#1a1a1a]/50'
            }`}
          >
            3. Tariffs
          </div>
          <div
            className={`flex-1 py-2.5 text-center ${
              step === 4 ? 'text-[#1a1a1a] border-b-2 border-[#ff5d22] bg-white' : 'text-[#1a1a1a]/50'
            }`}
          >
            4. Proof & RC
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">Make / Brand</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">Model</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">Variant</label>
                  <input
                    type="text"
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">Year</label>
                  <input
                    type="number"
                    min={2015}
                    max={2026}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    Vehicle Body Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none"
                  >
                    {VEHICLE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    License Plate (RTO Registration)
                  </label>
                  <input
                    type="text"
                    required
                    value={numberPlate}
                    onChange={(e) => setNumberPlate(e.target.value.toUpperCase())}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-mono uppercase font-bold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Specs & City */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">Fuel</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    Transmission
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as any)}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none"
                  >
                    {TRANSMISSIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">Seats</label>
                  <input
                    type="number"
                    min={2}
                    max={9}
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    Operating City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none"
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    Pickup Landmark
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                  Vehicle Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs focus:outline-none focus:border-[#ff5d22]"
                />
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Deposit */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    Daily Tariff (₹)
                  </label>
                  <input
                    type="number"
                    min={800}
                    step={100}
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-mono font-bold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    min={2000}
                    step={500}
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-mono font-bold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    Weekly Rebate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={weeklyDiscount}
                    onChange={(e) => setWeeklyDiscount(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    Monthly Rebate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={monthlyDiscount}
                    onChange={(e) => setMonthlyDiscount(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-semibold focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#f4f1ea] border border-[#1a1a1a] space-y-2">
                <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-[#1a1a1a] cursor-pointer">
                  <span>Offer Doorstep Valet Delivery?</span>
                  <input
                    type="checkbox"
                    checked={deliveryAvailable}
                    onChange={(e) => setDeliveryAvailable(e.target.checked)}
                    className="w-4 h-4 border border-[#1a1a1a] accent-[#ff5d22]"
                  />
                </label>
                {deliveryAvailable && (
                  <div className="pt-2 border-t border-[#1a1a1a] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#1a1a1a]/80">Delivery Convenience Fee (₹)</span>
                    <input
                      type="number"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(Number(e.target.value))}
                      className="w-24 p-1.5 bg-white border border-[#1a1a1a] text-right font-bold focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Documents & Photos */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 bg-[#f4f1ea] border border-[#1a1a1a] text-xs text-[#1a1a1a] space-y-1">
                <div className="flex items-center gap-1.5 font-bold font-mono uppercase text-[#1a1a1a]">
                  <ShieldCheck className="w-4 h-4 text-[#ff5d22]" />
                  <span>Mandatory Statutory Compliance</span>
                </div>
                <p className="text-[11px] font-sans text-[#1a1a1a]/80">
                  RideRent mandates a validated Registration Certificate (RC) and Comprehensive Insurance for all peer listings.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    RC Document Number
                  </label>
                  <input
                    type="text"
                    required
                    value={rcNumber}
                    onChange={(e) => setRcNumber(e.target.value.toUpperCase())}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                    Insurance Policy Number
                  </label>
                  <input
                    type="text"
                    required
                    value={insuranceNumber}
                    onChange={(e) => setInsuranceNumber(e.target.value.toUpperCase())}
                    className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#ff5d22]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-[#1a1a1a]/70 uppercase">
                  Vehicle Exterior Photo URL
                </label>
                <input
                  type="url"
                  value={imageUrls[0]}
                  onChange={(e) => setImageUrls([e.target.value, ...imageUrls.slice(1)])}
                  className="w-full mt-1 p-2 bg-[#f4f1ea] border border-[#1a1a1a] text-xs focus:outline-none focus:border-[#ff5d22]"
                />
              </div>

              <div className="text-[11px] font-mono text-[#1a1a1a]/70">
                Initial listing status will be set to{' '}
                <strong className="text-[#ff5d22]">
                  {platformSettings.autoApproveVehicles ? 'ACTIVE' : 'PENDING_APPROVAL'}
                </strong>{' '}
                and audited in the Admin Compliance Desk.
              </div>
            </div>
          )}

          {/* Wizard Footer Controls */}
          <div className="flex justify-between gap-3 pt-4 border-t-2 border-[#1a1a1a]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 bg-white text-[#1a1a1a] border border-[#1a1a1a] font-mono font-bold uppercase text-xs hover:bg-[#1a1a1a] hover:text-white transition shadow-[2px_2px_0px_#1a1a1a] cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="px-5 py-2.5 bg-[#1a1a1a] text-white font-mono font-bold uppercase tracking-wider text-xs border border-[#1a1a1a] hover:bg-[#ff5d22] transition cursor-pointer shadow-[3px_3px_0px_#1a1a1a]"
              >
                Proceed Next Step
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white font-mono font-bold uppercase tracking-widest text-xs border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] transition cursor-pointer"
              >
                Submit for Audit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

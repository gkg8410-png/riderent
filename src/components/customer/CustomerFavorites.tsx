import React from 'react';
import { useApp } from '../../context/AppContext';
import { CarCard } from './CustomerHome';
import { Heart, ArrowRight } from 'lucide-react';

interface CustomerFavoritesProps {
  onSelectCar: (carId: string) => void;
  onExploreCars: () => void;
}

export const CustomerFavorites: React.FC<CustomerFavoritesProps> = ({
  onSelectCar,
  onExploreCars,
}) => {
  const { vehicles, favourites, toggleFavourite } = useApp();

  const favVehicles = vehicles.filter((v) => favourites.includes(v.id));

  return (
    <div className="space-y-6 pb-20">
      <div className="border-b-2 border-[#1a1a1a] pb-4">
        <h1 className="text-2xl font-serif font-bold text-[#1a1a1a] tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#ff5d22] fill-[#ff5d22]" />
          Saved Vehicles Collection ({favVehicles.length})
        </h1>
        <p className="text-xs font-mono text-[#1a1a1a]/70">
          Curated models bookmarked for upcoming itineraries or weekend drives
        </p>
      </div>

      {favVehicles.length === 0 ? (
        <div className="bg-white border-2 border-[#1a1a1a] p-12 text-center space-y-4 shadow-[4px_4px_0px_#1a1a1a]">
          <div className="w-12 h-12 border-2 border-[#1a1a1a] bg-[#f4f1ea] text-[#ff5d22] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#1a1a1a]">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">No saved vehicles yet</h3>
          <p className="text-xs font-mono text-[#1a1a1a]/70 max-w-sm mx-auto">
            Mark any car card with the heart badge to pin it here for rapid access.
          </p>
          <button
            onClick={onExploreCars}
            className="px-4 py-2.5 bg-[#ff5d22] hover:bg-[#1a1a1a] text-white text-xs font-mono font-bold uppercase tracking-widest border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] transition cursor-pointer"
          >
            Explore Available Fleet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favVehicles.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isFav={true}
              onToggleFav={() => toggleFavourite(car.id)}
              onSelect={() => onSelectCar(car.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

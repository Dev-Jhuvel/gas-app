// components/StationCardCompact.tsx
import React from "react";

const StationCardCompact = ({ station, data, fuelType, isLowest }: any) => {
  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 rounded-2xl p-6 shadow-xl relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400 rounded-l-2xl" />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">{station}</h2>
          <p className="text-xs text-gray-400">{fuelType}</p>

          {isLowest && (
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/30">
              🟢 Lowest in Area
            </span>
          )}
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-blue-400">
            ₱{data.price.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            ₱{data.minPrice.toFixed(2)} - ₱{data.maxPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StationCardCompact;

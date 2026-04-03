// components/StationCardFull.tsx
import React from "react";

const StationCardFull = ({ station, fuels, isLowest }: any) => {
  const primary =
    fuels.find((f: any) => f.fuel.includes("RON 95")) ||
    [...fuels].sort((a: any, b: any) => a.price - b.price)[0];

  const gasoline = fuels.filter((f: any) => f.fuel.includes("RON"));
  const diesel = fuels.filter(
    (f: any) => f.fuel.includes("DIESEL") || f.fuel.includes("KEROSENE"),
  );

  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 rounded-2xl p-6 shadow-xl relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400 rounded-l-2xl" />

      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold">{station}</h2>
          <p className="text-xs text-gray-400">Metro Manila Station</p>

          <div className="flex gap-2 mt-1">
            {isLowest && (
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                🟢 Lowest in Area
              </span>
            )}
            {/* <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
              Top Rated
            </span> */}
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">PRIMARY ({primary.fuel})</p>
          <p className="text-3xl font-bold text-blue-400">
            ₱{primary.price.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-2">GASOLINE GRADES</p>
          {gasoline.map((g: any, i: number) => (
            <div
              key={i}
              className="flex justify-between bg-white/5 p-2 rounded mb-2"
            >
              <span>{g.fuel}</span>
              <span>{g.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">DIESEL & SPECIALIZED</p>
          {diesel.map((d: any, i: number) => (
            <div
              key={i}
              className="flex justify-between bg-white/5 p-2 rounded mb-2"
            >
              <span>{d.fuel}</span>
              <span>{d.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StationCardFull;

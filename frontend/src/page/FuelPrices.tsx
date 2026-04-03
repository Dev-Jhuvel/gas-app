// pages/FuelPrices.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import StationCardFull from "../components/StationCardFull";
import StationCardCompact from "../components/StationCardCompact";
import FilterBar from "../components/FilterBar";

const FuelPrices = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [fuelPrices, setFuelPrices] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:3001/api/lists");
      setCities(res.data.cities);
      setFuelTypes(res.data.fuelTypes);
      setFuelPrices(res.data.fuelPrices);
    }
    fetchData();
  }, []);

  const filtered = fuelPrices.filter((a) =>
    selectedCity ? a.area === selectedCity : true
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Fuel Price Monitor</h1>

      <FilterBar
        cities={cities}
        fuelTypes={fuelTypes}
        selectedCity={selectedCity}
        selectedFuelType={selectedFuelType}
        setSelectedCity={setSelectedCity}
        setSelectedFuelType={setSelectedFuelType}
      />

      <div className="space-y-10">
        {filtered.map((areaObj) => {
          // -----------------------
          // GROUP BY STATION
          // -----------------------
          const stations = Object.entries(areaObj.fuels).reduce(
            (acc: any, [fuel, list]: any) => {
              Object.entries(list).forEach(([station, data]: any) => {
                if (!acc[station]) acc[station] = [];
                acc[station].push({
                  fuel,
                  ...data,
                });
              });
              return acc;
            },
            {}
          );

          // -----------------------
          // LOWEST HELPERS
          // -----------------------
          const getLowest = (fuels: any[]) =>
            Math.min(
              ...fuels.map((f) => f.price ?? f.minPrice ?? Infinity)
            );

          const areaLowest = Math.min(
            ...Object.values(stations).map((fuels: any) =>
              getLowest(fuels)
            )
          );

          return (
            <div key={areaObj.area}>
              {/* -----------------------
                  AREA HEADER
              ----------------------- */}
              <div className="mb-4 flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-white/10" />
                <h2 className="text-lg font-semibold text-white whitespace-nowrap">
                  📍 {areaObj.area}
                </h2>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* -----------------------
                  STATIONS
              ----------------------- */}
              <div className="space-y-6">
                {Object.entries(stations)
                  // ✅ SORT LOWEST → HIGHEST
                  .sort(([, fuelsA]: any, [, fuelsB]: any) => {
                    return getLowest(fuelsA) - getLowest(fuelsB);
                  })
                  .map(([station, fuels]: any) => {
                    const stationLowest = getLowest(fuels);
                    const isLowest = stationLowest === areaLowest;

                    // -----------------------
                    // FILTER MODE (COMPACT)
                    // -----------------------
                    if (selectedFuelType) {
                      const selected = fuels.find(
                        (f: any) => f.fuel === selectedFuelType
                      );
                      if (!selected) return null;

                      return (
                        <StationCardCompact
                          key={station}
                          station={station}
                          data={selected}
                          fuelType={selectedFuelType}
                          isLowest={isLowest} // ✅ badge support
                        />
                      );
                    }

                    // -----------------------
                    // ALL MODE (FULL CARD)
                    // -----------------------
                    return (
                      <StationCardFull
                        key={station}
                        station={station}
                        fuels={fuels}
                        isLowest={isLowest} // ✅ badge support
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FuelPrices;
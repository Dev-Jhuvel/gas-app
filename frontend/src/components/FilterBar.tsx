// components/FilterBar.tsx
import React from "react";
import CustomDropdown from "../components/CustomDropdown";

const FilterBar = ({
  cities,
  fuelTypes,
  selectedCity,
  selectedFuelType,
  setSelectedCity,
  setSelectedFuelType,
}: any) => {
  return (
    <div className="bg-white/5 p-4 rounded-xl mb-8 flex gap-4">
      <CustomDropdown
        label="Select City"
        options={cities}
        value={selectedCity}
        onChange={setSelectedCity}
      />

      <CustomDropdown
        label="Select Fuel Type"
        options={fuelTypes}
        value={selectedFuelType}
        onChange={setSelectedFuelType}
      />
    </div>
  );
};

export default FilterBar;

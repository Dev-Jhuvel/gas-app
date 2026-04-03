import React, { useState } from "react";

interface Props {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

const CustomDropdown: React.FC<Props> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-64">
      {/* LABEL */}
      <p className="text-xs text-gray-400 mb-1">{label}</p>

      {/* SELECT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className="bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 cursor-pointer flex justify-between items-center hover:border-blue-500 transition"
      >
        <span className="text-sm">
          {value || "Select option"}
        </span>
        <span className="text-gray-400">▾</span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-[#020617] border border-white/10 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* ALL OPTION */}
          <div
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="px-4 py-2 text-sm hover:bg-blue-500/20 cursor-pointer"
          >
            All
          </div>

          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-4 py-2 text-sm hover:bg-blue-500/20 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
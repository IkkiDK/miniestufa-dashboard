import React from "react";
import { SENSOR_META, SENSOR_KEYS } from "../constants/sensors";

export default function SensorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {["all", ...SENSOR_KEYS].map((k) => {
        const active = value === k;
        return (
          <button
            key={k}
            onClick={() => onChange(k)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition
            ${active ? "bg-brand text-white border-brand" : "bg-white border-gray-200 hover:border-gray-300"}
            `}
          >
            {SENSOR_META[k].label}
          </button>
        );
      })}
    </div>
  );
}

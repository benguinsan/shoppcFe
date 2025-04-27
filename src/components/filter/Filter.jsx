import React from "react";

const Filter = ({ data, type, filterSelect, filter }) => {
  if (!data || !Array.isArray(data)) return null;
  
  return (
    <div className="flex flex-col gap-y-2">
      {data.map((item, index) => (
        <label key={index} className="custom-checkbox">
          <input
            type="checkbox"
            checked={
              type === "Brands" 
                ? filter.brand.includes(item.id) 
                : type === "Colors"
                ? filter.color.includes(item.name)
                : type === "Rams"
                ? filter.ram.includes(item.name)
                : filter.demand.includes(item.value)
            }
            onChange={(e) => filterSelect(type, e.target.checked, item)}
          />
          <span className="custom-checkbox__checkmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </span>
          <span className="text-base font-medium">{item.name}</span>
        </label>
      ))}
    </div>
  );
};

export default Filter;

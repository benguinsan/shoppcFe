import React from "react";
import { useState } from "react";

const Filter = ({ name, onChange, value }) => {
  const handleChange = (e) => {
    if (!onChange) return;
    const { name, value, checked } = e.target;
    if (checked) {
      onChange({ [name]: value });
    }
  };
  return (
    <div className="mb-3">
      <input
        type="checkbox"
        name={name}
        value={value}
        className="w-5 h-5 cursor-pointer"
        id={value}
        onChange={handleChange}
      />
      <label
        htmlFor={value}
        className="px-2 font-medium text-xl cursor-pointer"
      >
        {value}
      </label>
    </div>
  );
};

export default Filter;

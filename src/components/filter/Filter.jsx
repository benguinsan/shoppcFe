import React from "react";

const Filter = ({ name }) => {
  return (
    <div className="mb-3">
      <input
        type="checkbox"
        name={name}
        value={name}
        className="w-5 h-5 cursor-pointer"
        id={name}
      />
      <label htmlFor={name} className="px-2 font-medium text-xl cursor-pointer">
        {name}
      </label>
    </div>
  );
};

export default Filter;

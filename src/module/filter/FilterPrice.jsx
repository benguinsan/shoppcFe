import React from "react";
import { useState } from "react";

const FilterPrice = ({ onChange }) => {
  const [values, setValues] = useState({
    salePrice_gte: 0,
    salePrice_lte: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (onChange) {
      onChange(values);
    }
  };
  return (
    <div className="flex flex-col items-start p-5">
      <span className=" font-semibold mb-4 text-base">Chọn khoảng giá</span>
      <div className="flex items-center justify-between gap-x-5 ">
        <input
          className="p-2 border-b-2 border-solid  border-black"
          type="number"
          style={{ width: "115px" }}
          name="salePrice_gte"
          value={values.salePrice_gte}
          onChange={handleChange}
        ></input>
        <span>-</span>
        <input
          className="p-2 border-b-2 border-solid  border-black"
          type="number"
          style={{ width: "115px" }}
          name="salePrice_lte"
          value={values.salePrice_lte}
          onChange={handleChange}
        ></input>
      </div>
      <button
        className="px-3 py-2 mt-5 mx-auto rounded-lg border-2 border-solid border-blue-400"
        onClick={handleSubmit}
      >
        Áp dụng{" "}
      </button>
    </div>
  );
};

export default FilterPrice;

import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addBrand, removeBrand } from "../../redux/product/filterSlice";

const Filter = ({ name, value, filters = {}, onChange }) => {
  // const { brands } = useSelector((state) => state.filter);
  // const dispatch = useDispatch();
  const [brand, setBrand] = useState([]);
  // let listBrand = [];
  const handleChange = (e) => {
    const { value, checked, name } = e.target;
    if (checked) {
      // dispatch(addBrand(value));
      // listBrand.push(value);
      // console.log(listBrand);
      setBrand([...brand, value]);
      onChange({ [name]: brand });
    } else {
      // dispatch(removeBrand(value));
      // listBrand.filter((item) => item !== value);
      // setBrand(listBrand);
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
        checked={filters?.[name]?.includes(value) || false}
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

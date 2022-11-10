import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addBrand, removeBrand } from "../../redux/product/filterSlice";

const Filter = ({ name, value, filters = {}, onChange }) => {
  // const { brands } = useSelector((state) => state.filter);
  // const dispatch = useDispatch();
  let brand = [];
  const handleChange = (e) => {
    const { value, checked, name } = e.target;
    if (checked) {
      // dispatch(addBrand(value));
      brand.push(value);
      onChange({ [name]: brand });
    } else {
      // dispatch(removeBrand(value));
      brand.filter((item) => item !== value);
      onChange({ [name]: brand });
      // onChange({ [name]: brands.join(" ") });
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

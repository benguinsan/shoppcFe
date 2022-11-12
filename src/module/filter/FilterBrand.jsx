import React from "react";
import { useRef } from "react";
import { useState } from "react";
import Accordion from "../../components/accordion/Accordion";
import Filter from "../../components/filter/Filter";

const Brand = [
  {
    id: 1,
    name: "Asus",
  },
  {
    id: 2,
    name: "Acer",
  },
  {
    id: 3,
    name: "Lenevo",
  },
  {
    id: 4,
    name: "HP",
  },
  {
    id: 5,
    name: "MSI",
  },
];
const FilterBrand = ({ Change, params, filter, setFilter }) => {
  const filterSelect = (checked, item) => {
    if (checked) {
      setFilter({ brands: [...filter.brands, item.name] });
    } else {
      const newBrand = filter.brands.filter((e) => e !== item.name);
      setFilter({ brands: newBrand });
    }
    // Change({ brands: filter });
  };

  return (
    <div className="border-y-2 border-solid border-[#f5f5f9] w-full">
      <Accordion title="Thương hiệu" className="true">
        {Brand.length > 0 &&
          Brand.map((item) => {
            return (
              <Filter
                label={item.name}
                key={item.id}
                onChange={(input) => {
                  filterSelect(input.checked, item);
                }}
                checked={params?.brands?.includes(item.name)}
              />
            );
          })}
      </Accordion>
    </div>
  );
};

export default FilterBrand;

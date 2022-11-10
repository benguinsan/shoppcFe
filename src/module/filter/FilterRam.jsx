import React from "react";
import Accordion from "../../components/accordion/Accordion";
import Filter from "../../components/filter/Filter";
const Rams = [
  {
    id: 1,
    name: "4GB",
  },
  {
    id: 2,
    name: "8GB",
  },
  {
    id: 3,
    name: "16GB",
  },
  {
    id: 4,
    name: "32GB",
  },
];
const FilterRam = ({ onChange, filters }) => {
  const handleChange = (values) => {
    if (!onChange) return;
    onChange(values);
    console.log(values);
  };
  return (
    <div className="border-y-2 border-solid border-[#f5f5f9] w-full">
      <Accordion title="Ram">
        {Rams.length > 0 &&
          Rams.map((item) => {
            return (
              <Filter
                name="rams"
                value={item.name}
                key={item.id}
                filters={filters}
                onChange={handleChange}
              />
            );
          })}
      </Accordion>
    </div>
  );
};

export default FilterRam;

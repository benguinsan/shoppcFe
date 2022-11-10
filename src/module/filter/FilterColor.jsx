import React from "react";
import Accordion from "../../components/accordion/Accordion";
import Filter from "../../components/filter/Filter";
const Colors = [
  {
    id: 1,
    name: "Bạc",
  },
  {
    id: 2,
    name: "Vàng",
  },
  {
    id: 3,
    name: "Đen",
  },
  {
    id: 4,
    name: "Xám",
  },
  {
    id: 5,
    name: "Trắng",
  },
];
const FilterColor = ({ filters, onChange }) => {
  const handleChange = (values) => {
    if (!onChange) return;
    onChange(values);
    console.log(values);
  };
  return (
    <div className="border-y-2 border-solid border-[#f5f5f9] w-full">
      <Accordion title="Màu sắc">
        {Colors.length > 0 &&
          Colors.map((item) => {
            return (
              <Filter
                name="colors"
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

export default FilterColor;

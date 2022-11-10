import React from "react";
import Accordion from "../../components/accordion/Accordion";
import Filter from "../../components/filter/Filter";

const Demands = [
  {
    id: 1,
    name: "Học sinh - Sinh viên",
  },
  {
    id: 2,
    name: "Văn phòng",
  },
  {
    id: 3,
    name: "Gaming",
  },
  {
    id: 4,
    name: "Doanh nhân",
  },
  {
    id: 5,
    name: "Đồ họa",
  },
];
const FilterDemand = ({ filters, onChange }) => {
  const handleChange = (values) => {
    if (!onChange) return;
    onChange(values);
    console.log(values);
  };
  return (
    <div className="border-y-2 border-solid border-[#f5f5f9] w-full">
      <Accordion title="Nhu cầu">
        {Demands.length > 0 &&
          Demands.map((item) => {
            return (
              <Filter
                name="demands"
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

export default FilterDemand;

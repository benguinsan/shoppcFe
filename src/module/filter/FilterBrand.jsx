import React from "react";
import { useState } from "react";
import Accordion from "../../components/accordion/Accordion";
import Filter from "../../components/filter/Filter";

const FilterBrand = () => {
  return (
    <div className="border-y-2 border-solid border-[#f5f5f9] w-full">
      <Accordion title="Thương hiệu">
        <Filter name="Acer" />
        <Filter name="Asus" />
        <Filter name="Lenevo" />
        <Filter name="HP" />
        <Filter name="MSI" />
      </Accordion>
      <Accordion title="Màu sắc">
        <Filter name="Bạc" />
        <Filter name="Vàng" />
        <Filter name="Xám" />
        <Filter name="Đen" />
      </Accordion>
      <Accordion title="Nhu cầu">
        <Filter name="Doanh nhân" />
        <Filter name="Gaming" />
        <Filter name="Học sinh - Sinh viên" />
        <Filter name="Văn phòng" />
        <Filter name="Đồ họa - Kỹ thuật" />
      </Accordion>
    </div>
  );
};

export default FilterBrand;

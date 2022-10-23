import React from "react";
import ItemAddress from "./ItemAddress";

const data = [
  {
    id: "1",
    name: "Cuong",
    address:
      "287 Lê Hồng Phong, Phường Lê Hồng Phong, Thành Phố Quy Nhơn, Tỉnh Bình Định",
    phone: "0987654321",
  },
  {
    id: "2",
    name: "Nga",
    address:
      "1220 Quang Trung, Phường Quang Trung, Quận Gò Vấp, Thành phố Hồ Chí Minh",
    phone: "0873456789",
  },
  {
    id: "3",
    name: "Quốc",
    address: "5 Đường Số 7, Phường Cống Vị, Quận Ba Đình, Thành phố Hà Nội",
    phone: "0167432153",
  },
];
const ListAddress = () => {
  return (
    <>
      {data.map((item) => (
        <ItemAddress data={item} key={item.id} />
      ))}
    </>
  );
};

export default ListAddress;

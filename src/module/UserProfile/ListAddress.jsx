import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import ItemAddress from "./ItemAddress";

const ListAddress = () => {
  const [address, setAddress] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await userApi.getAddress();
        setAddress(response.data.address);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  return (
    <>
      {address.length > 0 &&
        address.map((item, index) => (
          <ItemAddress data={item} key={index} data_key={index} />
        ))}
    </>
  );
};

export default ListAddress;

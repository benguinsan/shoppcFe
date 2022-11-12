import React, { useEffect, useState } from "react";
import { getAddress } from "../../redux/auth/userSlice";
import ItemAddress from "./ItemAddress";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const ListAddress = () => {
  const [address, setAddress] = useState([]);
  const { current } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const action = getAddress();
        const resultAction = await dispatch(action);
        const data = unwrapResult(resultAction);
        setAddress(data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [current?.address]);

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

import React, { useEffect } from "react";
import ItemAddress from "./ItemAddress";
import { useDispatch, useSelector } from "react-redux";
import { action_status } from "../../utils/constants/status";
import { getAddress, refresh } from "../../redux/auth/addressSlice";
import LoadingPage from "../../components/loading/LoadingPage";

const ListAddress = () => {
  const { status, updateAddress, add, deleteAddress, address } = useSelector(
    (state) => state.address
  );

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      if (status === action_status.IDLE) {
        dispatch(getAddress());
      }
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    try {
      if (add) {
        dispatch(getAddress());
        dispatch(refresh());
      }
      if (deleteAddress) {
        dispatch(getAddress());
        dispatch(refresh());
      }
      if (updateAddress) {
        dispatch(getAddress());
        dispatch(refresh());
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [add, deleteAddress, updateAddress]);

  return (
    <>
      {status === action_status.LOADING && <LoadingPage />}
      {status === action_status.SUCCEEDED &&
        address.length > 0 &&
        address.map((item, index) => (
          <ItemAddress data={item} key={index} data_key={index} />
        ))}
    </>
  );
};

export default ListAddress;

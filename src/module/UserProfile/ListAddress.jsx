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
      {address.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[300px] bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-28 h-28 animate-bounce"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xl font-medium">
            Hiện tại chưa có thông tin địa chỉ. Vui lòng bạn thêm địa chỉ mới
            !!!
          </span>
        </div>
      )}
    </>
  );
};

export default ListAddress;

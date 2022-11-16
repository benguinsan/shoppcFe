import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/table/Table";
import DashboardHeading from "../dashboard/DashboardHeding";
import { formatPrice } from "../../utils/formatPrice";
import { useSelector, useDispatch } from "react-redux";
import { getOrder, selectAllOrder } from "../../redux/order/orderSlice";
import { useEffect } from "react";
import { action_status } from "../../utils/constants/status";
import { format } from "date-fns";
import LoadingPage from "../../components/loading/LoadingPage";
import { useState } from "react";
import Pagination from "react-js-pagination";

const UserOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.order);
  const { current } = useSelector((state) => state.user);
  const order = useSelector(selectAllOrder);
  console.log(order);

  const [state, setState] = useState("All");
  const filterProcessed = order.filter((item) => item.status === "Processed");
  const filterCancelled = order.filter((item) => item.status === "Cancelled");
  const filterSuccess = order.filter((item) => item.status === "Success");

  useEffect(() => {
    try {
      if (status === action_status.IDLE) {
        dispatch(getOrder(current._id));
      }
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const handleClick = (e) => {
    console.log(e.target.value);
    setState(e.target.value);
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <DashboardHeading
          title="Quản lý đơn hàng"
          className="px-5 py-5"
        ></DashboardHeading>
        <div className="flex items-center gap-x-3">
          <button
            className={`flex items-center gap-x-3 cursor-pointer py-3 px-6 text-base font-medium rounded-lg border border-gray-100 ${
              state === "All" ? "bg-blue-500 text-white" : ""
            }`}
            value="All"
            onClick={handleClick}
          >
            Tất cả đơn hàng
          </button>
          <button
            className={`flex items-center gap-x-3 cursor-pointer py-3 px-6 text-base font-medium rounded-lg border border-gray-100 ${
              state === "Processed" ? "bg-blue-500 text-white" : ""
            }`}
            value="Processed"
            onClick={handleClick}
          >
            Đang xử lý
          </button>
          <button
            className={`flex items-center gap-x-3 cursor-pointer py-3 px-6 text-base font-medium rounded-lg ${
              state === "Success" ? "bg-blue-500 text-white" : ""
            }`}
            value="Success"
            onClick={handleClick}
          >
            Đã duyệt
          </button>
          <button
            className={`flex items-center gap-x-3 cursor-pointer py-3 px-6 text-base font-medium rounded-lg border border-gray-100 ${
              state === "Cancelled" ? "bg-blue-500 text-white" : ""
            }`}
            value="Cancelled"
            onClick={handleClick}
          >
            Đã hủy đơn
          </button>
        </div>
      </div>

      {status === action_status.LOADING && <LoadingPage />}
      {status === action_status.SUCCEEDED && (
        <Table>
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Ngày mua</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {state === "All" && (
              <>
                {order?.length > 0 &&
                  order.map((item) => (
                    <tr className="text-lg" key={item._id}>
                      <td
                        className="cursor-pointer text-blue-600 hover:text-blue-900"
                        onClick={() => navigate(`/account/orders/${item._id}`)}
                        title={item._id}
                      >
                        {item._id.slice(0, 10)}
                      </td>
                      <td>
                        {format(new Date(item?.createdAt), "HH:mm")}
                        &nbsp;&nbsp;
                        {format(new Date(item?.createdAt), "dd/MM/yyyy")}
                      </td>
                      <td>{item.cart[0].product.title.slice(0, 50)}</td>
                      <td>{formatPrice(item.totalPrice)}</td>
                      {item?.status === "Processed" && (
                        <td>
                          <span className="p-2 rounded-lg text-white bg-orange-400">
                            Đang xử lý
                          </span>
                        </td>
                      )}
                      {item?.status === "Cancelled" && (
                        <td>
                          <span className="p-2 rounded-lg text-white bg-red-400">
                            Đã hủy đơn
                          </span>
                        </td>
                      )}
                      {item?.status === "Success" && (
                        <td>
                          <span className="p-2 rounded-lg text-white inline-block w-[105px] bg-green-400">
                            Đã duyệt
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
              </>
            )}
            {state === "Processed" && (
              <>
                {filterProcessed?.length > 0 &&
                  filterProcessed.map((item) => (
                    <tr className="text-lg" key={item._id}>
                      <td
                        className="cursor-pointer text-blue-600 hover:text-blue-900"
                        onClick={() => navigate(`/account/orders/${item._id}`)}
                        title={item._id}
                      >
                        {item._id.slice(0, 10)}
                      </td>
                      <td>
                        {format(new Date(item?.createdAt), "HH:mm")}
                        &nbsp;&nbsp;
                        {format(new Date(item?.createdAt), "dd/MM/yyyy")}
                      </td>
                      <td>{item.cart[0].product.title.slice(0, 50)}</td>
                      <td>{formatPrice(item.totalPrice)}</td>
                      <td>
                        <span className="p-2 rounded-lg text-white bg-orange-400">
                          Đang xử lý
                        </span>
                      </td>
                    </tr>
                  ))}
              </>
            )}
            {state === "Cancelled" && (
              <>
                {filterCancelled?.length > 0 &&
                  filterCancelled.map((item) => (
                    <tr className="text-lg" key={item._id}>
                      <td
                        className="cursor-pointer text-blue-600 hover:text-blue-900"
                        onClick={() => navigate(`/account/orders/${item._id}`)}
                        title={item._id}
                      >
                        {item._id.slice(0, 10)}
                      </td>
                      <td>
                        {format(new Date(item?.createdAt), "HH:mm")}
                        &nbsp;&nbsp;
                        {format(new Date(item?.createdAt), "dd/MM/yyyy")}
                      </td>
                      <td>{item.cart[0].product.title.slice(0, 50)}</td>
                      <td>{formatPrice(item.totalPrice)}</td>

                      <td>
                        <span className="p-2 rounded-lg text-white bg-red-400">
                          Đã hủy đơn
                        </span>
                      </td>
                    </tr>
                  ))}
              </>
            )}
            {state === "Success" && (
              <>
                {filterSuccess?.length > 0 &&
                  filterSuccess.map((item) => (
                    <tr className="text-lg" key={item._id}>
                      <td
                        className="cursor-pointer text-blue-600 hover:text-blue-900"
                        onClick={() => navigate(`/account/orders/${item._id}`)}
                        title={item._id}
                      >
                        {item._id.slice(0, 10)}
                      </td>
                      <td>
                        {format(new Date(item?.createdAt), "HH:mm")}
                        &nbsp;&nbsp;
                        {format(new Date(item?.createdAt), "dd/MM/yyyy")}
                      </td>
                      <td>{item.cart[0].product.title.slice(0, 50)}</td>
                      <td>{formatPrice(item.totalPrice)}</td>

                      <td>
                        <span className="p-2 rounded-lg text-white inline-block w-[105px] bg-green-400">
                          Đã duyệt
                        </span>
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserOrder;

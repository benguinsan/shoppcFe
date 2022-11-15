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

const UserOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.order);
  const { current } = useSelector((state) => state.user);
  const order = useSelector(selectAllOrder);
  console.log(order);

  useEffect(() => {
    try {
      if (status === action_status.IDLE) {
        dispatch(getOrder(current._id));
      }
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  return (
    <div>
      <DashboardHeading
        title="Quản lý đơn hàng"
        className="px-5 py-5"
      ></DashboardHeading>
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
            {order?.length > 0 &&
              order.map((item) => (
                <tr className="text-lg" key={item._id}>
                  <td
                    className="cursor-pointer text-blue-600 hover:text-blue-900"
                    onClick={() => navigate(`/account/orders/${item._id}`)}
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
                  <td className="text-orange-500">{item?.status}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserOrder;

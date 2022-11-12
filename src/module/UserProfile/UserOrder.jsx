import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/table/Table";
import DashboardHeading from "../dashboard/DashboardHeding";
import { formatPrice } from "../../utils/formatPrice";

const UserOrder = () => {
  const navigate = useNavigate();
  return (
    <div>
      <DashboardHeading
        title="Quản lý đơn hàng"
        className="px-5 py-5"
      ></DashboardHeading>
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
          <tr className="text-lg">
            <td
              className="cursor-pointer text-blue-600 hover:text-blue-900"
              onClick={() => navigate("/account/orders/22111035598700")}
            >
              22111035598700
            </td>
            <td>22:36, Thứ Năm 10/11/2022</td>
            <td>Máy tính xách tay/ Laptop HP 15s-fq2663TU</td>
            <td>{formatPrice(18658000)}</td>
            <td className="text-orange-500">Đang xử lý</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default UserOrder;

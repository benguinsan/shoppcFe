import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Space, Card } from "antd";
import AdminTable from "../../../components/admin/ui/table";

const Orders = () => {
  const [sortedInfo, setSortedInfo] = useState({});
  const columns = [
    {
      title: "Mã Hoá Đơn",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Mã Người Dùng",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Mã Nhân Viên",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Ngày Lập",
      dataIndex: "creationDate",
      key: "creationDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space>
          <Button
            onClick={() => handleStatusChange(record.orderId)}
            type={status ? "default" : "primary"}
            danger={status}
          >
            {status ? "Hủy" : "Xác nhận"}
          </Button>
        </Space>
      ),
    },
  ];

  const handleStatusChange = (orderId) => {
    // Logic to change order status
    console.log(`Changed status of order: ${orderId}`);
  };

  const clearAll = () => {
    setSortedInfo({});
  };

  return (
    <div className="p-4">
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearAll}>Clear</Button>
      </Space>
      <AdminTable
        columns={columns}
        dataSource={[]}
        rowKey="orderId"
        handleChange={() => {}}
        pageNo={0}
        pageSize={10}
        totalElements={0}
      />
    </div>
  );
};

export default Orders;

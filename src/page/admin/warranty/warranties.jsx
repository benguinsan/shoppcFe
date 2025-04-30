import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Space, Card } from "antd";
import AdminTable from "../../../components/admin/ui/table";

const Warranties = () => {
  const [sortedInfo, setSortedInfo] = useState({});
  const columns = [
    {
      title: "Mã Bảo Hành",
      dataIndex: "warrantyId",
      key: "warrantyId",
    },
    {
      title: "Mã Hoá Đơn",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Mã Seri",
      dataIndex: "serialId",
      key: "serialId",
    },
    {
      title: "Ngày Mua",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hạn Bảo Hành",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
  ];

  const handleStatusChange = (warrantyId) => {
    // Logic to change warranty status
    console.log(`Changed status of warranty: ${warrantyId}`);
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
        rowKey="warrantyId"
        handleChange={() => {}}
        pageNo={0}
        pageSize={10}
        totalElements={0}
      />
    </div>
  );
};

export default Warranties;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Space, Card } from "antd";
import AdminTable from "../../../components/admin/ui/table";
import { EyeOutlined } from "@ant-design/icons";

const Orders = () => {
  const [sortedInfo, setSortedInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Mock data cho chi tiết hoá đơn
  const mockOrderDetails = [
    {
      orderDetailId: "OD001",
      orderId: "ORD001",
      productId: "P001",
      serialId: "SER123456",
      unitPrice: 21000000,
    },
    {
      orderDetailId: "OD002",
      orderId: "ORD001",
      productId: "P002",
      serialId: "SER789012",
      unitPrice: 450000,
    },
  ];

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
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showOrderDetails(record.orderId)}
          className="detail-button"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const detailColumns = [
    {
      title: "Mã chi tiết hoá đơn",
      dataIndex: "orderDetailId",
      key: "orderDetailId",
    },
    {
      title: "Mã hoá đơn",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Mã seri",
      dataIndex: "serialId",
      key: "serialId",
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => `${price.toLocaleString()} VND`,
    },
  ];

  const handleStatusChange = (orderId) => {
    // Logic to change order status
    console.log(`Changed status of order: ${orderId}`);
  };

  const showOrderDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
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
        dataSource={[
          {
            orderId: "ORD001",
            userId: "USR123",
            employeeId: "EMP456",
            creationDate: "2025-04-25T10:30:00",
            totalAmount: 21450000,
            status: true,
          },
        ]}
        rowKey="orderId"
        handleChange={() => {}}
        pageNo={0}
        pageSize={10}
        totalElements={1}
      />

      <Modal
        title={`Chi tiết hoá đơn - Mã hoá đơn: ${selectedOrderId}`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        width={1000}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
      >
        <Table
          dataSource={mockOrderDetails.filter(
            (item) => item.orderId === selectedOrderId
          )}
          columns={detailColumns}
          rowKey="orderDetailId"
          pagination={false}
        />
      </Modal>
      <style jsx global>{`
        .detail-button {
          background-color: #1890ff !important;
          border-color: #1890ff !important;
          color: white !important;
        }

        .detail-button:hover {
          background-color: #096dd9 !important;
          border-color: #096dd9 !important;
        }
      `}</style>
    </div>
  );
};

export default Orders;

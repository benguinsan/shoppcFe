import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Space, Card } from "antd";
import AdminTable from "../../../components/admin/ui/table";
import { EyeOutlined } from "@ant-design/icons";

const Warranties = () => {
  const [sortedInfo, setSortedInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWarrantyId, setSelectedWarrantyId] = useState(null);

  // Mock data cho chi tiết bảo hành
  const mockWarrantyDetails = [
    {
      warrantyDetailId: "WD001",
      warrantyId: "WAR001",
      warrantyDate: "2025-06-15T10:30:00",
      completionDate: "2025-06-18T14:20:00",
      status: "Đã hoàn thành",
      details: "Thay thế màn hình bị lỗi",
    },
    {
      warrantyDetailId: "WD002",
      warrantyId: "WAR001",
      warrantyDate: "2025-07-22T09:15:00",
      completionDate: "2025-07-25T16:30:00",
      status: "Đã hoàn thành",
      details: "Sửa bản lề màn hình",
    },
  ];

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
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showWarrantyDetails(record.warrantyId)}
          className="detail-button"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const detailColumns = [
    {
      title: "Mã chi tiết bảo hành",
      dataIndex: "warrantyDetailId",
      key: "warrantyDetailId",
    },
    {
      title: "Mã Bảo Hành",
      dataIndex: "warrantyId",
      key: "warrantyId",
    },
    {
      title: "Ngày Bảo Hành",
      dataIndex: "warrantyDate",
      key: "warrantyDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày Hoàn Thành",
      dataIndex: "completionDate",
      key: "completionDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tình Trạng",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Chi Tiết",
      dataIndex: "details",
      key: "details",
    },
  ];

  const handleStatusChange = (warrantyId) => {
    // Logic to change warranty status
    console.log(`Changed status of warranty: ${warrantyId}`);
  };

  const showWarrantyDetails = (warrantyId) => {
    setSelectedWarrantyId(warrantyId);
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
        <Button onClick={clearAll} className="clear-button" danger>
          Clear
        </Button>
      </Space>
      <AdminTable
        columns={columns}
        dataSource={[
          {
            warrantyId: "WAR001",
            orderId: "ORD001",
            serialId: "SER123456",
            purchaseDate: "2025-03-15T09:30:00",
            expiryDate: "2026-03-15T09:30:00",
            description: "Bảo hành tiêu chuẩn 12 tháng",
          },
        ]}
        rowKey="warrantyId"
        handleChange={() => {}}
        pageNo={0}
        pageSize={10}
        totalElements={1}
      />
      <Modal
        title={`Chi tiết bảo hành - Mã bảo hành: ${selectedWarrantyId}`}
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
          dataSource={mockWarrantyDetails.filter(
            (item) => item.warrantyId === selectedWarrantyId
          )}
          columns={detailColumns}
          rowKey="warrantyDetailId"
          pagination={false}
        />
      </Modal>
      <div className="p-4">
        {/* Code hiện tại */}

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
          .clear-button {
            background-color: #ff4d4f !important;
            border-color: #ff4d4f !important;
            color: white !important;
          }

          .clear-button:hover {
            background-color: #d9363e !important;
            border-color: #d9363e !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Warranties;

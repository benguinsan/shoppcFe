import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Space, Card, Dropdown, message } from "antd";
import AdminTable from "../../../components/admin/ui/table";
import { EyeOutlined, DownOutlined } from "@ant-design/icons";

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
      render: (status, record) => {
        // Hàm xử lý khi chọn trạng thái
        const handleMenuClick = ({ key }) => {
          handleStatusChange(record.orderId, key);
        };

        // Các trạng thái có thể chọn
        const items = [
          {
            key: "paid",
            label: "Đã thanh toán",
          },
          {
            key: "unpaid",
            label: "Chưa thanh toán",
          },
          {
            key: "cancelled",
            label: "Đã huỷ",
          },
        ];

        // Xác định text hiển thị dựa vào giá trị status hiện tại
        let statusText = "Chưa thanh toán";
        let statusColor = "#faad14"; // Màu vàng cho trạng thái chưa thanh toán

        if (status === "paid") {
          statusText = "Đã thanh toán";
          statusColor = "#52c41a"; // Màu xanh cho đã thanh toán
        } else if (status === "cancelled") {
          statusText = "Đã huỷ";
          statusColor = "#ff4d4f"; // Màu đỏ cho đã hủy
        }

        return (
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
          >
            <Button style={{ color: statusColor, borderColor: statusColor }}>
              {statusText} <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
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

  const handleStatusChange = (orderId, newStatus) => {
    // Gọi API cập nhật trạng thái đơn hàng
    console.log(`Đã đổi trạng thái của đơn hàng ${orderId} thành ${newStatus}`);

    // Hiển thị thông báo
    let statusText = "";
    switch (newStatus) {
      case "paid":
        statusText = "đã thanh toán";
        break;
      case "unpaid":
        statusText = "chưa thanh toán";
        break;
      case "cancelled":
        statusText = "đã huỷ";
        break;
      default:
        statusText = newStatus;
    }

    message.success(
      `Đã cập nhật trạng thái đơn hàng #${orderId} thành ${statusText}`
    );
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
        <Button onClick={clearAll} className="clear-button" danger>
          Clear
        </Button>
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
            status: "unpaid", // có thể là 'paid', 'unpaid', hoặc 'cancelled'
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
  );
};

export default Orders;

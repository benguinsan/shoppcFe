import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Space, Card, message, Pagination, Input } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import AdminTable from "../../../components/admin/ui/table";
import axiosClient from "../../../api/axiosClient";

const Warranties = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWarrantyId, setSelectedWarrantyId] = useState(null);
  const [warrantyDetails, setWarrantyDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");

  // Hàm tải danh sách bảo hành
  const fetchWarranties = async (page = 1, search = "") => {
    try {
      setLoading(true);
      let url = `/api/baohanh?page=${page}&limit=${pageSize}`;
      
      if (search) {
        url += `&search=${search}`;
      }
      
      const response = await axiosClient.get(url);
      
      if (response && response.data) {
        setWarranties(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.last_page);
          setTotalItems(response.pagination.total);
          setCurrentPage(response.pagination.current_page);
        }
      } else {
        message.error("Không thể tải danh sách bảo hành");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách bảo hành:", error);
      message.error("Lỗi khi tải danh sách bảo hành: " + (error.message || "Lỗi không xác định"));
    } finally {
      setLoading(false);
    }
  };

  // Hàm tải chi tiết bảo hành
  const fetchWarrantyDetails = async (warrantyId) => {
    try {
      // API cho chi tiết bảo hành - thay thế khi có API thực tế
      const response = await axiosClient.get(`/api/baohanh/${warrantyId}`);
      
      if (response && response.data) {
        setWarrantyDetails([response.data]);
      } else {
        setWarrantyDetails([]);
        message.error("Không thể tải chi tiết bảo hành");
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết bảo hành:", error);
      setWarrantyDetails([]);
      message.error("Lỗi khi tải chi tiết bảo hành: " + (error.message || "Lỗi không xác định"));
    }
  };

  // Load danh sách bảo hành khi component mount hoặc khi trang thay đổi
  useEffect(() => {
    fetchWarranties(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    fetchWarranties(1, searchQuery);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowDetails = (warrantyId) => {
    setSelectedWarrantyId(warrantyId);
    setIsModalVisible(true);
    fetchWarrantyDetails(warrantyId);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Xác định trạng thái CSS dựa trên TrangThai
  const getStatusStyle = (status) => {
    switch (status) {
      case 1:
        return { color: '#faad14', backgroundColor: '#fffbe6' }; // Chờ xử lý
      case 2:
        return { color: '#52c41a', backgroundColor: '#f6ffed' }; // Đang xử lý
      case 3:
        return { color: '#1890ff', backgroundColor: '#e6f7ff' }; // Hoàn thành
      case 4:
        return { color: '#f5222d', backgroundColor: '#fff1f0' }; // Hủy
      default:
        return { color: '#000000', backgroundColor: '#f0f0f0' }; // Mặc định
    }
  };

  const columns = [
    {
      title: "Mã Bảo Hành",
      dataIndex: "MaBH",
      key: "MaBH",
      width: 120,
    },
    {
      title: "Mã Hoá Đơn",
      dataIndex: "MaHD",
      key: "MaHD",
      width: 120,
    },
    {
      title: "Mã Seri",
      dataIndex: "MaSeri",
      key: "MaSeri",
      width: 120,
    },
    {
      title: "Nhân viên xử lý",
      dataIndex: "TenNhanVien",
      key: "TenNhanVien",
      width: 150,
    },
    {
      title: "Ngày Gửi Bảo Hành",
      dataIndex: "NgayGuiBaoHanh",
      key: "NgayGuiBaoHanh",
      width: 150,
      render: (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"),
    },
    {
      title: "Ngày Trả Bảo Hành",
      dataIndex: "NgayTraBaoHanh",
      key: "NgayTraBaoHanh",
      width: 150,
      render: (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa trả"),
    },
    {
      title: "Mô Tả",
      dataIndex: "MoTa",
      key: "MoTa",
      ellipsis: true,
    },
    {
      title: "Trạng Thái",
      dataIndex: "TrangThaiText",
      key: "TrangThaiText",
      width: 120,
      render: (text, record) => (
        <div 
          style={{
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '4px',
            ...getStatusStyle(record.TrangThai)
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleShowDetails(record.MaBH)}
          className="detail-button"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const detailColumns = [
    {
      title: "Mã Bảo Hành",
      dataIndex: "MaBH",
      key: "MaBH",
    },
    {
      title: "Mã Hoá Đơn",
      dataIndex: "MaHD",
      key: "MaHD",
    },
    {
      title: "Mã Seri",
      dataIndex: "MaSeri",
      key: "MaSeri",
    },
    {
      title: "Ngày Gửi Bảo Hành",
      dataIndex: "NgayGuiBaoHanh",
      key: "NgayGuiBaoHanh",
      render: (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"),
    },
    {
      title: "Ngày Trả Bảo Hành",
      dataIndex: "NgayTraBaoHanh",
      key: "NgayTraBaoHanh",
      render: (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa trả"),
    },
    {
      title: "Mô Tả",
      dataIndex: "MoTa",
      key: "MoTa",
    },
    {
      title: "Trạng Thái",
      dataIndex: "TrangThaiText",
      key: "TrangThaiText",
      render: (text, record) => (
        <div 
          style={{
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '4px',
            ...getStatusStyle(record.TrangThai)
          }}
        >
          {text}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Danh sách bảo hành</h2>
        <Space>
          <Input 
            placeholder="Tìm kiếm bảo hành..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 250 }}
            onPressEnter={handleSearch}
          />
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={warranties}
          rowKey="MaBH"
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
        />
        
        <div className="flex justify-end mt-4">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={handlePageChange}
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
            showSizeChanger={false}
          />
        </div>
      </Card>

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
          dataSource={warrantyDetails}
          columns={detailColumns}
          rowKey="MaBH"
          pagination={false}
        />
      </Modal>

      <style jsx="true" global="true">{`
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

export default Warranties;

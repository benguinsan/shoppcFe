import { EyeOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Pagination, Space, Table, message as antdMessage } from "antd";
import React, { useEffect, useState } from "react";
import importApi from "../../../api/importApi";
import AdminTable from "../../../components/admin/ui/table";

const Imports = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImportId, setSelectedImportId] = useState(null);
  const [imports, setImports] = useState([]);
  const [importDetails, setImportDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchImports = async () => {
      try {
        const response = await importApi.getImports(currentPage, search);
        if (response && response.data && response.pagination) {
          setImports(response.data);
          setTotalPages(response.pagination.last_page);
        } else {
          setImports([]);
          setTotalPages(0);
          antdMessage.error("Không có dữ liệu phiếu nhập hoặc lỗi dữ liệu trả về từ server.");
        }
      } catch (error) {
        setImports([]);
        setTotalPages(0);
        antdMessage.error(error.message || "Có lỗi xảy ra khi tải danh sách phiếu nhập");
      }
    };
    fetchImports();
  }, [currentPage, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const showImportDetails = async (importId) => {
    try {
      setSelectedImportId(importId);
      setIsModalVisible(true);
      const response = await importApi.getImportDetails(importId);
      setImportDetails(response.data.chiTiet);
    } catch (error) {
      antdMessage.error(error.message || "Có lỗi xảy ra khi tải chi tiết phiếu nhập");
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Mã Phiếu Nhập",
      dataIndex: "MaPN",
      key: "MaPN",
    },
    {
      title: "Nhà Cung Cấp",
      dataIndex: "TenNhaCungCap",
      key: "TenNhaCungCap",
    },
    {
      title: "Ngày Nhập",
      dataIndex: "NgayNhap",
      key: "NgayNhap",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "TongTien",
      key: "TongTien",
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Trạng Thái",
      dataIndex: "TrangThaiText",
      key: "TrangThaiText",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showImportDetails(record.MaPN)}
          className="detail-button"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const detailColumns = [
    {
      title: "Mã chi tiết phiếu nhập",
      dataIndex: "MaCTPN",
      key: "MaCTPN",
    },
    {
      title: "Mã phiếu nhập",
      dataIndex: "MaPN",
      key: "MaPN",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "MaSP",
      key: "MaSP",
    },
    {
      title: "Số lượng",
      dataIndex: "SoLuong",
      key: "SoLuong",
    },
    {
      title: "Đơn giá",
      dataIndex: "DonGia",
      key: "DonGia",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Thành tiền",
      dataIndex: "ThanhTien",
      key: "ThanhTien",
      render: (price) => `${price.toLocaleString()} VND`,
    },
  ];

  return (
    <div className="p-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm phiếu nhập, nhà cung cấp..."
          value={search}
          onChange={handleSearchChange}
          style={{ width: 300 }}
          allowClear
        />
      </Space>
      <div style={{ width: '100%', maxWidth: 1100 }}>
        <AdminTable
          columns={columns}
          dataSource={imports}
          rowKey="MaPN"
          handleChange={() => {}}
          pageNo={currentPage}
          pageSize={10}
          totalElements={imports.length}
        />
        <Pagination
          current={currentPage}
          total={totalPages * 10}
          pageSize={10}
          onChange={setCurrentPage}
          style={{ marginTop: 16, textAlign: 'center' }}
        />
      </div>
      <Modal
        title={`Chi tiết phiếu nhập - Mã phiếu nhập: ${selectedImportId}`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        width={1000}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Table
            dataSource={importDetails}
            columns={detailColumns}
            rowKey="MaCTPN"
            pagination={false}
            style={{ width: '100%', maxWidth: 900 }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Imports; 
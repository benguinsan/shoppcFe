import { EyeOutlined, FileExcelOutlined, FilePdfOutlined, ReloadOutlined } from "@ant-design/icons";
import { message as antdMessage, Button, Card, Col, DatePicker, Input, Modal, Pagination, Row, Space, Statistic, Table } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import React, { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import importApi from "../../../api/importApi";

const { RangePicker } = DatePicker;

const Imports = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImportId, setSelectedImportId] = useState(null);
  const [imports, setImports] = useState([]);
  const [importDetails, setImportDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImports();
    fetchStatistics();
  }, [currentPage, search, dateRange]);

    const fetchImports = async () => {
      try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: search,
        from_date: dateRange?.[0]?.format('YYYY-MM-DD'),
        to_date: dateRange?.[1]?.format('YYYY-MM-DD')
      };
      const response = await importApi.getImports(params);
        if (response && response.status === 'success' && response.data) {
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
    } finally {
      setLoading(false);
      }
    };

  const fetchStatistics = async () => {
    try {
      const params = {
        from_date: dateRange?.[0]?.format('YYYY-MM-DD'),
        to_date: dateRange?.[1]?.format('YYYY-MM-DD')
      };
      const response = await importApi.getStatistics(params);
      if (response && response.status === 'success') {
        setStatistics(response.data);
      }
    } catch (error) {
      // antdMessage.error(error.message || "Có lỗi xảy ra khi tải thống kê");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setCurrentPage(1);
  };

  const showImportDetails = async (importId) => {
    try {
      setSelectedImportId(importId);
      setIsModalVisible(true);
      const response = await fetch(`http://localhost/shoppc/api/chitietphieunhap/${importId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result && result.status === 'success') {
        setImportDetails(result.data);
      } else {
        setImportDetails([]);
        antdMessage.error(result.message || "Không có dữ liệu chi tiết phiếu nhập");
      }
    } catch (error) {
      setImportDetails([]);
      antdMessage.error(error.message || "Có lỗi xảy ra khi tải chi tiết phiếu nhập");
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const exportToExcel = () => {
    const data = imports.map(item => ({
      'Mã Phiếu Nhập': item.MaPN,
      'Nhà Cung Cấp': item.TenNhaCungCap,
      'Ngày Nhập': moment(item.NgayNhap).format('DD/MM/YYYY'),
      'Tổng Tiền': item.TongTien.toLocaleString() + ' VND',
      'Trạng Thái': item.TrangThaiText
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Phiếu Nhập");
    XLSX.writeFile(wb, "phieu_nhap.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Danh Sách Phiếu Nhập', 14, 15);
    
    // Add date range if selected
    if (dateRange) {
      doc.setFontSize(10);
      doc.text(`Từ ${dateRange[0].format('DD/MM/YYYY')} đến ${dateRange[1].format('DD/MM/YYYY')}`, 14, 22);
    }

    // Add table
    autoTable(doc, {
      startY: 30,
      head: [['Mã PN', 'Nhà Cung Cấp', 'Ngày Nhập', 'Tổng Tiền', 'Trạng Thái']],
      body: imports.map(item => [
        item.MaPN,
        item.TenNhaCungCap,
        moment(item.NgayNhap).format('DD/MM/YYYY'),
        item.TongTien.toLocaleString() + ' VND',
        item.TrangThaiText
      ])
    });

    doc.save('phieu_nhap.pdf');
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
      render: (date) => moment(date).format('DD/MM/YYYY'),
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
      dataIndex: "MaPhieuNhap",
      key: "MaPhieuNhap",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "MaSP",
      key: "MaSP",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "TenSP",
      key: "TenSP",
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
      render: (price) => `${Number(price).toLocaleString()} VND`,
    },
    {
      title: "Thành tiền",
      dataIndex: "ThanhTien",
      key: "ThanhTien",
      render: (price) => `${Number(price).toLocaleString()} VND`,
    },
    {
      title: "Ngày nhập",
      dataIndex: "NgayNhap",
      key: "NgayNhap",
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
  ];

  return (
    <div className="p-4">
      {statistics && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số phiếu nhập"
                value={statistics.TongSoPhieu}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng tiền nhập"
                value={statistics.TongTienNhap}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                suffix="VND"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Trung bình tiền nhập"
                value={statistics.TrungBinhTienNhap}
                precision={0}
                valueStyle={{ color: '#1890ff' }}
                suffix="VND"
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        <Space style={{ marginBottom: 16 }} size="middle">
          <Input
            placeholder="Tìm kiếm theo mã phiếu nhập hoặc nhà cung cấp"
            value={search}
            onChange={handleSearchChange}
            style={{ width: 300 }}
          />
          <RangePicker onChange={handleDateRangeChange} />
          <Button icon={<ReloadOutlined />} onClick={() => {
            setSearch("");
            setDateRange(null);
            setCurrentPage(1);
          }}>
            Đặt lại
          </Button>
          <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>
            Xuất Excel
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={exportToPDF}>
            Xuất PDF
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={imports}
          loading={loading}
          rowKey="MaPN"
          pagination={false}
        />

        {totalPages > 0 && (
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Pagination
              current={currentPage}
              total={totalPages * 10}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        )}
      </Card>

      <Modal
        title={`Chi tiết phiếu nhập #${selectedImportId}`}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        width={1000}
        footer={null}
      >
        <Table
          columns={detailColumns}
          dataSource={importDetails}
          rowKey="MaCTPN"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default Imports; 
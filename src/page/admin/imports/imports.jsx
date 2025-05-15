import { EditOutlined, EyeOutlined, FileExcelOutlined, FilePdfOutlined, ReloadOutlined } from "@ant-design/icons";
import { message as antdMessage, Button, Card, DatePicker, Form, Input, Modal, Pagination, Select, Space, Table } from "antd";
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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedImport, setSelectedImport] = useState(null);
  const [form] = Form.useForm();
  const [isDetailEditModalVisible, setIsDetailEditModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailForm] = Form.useForm();
  const [selectedImportDetails, setSelectedImportDetails] = useState(null);

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
      const result = await importApi.getImportDetails(importId);
      
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
      'Mã NCC': item.MaNCC,
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
      head: [['Mã PN', 'Mã NCC', 'Nhà Cung Cấp', 'Ngày Nhập', 'Tổng Tiền', 'Trạng Thái']],
      body: imports.map(item => [
        item.MaPN,
        item.MaNCC,
        item.TenNhaCungCap,
        moment(item.NgayNhap).format('DD/MM/YYYY'),
        item.TongTien.toLocaleString() + ' VND',
        item.TrangThaiText
      ])
    });

    doc.save('phieu_nhap.pdf');
  };

  const showEditModal = (record) => {
    setSelectedImport(record);
    form.setFieldsValue({
      MaNCC: record.MaNCC,
      NgayNhap: moment(record.NgayNhap),
      TongTien: record.TongTien,
      TrangThai: record.TrangThai,
      MaNhanVien: record.MaNhanVien
    });
    setIsEditModalVisible(true);
  };

  const handleEditImport = async (values) => {
    try {
      // Hiển thị thông báo xác nhận trước khi cập nhật
      Modal.confirm({
        title: "Xác nhận cập nhật phiếu nhập",
        content: (
          <div>
            <p>Bạn có chắc muốn cập nhật thông tin phiếu nhập này?</p>
            <p>Mã phiếu nhập: <strong>{selectedImport.MaPN}</strong></p>
            <p>Tổng tiền: <strong>{values.TongTien.toLocaleString()} VND</strong></p>
          </div>
        ),
        okText: "Cập nhật",
        cancelText: "Hủy",
        okButtonProps: {
          style: { backgroundColor: '#1890ff', borderColor: '#1890ff' }
        },
        onOk: async () => {
          const response = await importApi.updateImport(selectedImport.MaPN, {
            MaNCC: values.MaNCC,
            MaNhanVien: values.MaNhanVien,
            NgayNhap: values.NgayNhap.format('YYYY-MM-DD HH:mm:ss'),
            TongTien: values.TongTien || 0,
            TrangThai: values.TrangThai
          });
          
          if (response && response.status === 'success') {
            // Nếu trạng thái là "Đã xác nhận" (giá trị 2), tạo seri cho tất cả sản phẩm trong phiếu nhập
            if (parseInt(values.TrangThai) === 2) {
              try {
                // Lấy chi tiết phiếu nhập để biết số lượng từng sản phẩm
                const importDetailsResponse = await importApi.getImportDetails(selectedImport.MaPN);
                if (importDetailsResponse && importDetailsResponse.status === 'success') {
                  const details = importDetailsResponse.data;
                  console.log("Chi tiết phiếu nhập:", details);
                  
                  if (details && details.length > 0) {
                    let totalSerialCreated = 0;
                    let hasError = false;
                    
                    // Tạo seri cho từng sản phẩm trong phiếu nhập
                    for (const detail of details) {
                      console.log(`Tạo seri cho sản phẩm ${detail.MaSP}, số lượng: ${detail.SoLuong}`);
                      for (let i = 0; i < detail.SoLuong; i++) {
                        try {
                          const seriResponse = await importApi.createSeri({
                            MaSP: detail.MaSP,
                            MaPhieuNhap: selectedImport.MaPN
                          });
                          
                          console.log("Response đầy đủ từ API tạo seri:", JSON.stringify(seriResponse));
                          
                          if (seriResponse && seriResponse.status === 'success') {
                            totalSerialCreated++;
                          } else {
                            console.error("Lỗi tạo seri:", seriResponse);
                            hasError = true;
                          }
                        } catch (seriError) {
                          console.error(`Lỗi tạo seri cho sản phẩm ${detail.MaSP}:`, seriError);
                          hasError = true;
                        }
                      }
                    }
                    
                    if (hasError) {
                      antdMessage.warning(`Đã tạo ${totalSerialCreated} seri, nhưng có một số lỗi xảy ra. Vui lòng kiểm tra lại.`);
                    } else {
                      antdMessage.success(`Đã tạo thành công ${totalSerialCreated} seri cho tất cả sản phẩm trong phiếu nhập`);
                    }
                  } else {
                    antdMessage.warning("Không có chi tiết sản phẩm nào trong phiếu nhập để tạo seri");
                  }
                } else {
                  antdMessage.error("Không thể lấy chi tiết phiếu nhập");
                }
              } catch (error) {
                console.error("Lỗi khi tạo seri:", error);
                antdMessage.error(error.message || "Có lỗi xảy ra khi tạo seri cho sản phẩm");
              }
            } else {
              console.log("Không tạo seri vì trạng thái không phải Đã xác nhận:", values.TrangThai);
            }
            
            const updatedResponse = await importApi.getImports({ page: currentPage });
            setImports(updatedResponse.data);
            setIsEditModalVisible(false);
            antdMessage.success(response.data.message || "Cập nhật phiếu nhập thành công");
          } else {
            antdMessage.error(response.data?.message || "Cập nhật phiếu nhập thất bại");
          }
        }
      });
    } catch (error) {
      antdMessage.error(error.message || "Có lỗi xảy ra khi cập nhật phiếu nhập");
    }
  };

  const handleEditDetail = (record) => {
    setSelectedDetail(record);
    detailForm.setFieldsValue({
      MaSP: record.MaSP,
      SoLuong: record.SoLuong,
      DonGia: record.DonGia,
      MaPhieuNhap: record.MaPhieuNhap
    });
    setIsDetailEditModalVisible(true);
  };

  const handleDetailUpdate = async (values) => {
    try {
      // Gọi API để cập nhật chi tiết phiếu nhập
      const response = await importApi.updateImportDetail(selectedDetail.MaCTPN, {
        MaSP: values.MaSP,
        MaPhieuNhap: selectedDetail.MaPhieuNhap,
        SoLuong: values.SoLuong,
        DonGia: values.DonGia
      });
      
      if (response && response.status === 'success') {
        // Refresh lại danh sách chi tiết
        const refreshedDetails = await importApi.getImportDetails(selectedImportId);
        if (refreshedDetails && refreshedDetails.status === 'success') {
          setImportDetails(refreshedDetails.data);
        }
        setIsDetailEditModalVisible(false);
        antdMessage.success("Cập nhật chi tiết phiếu nhập thành công");
      } else {
        antdMessage.error(response.data?.message || "Cập nhật chi tiết phiếu nhập thất bại");
      }
    } catch (error) {
      antdMessage.error(error.message || "Có lỗi xảy ra khi cập nhật chi tiết phiếu nhập");
    }
  };

  const handleCreateSeri = async (record) => {
    if (!record) {
      antdMessage.warning("Vui lòng chọn một sản phẩm để tạo seri");
      return;
    }
    
    try {
      Modal.confirm({
        title: "Xác nhận tạo seri",
        content: (
          <div>
            <p>Bạn có chắc muốn tạo seri cho sản phẩm này?</p>
            <p>Sản phẩm: <strong>{record.TenSP}</strong></p>
            <p>Mã sản phẩm: <strong>{record.MaSP}</strong></p>
            <p>Số lượng seri sẽ tạo: <strong>{record.SoLuong}</strong></p>
          </div>
        ),
        okText: "Tạo seri",
        cancelText: "Hủy",
        okButtonProps: {
          style: { backgroundColor: '#1890ff', borderColor: '#1890ff' }
        },
        onOk: async () => {
          // Tạo số lượng seri tương ứng với số lượng sản phẩm
          console.log(`Bắt đầu tạo ${record.SoLuong} seri cho sản phẩm ${record.MaSP}`);
          
          let successCount = 0;
          let hasError = false;
          
          for (let i = 0; i < record.SoLuong; i++) {
            try {
              const response = await importApi.createSeri({
                MaSP: record.MaSP,
                MaPhieuNhap: record.MaPhieuNhap
              });
              
              console.log("Response đầy đủ từ API tạo seri:", JSON.stringify(response));
              
              if (response && response.status === 'success') {
                successCount++;
                console.log(`Tạo seri thành công ${successCount}/${record.SoLuong}`);
              } else {
                console.error(`Lỗi tạo seri ${i+1}:`, response);
                hasError = true;
              }
            } catch (error) {
              console.error(`Lỗi tạo seri ${i+1}:`, error);
              hasError = true;
            }
          }
          
          if (hasError) {
            if (successCount > 0) {
              antdMessage.warning(`Đã tạo ${successCount}/${record.SoLuong} seri cho sản phẩm ${record.TenSP}. Một số seri không thể tạo được.`);
            } else {
              antdMessage.error(`Không thể tạo seri cho sản phẩm ${record.TenSP}.`);
            }
          } else {
            antdMessage.success(`Đã tạo thành công ${record.SoLuong} seri cho sản phẩm ${record.TenSP}`);
          }
        }
      });
    } catch (error) {
      console.error("Lỗi khi tạo seri:", error);
      antdMessage.error(error.message || "Có lỗi xảy ra khi tạo seri cho sản phẩm");
    }
  };

  const columns = [
    {
      title: "Mã Phiếu Nhập",
      dataIndex: "MaPN",
      key: "MaPN",
    },
    {
      title: "Mã NCC",
      dataIndex: "MaNCC",
      key: "MaNCC",
    },
    {
      title: "Nhà Cung Cấp",
      dataIndex: "TenNhaCungCap",
      key: "TenNhaCungCap",
    },
    {
      title: "Mã Nhân Viên",
      dataIndex: "MaNhanVien",
      key: "MaNhanVien",
    },
    {
      title: "Tên Nhân Viên",
      dataIndex: "TenNhanVien",
      key: "TenNhanVien",
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
      dataIndex: "TrangThai",
      key: "TrangThai",
      render: (status, record) => {
        const stt = Number(status);
        const statusText = {
          1: 'Chờ xác nhận',
          2: 'Đã xác nhận',
          3: 'Đang nhập kho',
          4: 'Đã hủy'
        };
        return (
          <Space>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 16px',
                borderRadius: '16px',
                background: stt === 1 ? '#faad14' : stt === 2 ? '#52c41a' : stt === 3 ? '#ffd666' : stt === 4 ? '#f5222d' : '#d9d9d9',
                color: stt === 1 ? '#fffbe6' : stt === 2 ? '#fff' : stt === 3 ? '#333' : stt === 4 ? '#fff' : '#333',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                cursor: 'default',
                minWidth: 100,
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {statusText[stt] || record.TrangThaiText || 'Không xác định'}
            </div>
          </Space>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showImportDetails(record.MaPN)}
            className="detail-button"
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="edit-button"
          >
            Sửa
          </Button>
        </Space>
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
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditDetail(record)}
            className="edit-button"
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">

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
        open={isModalVisible}
        onCancel={handleCloseModal}
        width={1000}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
          
          // <Button 
          //   key="createSeri" 
          //   type="primary" 
          //   style={{backgroundColor: '#1890ff', borderColor: '#1890ff'}}
          //   onClick={() => handleCreateSeri(selectedImportDetails)}
          //   disabled={!selectedImportDetails}
          // >
          //   Tạo seri
          // </Button>
        ]}
      >
        <Table
          columns={detailColumns}
          dataSource={importDetails}
          rowKey="MaCTPN"
          pagination={false}
          onRow={(record) => ({
            onClick: () => {
              setSelectedImportDetails(record);
            }
          })}
          rowClassName={(record) => record.MaCTPN === selectedImportDetails?.MaCTPN ? 'selected-row' : ''}
        />
      </Modal>

      <Modal
        title={<span>Sửa phiếu nhập <span style={{color:'#1890ff', fontWeight:600, marginLeft:8}}>{selectedImport?.MaPN}</span></span>}
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleEditImport}
          layout="vertical"
        >
          <Form.Item
            name="MaNCC"
            label="Mã nhà cung cấp"
            rules={[{ required: true, message: 'Vui lòng nhập mã nhà cung cấp!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="NgayNhap"
            label="Ngày nhập"
            rules={[{ required: true, message: 'Vui lòng chọn ngày nhập!' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="TongTien"
            label="Tổng tiền"
          >
            <Input disabled suffix="VND" />
          </Form.Item>
          <Form.Item
            name="MaNhanVien"
            label="Mã nhân viên"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select style={{ width: '100%' }}>
              <Select.Option value={1}>Chờ xác nhận</Select.Option>
              <Select.Option value={2}>Đã xác nhận</Select.Option>
              <Select.Option value={3}>Đang nhập kho</Select.Option>
              <Select.Option value={4}>Đã hủy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{background:'#1890ff', borderColor:'#1890ff'}}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<span>Sửa chi tiết phiếu nhập <span style={{color:'#1890ff', fontWeight:600, marginLeft:8}}>{selectedDetail?.MaCTPN}</span></span>}
        open={isDetailEditModalVisible}
        onCancel={() => setIsDetailEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={detailForm}
          onFinish={handleDetailUpdate}
          layout="vertical"
        >
          <Form.Item
            name="MaPhieuNhap"
            label="Mã Phiếu Nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="MaSP"
            label="Mã sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="SoLuong"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="DonGia"
            label="Đơn giá"
            rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
          >
            <Input type="number" min={0} suffix="VND" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{background:'#1890ff', borderColor:'#1890ff'}}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
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
        .edit-button {
          background-color: #52c41a !important;
          border-color: #52c41a !important;
          color: white !important;
        }
        .edit-button:hover {
          background-color: #389e0d !important;
          border-color: #389e0d !important;
        }
        .ant-table-thead > tr > th,
        .ant-table-tbody > tr > td {
          text-align: center !important;
        }
        .selected-row {
          background-color: #e6f7ff !important;
        }
      `}</style>
    </div>
  );
};

export default Imports; 
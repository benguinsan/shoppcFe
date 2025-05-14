import React, { useEffect, useState } from "react";
import { 
  Table, 
  Button, 
  Modal, 
  Space, 
  Card, 
  message, 
  Pagination, 
  Input, 
  Form,
  Select,
  DatePicker,
  Spin,
  Typography
} from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import moment from 'moment';
import AdminTable from "../../../components/admin/ui/table";
import warrantyApi from "../../../api/warrantyApi";

const { TextArea } = Input;
const { Title } = Typography;

const Warranties = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [savingWarranty, setSavingWarranty] = useState(false);
  const [form] = Form.useForm();
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState("");

  // Hàm tải danh sách bảo hành
  const fetchWarranties = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await warrantyApi.getWarranties(page, pageSize, search);
      
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

  // Hàm cập nhật trạng thái bảo hành
  const updateWarrantyStatus = async (values) => {
    if (!selectedWarranty || !selectedWarranty.MaBH) return;
    
    try {
      setSavingWarranty(true);
      
      const formattedData = {
        TrangThai: values.TrangThai,
        MoTa: values.MoTa,
        NgayTraBaoHanh: values.NgayTraBaoHanh ? values.NgayTraBaoHanh.format('YYYY-MM-DD') : null
      };
      
      const response = await warrantyApi.updateWarrantyStatus(selectedWarranty.MaBH, formattedData);
      
      if (response) {
        message.success("Cập nhật trạng thái bảo hành thành công");
        setIsModalVisible(false);
        fetchWarranties(currentPage, searchQuery); // Refresh list
      } else {
        message.error("Không thể cập nhật trạng thái bảo hành");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái bảo hành:", error);
      message.error("Lỗi khi cập nhật trạng thái bảo hành: " + (error.message || "Lỗi không xác định"));
    } finally {
      setSavingWarranty(false);
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

  const handleEdit = (warranty) => {
    setSelectedWarranty(warranty);
    setIsModalVisible(true);
    
    // Đặt giá trị mặc định cho form
    form.setFieldsValue({
      TrangThai: warranty.TrangThai,
      MoTa: warranty.MoTa,
      NgayTraBaoHanh: warranty.NgayTraBaoHanh ? moment(warranty.NgayTraBaoHanh) : null
    });
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSaveWarranty = () => {
    form.validateFields()
      .then(values => {
        updateWarrantyStatus(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
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
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          className="edit-button"
        >
          Sửa
        </Button>
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
        title={`Cập nhật bảo hành - Mã bảo hành: ${selectedWarranty?.MaBH}`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        width={700}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Hủy
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            onClick={handleSaveWarranty}
            loading={savingWarranty}
            className="save-button"
          >
            Lưu
          </Button>,
        ]}
      >
        {selectedWarranty ? (
          <div className="warranty-detail">
            <div className="warranty-info mb-4">
              <Title level={5}>Thông tin bảo hành</Title>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Mã bảo hành:</strong> {selectedWarranty.MaBH}</p>
                  <p><strong>Mã hóa đơn:</strong> {selectedWarranty.MaHD}</p>
                  <p><strong>Mã seri:</strong> {selectedWarranty.MaSeri}</p>
                </div>
                <div>
                  <p><strong>Nhân viên xử lý:</strong> {selectedWarranty.TenNhanVien || 'N/A'}</p>
                  <p><strong>Ngày gửi:</strong> {selectedWarranty.NgayGuiBaoHanh ? new Date(selectedWarranty.NgayGuiBaoHanh).toLocaleDateString("vi-VN") : 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                TrangThai: selectedWarranty.TrangThai,
                MoTa: selectedWarranty.MoTa,
                NgayTraBaoHanh: selectedWarranty.NgayTraBaoHanh ? moment(selectedWarranty.NgayTraBaoHanh) : null
              }}
            >
              <Form.Item
                name="TrangThai"
                label="Trạng thái bảo hành"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Select.Option value={1}>Chờ xử lý</Select.Option>
                  <Select.Option value={2}>Đang xử lý</Select.Option>
                  <Select.Option value={3}>Hoàn thành</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.TrangThai !== currentValues.TrangThai}
              >
                {({ getFieldValue }) => 
                  getFieldValue('TrangThai') === 3 ? (
                    <Form.Item
                      name="NgayTraBaoHanh"
                      label="Ngày trả bảo hành"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày trả bảo hành!' }]}
                    >
                      <DatePicker 
                        format="DD/MM/YYYY" 
                        placeholder="Chọn ngày trả" 
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
              
              <Form.Item
                name="MoTa"
                label="Mô tả"
              >
                <TextArea rows={4} placeholder="Nhập mô tả về tình trạng bảo hành" />
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div className="flex justify-center items-center p-8">
            <Spin />
          </div>
        )}
      </Modal>

      <style jsx="true" global="true">{`
        .edit-button {
          background-color: #52c41a !important;
          border-color: #52c41a !important;
          color: white !important;
        }

        .edit-button:hover {
          background-color: #389e0d !important;
          border-color: #389e0d !important;
        }
        
        .save-button {
          background-color: #1890ff !important;
          border-color: #1890ff !important;
          color: white !important;
        }

        .save-button:hover {
          background-color: #096dd9 !important;
          border-color: #096dd9 !important;
        }
      `}</style>
    </div>
  );
};

export default Warranties;

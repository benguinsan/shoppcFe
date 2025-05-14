import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Space, Card, Pagination, Input, Form, InputNumber, DatePicker, message as antdMessage, Select, Row, Col } from "antd";
import { EyeOutlined, EditOutlined, SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import orderApi from "../../../api/orderApi";

const { RangePicker } = DatePicker;

const Orders = () => {
  const [sortedInfo, setSortedInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditDetailModalVisible, setIsEditDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (page = currentPage, searchTerm = search, dates = dateRange) => {
    try {
      setLoading(true);
      let response;
      
      let fromDate = null;
      let toDate = null;
      
      if (dates && dates[0] && dates[1]) {
        fromDate = dates[0].format('YYYY-MM-DD');
        toDate = dates[1].format('YYYY-MM-DD');
      }
      
      if (searchTerm.trim() !== "" || (fromDate && toDate)) {
        console.log(`Đang tìm kiếm với từ khóa: "${searchTerm}", từ ngày: ${fromDate}, đến ngày: ${toDate}`);
        response = await orderApi.searchOrders(searchTerm, page, fromDate, toDate);
        console.log("Kết quả tìm kiếm:", response);
      } else {
        response = await orderApi.getOrders(page);
      }
      
      if (response && response.data) {
        setOrders(response.data);
        setTotalItems(response.pagination?.total || response.pagination?.last_page * pageSize || 0);
      } else {
        setOrders([]);
        setTotalItems(0);
        antdMessage.warning("Không có dữ liệu phù hợp");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      antdMessage.error(error.message || "Có lỗi xảy ra khi tải danh sách đơn hàng");
      setLoading(false);
      setOrders([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, search, dateRange);
  }, [currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders(1, search, dateRange);
  };

  const showOrderDetails = async (orderId) => {
    try {
      setSelectedOrderId(orderId);
      setIsModalVisible(true);
      const response = await orderApi.getOrderDetails(orderId);
      setOrderDetails(response.data);
    } catch (error) {
      antdMessage.error(error.message || "Có lỗi xảy ra khi tải chi tiết đơn hàng");
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const clearAll = () => {
    setSortedInfo({});
    setSearch("");
    setDateRange(null);
    setCurrentPage(1);
    fetchOrders(1, "", null);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const showEditModal = (record) => {
    setSelectedOrder(record);
    form.setFieldsValue({
      NgayLap: moment(record.NgayLap),
      TongTien: record.TongTien,
      TrangThai: record.TrangThai
    });
    setIsEditModalVisible(true);
  };

  const showEditDetailModal = (record) => {
    setSelectedOrderDetail(record);
    detailForm.setFieldsValue({
      MaHD: record.MaHD,
      MaSP: record.MaSP,
      MaSeri: record.MaSeri,
      DonGia: record.DonGia
    });
    setIsEditDetailModalVisible(true);
  };

  const handleEditOrder = async (values) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        antdMessage.error("Không tìm thấy thông tin đăng nhập!");
        return;
      }
      
      const user = JSON.parse(userStr);
      const maTK = user.nguoiDung?.MaTK || user.MaTK || user.maTK;
      
      if (!maTK) {
        antdMessage.error("Không tìm thấy mã tài khoản người dùng!");
        return;
      }
      
      const updatedValues = {
        ...values,
        MaTK: maTK
      };
      
      const response = await orderApi.updateOrder(selectedOrder.MaHD, updatedValues);
      if (response.status === "success") {
        const updatedResponse = await orderApi.getOrders(currentPage);
        setOrders(updatedResponse.data);
        setIsEditModalVisible(false);
        antdMessage.success("Cập nhật đơn hàng thành công");
      }
    } catch (error) {
      antdMessage.error(error.message || "Có lỗi xảy ra khi cập nhật đơn hàng");
    }
  };

  const handleEditOrderDetail = async (values) => {
    try {
      const response = await orderApi.updateOrderDetail(selectedOrderDetail.MaCTHD, values);
      if (response.status === "success") {
        const updatedResponse = await orderApi.getOrderDetails(selectedOrderDetail.MaHD);
        setOrderDetails(updatedResponse.data);
        setIsEditDetailModalVisible(false);

        const chiTietList = updatedResponse.data;
        const tongTien = chiTietList.reduce((sum, item) => sum + (parseFloat(item.DonGia) || 0), 0);
        const hoaDon = orders.find(hd => hd.MaHD === selectedOrderDetail.MaHD);
        
        if (hoaDon) {
          const userStr = localStorage.getItem("user");
          if (!userStr) {
            antdMessage.error("Không tìm thấy thông tin đăng nhập!");
            return;
          }
          
          const user = JSON.parse(userStr);
          const maTK = user.nguoiDung?.MaTK || user.MaTK || user.maTK;
          
          if (!maTK) {
            antdMessage.error("Không tìm thấy mã tài khoản người dùng!");
            return;
          }
          
          await orderApi.updateOrder(hoaDon.MaHD, {
            MaNguoiDung: hoaDon.MaNguoiDung,
            NgayLap: hoaDon.NgayLap,
            TongTien: tongTien,
            TrangThai: hoaDon.TrangThai,
            MaTK: maTK
          });
          
          const refreshOrders = await orderApi.getOrders(currentPage);
          setOrders(refreshOrders.data);
        }
        antdMessage.success("Cập nhật chi tiết đơn hàng thành công");
      }
    } catch (error) {
      let msg = error.message || "Có lỗi xảy ra khi cập nhật chi tiết đơn hàng";
      if (msg.includes('Cannot add or update a child row: a foreign key constraint fails')) {
        msg = 'Sản phẩm không tồn tại mã seri này!';
      }
      antdMessage.error(msg);
    }
  };

  const columns = [
    {
      title: "Mã Hoá Đơn",
      dataIndex: "MaHD",
      key: "MaHD",
      width: 120,
    },
    {
      title: "Mã Người Dùng",
      dataIndex: "MaNguoiDung",
      key: "MaNguoiDung",
      width: 150,
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "TenNguoiDung",
      key: "TenNguoiDung",
      width: 180,
    },
    {
      title: "Mã Nhân Viên",
      dataIndex: "MaNhanVien",
      key: "MaNhanVien",
      width: 150,
    },
    {
      title: "Tên Nhân Viên",
      dataIndex: "TenNhanVien",
      key: "TenNhanVien",
      width: 180,
    },
    {
      title: "Ngày Lập",
      dataIndex: "NgayLap",
      key: "NgayLap",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "TongTien",
      key: "TongTien",
      width: 150,
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
          3: 'Đang giao hàng',
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
              {statusText[stt] || 'Không xác định'}
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
            onClick={() => showOrderDetails(record.MaHD)}
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
      title: "Mã chi tiết hoá đơn",
      dataIndex: "MaCTHD",
      key: "MaCTHD",
    },
    {
      title: "Mã hoá đơn",
      dataIndex: "MaHD",
      key: "MaHD",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "MaSP",
      key: "MaSP",
    },
    {
      title: "Mã seri",
      dataIndex: "MaSeri",
      key: "MaSeri",
    },
    {
      title: "Đơn giá",
      dataIndex: "DonGia",
      key: "DonGia",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => showEditDetailModal(record)}
          className="edit-button"
        >
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-3">Danh sách hóa đơn</h2>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Input
              placeholder="Tìm kiếm hóa đơn, người dùng, nhân viên..."
              value={search}
              onChange={handleSearchChange}
              style={{ width: '100%' }}
              onPressEnter={handleSearch}
              allowClear
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
              value={dateRange}
              allowClear
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col span={24}>
            <Space>
              <Button onClick={handleSearch} type="primary" className="detail-button" icon={<SearchOutlined />}>
                Tìm kiếm
              </Button>
              <Button onClick={clearAll} icon={<CalendarOutlined />}>
                Xóa bộ lọc
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
      <div className="mb-2">
        <small className="text-gray-500">
          * Có thể tìm kiếm theo: Mã hóa đơn (HD001), Mã người dùng (ND...), Mã nhân viên, Tên người dùng, Tên nhân viên
        </small>
      </div>
      
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="MaHD"
          pagination={false}
          loading={loading}
          scroll={{ x: 1500 }}
        />
        
        <div className="flex justify-end mt-4">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={handlePageChange}
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
            showSizeChanger={true}
            pageSizeOptions={['10', '20', '50']}
          />
        </div>
      </Card>

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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Table
            dataSource={orderDetails}
            columns={detailColumns}
            rowKey="MaCTHD"
            pagination={false}
            style={{ width: '100%', maxWidth: 900 }}
          />
        </div>
      </Modal>

      <Modal
        title={<span>Sửa hóa đơn <span style={{color:'#1890ff', fontWeight:600, marginLeft:8}}>{selectedOrder?.MaHD}</span></span>}
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleEditOrder}
          layout="vertical"
        >
          <Form.Item
            name="NgayLap"
            label="Ngày lập"
            rules={[{ required: true, message: 'Vui lòng chọn ngày lập!' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select style={{ width: '100%' }}>
              <Select.Option value={1}>Chờ xác nhận</Select.Option>
              <Select.Option value={2}>Đã xác nhận</Select.Option>
              <Select.Option value={3}>Đang giao hàng</Select.Option>
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
        title="Sửa chi tiết hóa đơn"
        open={isEditDetailModalVisible}
        onCancel={() => setIsEditDetailModalVisible(false)}
        footer={null}
      >
        <Form
          form={detailForm}
          onFinish={handleEditOrderDetail}
          layout="vertical"
        >
          <Form.Item
            name="MaHD"
            label="Mã hóa đơn"
            rules={[{ required: true, message: 'Vui lòng nhập mã hóa đơn!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="MaSP"
            label="Mã sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="MaSeri"
            label="Mã seri"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="DonGia"
            label="Đơn giá"
            rules={[
              { required: true, message: 'Vui lòng nhập đơn giá!' },
              { type: 'number', message: 'Đơn giá phải là số!' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
              controls={false}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
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
      `}</style>
    </div>
  );
};

export default Orders;

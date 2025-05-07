import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Space, Card, Pagination, Input, Form, InputNumber, DatePicker, message as antdMessage, Select } from "antd";
import AdminTable from "../../../components/admin/ui/table";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import orderApi from "../../../api/orderApi";

const Orders = () => {
  const [sortedInfo, setSortedInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditDetailModalVisible, setIsEditDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let response;
        if (search.trim() !== "") {
          response = await orderApi.searchOrders(search, currentPage);
        } else {
          response = await orderApi.getOrders(currentPage);
        }
        setOrders(response.data);
        setTotalPages(response.pagination.last_page);
      } catch (error) {
        antdMessage.error(error.message || "Có lỗi xảy ra khi tải danh sách đơn hàng");
      }
    };
    fetchOrders();
  }, [currentPage, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
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
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showEditModal = (record) => {
    setSelectedOrder(record);
    form.setFieldsValue({
      MaNguoiDung: record.MaNguoiDung,
      MaNhanVien: record.MaNhanVien,
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
      const response = await orderApi.updateOrder(selectedOrder.MaHD, values);
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

        // Tính lại tổng tiền và cập nhật hóa đơn
        const chiTietList = updatedResponse.data;
        const tongTien = chiTietList.reduce((sum, item) => sum + (parseFloat(item.DonGia) || 0), 0);
        const hoaDon = orders.find(hd => hd.MaHD === selectedOrderDetail.MaHD);
        if (hoaDon) {
          await orderApi.updateOrder(hoaDon.MaHD, {
            MaNguoiDung: hoaDon.MaNguoiDung,
            MaNhanVien: hoaDon.MaNhanVien,
            NgayLap: hoaDon.NgayLap,
            TongTien: tongTien,
            TrangThai: hoaDon.TrangThai
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
    },
    {
      title: "Mã Người Dùng",
      dataIndex: "MaNguoiDung",
      key: "MaNguoiDung",
    },
    {
      title: "Mã Nhân Viên",
      dataIndex: "MaNhanVien",
      key: "MaNhanVien",
    },
    {
      title: "Ngày Lập",
      dataIndex: "NgayLap",
      key: "NgayLap",
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
    <div className="p-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm hóa đơn, người dùng, nhân viên..."
          value={search}
          onChange={handleSearchChange}
          style={{ width: 300 }}
          allowClear
        />
        <Button onClick={clearAll}>Clear</Button>
      </Space>
      <div style={{ width: '100%', maxWidth: 1100 }}>
        <AdminTable
          columns={columns}
          dataSource={orders}
          rowKey="MaHD"
          handleChange={() => {}}
          pageNo={currentPage}
          pageSize={10}
          totalElements={orders.length}
        />
        <Pagination
          current={currentPage}
          total={totalPages * 10}
          pageSize={10}
          onChange={handlePageChange}
          style={{ marginTop: 16, textAlign: 'center' }}
        />
      </div>

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
            name="MaNhanVien"
            label="Mã nhân viên"
            rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}
          >
            <Input />
          </Form.Item>
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

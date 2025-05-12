import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { message as antdMessage, Button, Card, DatePicker, Form, Input, Modal, Select, Space, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import warrantyApi from "../../../api/warrantyApi";
import AdminTable from "../../../components/admin/ui/table";

const Warranties = () => {
  const [sortedInfo, setSortedInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWarrantyId, setSelectedWarrantyId] = useState(null);
  const [warranties, setWarranties] = useState([]);
  const [warrantyDetails, setWarrantyDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditDetailModalVisible, setIsEditDetailModalVisible] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [selectedWarrantyDetail, setSelectedWarrantyDetail] = useState(null);
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        let response;
        if (search.trim() !== "") {
          response = await warrantyApi.searchWarranties(search, currentPage);
        } else {
          response = await warrantyApi.getWarranties(currentPage);
        }
        setWarranties(response?.data || []);
        setTotalPages(response?.pagination?.last_page || 1);
      } catch (error) {
        antdMessage.error(error.message || "Có lỗi xảy ra khi tải danh sách bảo hành");
        setWarranties([]);
        setTotalPages(1);
      }
    };
    fetchWarranties();
  }, [currentPage, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const showWarrantyDetails = async (warrantyId) => {
    try {
      setSelectedWarrantyId(warrantyId);
      setIsModalVisible(true);
      const response = await warrantyApi.getWarrantyDetails(warrantyId);
      setWarrantyDetails(response.data);
    } catch (error) {
      antdMessage.error(error.message || "Có lỗi xảy ra khi tải chi tiết bảo hành");
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
    setSelectedWarranty(record);
    form.setFieldsValue({
      MaHD: record.MaHD,
      MaSeri: record.MaSeri,
      NgayMua: moment(record.NgayMua),
      HanBaoHanh: moment(record.HanBaoHanh),
      MoTa: record.MoTa
    });
    setIsEditModalVisible(true);
  };

  const showEditDetailModal = (record) => {
    setSelectedWarrantyDetail(record);
    detailForm.setFieldsValue({
      MaBH: record.MaBH,
      NgayBaoHanh: moment(record.NgayBaoHanh),
      NgayHoanThanh: record.NgayHoanThanh ? moment(record.NgayHoanThanh) : null,
      TinhTrang: record.TinhTrang,
      ChiTiet: record.ChiTiet
    });
    setIsEditDetailModalVisible(true);
  };

  const handleEditWarranty = async (values) => {
    try {
      const response = await warrantyApi.updateWarranty(selectedWarranty.MaBH, values);
      if (response.status === "success" || response.message?.includes("thành công")) {
        antdMessage.success(response.message || "Cập nhật bảo hành thành công");
        setIsEditModalVisible(false);
        form.resetFields();
        const updatedResponse = await warrantyApi.getWarranties(currentPage);
        setWarranties(updatedResponse.data);
      } else {
        antdMessage.error(response.message || "Cập nhật bảo hành thất bại");
      }
    } catch (error) {
      antdMessage.error(error.message || "Có lỗi xảy ra khi cập nhật bảo hành");
    }
  };

  const handleEditWarrantyDetail = async (values) => {
    try {
      const response = await warrantyApi.updateWarrantyDetail(selectedWarrantyDetail.MaCTBH, values);
      if (response.status === "success" || response.message?.includes("thành công")) {
        antdMessage.success(response.message || "Cập nhật chi tiết bảo hành thành công");
        setIsEditDetailModalVisible(false);
        detailForm.resetFields();
        const updatedResponse = await warrantyApi.getWarrantyDetails(selectedWarrantyDetail.MaBH);
        setWarrantyDetails(updatedResponse.data);
        const warrantiesResponse = await warrantyApi.getWarranties(currentPage);
        setWarranties(warrantiesResponse.data);
      } else {
        antdMessage.error(response.message || "Cập nhật chi tiết bảo hành thất bại");
      }
    } catch (error) {
      antdMessage.error(error.message || "Có lỗi xảy ra khi cập nhật chi tiết bảo hành");
    }
  };

  const columns = [
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
      title: "Ngày Mua",
      dataIndex: "NgayMua",
      key: "NgayMua",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hạn Bảo Hành",
      dataIndex: "HanBaoHanh",
      key: "HanBaoHanh",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Mô Tả",
      dataIndex: "MoTa",
      key: "MoTa",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showWarrantyDetails(record.MaBH)}
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
      title: "Mã chi tiết bảo hành",
      dataIndex: "MaCTBH",
      key: "MaCTBH",
    },
    {
      title: "Mã Bảo Hành",
      dataIndex: "MaBH",
      key: "MaBH",
    },
    {
      title: "Ngày Bảo Hành",
      dataIndex: "NgayBaoHanh",
      key: "NgayBaoHanh",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày Hoàn Thành",
      dataIndex: "NgayHoanThanh",
      key: "NgayHoanThanh",
      render: (date) => date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa hoàn thành",
    },
    {
      title: "Tình Trạng",
      dataIndex: "TinhTrang",
      key: "TinhTrang",
      render: (status) => {
        const statusText = {
          'pending': 'Đang xử lý',
          'in_progress': 'Đang sửa chữa',
          'completed': 'Đã hoàn thành',
          'cancelled': 'Đã hủy'
        };
        return statusText[status] || status;
      }
    },
    {
      title: "Chi Tiết",
      dataIndex: "ChiTiet",
      key: "ChiTiet",
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
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm bảo hành..."
            onChange={handleSearchChange}
            style={{ width: 300 }}
          />
          <Button onClick={clearAll} className="clear-button" danger>
            Clear
          </Button>
        </Space>
        <AdminTable
          columns={columns}
          dataSource={warranties}
          rowKey="MaBH"
          handleChange={() => {}}
          pageNo={currentPage}
          pageSize={10}
          totalElements={totalPages * 10}
        />
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
          rowKey="MaCTBH"
          pagination={false}
        />
      </Modal>

      <Modal
        title="Chỉnh sửa bảo hành"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditWarranty}
        >
          <Form.Item
            name="MaHD"
            label="Mã hóa đơn"
            rules={[{ required: true, message: "Vui lòng nhập mã hóa đơn" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="MaSeri"
            label="Mã seri"
            rules={[{ required: true, message: "Vui lòng nhập mã seri" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="NgayMua"
            label="Ngày mua"
            rules={[{ required: true, message: "Vui lòng chọn ngày mua" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="HanBaoHanh"
            label="Hạn bảo hành"
            rules={[{ required: true, message: "Vui lòng chọn hạn bảo hành" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="MoTa"
            label="Mô tả"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa chi tiết bảo hành"
        open={isEditDetailModalVisible}
        onCancel={() => setIsEditDetailModalVisible(false)}
        footer={null}
      >
        <Form
          form={detailForm}
          layout="vertical"
          onFinish={handleEditWarrantyDetail}
        >
          <Form.Item
            name="NgayBaoHanh"
            label="Ngày bảo hành"
            rules={[{ required: true, message: "Vui lòng chọn ngày bảo hành" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="NgayHoanThanh"
            label="Ngày hoàn thành"
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="TinhTrang"
            label="Tình trạng"
            rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
          >
            <Select>
              <Select.Option value="pending">Đang xử lý</Select.Option>
              <Select.Option value="in_progress">Đang sửa chữa</Select.Option>
              <Select.Option value="completed">Đã hoàn thành</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ChiTiet"
            label="Chi tiết"
            rules={[{ required: true, message: "Vui lòng nhập chi tiết" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
              <Button onClick={() => setIsEditDetailModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
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

export default Warranties;

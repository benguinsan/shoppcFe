import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, message, Card, Row, Col, Typography, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/vi_VN';
import warrantyApi from '../../../api/warrantyApi';

const { Option } = Select;
const { Title, Text } = Typography;

const CreateWarranty = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [inputOrderId, setInputOrderId] = useState('');

  // Thiết lập giá trị mặc định cho form khi component được tạo
  useEffect(() => {
    form.setFieldsValue({
      NgayGuiBaoHanh: moment()
    });
  }, [form]);

  const fetchOrderDetails = async (orderId) => {
    if (!orderId || orderId.trim() === '') {
      setOrderDetails([]);
      return;
    }

    try {
      setLoadingDetails(true);
      const response = await warrantyApi.getOrderDetails(orderId);
      if (response.status === 'success' && response.data && response.data.length > 0) {
        setOrderDetails(response.data);
        message.success('Đã tải thông tin chi tiết hóa đơn');
      } else {
        setOrderDetails([]);
        message.error('Không tìm thấy hóa đơn hoặc hóa đơn không có sản phẩm');
      }
    } catch (error) {
      setOrderDetails([]);
      message.error('Lỗi khi tải chi tiết hóa đơn: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleInputOrderChange = (e) => {
    setInputOrderId(e.target.value);
  };

  const handleSearchOrder = () => {
    form.setFieldsValue({
      MaSeri: undefined,
    });
    fetchOrderDetails(inputOrderId);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Lấy thông tin user từ localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        message.error("Không tìm thấy thông tin đăng nhập!");
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const maTK = user.nguoiDung?.MaTK || user.MaTK || user.maTK;
      
      if (!maTK) {
        message.error("Không tìm thấy mã tài khoản người dùng!");
        setLoading(false);
        return;
      }

      // Tự động tính ngày kết thúc bảo hành (12 tháng sau ngày bắt đầu)
      const NgayGuiBaoHanh = values.NgayGuiBaoHanh;
      const ngayKetThuc = moment(NgayGuiBaoHanh).add(12, 'months');

      // Tạo object dữ liệu bảo hành
      const warrantyData = {
        MaHD: inputOrderId,
        MaSeri: values.MaSeri,
        NgayGuiBaoHanh: NgayGuiBaoHanh.format('YYYY-MM-DD HH:mm:ss'),
        NgayKetThuc: ngayKetThuc.format('YYYY-MM-DD HH:mm:ss'),
        MoTa: values.MoTa,
        MaTK: maTK
      };

      console.log('Dữ liệu gửi đi:', warrantyData);

      const response = await warrantyApi.createWarranty(warrantyData);
      
      // Cách xử lý phản hồi được cải thiện
      console.log('Phản hồi từ API:', response);
      
      // Kiểm tra nếu response có status success hoặc nội dung thông báo chứa "thành công"
      if (response.status === 'success' || 
          (response.message && response.message.toLowerCase().includes('thành công')) ||
          (response.data && response.data.message && response.data.message.toLowerCase().includes('thành công'))) {
        
        message.success('Tạo bảo hành thành công!');
        
        // Delay một chút trước khi chuyển hướng để người dùng thấy thông báo
        setTimeout(() => {
          navigate('/admin/warranties');
        }, 1000);
      } else {
        message.error('Tạo bảo hành thất bại: ' + (response.message || ''));
      }
    } catch (error) {
      console.error('Chi tiết lỗi:', error);
      // Kiểm tra nếu lỗi có chứa thông báo thành công
      if (error.message && error.message.toLowerCase().includes('thành công')) {
        message.success('Tạo bảo hành thành công!');
        setTimeout(() => {
          navigate('/admin/warranties');
        }, 1000);
      } else {
        message.error('Lỗi khi tạo bảo hành: ' + (error.message || 'Lỗi không xác định'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <Title level={2} className="text-center mb-6">Tạo Bảo Hành Mới</Title>
      <Divider />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col span={24} className="mb-4">
            <Form.Item
              label="Mã hóa đơn"
              required
              tooltip="Nhập mã hóa đơn và nhấn tìm kiếm để tải danh sách sản phẩm"
            >
              <Input.Group compact>
                <Input
                  style={{ width: 'calc(100% - 100px)' }}
                  placeholder="Nhập mã hóa đơn (ví dụ: HD001)"
                  value={inputOrderId}
                  onChange={handleInputOrderChange}
                />
                <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearchOrder}
                loading={loadingDetails}
                style={{
                    width: '100px',
                    backgroundColor: '#1677ff', // Màu xanh của Ant Design primary
                    color: '#fff',               // Màu chữ trắng
                    borderColor: '#1677ff',     // Viền xanh
                }}
                >
                Tìm kiếm
                </Button>
              </Input.Group>
            </Form.Item>
          </Col>
        </Row>
          
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="MaSeri"
              label="Mã Seri sản phẩm"
              rules={[{ required: true, message: 'Vui lòng chọn mã seri sản phẩm!' }]}
            >
              <Select 
                placeholder={orderDetails.length === 0 ? "Hãy tìm kiếm hóa đơn trước" : "Chọn mã seri sản phẩm"}
                disabled={orderDetails.length === 0}
                loading={loadingDetails}
                showSearch
                optionFilterProp="children"
              >
                {orderDetails.map(detail => (
                  detail.MaSeri ? (
                    <Option key={detail.MaSeri} value={detail.MaSeri}>
                      {detail.MaSeri} - {detail.TenSP || 'Sản phẩm không xác định'}
                    </Option>
                  ) : null
                )).filter(Boolean)}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="NgayGuiBaoHanh"
              label="Ngày bắt đầu bảo hành"
              tooltip="Mặc định là ngày hiện tại, thời hạn bảo hành 12 tháng sẽ được tự động tính"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                placeholder="Chọn ngày bắt đầu"
                locale={locale}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="MoTa"
              label="Mô tả bảo hành"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả bảo hành!' }]}
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Nhập mô tả chi tiết về bảo hành" 
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="text-center mt-4">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={orderDetails.length === 0 || !inputOrderId}
            style={{
                width: '150px',
                backgroundColor: '#1677ff', // Màu xanh của Ant Design primary
                color: '#fff',               // Màu chữ trắng
                borderColor: '#1677ff',     // Viền xanh
            }}
            className="mr-4"
          >
            Tạo bảo hành
          </Button>
          <Button 
            onClick={() => navigate('/admin/warranties')}
            style={{ minWidth: 150 }}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateWarranty; 
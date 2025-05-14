import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Alert, 
  Typography, 
  Spin, 
  Divider, 
  Row, 
  Col, 
  Descriptions, 
  Badge,
  message
} from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import warrantyApi from '../api/warrantyApi';

const { Title, Paragraph, Text } = Typography;

const WarrantyCheck = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [warrantyData, setWarrantyData] = useState(null);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleCheck = async (values) => {
    try {
      setLoading(true);
      setError(null);
      setWarrantyData(null);
      setSearched(true);
      
      const { invoiceId, serialNumber } = values;
      const response = await warrantyApi.checkWarrantyStatus(invoiceId, serialNumber);
      
      if (response && response.success) {
        setWarrantyData(response.data);
      } else {
        setError(response?.message || 'Không thể kiểm tra thông tin bảo hành');
      }
    } catch (error) {
      setError(error.message || 'Đã xảy ra lỗi khi kiểm tra bảo hành');
    } finally {
      setLoading(false);
    }
  };

  const renderWarrantyStatus = () => {
    if (!warrantyData) return null;

    return (
      <Card 
        className="warranty-result-card"
        bordered={false}
        style={{ marginTop: '2rem' }}
      >
        <Title level={4} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Thông tin bảo hành
        </Title>
        
        <Alert
          message={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {warrantyData.ConHieuLuc ? (
                <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#52c41a', marginRight: '0.5rem' }} />
              ) : (
                <CloseCircleOutlined style={{ fontSize: '1.5rem', color: '#f5222d', marginRight: '0.5rem' }} />
              )}
              <Text strong style={{ fontSize: '1rem' }}>
                {warrantyData.ConHieuLuc 
                  ? `Sản phẩm còn bảo hành (${warrantyData.SoNgayConLai} ngày)` 
                  : 'Sản phẩm đã hết bảo hành'}
              </Text>
            </div>
          }
          type={warrantyData.ConHieuLuc ? "success" : "error"}
          style={{ marginBottom: '1.5rem' }}
          showIcon={false}
          banner
        />
        
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Mã hóa đơn">{warrantyData.MaHD}</Descriptions.Item>
          <Descriptions.Item label="Mã sản phẩm">{warrantyData.MaSP}</Descriptions.Item>
          <Descriptions.Item label="Tên sản phẩm">{warrantyData.TenSP}</Descriptions.Item>
          <Descriptions.Item label="Số seri">{warrantyData.MaSeri}</Descriptions.Item>
          <Descriptions.Item label="Ngày mua">
            {new Date(warrantyData.NgayMua).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian bảo hành">{warrantyData.ThoiGianBaoHanh}</Descriptions.Item>
          <Descriptions.Item label="Ngày hết hạn">
            {new Date(warrantyData.NgayHetHan).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Badge 
              status={warrantyData.ConHieuLuc ? "success" : "error"} 
              text={warrantyData.ConHieuLuc ? "Còn hiệu lực" : "Hết hiệu lực"} 
            />
          </Descriptions.Item>
          {warrantyData.DaGuiBaoHanh && (
            <Descriptions.Item label="Đã gửi bảo hành">
              <Badge status="processing" text="Đã gửi bảo hành" />
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    );
  };

  return (
    <div className="warranty-check-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Card 
        title={
          <div style={{ textAlign: 'center' }}>
            <HistoryOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '8px' }} />
            <span>Kiểm tra bảo hành</span>
          </div>
        }
        style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      >
        <Paragraph style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Nhập mã hóa đơn và số seri của sản phẩm để kiểm tra tình trạng bảo hành
        </Paragraph>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCheck}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="invoiceId"
                label="Mã hóa đơn"
                rules={[{ required: true, message: 'Vui lòng nhập mã hóa đơn!' }]}
              >
                <Input 
                  placeholder="Ví dụ: HD001" 
                  size="large"
                  prefix={<span style={{ color: '#bfbfbf' }}>#</span>}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="serialNumber"
                label="Số seri sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập số seri sản phẩm!' }]}
              >
                <Input 
                  placeholder="Ví dụ: SR001" 
                  size="large"
                  prefix={<span style={{ color: '#bfbfbf' }}>#</span>}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              icon={<SearchOutlined />}
              loading={loading}
              style={{
                width: '150px',
                backgroundColor: '#1677ff',
                color: '#fff',
                borderColor: '#1677ff',
            }}
            >
              Kiểm tra
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Spin size="large" />
          <div style={{ marginTop: '1rem' }}>Đang kiểm tra thông tin bảo hành...</div>
        </div>
      )}
      
      {error && searched && !loading && (
        <Alert
          message="Không tìm thấy thông tin bảo hành"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: '2rem' }}
        />
      )}
      
      {warrantyData && !loading && renderWarrantyStatus()}
      
      <style jsx="true">{`
        .warranty-check-container {
          background-color: #f5f5f5;
          min-height: 100vh;
          padding-top: 2rem;
          padding-bottom: 2rem;
        }
        
        .warranty-result-card {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        
        @media (max-width: 576px) {
          .warranty-check-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WarrantyCheck; 
import { MinusOutlined, PlusOutlined, RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import { message as antdMessage, Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Space, Table, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";

const { Option } = Select;
const { Title } = Typography;

const CreateImport = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([
    { MaSP: undefined, SoLuong: 0, DonGia: 0, ThanhTien: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [debug, setDebug] = useState({
    apiResponse: null,
    suppliersState: null
  });

  // Lấy danh sách sản phẩm, nhà cung cấp, nhân viên
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Dùng axiosClient đúng cách - lưu ý axiosClient đã trả về response.data luôn
        const suppliersData = await axiosClient.get("api/nhacungcap");
        console.log("API nhà cung cấp trả về:", suppliersData);
        
        // Lưu response để debug
        setDebug(prev => ({...prev, apiResponse: suppliersData}));
        
        // Kiểm tra và set dữ liệu - suppliersData là data chứ không phải response.data
        if (suppliersData && suppliersData.data && Array.isArray(suppliersData.data)) {
          setSuppliers(suppliersData.data);
          // Lưu state để debug
          setDebug(prev => ({...prev, suppliersState: suppliersData.data}));
          console.log("Đã set suppliers state với:", suppliersData.data);
        } else {
          console.error("Cấu trúc dữ liệu không đúng:", suppliersData);
          antdMessage.error("Không thể tải danh sách nhà cung cấp - sai cấu trúc dữ liệu");
        }
        
        // Tiếp tục tải các dữ liệu khác - axiosClient trả về data luôn
        const [productsData, usersData] = await Promise.all([
          axiosClient.get("sanpham"),
          axiosClient.get("api/nhanvien")
        ]);

        if (productsData) {
          setProducts(productsData);
          setFilteredProducts(productsData);
        }
        
        if (usersData && usersData.status === "success" && Array.isArray(usersData.data)) {
          setUsers(usersData.data);
          console.log("Đã tải danh sách nhân viên:", usersData.data);
        } else {
          console.error("Cấu trúc dữ liệu nhân viên không đúng:", usersData);
          antdMessage.error("Không thể tải danh sách nhân viên - sai cấu trúc dữ liệu");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        antdMessage.error("Có lỗi xảy ra khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products based on search
  useEffect(() => {
    if (productSearch) {
      const filtered = products.filter(p => 
        p.TenSP.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.MaSP.toLowerCase().includes(productSearch.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [productSearch, products]);

  // Tính lại thành tiền khi thay đổi số lượng hoặc đơn giá
  const updateRow = (index, key, value) => {
    const newRows = [...rows];
    newRows[index][key] = value;
    if (key === "SoLuong" || key === "DonGia") {
      const soLuong = Number(newRows[index].SoLuong) || 0;
      const donGia = Number(newRows[index].DonGia) || 0;
      newRows[index].ThanhTien = soLuong * donGia;
    }
    setRows(newRows);
  };

  // Thêm dòng sản phẩm
  const addRow = () => {
    setRows([...rows, { MaSP: undefined, SoLuong: 0, DonGia: 0, ThanhTien: 0 }]);
  };

  // Xóa dòng sản phẩm
  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    return rows.reduce((total, row) => total + (row.ThanhTien || 0), 0);
  };

  // Xử lý submit
  const onFinish = async (values) => {
    if (rows.some(row => !row.MaSP || !row.SoLuong || !row.DonGia)) {
      antdMessage.error("Vui lòng nhập đầy đủ thông tin sản phẩm!");
      return;
    }

    Modal.confirm({
      title: "Xác nhận lưu phiếu nhập?",
      content: (
        <div>
          <p>Bạn có chắc chắn muốn lưu phiếu nhập này không?</p>
          <p>Tổng tiền: {calculateTotal().toLocaleString()} VND</p>
        </div>
      ),
      okText: "Lưu",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const payload = {
            MaNCC: values.MaNCC,
            MaNhanVien: values.MaNhanVien,
            NgayNhap: values.NgayNhap.format("YYYY-MM-DD HH:mm:ss"),
            ChiTiet: rows.map(row => ({
              MaSP: row.MaSP,
              SoLuong: row.SoLuong,
              DonGia: row.DonGia
            })),
            GhiChu: values.GhiChu || ""
          };
          await axiosClient.post("/phieunhap", payload);
          antdMessage.success("Tạo phiếu nhập thành công!");
          form.resetFields();
          setRows([{ MaSP: undefined, SoLuong: 0, DonGia: 0, ThanhTien: 0 }]);
        } catch (err) {
          const msg = err?.response?.data?.message || err.message || "Tạo phiếu nhập thất bại!";
          antdMessage.error(msg);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "MaSP",
      render: (value, row, idx) => (
        <Select
          showSearch
          placeholder="Chọn sản phẩm"
          value={value}
          onChange={val => updateRow(idx, "MaSP", val)}
          style={{ width: 250 }}
          filterOption={false}
          onSearch={setProductSearch}
          notFoundContent={loading ? "Đang tải..." : "Không tìm thấy sản phẩm"}
        >
          {filteredProducts.map(sp => (
            <Option key={sp.MaSP} value={sp.MaSP}>
              <div>
                <div>{sp.TenSP}</div>
                <small style={{ color: '#999' }}>Mã: {sp.MaSP}</small>
              </div>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "SoLuong",
      render: (value, row, idx) => (
        <InputNumber
          min={1}
          value={value}
          onChange={val => updateRow(idx, "SoLuong", val)}
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "DonGia",
      render: (value, row, idx) => (
        <InputNumber
          min={0}
          value={value}
          onChange={val => updateRow(idx, "DonGia", val)}
          style={{ width: 120 }}
          formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={val => val.replace(/\$\s?|(,*)/g, '')}
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "ThanhTien",
      render: (value) => (
        <span>{value.toLocaleString()} VND</span>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      render: (_, __, idx) => (
        <Button 
          danger 
          icon={<MinusOutlined />}
          onClick={() => removeRow(idx)} 
          disabled={rows.length === 1}
        >
          Xóa
        </Button>
      ),
    },
  ];

  // Sửa lại phần dropdown nhà cung cấp
  const renderSupplierDropdown = () => {
    console.log("Rendering supplier dropdown with:", suppliers);
    
    return (
      <Form.Item 
        name="MaNCC" 
        label="Nhà cung cấp" 
        rules={[{ required: true, message: "Chọn nhà cung cấp!" }]}
      >
        <Select 
          showSearch 
          placeholder={loading ? "Đang tải..." : "Chọn nhà cung cấp"}
          optionFilterProp="children"
          loading={loading}
          style={{ width: '100%' }}
        >
          {suppliers && suppliers.length > 0 ? (
            suppliers.map((ncc) => (
              <Select.Option key={ncc.MaNCC} value={ncc.MaNCC}>
                {ncc.TenNCC}
              </Select.Option>
            ))
          ) : (
            <Select.Option value="" disabled>
              Không có dữ liệu nhà cung cấp
            </Select.Option>
          )}
        </Select>
      </Form.Item>
    );
  };

  // Thêm debug panel ở cuối component (trước return cuối cùng)
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>Tạo phiếu nhập hàng</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ NgayNhap: moment() }}
        >
          <Row gutter={16}>
            <Col span={8}>
              {renderSupplierDropdown()}
            </Col>
            <Col span={8}>
              <Form.Item 
                name="MaNhanVien" 
                label="Nhân viên nhập" 
                rules={[{ required: true, message: "Chọn nhân viên!" }]}
              >
                <Select 
                  showSearch 
                  placeholder="Chọn nhân viên"
                  optionFilterProp="children"
                  loading={loading}
                >
                  {users && users.length > 0 ? (
                    users.map(u => (
                      <Option key={u.MaNguoiDung} value={u.MaNguoiDung}>{u.HoTen}</Option>
                    ))
                  ) : (
                    <Option value="" disabled>
                      Không có dữ liệu nhân viên
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="NgayNhap" 
                label="Ngày nhập" 
                rules={[{ required: true, message: "Chọn ngày nhập!" }]}
              >
                <DatePicker 
                  showTime 
                  format="YYYY-MM-DD HH:mm:ss" 
                  style={{ width: "100%" }} 
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="GhiChu" label="Ghi chú">
            <Input.TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>

          <Card 
            title="Chi tiết sản phẩm" 
            extra={
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={addRow}
              >
                Thêm sản phẩm
              </Button>
            }
            style={{ marginBottom: 24 }}
          >
            <Table
              columns={columns}
              dataSource={rows}
              pagination={false}
              rowKey={(_, idx) => idx}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <strong>Tổng tiền:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>{calculateTotal().toLocaleString()} VND</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                </Table.Summary.Row>
              )}
            />
          </Card>

          <div style={{ textAlign: "right" }}>
            <Space>
              <Button 
                icon={<RollbackOutlined />}
                onClick={() => {
                  form.resetFields();
                  setRows([{ MaSP: undefined, SoLuong: 0, DonGia: 0, ThanhTien: 0 }]);
                }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                htmlType="submit" 
                loading={loading}
              >
                Lưu phiếu nhập
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateImport; 
import { message as antdMessage, Button, DatePicker, Form, InputNumber, Modal, Select, Space, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";

const { Option } = Select;

const CreateImport = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([
    { MaSP: undefined, SoLuong: 0, DonGia: 0, ThanhTien: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách sản phẩm, nhà cung cấp, nhân viên
  useEffect(() => {
    // Lấy danh sách sản phẩm
    axiosClient.get("/sanpham").then((res) => {
      if (res && res.data) setProducts(res.data);
    });
    // Lấy danh sách nhà cung cấp
    axiosClient.get("/nhacungcap").then((res) => {
      if (res && res.data) setSuppliers(res.data);
    });
    // Lấy danh sách nhân viên
    axiosClient.get("/nhanvien").then((res) => {
      if (res && res.data) setUsers(res.data);
    });
  }, []);

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

  // Xử lý submit
  const onFinish = async (values) => {
    if (rows.some(row => !row.MaSP || !row.SoLuong || !row.DonGia)) {
      antdMessage.error("Vui lòng nhập đầy đủ thông tin sản phẩm!");
      return;
    }
    Modal.confirm({
      title: "Xác nhận lưu phiếu nhập?",
      content: "Bạn có chắc chắn muốn lưu phiếu nhập này không?",
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
          style={{ width: 180 }}
        >
          {products.map(sp => (
            <Option key={sp.MaSP} value={sp.MaSP}>{sp.TenSP}</Option>
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
        <Button danger onClick={() => removeRow(idx)} disabled={rows.length === 1}>Xóa</Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", padding: 24, borderRadius: 8 }}>
      <h2 style={{ marginBottom: 24 }}>Tạo phiếu nhập hàng</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ NgayNhap: moment() }}
      >
        <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
          <Form.Item name="MaNCC" label="Nhà cung cấp" rules={[{ required: true, message: "Chọn nhà cung cấp!" }]}
            style={{ minWidth: 220 }}>
            <Select showSearch placeholder="Chọn nhà cung cấp">
              {suppliers.map(ncc => (
                <Option key={ncc.MaNCC} value={ncc.MaNCC}>{ncc.TenNCC}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="MaNhanVien" label="Nhân viên nhập" rules={[{ required: true, message: "Chọn nhân viên!" }]}
            style={{ minWidth: 220 }}>
            <Select showSearch placeholder="Chọn nhân viên">
              {users.map(u => (
                <Option key={u.MaNguoiDung} value={u.MaNguoiDung}>{u.HoTen}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="NgayNhap" label="Ngày nhập" rules={[{ required: true, message: "Chọn ngày nhập!" }]}
            style={{ minWidth: 180 }}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} />
          </Form.Item>
        </Space>
        <Table
          columns={columns}
          dataSource={rows}
          pagination={false}
          rowKey={(_, idx) => idx}
          footer={() => (
            <Button type="dashed" onClick={addRow} style={{ width: "100%" }}>+ Thêm sản phẩm</Button>
          )}
        />
        <div style={{ textAlign: "right", marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>Lưu</Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>Hủy</Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateImport; 
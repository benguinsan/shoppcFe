import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message } from "antd";
import {
  fetchCategories,
  fetchUpdateCategory,
} from "../../../redux/category/categoryAdminSlice";
import { useDispatch, useSelector } from "react-redux";
const { TextArea } = Input;
const { Option } = Select;

// Dữ liệu mẫu loại sản phẩm (giả lập)

const EditCategory = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.categoryAdmin);
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSelectChange = (categoryId) => {
    const selected = items?.data?.find((c) => c.MaLoaiSP === categoryId);
    if (selected) {
      form.setFieldsValue({
        categoryId: selected.MaLoaiSP, // Changed from id to categoryId
        name: selected.TenLoaiSP,
        description: selected.MoTa, // Changed from description to MoTa
      });
      setSelectedCategory(selected);
    }
  };

  const handleFinish = async (values) => {
    try {
      const categoryData = {
        MaLoaiSP: selectedCategory.MaLoaiSP,
        TenLoaiSP: values.name,
        MoTa: values.description,
        TrangThai: selectedCategory.TrangThai,
      };

      const result = await dispatch(fetchUpdateCategory(categoryData)).unwrap();

      if (result.success) {
        message.success(result.message || "Cập nhật loại sản phẩm thành công!");
        dispatch(fetchCategories()); // Refresh danh sách
        form.resetFields();
      } else {
        throw new Error(result.message || "Cập nhật loại sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật loại sản phẩm:", error);
      message.error(`Lỗi: ${error.message}`);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 500, margin: "auto", padding: 20 }}
    >
      <Form.Item
        label="Mã loại sản phẩm"
        name="id"
        rules={[{ required: true, message: "Vui lòng chọn mã loại sản phẩm" }]}
      >
        <Select
          placeholder="Chọn mã loại sản phẩm"
          onChange={handleSelectChange}
          loading={loading}
        >
          {items?.data &&
            items.data.map((category) => (
              <Option key={category.MaLoaiSP} value={category.MaLoaiSP}>
                {category.MaLoaiSP} - {category.TenLoaiSP}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Tên loại sản phẩm"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên loại sản phẩm" }]}
      >
        <Input placeholder="Nhập tên loại sản phẩm" />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
      >
        <TextArea rows={3} placeholder="Nhập mô tả loại sản phẩm" />
      </Form.Item>

      <Form.Item style={{ textAlign: "center" }}>
        <Button type="primary" htmlType="submit">
          Cập nhật loại sản phẩm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditCategory;

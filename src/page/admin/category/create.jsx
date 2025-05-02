import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
  fetchCreateCategory,
  fetchCategories,
} from "../../../redux/category/categoryAdminSlice";
import { useDispatch } from "react-redux";
const { TextArea } = Input;

const CreateCategory = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      const categoryData = {
        TenLoaiSP: values.name,
        MoTa: values.description,
        TrangThai: true,
      };

      const result = await dispatch(fetchCreateCategory(categoryData)).unwrap();

      if (result.success) {
        message.success(result.message || "Tạo loại sản phẩm thành công!");
        dispatch(fetchCategories()); // Fetch the updated list of categories
        form.resetFields();
      } else {
        throw new Error(result.message || "Tạo loại sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi tạo loại sản phẩm:", error);
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
          Tạo loại sản phẩm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateCategory;

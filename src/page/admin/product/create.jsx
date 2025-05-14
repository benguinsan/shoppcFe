import { useEffect, React, useState } from "react";

import {
  InputNumber,
  Button,
  DatePicker,
  Form,
  Upload,
  Input,
  Select,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreateProduct,
  fetchProducts,
} from "../../../redux/product/productAdminSlice";
import { fetchCategories } from "../../../redux/category/categoryAdminSlice";

const { TextArea } = Input;
const { Option } = Select;

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "upload_file"); // từ Cloudinary settings
  formData.append("cloud_name", "djxejkjre");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/djxejkjre/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url; // URL ảnh public
};

const ProductCreate = () => {
  const dispatch = useDispatch();
  // Lấy dữ liệu từ Redux store và truy cập vào data
  const categories = useSelector(
    (state) => state.categoryAdmin.items?.data || []
  );
  const [selectedType, setSelectedType] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Log để kiểm tra dữ liệu
  useEffect(() => {
    console.log("Categories from Redux:", categories);
  }, [categories]);

  const handleCategoryChange = (value) => {
    const found = categories.find((type) => type.MaLoaiSP === value);
    setSelectedType(found);
  };

  const handleFinish = async (values) => {
    try {
      console.log("Starting handleFinish with values:", values);
      const imageFile = values.image?.[0]?.originFileObj;
      let imgUrl = "";

      if (imageFile) {
        console.log("Uploading image file:", imageFile);
        try {
          imgUrl = await uploadToCloudinary(imageFile);
          console.log("Image uploaded successfully, URL:", imgUrl);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          message.error("Lỗi khi tải lên hình ảnh!");
          return;
        }
      }

      // Bảo toàn định dạng xuống dòng trong mô tả
      const formattedDescription = values.description?.trim() || "";

      const productData = {
        MaLoaiSP: values.categoryCode,
        TenSP: values.name,
        MoTa: formattedDescription,
        CPU: values.cpu || "",
        RAM: values.ram || "",
        GPU: values.gpu || "",
        Storage: values.storage || "",
        ManHinh: values.screen || "",
        Gia: values.price,
        tg_baohanh: values.tg_baohanh,
        ImgUrl: imgUrl,
        TrangThai: true,
      };

      console.log("Sending product data to server:", productData);

      const result = await dispatch(fetchCreateProduct(productData)).unwrap();
      console.log("Server response:", result);

      if (result.success) {
        message.success("Tạo sản phẩm thành công!");
        form.resetFields();
      } else {
        throw new Error(result.message || "Tạo sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Error in handleFinish:", error);
      message.error(`Lỗi khi tạo sản phẩm: ${error.message}`);
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 600, margin: "auto", padding: 20 }}
    >
      <Form.Item
        label="Mã loại sản phẩm"
        name="categoryCode"
        rules={[{ required: true, message: "Vui lòng chọn mã loại" }]}
      >
        <Select
          placeholder="Chọn mã loại sản phẩm"
          onChange={handleCategoryChange}
          allowClear
        >
          {Array.isArray(categories) && categories.length > 0 ? (
            categories
              .filter((type) => type.TrangThai == true) // Thêm filter cho TrangThai = true
              .map((type) => (
                <Option key={type.MaLoaiSP} value={type.MaLoaiSP}>
                  {type.MaLoaiSP} - {type.TenLoaiSP}
                </Option>
              ))
          ) : (
            <Option value="" disabled>
              Không có dữ liệu
            </Option>
          )}
        </Select>
      </Form.Item>

      {selectedType && (
        <div style={{ marginBottom: 16, fontStyle: "italic", color: "#888" }}>
          <strong>{selectedType.TenLoaiSP}</strong>: {selectedType.MoTa}
        </div>
      )}

      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
      >
        <Input placeholder="Nhập tên sản phẩm" />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
      >
        <TextArea
          placeholder="Nhập mô tả sản phẩm"
          autoSize={{ minRows: 4, maxRows: 100 }}
          showCount={false}
          style={{ whiteSpace: "pre-wrap" }}
        />
      </Form.Item>

      <Form.Item label="CPU" name="cpu">
        <Input placeholder="Nhập thông tin CPU" />
      </Form.Item>

      <Form.Item label="GPU" name="gpu">
        <Input placeholder="Nhập thông tin GPU" />
      </Form.Item>

      <Form.Item label="RAM" name="ram">
        <Input placeholder="Nhập dung lượng RAM" />
      </Form.Item>

      <Form.Item label="Storage" name="storage">
        <Input placeholder="Nhập dung lượng lưu trữ" />
      </Form.Item>

      <Form.Item label="Màn hình" name="screen">
        <Input placeholder="Nhập kích thước/độ phân giải màn hình" />
      </Form.Item>

      <Form.Item
        label="Giá (VNĐ)"
        name="price"
        rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          placeholder="Nhập giá sản phẩm"
        />
      </Form.Item>

      <Form.Item
        label="Thời gian bảo hành"
        name="tg_baohanh"
        rules={[
          { required: true, message: "Vui lòng nhập thời gian bảo hành" },
        ]}
      >
        <InputNumber
          min={12}
          max={24}
          style={{ width: "100%" }}
          placeholder="Nhập giá thời gian bảo hành"
        />
      </Form.Item>

      <Form.Item
        label="Hình ảnh"
        name="image"
        valuePropName="fileList"
        getValueFromEvent={(e) => e && e.fileList}
        rules={[{ required: true, message: "Vui lòng tải lên hình ảnh" }]}
      >
        <Upload beforeUpload={() => false} maxCount={1}>
          <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
        </Upload>
      </Form.Item>

      <Form.Item style={{ textAlign: "center" }}>
        <Button type="primary" htmlType="submit">
          Tạo sản phẩm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductCreate;

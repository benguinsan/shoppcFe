import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Select,
  message,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchAllProducts,
  fetchEditProduct,
} from "../../../redux/product/productAdminSlice";
import { fetchCategories } from "../../../redux/category/categoryAdminSlice";

const { TextArea } = Input;
const { Option } = Select;

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "upload_file");
  formData.append("cloud_name", "djxejkjre");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/djxejkjre/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};

const ProductEdit = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { allProducts, loading } = useSelector((state) => state.productAdmin);
  const categoryState = useSelector((state) => state.categoryAdmin);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleProductSelect = (productId) => {
    const product = allProducts.find((p) => p.MaSP === productId);
    if (product) {
      form.setFieldsValue({
        id: product.MaSP,
        categoryCode: product.MaLoaiSP,
        name: product.TenSP,
        description: product.MoTa,
        cpu: product.CPU,
        gpu: product.GPU,
        ram: product.RAM,
        storage: product.Storage,
        screen: product.ManHinh,
        price: product.Gia,
        tg_baohanh: product.tg_baohanh,
        image: [],
      });
      setSelectedProduct(product);
    }
  };

  const handleFinish = async (values) => {
    try {
      console.log("Form values on submit:", values);
      console.log("values.image:", values.image);

      let imgUrl = selectedProduct?.ImgUrl || "";
      const imageFile = values.image?.[0]?.originFileObj;

      if (imageFile) {
        console.log("Starting upload for file:", imageFile);
        imgUrl = await uploadToCloudinary(imageFile);
        console.log("Upload successful, new URL:", imgUrl);
      } else {
        console.log("No new image selected, using existing URL:", imgUrl);
        if (!imgUrl) {
          message.error("Vui lòng chọn một hình ảnh!");
          return;
        }
      }

      const productData = {
        MaSP: values.id,
        MaLoaiSP: values.categoryCode,
        TenSP: values.name,
        MoTa: values.description?.trim() || "",
        CPU: values.cpu || "",
        RAM: values.ram || "",
        GPU: values.gpu || "",
        Storage: values.storage || "",
        ManHinh: values.screen || "",
        Gia: values.price,
        tg_baohanh: values.tg_baohanh,
        ImgUrl: imgUrl || selectedProduct.ImgUrl,
        TrangThai: true,
      };

      const result = await dispatch(fetchEditProduct(productData)).unwrap();

      if (result.success) {
        message.success(result.message || "Cập nhật sản phẩm thành công!");
        form.resetFields();
        setSelectedProduct(null);
      } else {
        throw new Error(result.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      message.error(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: 600, margin: "auto", padding: 20 }}
      >
        <Form.Item
          label="Mã sản phẩm"
          name="id"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
          <Select placeholder="Chọn sản phẩm" onChange={handleProductSelect}>
            {allProducts.map((product) => (
              <Option key={product.MaSP} value={product.MaSP}>
                {product.MaSP} - {product.TenSP}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Mã loại sản phẩm"
          name="categoryCode"
          rules={[{ required: true, message: "Vui lòng chọn mã loại" }]}
        >
          <Select
            placeholder="Chọn mã loại sản phẩm"
            loading={categoryState.loading}
          >
            {categoryState.items?.data &&
              categoryState.items.data
                .filter((category) => category.TrangThai == true) // Add filter for active categories
                .map((category) => (
                  <Option key={category.MaLoaiSP} value={category.MaLoaiSP}>
                    {category.MaLoaiSP} - {category.TenLoaiSP}
                  </Option>
                ))}
          </Select>
        </Form.Item>

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
          getValueFromEvent={(e) => {
            console.log("Upload event details:", e);
            return e?.fileList;
          }}
        >
          {selectedProduct && selectedProduct.ImgUrl && (
            <div style={{ marginBottom: 16 }}>
              <img
                src={selectedProduct.ImgUrl}
                alt="Ảnh hiện tại"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginRight: "8px",
                }}
              />
              <div style={{ color: "#666", marginTop: 8 }}>Ảnh hiện tại</div>
            </div>
          )}
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            listType="picture"
            accept="image/*"
            showUploadList={{ showRemoveIcon: true }}
            onChange={(info) => {
              console.log("Upload onChange info:", info.fileList);
              form.setFieldsValue({ image: info.fileList });
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh mới</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            Cập nhật sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default ProductEdit;

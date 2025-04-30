import React, { useEffect } from "react";
import { Form, Input, Button, Card, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createSupplier,
  resetActionStatus,
} from "../../../redux/admin/supplierSlice";
import { action_status } from "../../../utils/constants/status";

const { Option } = Select;

const CreateSupplier = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actionStatus, error, loading } = useSelector(
    (state) => state.supplier
  );

  // Theo dõi trạng thái action
  useEffect(() => {
    if (actionStatus === action_status.SUCCEEDED) {
      message.success("Thêm nhà cung cấp thành công");
      dispatch(resetActionStatus());
      navigate("/admin/suppliers");
    } else if (actionStatus === action_status.FAILED) {
      if (error && error.includes("validation")) {
        try {
          // Nếu có lỗi validation từ server
          const errorObj = JSON.parse(error.substring(error.indexOf("{")));
          Object.keys(errorObj).forEach((field) => {
            form.setFields([
              {
                name: field,
                errors: [errorObj[field]],
              },
            ]);
          });
        } catch (e) {
          message.error("Không thể thêm nhà cung cấp");
        }
      } else {
        message.error("Không thể thêm nhà cung cấp");
      }
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, navigate, form]);

  // Hàm xử lý khi submit form
  const onFinish = (values) => {
    dispatch(createSupplier(values));
  };

  return (
    <Card title="Thêm nhà cung cấp mới" className="shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="TenNCC"
          label="Tên nhà cung cấp"
          rules={[
            { required: true, message: "Vui lòng nhập tên nhà cung cấp" },
            {
              max: 100,
              message: "Tên nhà cung cấp không được vượt quá 100 ký tự",
            },
          ]}
        >
          <Input placeholder="Nhập tên nhà cung cấp" />
        </Form.Item>

        <Form.Item
          name="DiaChi"
          label="Địa chỉ"
          rules={[
            { max: 255, message: "Địa chỉ không được vượt quá 255 ký tự" },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Nhập địa chỉ nhà cung cấp" />
        </Form.Item>

        <Form.Item
          name="SDT"
          label="Số điện thoại"
          rules={[
            {
              pattern: /^[0-9]{10,11}$/,
              message: "Số điện thoại không hợp lệ (10-11 số)",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="Email"
          label="Email"
          rules={[
            { type: "email", message: "Email không hợp lệ" },
            { max: 100, message: "Email không được vượt quá 100 ký tự" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => navigate("/admin/suppliers")}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || actionStatus === action_status.LOADING}
              className="confirm-button"
            >
              Xác nhận
            </Button>
          </div>
        </Form.Item>
        <style jsx global>{`
          .confirm-button {
            background-color: #1890ff !important;
            border-color: #1890ff !important;
            color: white !important;
          }
          .confirm-button:hover {
            background-color: #096dd9 !important;
            border-color: #096dd9 !important;
          }
        `}</style>
      </Form>
    </Card>
  );
};

export default CreateSupplier;

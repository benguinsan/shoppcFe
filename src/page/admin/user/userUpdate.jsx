import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditUser, fetchUserById } from '../../../redux/admin/userAdminSlice';

const { Item: FormItem } = Form;

const UserUpdate = ({ visible, onCancel, userId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Lấy thông tin người dùng từ Redux store
  const { loading: storeLoading } = useSelector((state) => state.userAdmin);

  // Fetch thông tin người dùng khi component mount hoặc userId thay đổi
  useEffect(() => {
    if (visible && userId) {
      setLoading(true);
      dispatch(fetchUserById(userId))
        .unwrap()
        .then((result) => {
          if (result.success && result.data) {
            setUserData(result.data);
            
            // Cập nhật form với dữ liệu người dùng
            form.setFieldsValue({
              MaNguoiDung: userId,
              HoTen: result.data.HoTen,
              Email: result.data.Email,
              SDT: result.data.SDT,
              DiaChi: result.data.DiaChi,
            });
          } else {
            message.error("Không thể lấy thông tin người dùng");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          message.error(`Lỗi khi lấy thông tin người dùng: ${error.message}`);
          setLoading(false);
        });
    }
  }, [dispatch, visible, userId, form]);

  // Reset form khi modal đóng
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setUserData(null);
    }
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Chuẩn bị dữ liệu để gửi lên API
      const updateData = {
        HoTen: values.HoTen,
        Email: values.Email,
        SDT: values.SDT,
        DiaChi: values.DiaChi,
      };
      
      // Gọi API thông qua Redux action
      const result = await dispatch(fetchEditUser({ userId, data: updateData })).unwrap();
      
      if (result.success) {
        message.success("Cập nhật thông tin người dùng thành công!");
        // Reset form
        form.resetFields();
        // Đóng modal
        onCancel();
      } else {
        throw new Error(result.message || "Cập nhật thông tin người dùng thất bại");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      message.error(`Lỗi khi cập nhật thông tin người dùng: ${error.message}`);
    }
  };

  return (
    <Modal
      title="Cập nhật thông tin người dùng"
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Cập nhật
        </Button>,
      ]}
    >
      {loading || storeLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          name="update_user_form"
        >
          <FormItem
            name="MaNguoiDung"
            label="Mã người dùng"
          >
            <Input 
              value={userId} 
              disabled={true}
              className="bg-gray-100 cursor-not-allowed" 
            />
          </FormItem>

          <FormItem
            name="HoTen"
            label="Họ tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên!' },
              { min: 3, message: 'Họ tên phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập họ tên" />
          </FormItem>

          <FormItem
            name="Email"
            label="Email"
            rules={[
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </FormItem>

          <FormItem
            name="SDT"
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </FormItem>

          <FormItem
            name="DiaChi"
            label="Địa chỉ"
          >
            <Input.TextArea 
              placeholder="Nhập địa chỉ" 
              rows={3} 
              showCount 
              maxLength={200} 
            />
          </FormItem>
        </Form>
      )}
    </Modal>
  );
};

export default UserUpdate;

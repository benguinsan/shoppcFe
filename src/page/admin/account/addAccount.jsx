import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateAccount, fetchAccounts } from '../../../redux/admin/accountAdminSlice';
import { fetchRoles } from '../../../redux/admin/roleAdminSlice';

const { Option } = Select;
const { Item: FormItem } = Form;

const AddAccount = ({ visible, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  
  // // Lấy danh sách nhóm quyền từ Redux store
  const { dataSource, loading: rolesLoading } = useSelector((state) => state.roleAdmin);
  const filteredRoles = Array.isArray(dataSource) ? dataSource.filter(role => role.MaNhomQuyen !== 'ADMIN') : [];

  // // Fetch danh sách nhóm quyền khi component mount
  useEffect(() => {
    if (visible) {
      dispatch(fetchRoles({ page: 0, limit: 10 })); 
    }
  }, [dispatch, visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Chuẩn bị dữ liệu để gửi lên API
      const accountData = {
        TenTK: values.TenTK,
        MatKhau: values.MatKhau,
        HoTen: values.HoTen,
        MaNhomQuyen: values.MaNhomQuyen,
        TrangThai: 1
      };
      
      // Gọi API thông qua Redux action
      const result = await dispatch(fetchCreateAccount(accountData)).unwrap();
    
      if (result.success) {
        message.success("Tạo tài khoản thành công!");
        // Refresh danh sách tài khoản
        dispatch(fetchAccounts({ page: 0, limit: 10 }));
        // Reset form
        form.resetFields();
        // Đóng modal
        onCancel();
        // Gọi callback onSuccess nếu cần
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        throw new Error(result.message || "Tạo tài khoản thất bại");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      message.error(`Lỗi khi tạo tài khoản: ${error.message}`);
    }
  };

  return (
    <Modal
      title="Thêm tài khoản mới"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} className="bg-blue-500">
          Thêm
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="add_account_form"
      >
        <FormItem
          name="TenTK"
          label="Tên tài khoản"
          rules={[
            { required: true, message: 'Vui lòng nhập tên tài khoản!' },
            { min: 3, message: 'Tên tài khoản phải có ít nhất 3 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên tài khoản" />
        </FormItem>

        <FormItem
          name="HoTen"
          label="Họ tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ tên!' },
            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập họ tên người dùng" />
        </FormItem>

        <FormItem
          name="MatKhau"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </FormItem>

        <FormItem
          name="XacNhanMatKhau"
          label="Xác nhận mật khẩu"
          dependencies={['MatKhau']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('MatKhau') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </FormItem>

        <FormItem
          name="MaNhomQuyen"
          label="Nhóm quyền"
          rules={[{ required: true, message: 'Vui lòng chọn nhóm quyền!' }]}
        >
          <Select 
            placeholder="Chọn nhóm quyền"
            loading={rolesLoading}
            notFoundContent={rolesLoading ? <Spin size="small" /> : null}
          >
            {Array.isArray(filteredRoles) && filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <Option key={role.MaNhomQuyen} value={role.MaNhomQuyen}>
                  {role.TenNhomQuyen}
                </Option>
              ))
            ) : (
              <Option value="" disabled>
                Không có dữ liệu nhóm quyền
              </Option>
            )}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default AddAccount;

import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditAccount, fetchAccountById } from '../../../redux/admin/accountAdminSlice';
import { fetchRoles } from '../../../redux/admin/roleAdminSlice';

const { Option } = Select;
const { Item: FormItem } = Form;

const UpdateAccount = ({ visible, onCancel, accountId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  // Lấy thông tin tài khoản và danh sách nhóm quyền từ Redux store
  const { currentAccount } = useSelector((state) => state.accountAdmin);

  const { dataSource: roles, loading: rolesLoading } = useSelector((state) => state.roleAdmin);

  // Fetch thông tin tài khoản khi component mount hoặc accountId thay đổi
  useEffect(() => {
    if (visible && accountId) {
      setLoading(true);
      dispatch(fetchAccountById(accountId))
        .unwrap()
        .then(() => setLoading(false))
        .catch((error) => {
          message.error(`Lỗi khi lấy thông tin tài khoản: ${error.message}`);
          setLoading(false);
        });
      
      // Fetch danh sách nhóm quyền
      dispatch(fetchRoles({ page: 0, limit: 100 }));
    }
  }, [dispatch, visible, accountId]);

  // Cập nhật form khi currentAccount thay đổi
  useEffect(() => {
    if (currentAccount) {
      form.setFieldsValue({
        TenTK: currentAccount.TenTK,
        HoTen: currentAccount.HoTen,
        MaNhomQuyen: currentAccount.MaNhomQuyen,
        TrangThai: currentAccount.TrangThai,
      });
    }
  }, [currentAccount, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Chuẩn bị dữ liệu để gửi lên API
      const accountData = {
        // TenTK: values.TenTK,
        // HoTen: values.HoTen,
        MaNhomQuyen: values.MaNhomQuyen,
        TrangThai: values.TrangThai,
      };
      
      // Nếu người dùng nhập mật khẩu mới
      if (values.MatKhau) {
        accountData.MatKhau = values.MatKhau;
      }
      
      // Gọi API thông qua Redux action
      const result = await dispatch(fetchEditAccount({ 
        accountId: accountId, 
        data: accountData 
      })).unwrap();
      
      if (result.success) {
        message.success("Cập nhật tài khoản thành công!");
        // Reset form
        form.resetFields();
        // Đóng modal
        onCancel();
       
      } else {
        throw new Error(result.message || "Cập nhật tài khoản thất bại");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      message.error(`Lỗi khi cập nhật tài khoản: ${error.message}`);
    }
  };

  // Lọc danh sách nhóm quyền (nếu cần)
  const filteredRoles = Array.isArray(roles) ? roles.filter(role => role.MaNhomQuyen !== 'ADMIN') : [];

  return (
    <Modal
      title="Cập nhật tài khoản"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} className="bg-blue-500" loading={loading}>
          Cập nhật
        </Button>,
      ]}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          name="update_account_form"
        >
          <FormItem
            name="TenTK"
            label="Tên tài khoản"
            rules={[
              { required: true, message: 'Vui lòng nhập tên tài khoản!' },
              { min: 3, message: 'Tên tài khoản phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input disabled={true} />
          </FormItem>

          <FormItem
            name="MatKhau"
            label="Mật khẩu mới (để trống nếu không thay đổi)"
            rules={[
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </FormItem>

          <FormItem
            name="XacNhanMatKhau"
            label="Xác nhận mật khẩu mới"
            dependencies={['MatKhau']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue('MatKhau') || !value || getFieldValue('MatKhau') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
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
              {filteredRoles.length > 0 ? (
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

          <FormItem
            name="TrangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value={1}>Hoạt động</Option>
              <Option value={0}>Bị khóa</Option>
            </Select>
          </FormItem>
        </Form>
      )}
    </Modal>
  );
};

export default UpdateAccount;

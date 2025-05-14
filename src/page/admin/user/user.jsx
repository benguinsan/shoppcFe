import React, { useState, useEffect } from 'react';
import { Space, Input, Popconfirm, message, Card, Tag } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../../redux/admin/userAdminSlice';
import AdminTable from '../../../components/admin/ui/table';
import UserUpdate from './userUpdate';

const User = () => {

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Lấy dữ liệu người dùng từ API
  const { dataSource, pageNo, pageSize, totalElements, loading } = useSelector((state) => state.userAdmin);
  const [sortedInfo, setSortedInfo] = useState({});

  // Lấy dữ liệu người dùng từ API
  useEffect(() => {
    dispatch(fetchUsers({ page: 0, limit: pageSize }));
  }, [dispatch, pageSize]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    dispatch(
      fetchUsers({
        page: pagination.current - 1,
        limit: pagination.pageSize,
      })
    );
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredUsers = dataSource.filter(user => 
    (user.HoTen && user.HoTen.toLowerCase().includes(searchText.toLowerCase())) ||
    (user.Email && user.Email.toLowerCase().includes(searchText.toLowerCase())) ||
    (user.SDT && user.SDT.includes(searchText)) ||
    (user.MaNguoiDung && user.MaNguoiDung.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Xử lý chỉnh sửa người dùng
  const handleEdit = (userId) => {
    setCurrentUserId(userId);
    setIsUpdateModalVisible(true);
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: 'Mã người dùng',
      dataIndex: 'MaNguoiDung',
      key: 'MaNguoiDung',
      width: 150,
    },
    {
      title: 'Họ tên',
      dataIndex: 'HoTen',
      key: 'HoTen',
      sorter: (a, b) => a.HoTen.localeCompare(b.HoTen),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'SDT',
      key: 'SDT',
      render: (sdt) => sdt || <Tag color="red">Chưa cập nhật</Tag>,
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
      render: (email) => email || <Tag color="red">Chưa cập nhật</Tag>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'DiaChi',
      key: 'DiaChi',
      render: (diaChi) => diaChi || <Tag color="red">Chưa cập nhật</Tag>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button 
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-300 shadow-sm"
            onClick={() => handleEdit(record.MaNguoiDung)}
          >
            <EditOutlined className="mr-1" /> Sửa
          </button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý người dùng" className="w-full shadow-md">
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo tên, email, số điện thoại, mã người dùng..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-80"
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>
      <AdminTable
        columns={columns}
        dataSource={filteredUsers}
        rowKey="MaNguoiDung"
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
        loading={loading}
        handleChange={handleChange}
        className="shadow-sm"
      />

      {/* Modal cập nhật thông tin người dùng */}
      <UserUpdate 
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        userId={currentUserId}
      />
    </Card>
  );
};

export default User; 
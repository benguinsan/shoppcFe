import React, { useState, useEffect } from 'react';
import { Table, Space, Input, message, Card, Tag, Select } from 'antd';
import { SearchOutlined, EditOutlined, LockOutlined, UnlockOutlined, UserAddOutlined } from '@ant-design/icons';
import AddAccount from './addAccount';
import UpdateAccount from './updateAccount';
import { fetchAccounts, fetchChangeStatusAccount } from '../../../redux/admin/accountAdminSlice';
import { useDispatch, useSelector } from 'react-redux';
import AdminTable from '../../../components/admin/ui/table';



const { Option } = Select;

const Account = () => {
  const dispatch = useDispatch();
 
  const[accounts, setAccounts] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState(null);

  const { dataSource, pageNo, pageSize, totalElements, loading } = useSelector((state) => state.accountAdmin);
  const [sortedInfo, setSortedInfo] = useState({});


  // Lấy dữ liệu tài khoản từ API
  useEffect(() => {
    dispatch(fetchAccounts({ page: 0, limit: pageSize }));
  }, [dispatch, pageSize]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    dispatch(
      fetchAccounts({
        page: pagination.current - 1,
        limit: pagination.pageSize,
      })
    );
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredAccounts = dataSource.filter(dataSource => 
    (dataSource.MaTK && dataSource.MaTK.toLowerCase().includes(searchText.toLowerCase())) ||
    (dataSource.TenTK && dataSource.TenTK.toLowerCase().includes(searchText.toLowerCase())) ||
    (dataSource.MaNguoiDung && dataSource.MaNguoiDung.toLowerCase().includes(searchText.toLowerCase())) ||
    (dataSource.MaNhomQuyen && dataSource.MaNhomQuyen.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Xử lý thêm tài khoản mới
  const handleAddAccount = () => {
    setIsAddModalVisible(true);
  };

  // Xử lý chỉnh sửa tài khoản
  const handleEdit = (accountId) => {
    setCurrentAccountId(accountId);
    setIsUpdateModalVisible(true);
  };

  // Xử lý thay đổi trạng thái tài khoản
  const handleToggleStatus = (accountId, currentStatus) => {
    // Gọi API thông qua Redux action
    dispatch(fetchChangeStatusAccount(accountId))
      .unwrap()
      .then((result) => {
        if (result.success) {
          message.success(`Đã ${currentStatus === 1 ? 'khóa' : 'kích hoạt'} tài khoản thành công`);
          // // Refresh danh sách tài khoản
          dispatch(fetchAccounts({ page: pageNo, limit: pageSize }));
        } else {
          throw new Error(result.message || `Không thể ${currentStatus === 1 ? 'khóa' : 'kích hoạt'} tài khoản`);
        }
      })
      .catch((error) => {
        console.error("Error toggling account status:", error);
        message.error(`Lỗi khi thay đổi trạng thái tài khoản: ${error.message}`);
      });
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: 'Mã tài khoản',
      dataIndex: 'MaTK',
      key: 'MaTK',
      width: 150,
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'TenTK',
      key: 'TenTK',
      sorter: (a, b) => a.TenTK.localeCompare(b.TenTK),
    },
    {
      title: 'Mật khẩu',
      dataIndex: 'MatKhau',
      key: 'MatKhau',
      render: (matKhau) => (
        <span className="text-gray-500">••••••••••</span>
      ),
    },
    {
      title: 'Mã người dùng',
      dataIndex: 'MaNguoiDung',
      key: 'MaNguoiDung',
    },
    {
      title: 'Nhóm quyền',
      dataIndex: 'MaNhomQuyen',
      key: 'MaNhomQuyen',
      filters: [
        { text: 'Admin', value: 'ADMIN' },
        { text: 'Khách hàng', value: 'KHACHHANG' },
        { text: 'Quản lý sản phẩm', value: 'QLSP1' },
      ],
      onFilter: (value, record) => record.MaNhomQuyen === value,
      render: (maNhomQuyen) => {
        let color = 'blue';
        let nhomQuyen = maNhomQuyen;
        
        if (maNhomQuyen === 'ADMIN') {
          color = 'red';
          nhomQuyen = 'Admin';
        } else if (maNhomQuyen === 'KHACHHANG') {
          color = 'green';
          nhomQuyen = 'Khách hàng';
        } else if (maNhomQuyen === 'QLSP1') {
          color = 'orange';
          nhomQuyen = 'Quản lý sản phẩm';
        }
        
        return (
          <Tag color={color}>
            {nhomQuyen}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'TrangThai',
      key: 'TrangThai',
      filters: [
        { text: 'Hoạt động', value: 1 },
        { text: 'Bị khóa', value: 0 },
      ],
      onFilter: (value, record) => record.TrangThai === value,
      render: (trangThai) => (
        <Tag color={trangThai === 1 ? 'green' : 'red'}>
          {trangThai === 1 ? 'Hoạt động' : 'Bị khóa'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button 
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-300 shadow-sm"
            onClick={() => handleEdit(record.MaTK)}
          >
            <EditOutlined className="mr-1" /> Sửa
          </button>
          <button 
            className={`flex items-center ${record.TrangThai === 1 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded-md text-sm transition-colors duration-300 shadow-sm`}
            onClick={() => handleToggleStatus(record.MaTK, record.TrangThai)}
          >
            {record.TrangThai === 1 ? (
              <>
                <LockOutlined className="mr-1" /> Khóa
              </>
            ) : (
              <>
                <UnlockOutlined className="mr-1" /> Mở khóa
              </>
            )}
          </button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý tài khoản" className="w-full shadow-md">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm theo tên tài khoản, mã tài khoản, mã người dùng, nhóm quyền..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-80"
          prefix={<SearchOutlined />}
          allowClear
        />
        <button 
          className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-300 shadow-sm"
          onClick={handleAddAccount}
        >
          <UserAddOutlined className="mr-2" /> Thêm tài khoản
        </button>
      </div>
      <AdminTable
        columns={columns}
        dataSource={filteredAccounts}
        rowKey="MaTK"
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
        loading={loading}
        handleChange={handleChange}
        className="shadow-sm"
      />

      {/* Modal thêm tài khoản */}
      <AddAccount 
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
      />

      {/* Modal cập nhật tài khoản */}
      <UpdateAccount 
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        accountId={currentAccountId}
      />
    </Card>
  );
};

export default Account;
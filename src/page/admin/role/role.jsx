import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Form, Input, Checkbox, Space, message, Spin, Popconfirm, Tag, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
// Giả sử bạn sẽ tạo các action này trong roleAdminSlice
import { fetchRoles, fetchCreateRole, fetchUpdateRole, fetchDeleteRole, fetchAllFunctions, fetchRoleFunctions, fetchRoleById } from "../../../redux/admin/roleAdminSlice";
import AdminTable from "../../../components/admin/ui/table";

const { Item: FormItem } = Form;
const { Option } = Select;

const Role = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState(null);
  const [sortedInfo, setSortedInfo] = useState({});


  // Lấy dữ liệu từ Redux store
  const roleAdmin = useSelector((state) => state.roleAdmin || {});
  const { 
    dataSource = [], 
    pageNo = 0, 
    pageSize = 10, 
    totalElements = 0, 
    loading = false,
    allFunctions = [] // Lấy danh sách tất cả chức năng từ store
  } = roleAdmin;

  // Lấy danh sách nhóm quyền khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching roles with page:", pageNo, "limit:", pageSize);
        await dispatch(fetchRoles({ page: pageNo, limit: pageSize })).unwrap();
        console.log("Roles fetched successfully");
      } catch (error) {
        console.error("Error fetching roles:", error);
        message.error("Không thể tải danh sách nhóm quyền: " + (error.message || "Lỗi không xác định"));
      }
    };
    
    fetchData();
  }, [dispatch, pageNo, pageSize]);

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Lọc dữ liệu theo tìm kiếm
  const filteredRoles = Array.isArray(dataSource) 
    ? dataSource.filter(role => 
        (role?.MaNhomQuyen && role.MaNhomQuyen.toLowerCase().includes(searchText.toLowerCase())) ||
        (role?.TenNhomQuyen && role.TenNhomQuyen.toLowerCase().includes(searchText.toLowerCase()))
      )
    : [];

  // Xử lý thay đổi phân trang và sắp xếp
  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    const newPage = pagination.current - 1;
    console.log("Changing page to:", newPage, "pageSize:", pagination.pageSize);
    dispatch(fetchRoles({
      page: newPage,
      limit: pagination.pageSize
    }));
  };

  // Mở modal thêm nhóm quyền mới
  const showAddModal = async () => {
    setIsEditing(false);
    setCurrentRoleId(null);
    setSelectedPermissions([]);
    form.resetFields();
    
    try {
      // Gọi API để lấy danh sách tất cả chức năng
      await dispatch(fetchAllFunctions()).unwrap();
      console.log("All functions fetched successfully");
    } catch (error) {
      console.error("Error fetching functions:", error);
      message.error("Không thể tải danh sách chức năng: " + (error.message || "Lỗi không xác định"));
    }
    
    setIsModalVisible(true);
  };

  // Mở modal chỉnh sửa nhóm quyền
  const showEditModal = async (role) => {
    setIsEditing(true);
    setCurrentRoleId(role.MaNhomQuyen);
    
    try {
      // Gọi API để lấy thông tin chi tiết của nhóm quyền
      const roleDetail = await dispatch(fetchRoleById(role.MaNhomQuyen)).unwrap();
      console.log("Role detail fetched successfully:", roleDetail);
      
      // Gọi API để lấy danh sách tất cả chức năng
      await dispatch(fetchAllFunctions()).unwrap();
      
      // Gọi API để lấy danh sách chức năng của nhóm quyền
      const result = await dispatch(fetchRoleFunctions(role.MaNhomQuyen)).unwrap();
      console.log("Role functions API response:", result);
      
      // Trích xuất mảng MaChucNang từ cấu trúc dữ liệu đặc biệt
      let functionIds = [];
      
      // Kiểm tra xem result có phải là mảng không
      if (Array.isArray(result)) {
        // Lọc bỏ thuộc tính roleId và chỉ lấy các phần tử là đối tượng
        const functionObjects = result.filter(item => typeof item === 'object' && item !== null && !('roleId' in item));
        
        // Trích xuất MaChucNang từ các đối tượng
        functionIds = functionObjects.map(item => {
          if (item && item.MaChucNang) {
            return item.MaChucNang;
          }
          return null;
        }).filter(id => id !== null); // Lọc bỏ các giá trị null
        
        console.log("Extracted MaChucNang from array:", functionIds);
      } 
      // Kiểm tra xem result có thuộc tính số (0, 1, 2, ...) và roleId không
      else if (result && typeof result === 'object' && 'roleId' in result) {
        // Lấy tất cả các key là số trong result
        const numericKeys = Object.keys(result).filter(key => !isNaN(Number(key)));
        
        // Trích xuất MaChucNang từ các đối tượng
        functionIds = numericKeys.map(key => {
          const item = result[key];
          if (item && item.MaChucNang) {
            return item.MaChucNang;
          }
          return null;
        }).filter(id => id !== null); // Lọc bỏ các giá trị null
        
        console.log("Extracted MaChucNang from numeric keys:", functionIds);
      }
      
      // Cập nhật state selectedPermissions
      setSelectedPermissions(functionIds);
      console.log("Final selectedPermissions:", functionIds);
      
      // Điền thông tin từ roleDetail vào form
      form.setFieldsValue({
        TenNhomQuyen: roleDetail.data?.TenNhomQuyen || role.TenNhomQuyen,
      });
    } catch (error) {
      console.error("Error fetching role details:", error);
      message.error("Không thể tải thông tin nhóm quyền: " + (error.message || "Lỗi không xác định"));
      
      // Nếu có lỗi, vẫn điền thông tin cơ bản từ danh sách
      form.setFieldsValue({
        TenNhomQuyen: role.TenNhomQuyen,
      });
      
      // Đặt mảng rỗng cho selectedPermissions
      setSelectedPermissions([]);
    }
    
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Xử lý khi submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEditing) {
        // Cập nhật nhóm quyền
        const updateData = {
          TenNhomQuyen: values.TenNhomQuyen,
          ChucNang: selectedPermissions,
        };
        
        console.log("Updating role with data:", updateData);
        
        const result = await dispatch(fetchUpdateRole({ 
          roleId: currentRoleId, 
          data: updateData 
        })).unwrap();
        
        // Kiểm tra kết quả trả về từ API
        console.log("Update role API response:", result);
        
        // Kiểm tra nhiều trường hợp thành công có thể có
        if (result && (result.success === true || result.status === 'success' || 
            (result.message && result.message.includes("thành công")))) {
          message.success("Cập nhật nhóm quyền thành công!");
          setIsModalVisible(false);
          // Tải lại danh sách nhóm quyền
          dispatch(fetchRoles({ page: pageNo, limit: pageSize }));
        } else {
          // Nếu có thông báo "Cập nhật nhóm quyền thành công" trong message, vẫn xử lý như thành công
          if (result && result.message && result.message.includes("thành công")) {
            message.success("Cập nhật nhóm quyền thành công!");
            setIsModalVisible(false);
            // Tải lại danh sách nhóm quyền
            dispatch(fetchRoles({ page: pageNo, limit: pageSize }));
          } else {
            message.error("Cập nhật nhóm quyền thất bại: " + ((result && result.message) || "Lỗi không xác định"));
          }
        }
      } else {
        // Thêm nhóm quyền mới
        const createData = {
          MaNhomQuyen: values.MaNhomQuyen.toUpperCase(),
          TenNhomQuyen: values.TenNhomQuyen,
          ChucNang: selectedPermissions,
        };
        
        console.log("Creating new role with data:", createData);
        
        const result = await dispatch(fetchCreateRole(createData)).unwrap();
        
        // Kiểm tra kết quả trả về từ API
        console.log("Create role API response:", result);
        
        // Kiểm tra nhiều trường hợp thành công có thể có
        if (result && (result.success === true || result.status === 'success' || 
            (result.message && result.message.includes("thành công")))) {
          message.success("Thêm nhóm quyền mới thành công!");
          setIsModalVisible(false);
          // Tải lại danh sách nhóm quyền
          dispatch(fetchRoles({ page: pageNo, limit: pageSize }));
        } else {
          // Nếu có thông báo "Tạo nhóm quyền thành công" trong message, vẫn xử lý như thành công
          if (result && result.message && result.message.includes("thành công")) {
            message.success("Thêm nhóm quyền mới thành công!");
            setIsModalVisible(false);
            // Tải lại danh sách nhóm quyền
            dispatch(fetchRoles({ page: pageNo, limit: pageSize }));
          } else {
            message.error("Thêm nhóm quyền mới thất bại: " + ((result && result.message) || "Lỗi không xác định"));
          }
        }
      }
    } catch (error) {
      console.error("Form validation error:", error);
      message.error("Vui lòng kiểm tra lại thông tin nhập!");
    }
  };

  // Xử lý xóa nhóm quyền
  const handleDelete = async (roleId) => {
    try {
      console.log("Deleting role with ID:", roleId);
      
      const result = await dispatch(fetchDeleteRole(roleId)).unwrap();
      
      // Kiểm tra kết quả trả về từ API
      console.log("Delete role API response:", result);
      
      // Kiểm tra nhiều trường hợp thành công có thể có
      if (result && (result.success === true || result.status === 'success' || 
          (result.message && result.message.includes("thành công")))) {
        message.success("Xóa nhóm quyền thành công!");
        // Tải lại danh sách nhóm quyền
        dispatch(fetchRoles({ page: pageNo, limit: pageSize }));
      } else {
        // Nếu có thông báo "Xóa nhóm quyền thành công" trong message, vẫn xử lý như thành công
        if (result && result.message && result.message.includes("thành công")) {
          message.success("Xóa nhóm quyền thành công!");
          // Tải lại danh sách nhóm quyền
          dispatch(fetchRoles({ page: pageNo, limit: pageSize }));
        } else {
          message.error("Xóa nhóm quyền thất bại: " + ((result && result.message) || "Lỗi không xác định"));
        }
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      message.error("Xóa nhóm quyền thất bại: " + (error.message || "Lỗi không xác định"));
    }
  };

  // Xử lý khi chọn/bỏ chọn một quyền
  const handlePermissionChange = (permissionId, checked) => {
    const newSelectedPermissions = [...selectedPermissions];
    
    if (checked) {
      // Thêm quyền
      if (!newSelectedPermissions.includes(permissionId)) {
        newSelectedPermissions.push(permissionId);
      }
    } else {
      // Xóa quyền
      const index = newSelectedPermissions.indexOf(permissionId);
      if (index !== -1) {
        newSelectedPermissions.splice(index, 1);
      }
    }
    
    setSelectedPermissions(newSelectedPermissions);
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: "Mã nhóm quyền",
      dataIndex: "MaNhomQuyen",
      key: "MaNhomQuyen",
      width: 150,
      sorter: (a, b) => a.MaNhomQuyen.localeCompare(b.MaNhomQuyen),
      sortOrder: sortedInfo.columnKey === 'MaNhomQuyen' ? sortedInfo.order : null,
    },
    {
      title: "Tên nhóm quyền",
      dataIndex: "TenNhomQuyen",
      key: "TenNhomQuyen",
      sorter: (a, b) => a.TenNhomQuyen.localeCompare(b.TenNhomQuyen),
      sortOrder: sortedInfo.columnKey === 'TenNhomQuyen' ? sortedInfo.order : null,
    },
    {
      title: "Loại nhóm quyền",
      dataIndex: "LoaiNhomQuyen",
      key: "LoaiNhomQuyen",
      filters: [
        { text: 'Hệ thống', value: 'system' },
        { text: 'Tùy chỉnh', value: 'custom' },
      ],
      onFilter: (value, record) => {
        // Giả định: ADMIN, KHACHHANG là nhóm quyền hệ thống
        if (value === 'system') {
          return ['ADMIN', 'KHACHHANG', 'QLSP'].includes(record.MaNhomQuyen);
        } else {
          return !['ADMIN', 'KHACHHANG', 'QLSP'].includes(record.MaNhomQuyen);
        }
      },
      render: (_, record) => {
        const isSystem = ['ADMIN', 'KHACHHANG', 'QLSP'].includes(record.MaNhomQuyen);
        return (
          <Tag color={isSystem ? 'purple' : 'cyan'}>
            {isSystem ? 'Hệ thống' : 'Tùy chỉnh'}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => {
        const isSystem = ['ADMIN', 'KHACHHANG', 'QLSP'].includes(record.MaNhomQuyen);
        
        return (
          <Space size="middle">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Sửa
            </Button>
            {!isSystem && (
              <Popconfirm
                title="Xóa nhóm quyền"
                description="Bạn có chắc chắn muốn xóa nhóm quyền này không?"
                onConfirm={() => handleDelete(record.MaNhomQuyen)}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                >
                  Xóa
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  // Render component
  return (
    <Card title="Quản lý nhóm quyền" className="shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm theo mã, tên nhóm quyền..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            placeholder="Lọc theo loại"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setTypeFilter(value)}
          >
            <Option value="system">Hệ thống</Option>
            <Option value="custom">Tùy chỉnh</Option>
          </Select>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          className="bg-green-500 hover:bg-green-600"
        >
          Thêm nhóm quyền mới
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <AdminTable
          columns={columns}
          dataSource={filteredRoles}
          rowKey="MaNhomQuyen"
          pageNo={pageNo}
          pageSize={pageSize}
          totalElements={totalElements}
          loading={loading}
          handleChange={handleChange}
          className="shadow-sm"
        />
      )}

      <Modal
        title={isEditing ? "Chỉnh sửa nhóm quyền" : "Thêm nhóm quyền mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          {!isEditing && (
            <FormItem
              label="Mã nhóm quyền"
              name="MaNhomQuyen"
              rules={[
                { required: true, message: "Vui lòng nhập mã nhóm quyền!" },
                { pattern: /^[A-Z0-9_]+$/, message: "Mã nhóm quyền chỉ chấp nhận chữ in hoa, số và dấu gạch dưới!" },
                { max: 20, message: "Mã nhóm quyền tối đa 20 ký tự!" }
              ]}
            >
              <Input 
                placeholder="Nhập mã nhóm quyền (VD: NHANVIEN, QUANLY)" 
                maxLength={20}
                style={{ textTransform: 'uppercase' }}
              />
            </FormItem>
          )}
          
          <FormItem
            label="Tên nhóm quyền"
            name="TenNhomQuyen"
            rules={[{ required: true, message: "Vui lòng nhập tên nhóm quyền!" }]}
          >
            <Input 
              placeholder="Nhập tên nhóm quyền" 
              maxLength={100}
            />
          </FormItem>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Phân quyền chức năng:</h3>
            <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-4">
                  <Spin />
                </div>
              ) : (
                allFunctions.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {allFunctions
                      .filter(func => func.MaChucNang !== 'QLQT') // Lọc bỏ chức năng có mã QLQT
                      .map(func => (
                        <Checkbox
                          key={func.MaChucNang}
                          checked={selectedPermissions.includes(func.MaChucNang)}
                          onChange={(e) => {
                            handlePermissionChange(func.MaChucNang, e.target.checked);
                            console.log(`Checkbox ${func.TenChucNang} (${func.MaChucNang}) ${e.target.checked ? 'checked' : 'unchecked'}`);
                            console.log("Current selectedPermissions:", selectedPermissions);
                            console.log("Updated selectedPermissions will be:", 
                              e.target.checked 
                                ? [...selectedPermissions, func.MaChucNang].filter((v, i, a) => a.indexOf(v) === i) // Add and deduplicate
                                : selectedPermissions.filter(id => id !== func.MaChucNang) // Remove
                            );
                          }}
                        >
                          {func.TenChucNang}
                        </Checkbox>
                      ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    Không có dữ liệu chức năng
                  </div>
                )
              )}
            </div>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default Role;
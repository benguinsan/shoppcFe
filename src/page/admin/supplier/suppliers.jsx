import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Input, Modal, message, Tag } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  fetchSuppliers,
  softDeleteSupplier,
  restoreSupplier,
  updateSupplier,
  resetActionStatus,
} from "../../../redux/admin/supplierSlice";
import { action_status } from "../../../utils/constants/status";

const Suppliers = () => {
  const dispatch = useDispatch();
  const { suppliers, loading, pagination, actionStatus } = useSelector(
    (state) => state.supplier
  );
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Fetch tất cả nhà cung cấp khi component mount - bao gồm cả TrangThai = 0 và 1
  useEffect(() => {
    console.log("Fetching all suppliers");
    dispatch(fetchSuppliers({ page: 1, limit: 10, activeOnly: false }))
      .unwrap()
      .then((data) => {
        console.log("Fetched suppliers:", data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  }, [dispatch]);

  // Theo dõi trạng thái action để hiển thị thông báo
  useEffect(() => {
    if (actionStatus === action_status.SUCCEEDED) {
      message.success("Thao tác thành công");
      dispatch(resetActionStatus());
      // Sau khi thao tác thành công, tải lại danh sách
      console.log("Reloading suppliers after successful action");
      dispatch(
        fetchSuppliers({
          page: 1,
          limit: pagination.pageSize,
          activeOnly: false, // Lấy tất cả nhà cung cấp
          searchTerm: searchText,
        })
      );
    } else if (actionStatus === action_status.FAILED) {
      message.error("Thao tác thất bại");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, dispatch, pagination.pageSize, searchText]);

  // Xử lý khi thay đổi trang hoặc số lượng hiển thị
  const handleTableChange = (pagination) => {
    dispatch(
      fetchSuppliers({
        page: pagination.current,
        limit: pagination.pageSize,
        searchTerm: searchText,
        activeOnly: false, // Lấy tất cả nhà cung cấp
      })
    );
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    dispatch(
      fetchSuppliers({
        page: 1,
        limit: pagination.pageSize,
        searchTerm: searchText,
        activeOnly: false, // Lấy tất cả nhà cung cấp
      })
    );
  };

  // Xử lý vô hiệu hóa nhà cung cấp (xóa mềm)
  const handleDelete = (supplier) => {
    Modal.confirm({
      title: "Xác nhận vô hiệu hóa",
      content: `Bạn có chắc chắn muốn vô hiệu hóa nhà cung cấp "${supplier.TenNCC}" không?`,
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        dispatch(softDeleteSupplier(supplier.MaNCC))
          .unwrap()
          .then(() => {
            message.success(`Đã vô hiệu hóa nhà cung cấp ${supplier.TenNCC}`);
          })
          .catch((error) => {
            message.error(`Vô hiệu hóa không thành công: ${error.message}`);
          });
      },
    });
  };

  // Xử lý khôi phục nhà cung cấp
  const handleRestore = (supplier) => {
    Modal.confirm({
      title: "Xác nhận khôi phục",
      content: `Bạn có chắc chắn muốn khôi phục hoạt động của nhà cung cấp "${supplier.TenNCC}" không?`,
      okText: "Xác nhận",
      okType: "default",
      okButtonProps: {
        style: {
          backgroundColor: "#1890ff",
          borderColor: "#1890ff",
          color: "white",
        },
      },
      cancelText: "Hủy",
      onOk: () => {
        dispatch(restoreSupplier(supplier.MaNCC))
          .unwrap()
          .then(() => {
            message.success(
              `Đã khôi phục hoạt động nhà cung cấp ${supplier.TenNCC}`
            );
          })
          .catch((error) => {
            message.error(`Khôi phục không thành công: ${error.message}`);
          });
      },
    });
  };

  const columns = [
    {
      title: "Mã NCC",
      dataIndex: "MaNCC",
      key: "MaNCC",
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "TenNCC",
      key: "TenNCC",
    },
    {
      title: "Địa chỉ",
      dataIndex: "DiaChi",
      key: "DiaChi",
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "SDT",
      key: "SDT",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "TrangThai",
      render: (trangThai) => {
        // Log để kiểm tra kiểu dữ liệu và giá trị thực tế
        console.log("TrangThai value:", trangThai, "Type:", typeof trangThai);

        // Chuyển đổi thành số để đảm bảo so sánh chính xác
        const status = Number(trangThai);
        return (
          <Tag color={status === 1 ? "green" : "red"}>
            {status === 1 ? "Đang hoạt động" : "Đã xoá"}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        // Chuyển đổi thành số để đảm bảo so sánh chính xác
        const status = Number(record.TrangThai);

        return (
          <Space size="middle">
            {status === 1 ? (
              <>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() =>
                    navigate(`/admin/supplier/update/${record.MaNCC}`)
                  }
                  className="edit-button"
                >
                  Sửa
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record)}
                >
                  Xoá
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                icon={<UndoOutlined />}
                onClick={() => handleRestore(record)}
                className="restore-button"
              >
                Khôi phục
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Space>
          <Input
            placeholder="Tìm kiếm nhà cung cấp"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            onPressEnter={handleSearch}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Space>
        <Button
          type="primary"
          className="bg-blue-600"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/supplier/create")}
        >
          Thêm nhà cung cấp
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="MaNCC"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        loading={loading}
        onChange={handleTableChange}
      />
      <style jsx global>{`
        .edit-button {
          background-color: #1890ff !important;
          border-color: #1890ff !important;
          color: white !important;
        }

        .edit-button:hover {
          background-color: #096dd9 !important;
          border-color: #096dd9 !important;
        }

        .restore-button {
          background-color: #52c41a !important;
          border-color: #52c41a !important;
          color: white !important;
        }

        .restore-button:hover {
          background-color: #389e0d !important;
          border-color: #389e0d !important;
        }
      `}</style>
    </div>
  );
};

export default Suppliers;

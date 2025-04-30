import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message, Table, Button, Modal, Space, Card } from "antd";
import AdminTable from "../../../components/admin/ui/table";
import {
  fetchCategories,
  fetchDeleteCategory,
} from "../../../redux/category/categoryAdminSlice";

const Categories = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.categoryAdmin);
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleStatusChange = async (categoryId) => {
    try {
      console.log("categoryId", categoryId);
      const result = await dispatch(
        fetchDeleteCategory({ MaLoaiSP: categoryId })
      ).unwrap();

      if (result.success) {
        message.success("Cập nhật trạng thái thành công!");
        // Refresh the categories list
        dispatch(fetchCategories());
      } else {
        throw new Error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      message.error(`Lỗi: ${error.message}`);
    }
  };

  const columns = [
    {
      title: "Mã LSP",
      dataIndex: "MaLoaiSP", // Cập nhật tên cột
      key: "MaLoaiSP",
      //   sorter: (a, b) => a.songId - b.songId,
      //   sortOrder: sortedInfo.columnKey === "songId" ? sortedInfo.order : null,
    },
    {
      title: "Tên LSP",
      dataIndex: "TenLoaiSP", // Cập nhật tên cột
      key: "TenLoaiSP",
      //   sorter: (a, b) => a.songName - b.songName,
      //   sortOrder: sortedInfo.columnKey === "songName" ? sortedInfo.order : null,
    },
    {
      title: "Mô tả",
      dataIndex: "MoTa",
      key: "MoTa",
    },

    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "TrangThai",
      render: (status, record) => (
        <Space>
          <Button
            onClick={() => handleStatusChange(record.MaLoaiSP)}
            type={status ? "default" : "primary"}
            danger={status}
          >
            {status ? "Hủy" : "Kích hoạt"}
          </Button>
        </Space>
      ),
    },
  ];

  // const handleChange = (pagination, filter, sorter) => {
  //   setSortedInfo(sorter);
  //   dispatch(
  //     fetchSongsAdmin({
  //       pageNo: pagination.current - 1,
  //       pageSize: pagination.pageSize,
  //     })
  //   );
  // };
  const clearAll = () => {
    setSortedInfo({});
  };
  return (
    <div className="p-4">
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearAll}>Clear</Button>
      </Space>
      <AdminTable
        columns={columns}
        dataSource={items?.data || []}
        rowKey="MaLoaiSP"
        handleChange={() => {}}
        pageNo={0}
        pageSize={10}
        totalElements={items?.data?.length || 0}
        loading={loading}
      />
    </div>
  );
};

export default Categories;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Space, Card } from "antd";
import AdminTable from "../../../components/admin/ui/table";

const Products = () => {
  const [sortedInfo, setSortedInfo] = useState({});
  const columns = [
    {
      title: "Mã SP",
      dataIndex: "productId", // Cập nhật tên cột
      key: "productId",
      //   sorter: (a, b) => a.songId - b.songId,
      //   sortOrder: sortedInfo.columnKey === "songId" ? sortedInfo.order : null,
    },
    {
      title: "Mã LSP",
      dataIndex: "productTypeId", // Cập nhật tên cột
      key: "productTypeId",
      //   sorter: (a, b) => a.songName - b.songName,
      //   sortOrder: sortedInfo.columnKey === "songName" ? sortedInfo.order : null,
    },
    {
      title: "Tên SP",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "CPU",
      dataIndex: "cpu",
      key: "cpu",
      //   render: (duration) => {
      //     const minutes = Math.floor(duration / 60);
      //     const seconds = duration % 60;
      //     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      //   },
    },
    {
      title: "RAM",
      dataIndex: "ram",
      key: "ram",
    },
    {
      title: "GPU",
      dataIndex: "gpu",
      key: "gpu",
    },
    {
      title: "Storage",
      dataIndex: "storage",
      key: "storage",
    },
    {
      title: "Màn hình",
      dataIndex: "screen",
      key: "screen",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Hình ảnh",
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (url) => (
        <img
          src={url}
          alt="Cover"
          style={{ width: 40, height: 40, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status", // Cập nhật tên cột
      key: "status",
      render: (status, record) => (
        <Space>
          <Button
            onClick={() => handleStatusChange(record.productId)} // Gọi hàm khi nhấn nút
            type={status ? "default" : "primary"}
            danger={status} // nút màu đỏ nếu đang private
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
        dataSource={[]}
        rowKey="productId"
        handleChange={() => {}}
        pageNo={0}
        pageSize={10}
        totalElements={0}
      />
    </div>
  );
};

export default Products;

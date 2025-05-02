import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, message, Space } from "antd";
import AdminTable from "../../../components/admin/ui/table";
import {
  fetchProducts,
  fetchChangeStatusProduct,
} from "../../../redux/product/productAdminSlice";

const Products = () => {
  const dispatch = useDispatch();
  const [sortedInfo, setSortedInfo] = useState({});

  const { dataSource, pageNo, pageSize, totalElements, loading } = useSelector(
    (state) => state.productAdmin
  );

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, limit: pageSize }));
  }, [dispatch, pageSize]);

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    dispatch(
      fetchProducts({
        page: pagination.current - 1,
        limit: pagination.pageSize,
      })
    );
  };

  const clearAll = () => {
    setSortedInfo({});
  };

  const columns = [
    {
      title: "Mã SP",
      dataIndex: "MaSP",
      key: "productId",
    },
    {
      title: "Mã LSP",
      dataIndex: "MaLoaiSP",
      key: "productTypeId",
    },
    {
      title: "Tên SP",
      dataIndex: "TenSP",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "MoTa",
      key: "description",
      render: (text) => (
        <div className="truncate max-w-[200px]" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: "CPU",
      dataIndex: "CPU",
      key: "cpu",
    },
    {
      title: "RAM",
      dataIndex: "RAM",
      key: "ram",
    },
    {
      title: "GPU",
      dataIndex: "GPU",
      key: "gpu",
    },
    {
      title: "Storage",
      dataIndex: "Storage",
      key: "storage",
    },
    {
      title: "Màn hình",
      dataIndex: "ManHinh",
      key: "screen",
    },
    {
      title: "Giá",
      dataIndex: "Gia",
      key: "price",
    },
    {
      title: "Hình ảnh",
      dataIndex: "ImgUrl",
      key: "imgUrl",
      render: (url) => (
        <img
          src={url}
          alt="Ảnh sản phẩm"
          style={{ width: 40, height: 40, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      key: "status",
      render: (status, record) => (
        <Space>
          <Button
            onClick={() => handleStatusChange(record.MaSP)}
            type="default"
            danger={status}
            style={
              !status
                ? {
                    backgroundColor: "#52c41a",
                    color: "#fff",
                    borderColor: "#52c41a",
                  }
                : {}
            }
          >
            {status ? "Hủy" : "Kích hoạt"}
          </Button>
        </Space>
      ),
    },
  ];

  const handleStatusChange = async (productId) => {
    try {
      const result = await dispatch(
        fetchChangeStatusProduct(productId)
      ).unwrap();

      if (result && result.success) {
        message.success(
          result.message || "Trạng thái sản phẩm đã được cập nhật!"
        );
        // Refresh data immediately after successful status change
        await dispatch(
          fetchProducts({
            page: pageNo,
            limit: pageSize,
          })
        );
      } else {
        throw new Error(result?.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      message.error(error.message || "Không thể cập nhật trạng thái sản phẩm!");
    }
  };

  return (
    <div className="p-4">
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearAll}>Clear</Button>
      </Space>
      <AdminTable
        columns={columns}
        dataSource={dataSource}
        rowKey="MaSP"
        handleChange={handleChange}
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
        loading={loading}
      />
    </div>
  );
};

export default Products;

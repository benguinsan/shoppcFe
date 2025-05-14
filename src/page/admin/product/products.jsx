import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, message, Space, Modal } from "antd";
import AdminTable from "../../../components/admin/ui/table";
import {
  fetchProducts,
  fetchChangeStatusProduct,
} from "../../../redux/product/productAdminSlice";

const Products = () => {
  const dispatch = useDispatch();
  const [sortedInfo, setSortedInfo] = useState({});
  const [specModalVisible, setSpecModalVisible] = useState(false);
  const [descModalVisible, setDescModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const showSpecModal = (product) => {
    setSelectedProduct(product);
    setSpecModalVisible(true);
  };

  const showDescModal = (product) => {
    setSelectedProduct(product);
    setDescModalVisible(true);
  };

  const closeModals = () => {
    setSpecModalVisible(false);
    setDescModalVisible(false);
  };

  // Chuyển đổi text xuống dòng thành các phần tử JSX
  const formatDescription = (text) => {
    if (!text) return "";

    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
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
      key: "description",
      render: (_, record) => (
        <Button type="link" onClick={() => showDescModal(record)}>
          Xem mô tả
        </Button>
      ),
    },
    {
      title: "Thông số kỹ thuật",
      key: "specs",
      render: (_, record) => (
        <Button type="link" onClick={() => showSpecModal(record)}>
          Xem chi tiết
        </Button>
      ),
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
        // Giữ nguyên limit là 3 khi refresh dữ liệu
        await dispatch(
          fetchProducts({
            page: pageNo,
            limit: 3,
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

      {/* Modal Thông số kỹ thuật */}
      <Modal
        title="Thông số kỹ thuật"
        open={specModalVisible}
        onCancel={closeModals}
        footer={[
          <Button key="close" onClick={closeModals}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedProduct && (
          <div className="space-y-2">
            <div className="flex">
              <div className="font-semibold w-24">CPU:</div>
              <div
                className="truncate max-w-[500px]"
                title={selectedProduct.CPU}
              >
                {selectedProduct.CPU || "Không có thông tin"}
              </div>
            </div>
            <div className="flex">
              <div className="font-semibold w-24">RAM:</div>
              <div
                className="truncate max-w-[500px]"
                title={selectedProduct.RAM}
              >
                {selectedProduct.RAM || "Không có thông tin"}
              </div>
            </div>
            <div className="flex">
              <div className="font-semibold w-24">GPU:</div>
              <div
                className="truncate max-w-[500px]"
                title={selectedProduct.GPU}
              >
                {selectedProduct.GPU || "Không có thông tin"}
              </div>
            </div>
            <div className="flex">
              <div className="font-semibold w-24">Storage:</div>
              <div
                className="truncate max-w-[500px]"
                title={selectedProduct.Storage}
              >
                {selectedProduct.Storage || "Không có thông tin"}
              </div>
            </div>
            <div className="flex">
              <div className="font-semibold w-24">Màn hình:</div>
              <div
                className="truncate max-w-[500px]"
                title={selectedProduct.ManHinh}
              >
                {selectedProduct.ManHinh || "Không có thông tin"}
              </div>
            </div>
            <div className="flex">
              <div className="font-semibold w-24">Bảo hành:</div>
              <div
                className="truncate max-w-[500px]"
                title={`${selectedProduct.tg_baohanh || 12} tháng`}
              >
                {selectedProduct.tg_baohanh || 12} tháng
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Mô tả */}
      <Modal
        title="Mô tả sản phẩm"
        open={descModalVisible}
        onCancel={closeModals}
        footer={[
          <Button key="close" onClick={closeModals}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedProduct && (
          <div className="whitespace-pre-line">
            {formatDescription(selectedProduct.MoTa) || "Không có mô tả"}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;

import React, { useState } from "react";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/product/productAdminSlice";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Đăng xuất", "logout", <PieChartOutlined />),
  getItem("Sản phẩm", "products", <PieChartOutlined />, [
    getItem("Danh sách sản phẩm", "products"),
    getItem("Thêm sản phẩm", "product/create"),
    getItem("Cập nhật sản phẩm", "product/update"),
    getItem("Hàng", "product/series"),
  ]),
  getItem("Loại sản phẩm", "category", <DesktopOutlined />, [
    getItem("Danh sách Loại sản phẩm", "categories"),
    getItem("Thêm loại sản phẩm", "category/create"),
    getItem("Cập nhật loại sản phẩm", "category/update"),
  ]),
  getItem("Người dùng", "users", <DesktopOutlined />, [
    getItem("Danh sách người dùng", "users"),
  ]),
  getItem("Hóa đơn", "order", <DesktopOutlined />, [
    getItem("Danh sách hóa đơn", "orders"),
  ]),
  getItem("Nhà cung cấp", "supplier", <DesktopOutlined />, [
    getItem("Danh sách nhà cung cấp", "suppliers"),
    getItem("Thêm nhà cung cấp", "supplier/create"),
  ]),
  getItem("Nhập hàng", "imports", <DesktopOutlined />, [
    getItem("Danh sách phiếu nhập", "imports"),
    getItem("Nhập hàng", "imports/create"),
  ]),
  getItem("Khuyến mãi", "sale", <DesktopOutlined />, [
    getItem("Danh sách khuyến mãi", "sales"),
    getItem("Thêm khuyến mãi", "sale/create"),
    getItem("Cập nhật khuyến mãi", "sale/update"),
  ]),
  getItem("Bảo hành", "guarantee", <DesktopOutlined />, [
    getItem("Danh sách bảo hành", "warranties"),
  ]),
  getItem("Tài khoản", "account", <DesktopOutlined />, [
    getItem("Danh sách tài khoản", "accounts"),
  ]),
  getItem("Thống kê", "statistic", <DesktopOutlined />, [
    getItem("Thống kê", "statistics"),
  ]),
  getItem("Nhóm Quyền", "role", <DesktopOutlined />, [
    getItem("Danh sách nhóm quyền", "roles"),
  ]),
];

const pageTitles = {
  logout: "Đăng xuất",
  products: "Danh sách sản phẩm",
  order: "Danh sách hóa đơn",
  imports: "Danh sách nhập hàng",
  guarantee: "Danh sách bảo hành",
  statistic: "Thống kê",
};
const MemoizedMenuItem = React.memo(Menu.Item);

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [openKeys, setOpenKeys] = useState([]);
  const dispatch = useDispatch();
  const onOpenChange = (keys) => {
    // Nếu user mở nhiều menu thì chỉ giữ cái cuối cùng
    setOpenKeys(keys.length ? [keys[keys.length - 1]] : []);
  };
  const location = useLocation(); // <-- Lấy URL hiện tại
  const navigate = useNavigate(); // <-- Để điều hướng khi click menu

  const path = location.pathname.replace("/admin/", "");

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token và thông tin người dùng từ localStorage
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");

    // Có thể thêm các xử lý khác nếu cần
    // Ví dụ: dispatch action để reset state trong Redux

    // Chuyển hướng về trang chủ
    navigate("/", { replace: true });

    // Tải lại trang để đảm bảo tất cả state được reset
    window.location.href = "/";
  };

  // Xử lý khi click vào menu item
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    } else if (key === "products") {
      // Khi click vào danh sách sản phẩm, đảm bảo limit là 3
      dispatch(fetchProducts({ page: 0, limit: 3 }));
      navigate(`/admin/${key}`);
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          position: "sticky", // Cố định khi cuộn
          top: 0, // Cố định từ trên cùng
          height: "100vh", // Chiều cao chiếm hết màn hình
          zIndex: 100, // Đảm bảo Sider nằm trên các phần tử khác
        }}
      >
        <div className="logo p-2"></div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[path]} // path là key hiện tại, ví dụ: "album/create"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={handleMenuClick}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: "0 24px", background: colorBgContainer }}>
          <h1 className="text-xl font-bold py-4">{pageTitles[path]}</h1>
        </Header>
        <Content style={{ margin: "10px 16px" }}>
          <div
            style={{
              padding: 20,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;

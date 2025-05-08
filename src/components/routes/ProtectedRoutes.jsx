import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Component bảo vệ các route admin
export const AdminProtectedRoute = ({ children }) => {
  const loggedInUser = useSelector((state) => state.user.current);
  
  // Kiểm tra xem người dùng đã đăng nhập chưa
  const isLoggedIn = loggedInUser !== null;
  
  // Danh sách các nhóm quyền được phép truy cập vào route admin
  const authorizedRoles = ["ADMIN", "MANAGER", "SUPERVISOR"]; // Thêm các nhóm quyền khác nếu cần
  
  if (!isLoggedIn || !authorizedRoles.includes(loggedInUser?.MaNhomQuyen)) {
    // Chuyển hướng về trang chủ nếu không có quyền
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Component bảo vệ các route thông thường, không cho phép admin truy cập
export const UserOnlyRoute = ({ children }) => {
  const loggedInUser = useSelector((state) => state.user.current);
  
  // Danh sách các nhóm quyền chỉ được phép truy cập trang admin
  const adminRoles = ["ADMIN", "MANAGER", "SUPERVISOR"];
  
  // Nếu người dùng là admin, chuyển hướng đến trang admin dashboard
  if (loggedInUser && adminRoles.includes(loggedInUser.MaNhomQuyen)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};

// Component xử lý chuyển hướng sau khi đăng nhập dựa trên nhóm quyền
export const AuthRedirect = () => {
  const loggedInUser = useSelector((state) => state.user.current);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Chỉ chuyển hướng khi người dùng mới đăng nhập
    // Không chuyển hướng khi người dùng đã ở trang đích
    if (loggedInUser) {
      const currentPath = window.location.pathname;
      
      if (loggedInUser.MaNhomQuyen === "KHACHHANG") {
        // Nếu người dùng là KHACHHANG và đang cố truy cập trang admin, chuyển hướng về trang chủ
        if (currentPath.startsWith('/admin')) {
          navigate("/", { replace: true });
        }
      } else if (["ADMIN", "MANAGER", "SUPERVISOR"].includes(loggedInUser.MaNhomQuyen)) {
        console.log(loggedInUser.MaNhomQuyen)
        // Nếu người dùng là ADMIN và đang ở trang đăng nhập hoặc đăng ký, chuyển hướng đến dashboard
        if (currentPath === '/sign-in' || currentPath === '/sign-up') {
          navigate("/admin/dashboard", { replace: true });
        }
        // Nếu người dùng là ADMIN và đang ở trang người dùng thông thường, chuyển hướng đến dashboard
        else if (!currentPath.startsWith('/admin')) {
          navigate("/admin/dashboard", { replace: true });
        }
      }
    }
  }, [loggedInUser, navigate]);
  
  return null;
};

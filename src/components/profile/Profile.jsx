import React from "react";
import styled from "styled-components";
import Dropdown from "../dropdown/Dropdown";

const ProfileStyles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  position: relative;
  cursor: pointer;
  .avatar {
    width: 48px;
    height: 48px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100rem;
    }
  }
  &:hover .name {
    color: yellow;
  }
`;
const Profile = ({ data }) => {
  // console.log("Profile data:", data);  
  
  // Sử dụng toán tử 3 ngôi để xác định tên hiển thị
  // Nếu data có thuộc tính nguoiDung, lấy TenTK từ nguoiDung
  // Nếu không, kiểm tra xem data có TenTK trực tiếp không
  // Nếu không có cả hai, hiển thị "Người dùng"
  const displayName = data?.taiKhoan?.TenTK || data?.TenTK || "Người dùng";
  
  return (
    <>
      <ProfileStyles className="profile">
        <div className="avatar">
          <img src={"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"} alt="" className="bg-red-600" />
        </div>
        <div className="flex flex-col items-start justify-center text-white text-base">
          <span className="text-sm font-medium">{displayName}</span>
        </div>
        <Dropdown />
      </ProfileStyles>
    </>
  );
};

export default Profile;

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
    width: 52px;
    height: 52px;
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
  return (
    <>
      <ProfileStyles className="profile">
        <div className="avatar">
          <img src={data.avatar} alt="" />
        </div>
        <div className="flex flex-col items-start justify-center text-white font-semibold gap-y-1 text-base name">
          <span className="">Xin chào ,</span>
          <span>{data.name}</span>
        </div>
        <Dropdown />
      </ProfileStyles>
    </>
  );
};

export default Profile;

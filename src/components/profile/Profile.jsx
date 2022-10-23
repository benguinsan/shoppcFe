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
          <img
            src="https://i.pinimg.com/564x/7d/9b/80/7d9b80fff2c220628dac3d11f985991b.jpg"
            alt=""
          />
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

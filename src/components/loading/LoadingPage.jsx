import React from "react";
import styled from "styled-components";

const LoadingStyles = styled.div`
  body {
    background-color: #00ccff;
  }
  padding: 0;
  position: absolute;
  text-align: center;
  top: 50%;
  width: 100%;
  .dots {
    animation: bounce 1.5s infinite linear;
    background: #fff;
    border-radius: 50%;
    display: inline-block;
    height: 20px;
    text-align: center;
    width: 20px;
  }

  .dots:nth-child(1) {
    animation-delay: 0.2s;
  }
  .dots:nth-child(2) {
    animation-delay: 0.4s;
  }
  .dots:nth-child(3) {
    animation-delay: 0.6s;
  }
  .dots:nth-child(4) {
    animation-delay: 0.8s;
  }
  .dots:nth-child(5) {
    animation-delay: 1s;
  }
  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    15% {
      transform: translateY(-15px);
    }
    30% {
      transform: translateY(0);
    }
  }
`;

const LoadingPage = () => {
  return (
    <LoadingStyles>
      <div className="dots"></div>
      <div className="dots"></div>
      <div className="dots"></div>
      <div className="dots"></div>
      <div className="dots"></div>
    </LoadingStyles>
  );
};

export default LoadingPage;

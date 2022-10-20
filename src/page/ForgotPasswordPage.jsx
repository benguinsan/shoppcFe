import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Navbar from "../components/navbar/Navbar";
import AuthenticationPage from "./AuthenticationPage";
import SendMail from "../components/form/SendMail";
import Verify from "../components/form/Verify";

const ForgotPasswordPage = () => {
  const [verify, setVerify] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleClick = () => {
    setVerify(true);
  };
  return (
    <div>
      <AuthenticationPage className="pb-20">
        <SendMail onClick={handleClick} />
        {verify && <Verify />}
      </AuthenticationPage>
    </div>
  );
};

export default ForgotPasswordPage;

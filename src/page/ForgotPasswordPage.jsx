import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/button/Button";
import Field from "../components/field/Field";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Input from "../components/input/Input";
import Label from "../components/label/Label";
import Navbar from "../components/navbar/Navbar";
import AuthenticationPage from "./AuthenticationPage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup
    .string()
    .email("Vui lòng nhập đúng định dạng email")
    .required("Vui lòng nhập email"),
  verify: yup
    .string()
    .required("Vui lòng nhập mã xác nhận")
    .min(6, "Mã xác nhận tối thiểu 6 ký tự"),
});
const ForgotPasswordPage = () => {
  const {
    reset,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", verify: "" },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [verify, setVerify] = useState(false);
  const [hiddenClock, setHiddenClock] = useState(true);
  const [hiddenButton, setHiddenButton] = useState(false);
  const timeRef = useRef(10);
  const [time, setTime] = useState(10);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  function countdownTimer() {
    const timeout = setTimeout(function () {
      timeRef.current = timeRef.current - 1;
      if (timeRef.current === -1) {
        timeRef.current = 10;
        setHiddenButton(false);
        setHiddenClock(true);
        clearTimeout(timeout);
        return;
      }
      setTime(timeRef.current);
      countdownTimer();
    }, 1000);
  }

  const handleSend = (values) => {
    if (!isValid) return;
  };

  const handleCLick = () => {
    setVerify(true);
    setHiddenClock(false);
    setHiddenButton(true);
    if (time === 0) {
      setTime(10);
    }
    countdownTimer();
  };

  const handleVerify = (values) => {
    if (!isValid) return;
    reset({
      verify: "",
    });
  };
  return (
    <div className="bg-[#f8f8fc]">
      <Header />
      <Navbar />
      <AuthenticationPage className="pb-20">
        <form onSubmit={handleSubmit(handleSend)} autoComplete="off">
          <Field>
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center">
              <Input
                name="email"
                type="text"
                placeholder="Mời bạn nhập email"
                control={control}
                style={{
                  width: "530px",
                }}
              ></Input>
              {!hiddenButton && (
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disable={isSubmitting}
                  onClick={handleCLick}
                  style={{
                    width: "150px",
                    margin: "0 10px",
                  }}
                >
                  Gửi mã
                </Button>
              )}
              {!hiddenClock && (
                <div className="clock w-[160px] py-[20px] flex items-center justify-center text-white rounded-md ">
                  <span className="text-xl font-semibold">{time}</span>
                </div>
              )}
            </div>
            {errors.email && (
              <p className="text-red-500 text-lg font-medium">
                {errors.email?.message}
              </p>
            )}
          </Field>
        </form>
        {verify && (
          <form onSubmit={handleSubmit(handleVerify)} autoComplete="off">
            <Field>
              <div className="flex items-center">
                <Input
                  name="verify"
                  type="text"
                  placeholder="Mời bạn nhập mã xác nhận"
                  control={control}
                  style={{ width: "530px" }}
                ></Input>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disable={isSubmitting}
                  style={{
                    width: "150px",
                    margin: "0 10px",
                  }}
                >
                  Xác nhận
                </Button>
              </div>

              {errors.verify && (
                <p className="text-red-500 text-lg font-medium">
                  {errors.verify?.message}
                </p>
              )}
            </Field>
          </form>
        )}
      </AuthenticationPage>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;

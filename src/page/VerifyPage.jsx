import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Field from "../components/field/Field";
import Header from "../components/header/Header";
import Input from "../components/input/Input";
import Label from "../components/label/Label";
import Navbar from "../components/navbar/Navbar";
import AuthenticationPage from "./AuthenticationPage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/button/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/footer/Footer";

const schema = yup.object({
  verify: yup
    .string()
    .required("Vui lòng nhập mã xác nhận")
    .min(6, "Mã xác nhận tối thiểu 6 ký tự"),
});
const VerifyPage = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: { verify: "" },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleVerify = (values) => {
    if (!isValid) return;
    toast.success("Đăng ký tài khoản thành công", { pauseOnHover: false });
    reset({
      verify: "",
    });
    navigate("/sign-in");
  };
  return (
    <div className="bg-[#f8f8fc]">
      <Header />
      <Navbar />
      <AuthenticationPage>
        <form
          onSubmit={handleSubmit(handleVerify)}
          autoComplete="off"
          className="pb-3"
        >
          <Field>
            <Label htmlFor="verify">Mã xác nhận</Label>
            <Input
              name="verify"
              type="text"
              placeholder="Mời bạn nhập mã xác nhận"
              control={control}
            ></Input>
            {errors.verify && (
              <p className="text-red-500 text-lg font-medium">
                {errors.verify?.message}
              </p>
            )}
          </Field>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disable={isSubmitting}
            style={{
              width: "100%",
              maxWidth: 300,
              margin: "30px auto",
            }}
          >
            Xác nhận
          </Button>
        </form>
      </AuthenticationPage>
      <Footer />
    </div>
  );
};

export default VerifyPage;

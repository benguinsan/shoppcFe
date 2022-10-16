import React, { useEffect } from "react";
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
});
const ForgotPasswordPage = () => {
  const {
    reset,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "" },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleForgotPassword = (values) => {
    if (!isValid) return;
    reset({
      email: "",
    });
    navigate("/reset-password");
  };
  return (
    <div className="bg-[#f8f8fc]">
      <Header />
      <Navbar />
      <AuthenticationPage>
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          autoComplete="off"
          className="pb-3"
        >
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="text"
              placeholder="Mời bạn nhập email"
              control={control}
            ></Input>
            {errors.email && (
              <p className="text-red-500 text-lg font-medium">
                {errors.email?.message}
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

export default ForgotPasswordPage;

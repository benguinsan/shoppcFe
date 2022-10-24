import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Field from "../components/field/Field";
import Input from "../components/input/Input";
import Label from "../components/label/Label";
import AuthenticationPage from "./AuthenticationPage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/button/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userApi from "../api/userApi";
import { verify } from "../redux/auth/userSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Navbar from "../components/navbar/Navbar";

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
    formState: { isValid, errors, isSubmitting },
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
    if (
      JSON.parse(localStorage.getItem("user")) === null &&
      localStorage.getItem("jwt") === null
    ) {
      return navigate("/sign-up");
    } else if (JSON.parse(localStorage.getItem("user")).active === "active") {
      toast.success("Chào mừng bạn đến với HC.VN", { pauseOnHover: false });
      return navigate("/");
    }
  }, []);

  const dem = useRef(0);
  const dispatch = useDispatch();

  const handleVerify = async (values) => {
    if (!isValid) return;
    console.log(values);
    const data = {
      encode: values.verify,
    };
    try {
      const action = verify(data);
      const resultAction = await dispatch(action);
      const user = unwrapResult(resultAction);
      console.log("Verify", user);
      toast.success("Chào mừng bạn đến với HC.VN", { pauseOnHover: false });
      navigate("/");
      reset({
        verify: "",
      });
    } catch (error) {
      dem.current = dem.current + 1;
      console.log(dem.current);
      if (dem.current >= 3) {
        const data = {
          state: "ban",
        };
        toast.warning("Bạn nhập sai mã xác nhận 3 lần");
        if (JSON.parse(localStorage.getItem("user")).active === "verify") {
          const response = await userApi.changeState(data);
          console.log(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/sign-up");
          dem.current = 0;
        }
      } else {
        toast.error(error.message, { pauseOnHover: false });
      }
    }
  };
  return (
    <>
      <Navbar />
      <div>
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
      </div>
    </>
  );
};

export default VerifyPage;

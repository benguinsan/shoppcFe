import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Field from "../field/Field";
import Input from "../input/Input";
import Button from "../button/Button";
import userApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const schema = yup.object({
  verify: yup
    .string()
    .required("Vui lòng nhập mã xác nhận")
    .min(6, "Vui lòng nhập đủ 6 ký tự"),
});
const Verify = () => {
  const {
    reset,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: { verify: "" },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const handleVerify = async (values) => {
    if (!isValid) return;
    console.log(values);
    const data = {
      token: values.verify,
    };
    try {
      const response = await userApi.verifyResetPassword(data);
      navigate(`/reset-password/${response.hashedToken}`);
    } catch (error) {
      toast.error(error.message, { pauseOnHover: false });
      console.log(error.message);
    }

    reset({
      verify: "",
    });
  };
  return (
    <>
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
    </>
  );
};

export default Verify;

import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Field from "../field/Field";
import Input from "../input/Input";
import Button from "../button/Button";
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

  const handleVerify = (values) => {
    if (!isValid) return;

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

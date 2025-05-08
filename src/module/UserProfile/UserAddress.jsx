import React, { useEffect, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeding";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/button/Button";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateInfoUser } from "../../redux/auth/userSlice";
import { useNavigate } from "react-router-dom";
import Field from "../../components/field/Field";
import { action_status } from "../../utils/constants/status";
import Skeleton from "../../components/skeleton/Skeleton";

const schema = yup.object({
  address: yup
    .string()
    .required("Vui lòng nhập địa chỉ")
    .min(5, "Địa chỉ quá ngắn"),
});

const UserAddress = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      address: "",
    }
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, current, update } = useSelector((state) => state.user);
  const watchAddress = watch("address");

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập");
      navigate("/sign-in");
    }
  }, [current, navigate]);

  // Lấy thông tin user ban đầu
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Cập nhật form khi có dữ liệu user
  useEffect(() => {
    if (user && user.nguoiDung) {
      console.log("Setting address from user data:", user.nguoiDung.DiaChi);
      setValue("address", user.nguoiDung.DiaChi || "");
    }
  }, [user, setValue]);

  // Cập nhật lại dữ liệu sau khi update thành công
  useEffect(() => {
    if (update) {
      console.log("Update successful, fetching new user data");
      dispatch(getUser());
    }
  }, [update, dispatch]);

  const handleUpdateAddress = (values) => {
    if (!isValid) return;
    
    console.log("Updating address with:", values.address);
    
    // Tạo object với thông tin cần cập nhật
    const updateData = {
      ...user?.nguoiDung,
      DiaChi: values.address
    };
    
    try {
      dispatch(updateInfoUser(updateData));
      toast.dismiss();
      toast.success("Cập nhật địa chỉ thành công", { pauseOnHover: false });
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật địa chỉ");
    }
  };

  return (
    <div>
      <DashboardHeading
        title="Địa chỉ của tôi"
        className="px-5 py-5"
      ></DashboardHeading>

      <div className="bg-white rounded-lg p-5">
        {status === action_status.LOADING && (
          <div className="pb-16">
            <Field>
              <Skeleton className="w-[100px] h-4 rounded-lg" />
              <Skeleton className="w-full h-10 rounded-md" />
            </Field>
            <Skeleton className="w-[200px] h-[40px] rounded-lg mx-auto mt-10" />
          </div>
        )}
        
        {status === action_status.FAILED && (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải thông tin địa chỉ</p>
            <Button 
              kind="primary"
              onClick={() => dispatch(getUser())}
            >
              Thử lại
            </Button>
          </div>
        )}
        
        {status === action_status.SUCCEEDED && (
          <form className="pb-16" onSubmit={handleSubmit(handleUpdateAddress)}>
            <Field>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input 
                name="address" 
                control={control} 
                type="text"
                placeholder="Nhập địa chỉ của bạn"
                value={watchAddress}
              ></Input>
              {errors.address && (
                <p className="text-red-500 text-base font-medium">
                  {errors.address?.message}
                </p>
              )}
            </Field>

            <Button
              kind="primary"
              className="mx-auto w-[200px] mt-10"
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              height="50px"
            >
              Cập nhật địa chỉ
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserAddress;

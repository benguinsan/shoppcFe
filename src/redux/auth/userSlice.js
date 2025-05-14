import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";
import { action_status } from "../../utils/constants/status";
import StorageKeys from "../../utils/constants/storage-keys";

// Hàm helper để decode JWT payload
const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Array.from(atob(base64))
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const register = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userApi.register(data);

      // Kiểm tra response
      if (response) {
        // Chỉ trả về thông báo thành công, không lưu token và user vào localStorage
        return {
          success: true,
          message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.",
        };
      } else {
        console.error("Invalid response format:", response);
        return rejectWithValue("Định dạng phản hồi không hợp lệ");
      }
    } catch (error) {
      // Log toàn bộ error object để debug
      console.error("Full error object:", error);

      if (error.response) {
        // Lỗi từ server với status code
        console.error(
          "Server error:",
          error.response.status,
          error.response.data
        );
        return rejectWithValue(error.response.data || "Lỗi từ server");
      } else if (error.request) {
        // Request đã được gửi nhưng không nhận được response
        console.error("No response received:", error.request);
        return rejectWithValue("Không nhận được phản hồi từ server");
      } else {
        // Lỗi khi thiết lập request
        console.error("Request setup error:", error.message);
        return rejectWithValue(error.message || "Lỗi khi gửi yêu cầu");
      }
    }
  }
);

export const verify = createAsyncThunk("user/verify", async (payload) => {
  const response = await userApi.verify(payload);
  localStorage.setItem("tokenStream", response.tokenStream);
  localStorage.setItem(StorageKeys.TOKEN, response.token);
  localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
  return response.data.user;
});

export const changeState = createAsyncThunk(
  "user/changeState",
  async (payload) => {
    const response = await userApi.changeState(payload);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
    return response.data.user;
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (payload) => {
    console.log(payload);
    const response = await userApi.resetPassword(payload, payload.token);
    localStorage.setItem("tokenStream", response.tokenStream);
    localStorage.setItem(StorageKeys.TOKEN, response.token);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
    return response.data.user;
  }
);

export const forgotPassword = createAsyncThunk(
  "user/fotgotPassword",
  async (payload) => {
    const response = await userApi.forgotPassword(payload);
    return response.data.user;
  }
);

export const verifyResetPassword = createAsyncThunk(
  "user/verifyResetPassword",
  async (payload) => {
    const response = await userApi.verifyResetPassword(payload);
    return response;
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {

      const response = await userApi.login(data);

      // Lưu token vào localStorage
      localStorage.setItem(StorageKeys.TOKEN, response.token);

      // Sử dụng hàm decodeJwtPayload để giải mã token
      const decoded = decodeJwtPayload(response.token);

      if (decoded) {
        // Tạo object user từ thông tin trong token
        const user = {
          TenTK: decoded.TenTK,
          MaTK: decoded.MaTK,
          MaNhomQuyen: decoded.MaNhomQuyen,
        };

        // Lưu thông tin user vào localStorage
        localStorage.setItem(StorageKeys.USER, JSON.stringify(user));

        return user;
      }

      // Nếu không thể giải mã token, trả về một object cơ bản
      return { message: response.message };
    } catch (error) {
      console.error("Login error details:", error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (payload) => {
    const response = await userApi.loginWithGoogle(payload);
    localStorage.setItem("tokenStream", response.tokenStream);
    localStorage.setItem(StorageKeys.TOKEN, response.token);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
    return response.data.user;
  }
);

export const updateInfoUser = createAsyncThunk(
  "user/updateInfoUser",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("Update user data:", payload);
      const response = await userApi.updateUser(payload);

      // Lưu token mới vào localStorage nếu có
      if (response.token) {
        localStorage.setItem(StorageKeys.TOKEN, response.token);

        // Sử dụng hàm helper để decode token
        const decoded = decodeJwtPayload(response.token);

        if (decoded) {
          // Tạo object user từ thông tin trong token
          const user = {
            TenTK: decoded.TenTK,
            MaTK: decoded.MaTK,
            MaNhomQuyen: decoded.MaNhomQuyen,
            // Thêm các trường khác nếu cần
          };

          // Lưu thông tin user vào localStorage
          localStorage.setItem(StorageKeys.USER, JSON.stringify(user));
          return user;
        }
      }

      // Nếu không có token mới, trả về response
      return response.data || response;
    } catch (error) {
      console.error("Update user error details:", error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUser = createAsyncThunk("user/getUser", async () => {
  const response = await userApi.getUser();
  return response.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    current: JSON.parse(localStorage.getItem(StorageKeys.USER)) || null,
    status: action_status.IDLE,
    user: {},
    update: false,
    registerSuccess: false,
    registerMessage: "",
  },

  reducers: {
    logout(state) {
      // Xóa token JWT
      localStorage.removeItem(StorageKeys.TOKEN);

      // Xóa thông tin user
      localStorage.removeItem(StorageKeys.USER);

      // Xóa các dữ liệu khác nếu cần
      localStorage.removeItem("order");
      localStorage.removeItem("keyword");

      // Đặt current về null
      state.current = null;
    },
    refresh: (state, action) => {
      state.update = false;
    },
    clearRegisterStatus: (state) => {
      state.registerSuccess = false;
      state.registerMessage = "";
    },
  },

  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.registerSuccess = action.payload.success;
      state.registerMessage = action.payload.message;
    },
    [register.rejected]: (state, action) => {
      state.registerSuccess = false;
      state.registerMessage = action.payload || "Đăng ký thất bại";
    },
    [login.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [loginWithGoogle.fulfilled]: (state, action) => {
      state.current = action.payload;
      state.user = action.payload;
    },
    [verify.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [changeState.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [getUser.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [getUser.fulfilled]: (state, action) => {
      state.status = action_status.SUCCEEDED;
      state.user = action.payload;
      state.current = action.payload;

      // Cập nhật localStorage với thông tin user mới nhất
      localStorage.setItem(StorageKeys.USER, JSON.stringify(action.payload));
    },
    [getUser.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
    [updateInfoUser.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [updateInfoUser.fulfilled]: (state, action) => {
      state.update = true;
      state.status = action_status.SUCCEEDED;

      // Lấy thông tin user hiện tại từ localStorage
      const currentUser = JSON.parse(localStorage.getItem(StorageKeys.USER));

      // Nếu action.payload chứa thông tin địa chỉ
      if (action.payload && action.payload.DiaChi) {
        // Cập nhật địa chỉ trong state
        if (state.current) {
          state.current.DiaChi = action.payload.DiaChi;
        }
        if (state.user) {
          state.user.DiaChi = action.payload.DiaChi;
        }

        // Cập nhật địa chỉ trong localStorage
        if (currentUser) {
          currentUser.DiaChi = action.payload.DiaChi;
          localStorage.setItem(StorageKeys.USER, JSON.stringify(currentUser));
        }
      }
      // Nếu action.payload là user object từ token
      else if (
        action.payload &&
        (action.payload.TenTK || action.payload.MaTK)
      ) {
        // Cập nhật state
        state.current = action.payload;
        state.user = action.payload;

        // Cập nhật localStorage
        localStorage.setItem(StorageKeys.USER, JSON.stringify(action.payload));
      }
      // Nếu action.payload là response data
      else if (action.payload) {
        // Xử lý các trường hợp khác như trước
        if (action.payload.user) {
          state.user = action.payload.user;
          state.current = action.payload.user;
          localStorage.setItem(
            StorageKeys.USER,
            JSON.stringify(action.payload.user)
          );
        } else if (action.payload.nguoiDung) {
          state.user = action.payload.nguoiDung;
          state.current = action.payload.nguoiDung;
          localStorage.setItem(
            StorageKeys.USER,
            JSON.stringify(action.payload.nguoiDung)
          );
        } else {
          state.user = action.payload;
          state.current = action.payload;
          localStorage.setItem(
            StorageKeys.USER,
            JSON.stringify(action.payload)
          );
        }
      }
    },
    [updateInfoUser.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
  },
});

const { actions, reducer } = userSlice;
export const { logout, refresh, clearRegisterStatus } = actions;
export default reducer;

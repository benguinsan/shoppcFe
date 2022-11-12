import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";
import StorageKeys from "../../utils/constants/storage-keys";

export const register = createAsyncThunk("user/register", async (payload) => {
  const response = await userApi.register(payload);
  localStorage.setItem(StorageKeys.TOKEN, response.token);
  localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
  return response.data.user;
});

export const verify = createAsyncThunk("user/verify", async (payload) => {
  const response = await userApi.verify(payload);
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

export const login = createAsyncThunk("user/login", async (payload) => {
  const response = await userApi.login(payload);
  localStorage.setItem(StorageKeys.TOKEN, response.token);
  localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
  return response.data.user;
});

export const updateInfoUser = createAsyncThunk(
  "user/updateInfoUser",
  async (payload) => {
    const response = await userApi.updateUser(payload);
    localStorage.setItem(StorageKeys.TOKEN, response.token);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
    return response.data.user;
  }
);

export const getUser = createAsyncThunk("user/getUser", async () => {
  const response = await userApi.getUser();
  return response.data.data;
});

export const addAddress = createAsyncThunk(
  "user/addAdress",
  async (payload) => {
    const response = await userApi.addAddress(payload);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data));
    return response.data;
  }
);

export const editAddress = createAsyncThunk(
  "user/editAddress",
  async (payload) => {
    const response = await userApi.updateAddress(payload);
    console.log(response.data);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data));
    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (payload) => {
    const response = await userApi.deleteAddress(payload);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data));
    return response.data;
  }
);

export const setAddressDefault = createAsyncThunk(
  "user/setAddressDefault",
  async (payload) => {
    const response = await userApi.updateDefault(payload);
    console.log(response.data);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data));
    return response.data;
  }
);

export const getAddress = createAsyncThunk("user/getAddress", async () => {
  const response = await userApi.getAddress();
  return response.data.address;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    current: JSON.parse(localStorage.getItem(StorageKeys.USER)) || null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem(StorageKeys.TOKEN);
      localStorage.removeItem(StorageKeys.USER);
      localStorage.removeItem("feedback");
      localStorage.removeItem("cart");
      state.current = null;
    },
  },
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [login.fulfilled]: (state, action) => {
      state.current = action.payload;
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
    [updateInfoUser.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [addAddress.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [editAddress.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [setAddressDefault.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [deleteAddress.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;
export const { logout, update } = actions;
export default reducer;

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

const userSlice = createSlice({
  name: "user",
  initialState: {
    current: JSON.parse(localStorage.getItem(StorageKeys.USER)) || null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem(StorageKeys.TOKEN);
      localStorage.removeItem(StorageKeys.USER);
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
    [updateInfoUser.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;
export const { logout, update } = actions;
export default reducer;

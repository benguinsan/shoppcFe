import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewApi from "../../api/reviewApi";
import { action_status } from "../../utils/constants/status";
import { toast } from "react-toastify";
export const createFeedback = createAsyncThunk(
  "user/createFeedback",
  async (payload, thunkApi) => {
    try {
      const response = await reviewApi.postReview(payload);
      toast.dismiss();
      toast.success("Cảm ơn bạn đã đánh giá sản phẩm", { pauseOnHover: false });
      return response.data;
    } catch (error) {
      toast.dismiss();
      toast.warning("Bạn đã đánh giá sản phẩm rồi", { pauseOnHover: false });
    }
  }
);

export const getFeedback = createAsyncThunk(
  "user/getFeedback",
  async (payload) => {
    const response = await reviewApi.getReview(payload);
    return response.data;
  }
);

export const updateFeedback = createAsyncThunk(
  "user/updateFeedback",
  async (payload) => {
    const data = {
      rating: payload.rating,
      review: payload.review,
    };
    const response = await reviewApi.updateReview(data, payload.product);
    return response.data;
  }
);

export const deleteReview = createAsyncThunk(
  "user/deleteReview",
  async (payload) => {
    const response = await reviewApi.deleteReview(payload.id);
    return response.data;
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbackAdd: false,
    feedbackUpdate: false,
    feedbackDelete: false,
    feedback: {},
  },
  reducers: {
    refresh: (state, action) => {
      state.feedbackAdd = false;
      state.feedbackUpdate = false;
      state.feedbackDelete = false;
    },
  },
  extraReducers: {
    [getFeedback.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [getFeedback.fulfilled]: (state, action) => {
      state.status = action_status.SUCCEEDED;
      state.feedback = action.payload;
    },
    [getFeedback.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
    [createFeedback.fulfilled]: (state, action) => {
      state.feedbackAdd = true;
    },
    [updateFeedback.fulfilled]: (state, action) => {
      state.feedbackUpdate = true;
    },
    [deleteReview.fulfilled]: (state, action) => {
      state.feedbackDelete = true;
    },
  },
});

const { actions, reducer } = feedbackSlice;
export const { refresh } = actions;
export default reducer;

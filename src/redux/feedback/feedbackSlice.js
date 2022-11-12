import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewApi from "../../api/reviewApi";

export const createFeedback = createAsyncThunk(
  "user/createFeedback",
  async (payload) => {
    const response = await reviewApi.postReview(payload);
    localStorage.setItem("feedback", JSON.stringify(response.data));
    return response.data;
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
    console.log(payload.product);
    console.log(data);
    const response = await reviewApi.updateReview(data, payload.product);
    localStorage.setItem("feedback", JSON.stringify(response.data));
    return response.data;
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedback: JSON.parse(localStorage.getItem("feedback")) || null,
  },
  extraReducers: {
    [createFeedback.fulfilled]: (state, action) => {
      state.feedback = action.payload;
    },
    [updateFeedback.fulfilled]: (state, action) => {
      state.feedback = action.payload;
    },
  },
});

const { actions, reducer } = feedbackSlice;
export default reducer;

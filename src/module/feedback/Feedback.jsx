import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StatisticFeedback from "./StatisticFeedback";
import ModalAdvanced from "../../components/Modal/ModalAdvanced";
import { useState } from "react";
import Rating from "./Rating";
import {
  createFeedback,
  getFeedback,
  refresh,
} from "../../redux/feedback/feedbackSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import LoadingPage from "../../components/loading/LoadingPage";
import { action_status } from "../../utils/constants/status";
import FeedbackList from "../feedback/FeedbackList";

const Feelback = ({ id, data }) => {
  const { current } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const {
    feedbackAdd,
    feedbackUpdate,
    feedbackDelete,
    status,
    feedback,
    error,
  } = useSelector((state) => state.feedback);

  const handleClick = () => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập");
      return;
    } else {
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = (values) => {
    const data = {
      rating: values.stars,
      review: values.content,
      product: id,
    };
    dispatch(createFeedback(data));
  };

  useEffect(() => {
    dispatch(getFeedback(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (feedbackAdd) {
      dispatch(getFeedback(id));
      dispatch(refresh());
    }
    if (feedbackUpdate) {
      dispatch(getFeedback(id));
      dispatch(refresh());
    }
    if (feedbackDelete) {
      dispatch(getFeedback(id));
      dispatch(refresh());
    }
  }, [feedbackAdd, feedbackUpdate, feedbackDelete, dispatch]);

  return (
    <div className="mt-10">
      {status === action_status.LOADING && <LoadingPage />}
      {status === action_status.SUCCEEDED && (
        <>
          {" "}
          <div className="container bg-white rounded-lg p-5">
            <span className="text-xl font-bold">
              Đánh giá & nhận xét {data?.title}
            </span>
            <StatisticFeedback data={feedback} />
            <div className="flex flex-col items-center gap-y-5 py-5">
              <span className="text-xl ">Bạn đánh giá sao sản phẩm này</span>
              <button
                className="text-lg py-3 px-10 rounded-lg font-medium text-white bg-red-600"
                onClick={handleClick}
              >
                Đánh giá ngay
              </button>
            </div>
            <FeedbackList data={feedback.data} />
          </div>
          <ModalAdvanced
            visible={showModal}
            onClose={() => {
              setShowModal(false);
            }}
            bodyClassName="w-[600px] bg-white p-10 rounded-lg relative z-10 content h-[600px] overflow-y-auto overflow-x-hidden"
          >
            <Rating
              onClose={handleClose}
              onSubmit={handleSubmit}
              id={data?._id}
            />
          </ModalAdvanced>
        </>
      )}
    </div>
  );
};

export default Feelback;

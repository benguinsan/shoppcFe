import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createComment,
  getComment,
  refresh,
} from "../../redux/feedback/commentSlice";
import CommentList from "./CommentList";
import Pagination from "react-js-pagination";
import { action_status } from "../../utils/constants/status";
import LoadingPage from "../loading/LoadingPage";
import { toast } from "react-toastify";

const Comment = ({ id }) => {
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const {
    commentAdd,
    commentDelete,
    commentUpdate,
    comment,
    totalPage,
    status,
  } = useSelector((state) => state.comment);
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.user);

  const handleSend = () => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập để thực hiện", { pauseOnHover: false });
      return;
    }
    if (text === "") {
      toast.dismiss();
      toast.warning("Vui lòng điền nội dung", { pauseOnHover: false });
      return;
    }
    try {
      const data = {
        comment: text,
        product: id,
        parent: null,
      };
      dispatch(createComment(data));
      setText("");
    } catch (error) {
      console.log(error.message);
    }
  };

  // console.log("Comment:", comment);
  // console.log("id", id);

  useEffect(() => {
    try {
      const data = {
        id: id,
        page: page,
      };
      dispatch(getComment(data));
    } catch (error) {
      console.log(error.message);
    }
  }, [page, id]);

  useEffect(() => {
    if (commentAdd) {
      const data = {
        id: id,
        page: page,
      };
      dispatch(getComment(data));
      dispatch(refresh());
    }
    if (commentUpdate) {
      const data = {
        id: id,
        page: page,
      };
      dispatch(getComment(data));
      dispatch(refresh());
    }
    if (commentDelete) {
      const data = {
        id: id,
        page: page,
      };
      dispatch(getComment(data));
      dispatch(refresh());
    }
  }, [commentAdd, commentUpdate, commentDelete]);

  const handlePageClick = (values) => {
    setPage(values);
    console.log("PageComment:", values);
  };

  return (
    <div className="mt-10">
      {status === action_status.LOADING && (
        <div className="container bg-white rounded-lg p-5">
          <LoadingPage />
        </div>
      )}
      {status === action_status.SUCCEEDED && (
        <>
          <div className="container bg-white  rounded-lg p-5">
            <span className="text-xl font-bold">Hỏi và đáp</span>
            <div className="flex items-start mt-5 gap-x-4">
              <textarea
                placeholder="Xin mời bạn để lại câu hỏi, HC.VN sẽ trả lời lại trong 1h, các câu hỏi sau 22h-8h sẽ được trả lời vào sáng hôm sau ..."
                className="w-full h-[150px] bg-[#f8f8f8] p-5 text-base font-medium rounded-lg resize-none border-2 border-solid"
                onChange={(e) => setText(e.target.value)}
              />
              <button
                className="px-6 py-3 rounded-lg bg-red-700 text-white font-bold"
                onClick={handleSend}
              >
                Gửi
              </button>
            </div>
            <div className="w-[1300px] overflow-hidden">
              <CommentList data={comment.data} />
            </div>
          </div>
          <div className="flex justify-center items-center mt-2">
            <Pagination
              activePage={page}
              nextPageText={">"}
              prevPageText={"<"}
              totalItemsCount={totalPage}
              itemsCountPerPage={1}
              firstPageText={"<<"}
              lastPageText={">>"}
              linkClass="page-num"
              onChange={handlePageClick}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Comment;

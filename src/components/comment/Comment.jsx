import React from "react";
import { useState } from "react";
import CommentItem from "./CommentItem";
import { commentData } from "../../api/commentApi";

const Comment = () => {
  const [text, setText] = useState("");
  const handleSend = () => {
    console.log("Text:", text);
  };
  console.log(commentData);

  return (
    <div className="mt-10">
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
        {commentData?.length > 0 &&
          commentData.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
      </div>
    </div>
  );
};

export default Comment;

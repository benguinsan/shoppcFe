import React from "react";
import FeedbackItem from "./FeedbackItem";

const Feedback = [
  {
    id: 1,
    img: "https://i.pinimg.com/564x/91/d7/c3/91d7c3f8b4591b65b90f6b6b3f8c934d.jpg",
    name: "Good boy",
    star: 4,
    content: "Sản phẩm tốt dùng sướng.",
  },
  {
    id: 2,
    img: "https://i.pinimg.com/564x/69/f4/25/69f425930ddc834a8e777a06cfa78af3.jpg",
    name: "Good girl",
    star: 5,
    content: "Sản phẩm mình khá ưng ý",
  },
  {
    id: 3,
    img: "https://i.pinimg.com/564x/fc/7d/83/fc7d837c5c1e43f8cf81253e35b7806b.jpg",
    name: "Hello world",
    star: 3,
    content:
      "ền nào của nấy. tóm gọn lại là đỉnh cao của Tablet. Màn chỉ là LCD nhưng rất đẹp. pin trâu. sạc cũng tương đối nhanh. Dùng chip M1 của laptop nên hiệu năng bỏ xa các chip di động khác như Snapdragon hay Apple A. Mới dùng vài ngày thôi hi vọng là dùng bền.",
  },
];
const FeedbackList = () => {
  return (
    <div>
      {Feedback?.length > 0 &&
        Feedback.map((item) => <FeedbackItem key={item.id} data={item} />)}
    </div>
  );
};

export default FeedbackList;

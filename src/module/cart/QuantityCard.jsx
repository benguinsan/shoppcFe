import React, { useState } from "react";

const QuantityCard = () => {
  const [quantity, setQuantity] = useState(1);
  const handleDecreaseQuantity = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber <= 1) {
      return;
    }
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };
  const handleIncreaseQuantity = () => {
    // 5 số lượng tồn kho
    const count = document.querySelector(".count");
    if (count.valueAsNumber >= 5) {
      return;
    }
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  return (
    <div className="flex items-center">
      <span
        className="inline-block p-2 bg-[#f8f8fc] cursor-pointer"
        onClick={handleDecreaseQuantity}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
        </svg>
      </span>
      <input
        type="number"
        value={quantity}
        readOnly
        className="p-2 bg-[#f8f8fc] w-[50px] text-center count"
      ></input>
      <span
        className="inline-block p-2 bg-[#f8f8fc] cursor-pointer"
        onClick={handleIncreaseQuantity}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m6-6H6"
          />
        </svg>
      </span>
    </div>
  );
};

export default QuantityCard;

import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const PriceCard = () => {
  return (
    <div className="flex flex-col items-end justify-center">
      <span className="text-xl font-semibold">{formatPrice(27000000)}</span>
      <span className="text-base line-through">{formatPrice(36990000)}</span>
    </div>
  );
};

export default PriceCard;

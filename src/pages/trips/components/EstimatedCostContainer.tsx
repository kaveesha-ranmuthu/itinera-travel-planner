import React from "react";
import { twMerge } from "tailwind-merge";

interface EstimatedCostContainerProps {
  estimatedTotalCost: number;
  userCurrencySymbol?: string;
  backgroundColor: string;
}

const EstimatedCostContainer: React.FC<EstimatedCostContainerProps> = ({
  estimatedTotalCost,
  userCurrencySymbol,
  backgroundColor,
}) => {
  return (
    <div className={twMerge("px-4 py-1 rounded-xl", backgroundColor)}>
      <span>Estimated cost per person: </span>
      <span>
        {userCurrencySymbol}
        {estimatedTotalCost}
      </span>
    </div>
  );
};

export default EstimatedCostContainer;

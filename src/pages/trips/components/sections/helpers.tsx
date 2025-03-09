import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

export const getSortArrowComponent = (currentSortDirection: "asc" | "desc") => {
  return currentSortDirection === "desc" ? (
    <IoIosArrowRoundUp size={20} />
  ) : (
    <IoIosArrowRoundDown size={20} />
  );
};

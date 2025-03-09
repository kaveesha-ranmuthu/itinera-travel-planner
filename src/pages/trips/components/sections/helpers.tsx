import axios from "axios";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

export const getSortArrowComponent = (currentSortDirection: "asc" | "desc") => {
  return currentSortDirection === "desc" ? (
    <IoIosArrowRoundUp size={20} />
  ) : (
    <IoIosArrowRoundDown size={20} />
  );
};

export const convertCurrency = async (
  base: string,
  target: string,
  amount: number
): Promise<number> => {
  const sessionStorageKey = `${base}-${target}`;
  const cachedRate = sessionStorage.getItem(sessionStorageKey);
  if (cachedRate) {
    return parseFloat(cachedRate) * amount;
  }
  try {
    const response = await axios.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base.toLowerCase()}.json`
    );

    const rate = response.data[base.toLowerCase()][target.toLowerCase()];

    if (!rate) {
      throw new Error("Failed to fetch currency conversion rate.");
    }
    sessionStorage.setItem(sessionStorageKey, rate);
    return rate * amount;
  } catch (error) {
    throw new Error(`Failed to fetch currency conversion rate: ${error}`);
  }
};

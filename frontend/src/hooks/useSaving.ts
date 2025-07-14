import { useContext } from "react";
import { SavingContext } from "../app/contexts";

export const useSaving = () => useContext(SavingContext);

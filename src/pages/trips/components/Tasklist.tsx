import React from "react";
import PopoverMenu from "./PopoverMenu";
import { GoTasklist } from "react-icons/go";

const Tasklist = () => {
  return (
    <PopoverMenu
      popoverTrigger={<GoTasklist fill="var(--color-primary)" size={20} />}
    >
      aaa
    </PopoverMenu>
  );
};

export default Tasklist;

import { PaperPlane } from "../assets/PaperPlane";
import { LuEllipsisVertical } from "react-icons/lu";

const Header = () => {
  return (
    <nav className="px-6 py-2 flex items-center justify-between">
      <PaperPlane fill="#3b4043" width={30} />
      <LuEllipsisVertical fill="#3b4043" size={20} />
    </nav>
  );
};

export default Header;

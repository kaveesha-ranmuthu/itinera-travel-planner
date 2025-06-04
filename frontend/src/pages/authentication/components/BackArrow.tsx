import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BackArrow = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(-1);
      }}
      className="z-10 absolute cursor-pointer hover:opacity-80 transition ease-in-out duration-300 text-primary left-3 top-5 flex items-center"
    >
      <IoIosArrowRoundBack className="text-primary" size={30} />
      <span className="font-brand tracking-wide italic text-lg">Go back</span>
    </button>
  );
};

export default BackArrow;

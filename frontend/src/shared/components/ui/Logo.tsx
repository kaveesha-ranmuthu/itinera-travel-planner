import { twMerge } from "tailwind-merge";
import frontPageLogo from "../assets/title.svg";

interface LogoProps {
  scale?: string;
  marginLeft?: string;
}

const Logo: React.FC<LogoProps> = ({ scale, marginLeft }) => {
  return (
    <div className={twMerge("ml-16", scale, marginLeft)}>
      <img src={frontPageLogo} alt="itinera travel planner" />
    </div>
  );
};

export default Logo;

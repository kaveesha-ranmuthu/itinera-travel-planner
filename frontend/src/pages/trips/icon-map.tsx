import {
  FaBed,
  FaBicycle,
  FaFish,
  FaHotel,
  FaPizzaSlice,
  FaStar,
  FaSuitcase,
  FaSwimmingPool,
  FaTheaterMasks,
  FaTicketAlt,
  FaWalking,
} from "react-icons/fa";
import { FaBowlFood, FaHouse } from "react-icons/fa6";
import { IoBed, IoFastFood, IoRestaurantSharp } from "react-icons/io5";
import {
  MdCake,
  MdEmojiFoodBeverage,
  MdOutlineRestaurant,
} from "react-icons/md";
import { BiSolidDrink, BiSolidSushi } from "react-icons/bi";
import { PiPinwheelFill, PiWineFill } from "react-icons/pi";
import { RiEmotionHappyFill } from "react-icons/ri";
import { SiApplearcade } from "react-icons/si";
import { TbBowlChopsticksFilled } from "react-icons/tb";

type FoodIcons =
  | "food-bowl"
  | "fast-food"
  | "coffee"
  | "cutlery"
  | "cutlery-2"
  | "fish"
  | "sushi"
  | "cake"
  | "pizza"
  | "wine"
  | "drink"
  | "chopstick-bowl";

type ActivityIcons =
  | "ticket"
  | "masks"
  | "person-walking"
  | "star"
  | "happy"
  | "bicycle"
  | "pinwheel"
  | "arcade"
  | "pool-ladder";

type AccommodationIcons = "house" | "hotel" | "bed" | "bed-2" | "suitcase";

export type IconId = FoodIcons | ActivityIcons | AccommodationIcons;

export const foodIcons: Record<FoodIcons, React.ReactNode> = {
  "food-bowl": <FaBowlFood size={20} />,
  "fast-food": <IoFastFood size={20} />,
  coffee: <MdEmojiFoodBeverage size={20} />,
  cutlery: <IoRestaurantSharp size={20} />,
  "cutlery-2": <MdOutlineRestaurant size={20} />,
  fish: <FaFish size={20} />,
  sushi: <BiSolidSushi size={20} />,
  cake: <MdCake size={20} />,
  pizza: <FaPizzaSlice size={20} />,
  wine: <PiWineFill size={20} />,
  drink: <BiSolidDrink size={20} />,
  "chopstick-bowl": <TbBowlChopsticksFilled size={20} />,
};

export const activityIcons: Record<ActivityIcons, React.ReactNode> = {
  ticket: <FaTicketAlt size={20} />,
  masks: <FaTheaterMasks size={20} />,
  "person-walking": <FaWalking size={20} />,
  star: <FaStar size={20} />,
  happy: <RiEmotionHappyFill size={20} />,
  bicycle: <FaBicycle size={20} />,
  pinwheel: <PiPinwheelFill size={20} />,
  arcade: <SiApplearcade size={20} />,
  "pool-ladder": <FaSwimmingPool size={20} />,
};

export const accommodationIcons: Record<AccommodationIcons, React.ReactNode> = {
  house: <FaHouse size={20} />,
  hotel: <FaHotel size={20} />,
  bed: <FaBed size={20} />,
  "bed-2": <IoBed size={20} />,
  suitcase: <FaSuitcase size={20} />,
};

export const allIcons = {
  ...foodIcons,
  ...activityIcons,
  ...accommodationIcons,
};

type IconColour = {
  backgroundColour: string;
  colour: string;
};

export const iconColours: IconColour[] = [
  {
    backgroundColour: "bg-[#BCD8EC]",
    colour: "text-[#BCD8EC]",
  },
  {
    backgroundColour: "bg-[#D6E5BD]",
    colour: "text-[#D6E5BD]",
  },
  {
    backgroundColour: "bg-[#f9e1a8]",
    colour: "text-[#f9e1a8]",
  },
  {
    backgroundColour: "bg-secondary",
    colour: "text-secondary",
  },
  {
    backgroundColour: "bg-primary",
    colour: "text-primary",
  },
];

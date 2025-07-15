import { BiSolidDrink, BiSolidSushi } from "react-icons/bi";
import {
  FaBed,
  FaBookmark,
  FaBus,
  FaCar,
  FaFish,
  FaHotel,
  FaParking,
  FaPizzaSlice,
  FaPlane,
  FaStar,
  FaSuitcase,
  FaSwimmingPool,
  FaTheaterMasks,
  FaTicketAlt,
  FaTrain,
  FaWalking,
} from "react-icons/fa";
import { FaBowlFood, FaHeart, FaHouse } from "react-icons/fa6";
import {
  IoBed,
  IoFastFood,
  IoRestaurantSharp,
  IoSparkles,
} from "react-icons/io5";
import {
  MdCake,
  MdEmojiFoodBeverage,
  MdOutlineRestaurant,
  MdPhotoCamera,
} from "react-icons/md";
import { PiPinwheelFill, PiWineFill } from "react-icons/pi";
import { RiDrinks2Fill, RiEmotionHappyFill } from "react-icons/ri";
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
  | "drink-2"
  | "chopstick-bowl";

type ActivityIcons =
  | "ticket"
  | "masks"
  | "person-walking"
  | "happy"
  | "pinwheel"
  | "arcade"
  | "pool-ladder";

type AccommodationIcons = "house" | "hotel" | "bed" | "bed-2" | "suitcase";

type MiscIcons =
  | "star"
  | "train"
  | "bus"
  | "car"
  | "heart"
  | "bookmark"
  | "plane"
  | "parking"
  | "sparkle"
  | "camera";

export type IconId = FoodIcons | ActivityIcons | AccommodationIcons | MiscIcons;

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
  "drink-2": <RiDrinks2Fill size={20} />,
  "chopstick-bowl": <TbBowlChopsticksFilled size={20} />,
};

export const activityIcons: Record<ActivityIcons, React.ReactNode> = {
  ticket: <FaTicketAlt size={20} />,
  masks: <FaTheaterMasks size={20} />,
  "person-walking": <FaWalking size={20} />,
  happy: <RiEmotionHappyFill size={20} />,
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

export const miscIcons: Record<MiscIcons, React.ReactNode> = {
  camera: <MdPhotoCamera size={20} />,
  star: <FaStar size={20} />,
  heart: <FaHeart size={20} />,
  bookmark: <FaBookmark size={20} />,
  sparkle: <IoSparkles size={20} />,
  train: <FaTrain size={20} />,
  bus: <FaBus size={20} />,
  car: <FaCar size={20} />,
  plane: <FaPlane size={20} />,
  parking: <FaParking size={20} />,
};

export const allIcons: Record<IconId, React.ReactNode> = {
  ...foodIcons,
  ...activityIcons,
  ...accommodationIcons,
  ...miscIcons,
};

type IconColour = {
  backgroundColour: string;
  colour: string;
};

export const iconColours: IconColour[] = [
  {
    backgroundColour: "bg-[#f9e242]",
    colour: "text-[#f9e242]",
  },
  {
    backgroundColour: "bg-[#f8b120]",
    colour: "text-[#f8b120]",
  },
  {
    backgroundColour: "bg-[#ee7235]",
    colour: "text-[#ee7235]",
  },
  {
    backgroundColour: "bg-[#f48fb1]",
    colour: "text-[#f48fb1]",
  },
  {
    backgroundColour: "bg-[#f06293]",
    colour: "text-[#f06293]",
  },
  {
    backgroundColour: "bg-[#990000]",
    colour: "text-[#990000]",
  },
  {
    backgroundColour: "bg-[#7b1753]",
    colour: "text-[#7b1753]",
  },
  {
    backgroundColour: "bg-[#561c51]",
    colour: "text-[#561c51]",
  },
  {
    backgroundColour: "bg-[#c6da8c]",
    colour: "text-[#c6da8c]",
  },
  {
    backgroundColour: "bg-[#a7c365]",
    colour: "text-[#a7c365]",
  },
  {
    backgroundColour: "bg-[#02500e]",
    colour: "text-[#02500e]",
  },
  {
    backgroundColour: "bg-[#b2def6]",
    colour: "text-[#b2def6]",
  },
  {
    backgroundColour: "bg-[#59a7dd]",
    colour: "text-[#59a7dd]",
  },
  {
    backgroundColour: "bg-[#1c3d78]",
    colour: "text-[#1c3d78]",
  },
  {
    backgroundColour: "bg-[#3b4043]",
    colour: "text-[#3b4043]",
  },
  {
    backgroundColour: "bg-[#f4f1e8]",
    colour: "text-[#f4f1e8]",
  },
];

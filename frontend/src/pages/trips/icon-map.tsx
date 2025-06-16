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
  "food-bowl": <FaBowlFood size={20} className="text-secondary" />,
  "fast-food": <IoFastFood size={20} className="text-secondary" />,
  coffee: <MdEmojiFoodBeverage size={20} className="text-secondary" />,
  cutlery: <IoRestaurantSharp size={20} className="text-secondary" />,
  "cutlery-2": <MdOutlineRestaurant size={20} className="text-secondary" />,
  fish: <FaFish size={20} className="text-secondary" />,
  sushi: <BiSolidSushi size={20} className="text-secondary" />,
  cake: <MdCake size={20} className="text-secondary" />,
  pizza: <FaPizzaSlice size={20} className="text-secondary" />,
  wine: <PiWineFill size={20} className="text-secondary" />,
  drink: <BiSolidDrink size={20} className="text-secondary" />,
  "chopstick-bowl": (
    <TbBowlChopsticksFilled size={20} className="text-secondary" />
  ),
};

export const activityIcons: Record<ActivityIcons, React.ReactNode> = {
  ticket: <FaTicketAlt size={20} className="text-secondary" />,
  masks: <FaTheaterMasks size={20} className="text-secondary" />,
  "person-walking": <FaWalking size={20} className="text-secondary" />,
  star: <FaStar size={20} className="text-secondary" />,
  happy: <RiEmotionHappyFill size={20} className="text-secondary" />,
  bicycle: <FaBicycle size={20} className="text-secondary" />,
  pinwheel: <PiPinwheelFill size={20} className="text-secondary" />,
  arcade: <SiApplearcade size={20} className="text-secondary" />,
  "pool-ladder": <FaSwimmingPool size={20} className="text-secondary" />,
};

export const accommodationIcons: Record<AccommodationIcons, React.ReactNode> = {
  house: <FaHouse size={20} className="text-secondary" />,
  hotel: <FaHotel size={20} className="text-secondary" />,
  bed: <FaBed size={20} className="text-secondary" />,
  "bed-2": <IoBed size={20} className="text-secondary" />,
  suitcase: <FaSuitcase size={20} className="text-secondary" />,
};

export const allIcons = {
  ...foodIcons,
  ...activityIcons,
  ...accommodationIcons,
};

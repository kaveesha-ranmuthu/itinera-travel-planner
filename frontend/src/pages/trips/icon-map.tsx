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
  FaWalking,
} from "react-icons/fa";
import { FaBowlFood, FaHouse, FaTicketSimple } from "react-icons/fa6";
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
  | "drink";

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

type IconId = FoodIcons | ActivityIcons | AccommodationIcons;

interface IconMap {
  id: IconId;
  component: React.ReactNode;
}

export const foodIcons: IconMap[] = [
  {
    id: "food-bowl",
    component: <FaBowlFood />,
  },
  {
    id: "fast-food",
    component: <IoFastFood />,
  },
  {
    id: "coffee",
    component: <MdEmojiFoodBeverage />,
  },
  {
    id: "cutlery",
    component: <IoRestaurantSharp />,
  },
  {
    id: "cutlery-2",
    component: <MdOutlineRestaurant />,
  },
  {
    id: "fish",
    component: <FaFish />,
  },
  {
    id: "sushi",
    component: <BiSolidSushi />,
  },
  {
    id: "cake",
    component: <MdCake />,
  },
  { id: "wine", component: <PiWineFill /> },
  {
    id: "pizza",
    component: <FaPizzaSlice />,
  },
  { id: "drink", component: <BiSolidDrink /> },
];

export const activityIcons: IconMap[] = [
  {
    id: "ticket",
    component: <FaTicketSimple />,
  },
  {
    id: "masks",
    component: <FaTheaterMasks />,
  },
  { id: "person-walking", component: <FaWalking /> },
  { id: "star", component: <FaStar /> },
  { id: "happy", component: <RiEmotionHappyFill /> },
  { id: "bicycle", component: <FaBicycle /> },
  { id: "pinwheel", component: <PiPinwheelFill /> },
  { id: "arcade", component: <SiApplearcade /> },
  { id: "pool-ladder", component: <FaSwimmingPool /> },
];

export const accommodationIcons: IconMap[] = [
  {
    id: "house",
    component: <FaHouse />,
  },
  {
    id: "hotel",
    component: <FaHotel />,
  },
  {
    id: "bed",
    component: <FaBed />,
  },
  {
    id: "bed-2",
    component: <IoBed />,
  },
  {
    id: "suitcase",
    component: <FaSuitcase />,
  },
];

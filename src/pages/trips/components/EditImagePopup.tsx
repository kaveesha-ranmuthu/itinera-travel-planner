import React from "react";
import PopoverMenu from "./PopoverMenu";
import { FiEdit } from "react-icons/fi";
import { ImageInfo, images } from "../images/images";

interface EditImagePopupProps {
  onImageClick: (imageSrc: string) => void;
}

const EditImagePopup: React.FC<EditImagePopupProps> = ({ onImageClick }) => {
  return (
    <PopoverMenu
      className="absolute bottom-2 right-2"
      popoverWidth="w-md"
      popoverTrigger={
        <button
          type="button"
          className="bg-primary absolute bottom-2 right-2 p-2 rounded-lg cursor-pointer hover:opacity-85 transition ease-in-out duration-300"
        >
          <FiEdit stroke="#3b4043" size={20} />
        </button>
      }
    >
      <h1 className="text-2xl font-brand italic tracking-wider mb-2">
        Edit Image
      </h1>
      <div className="space-y-5">
        {images.map((image) => (
          <ImageSection {...image} onImageClick={onImageClick} />
        ))}
      </div>
    </PopoverMenu>
  );
};

interface ImageSectionProps extends ImageInfo {
  onImageClick: (imageSrc: string) => void;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  artist,
  images,
  onImageClick,
}) => {
  return (
    <div>
      <h3 className="font-brand italic tracking-wider mb-2">{artist}</h3>
      <div className="grid grid-cols-4 gap-2 gap-y-5">
        {images.map((image) => {
          return (
            <img
              onClick={() => onImageClick(image)}
              src={image}
              className="object-cover w-24 h-14 rounded drop-shadow-(--drop-shadow-default) hover:opacity-90 cursor-pointer"
            />
          );
        })}
      </div>
    </div>
  );
};

export default EditImagePopup;

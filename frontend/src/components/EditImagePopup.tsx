import React, { useRef } from "react";
import PopoverMenu from "./PopoverMenu";
import { FiEdit } from "react-icons/fi";
import { ImageInfo, images } from "../assets/images";
import Button from "./Button";

interface EditImagePopupProps {
  onImageClick: (imageSrc: string) => void;
  onImageUpload: (file: File) => void;
}

const EditImagePopup: React.FC<EditImagePopupProps> = ({
  onImageClick,
  onImageUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      onImageUpload(selectedFile);
    }
  };

  return (
    <PopoverMenu
      className="absolute bottom-2 right-2"
      popoverWidth="w-md"
      popoverTrigger={
        <div className="bg-primary absolute bottom-2 right-2 p-2 rounded-lg cursor-pointer hover:opacity-85 transition ease-in-out duration-300">
          <FiEdit stroke="#3b4043" size={20} />
        </div>
      }
    >
      <div className="flex items-center mb-2 justify-between">
        <h1 className="text-2xl font-brand italic tracking-wider">
          Edit Image
        </h1>
        <Button.Primary
          className="border border-secondary normal-case py-1 px-3"
          onClick={handleUploadButtonClick}
        >
          Upload Image
        </Button.Primary>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      <div className="space-y-5">
        {images.map((image) => (
          <ImageSection
            key={image.artist}
            {...image}
            onImageClick={onImageClick}
          />
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
      <h1 className="font-brand italic tracking-wider mb-2">{artist}</h1>
      <div className="grid grid-cols-4 gap-2 gap-y-5">
        {images.map((image) => {
          return (
            <img
              key={image}
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

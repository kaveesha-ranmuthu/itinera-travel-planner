export const compressAndConvertToBase64 = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (!event.target?.result) return reject("Failed to load image");
      img.src = event.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // ✅ Resize while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        } else {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context failed");

      ctx.drawImage(img, 0, 0, width, height);

      // ✅ Convert to Base64 (JPEG with 70% quality)
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = (error) => reject(error);
  });
};

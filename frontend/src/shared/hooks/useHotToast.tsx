import { useCallback } from "react";
import toast, { ToastOptions } from "react-hot-toast";

export type ToastVariant = "success" | "error" | "info";

export const useHotToast = () => {
  const primaryColor = "#f4f1e8";
  const secondaryColor = "#3b4043";
  const red = "#b04a46";
  const green = "#609553";
  const font = '"ZT Bros Oskon 90s", sans-serif';

  const notify = useCallback((message: string, variant: ToastVariant) => {
    const defaultStyles: ToastOptions = {
      position: "top-center",
      duration: 5000,
      style: {
        padding: "15px 30px",
        maxWidth: "700px",
        fontFamily: font,
        fontStyle: "italic",
        letterSpacing: "1px",
      },
    };

    switch (variant) {
      case "success":
        return toast(message, {
          ...defaultStyles,
          style: {
            backgroundColor: green,
            color: primaryColor,
            ...defaultStyles.style,
          },
        });
      case "error":
        return toast(message, {
          ...defaultStyles,
          style: {
            backgroundColor: red,
            color: primaryColor,
            ...defaultStyles.style,
          },
        });
      case "info":
        return toast(message, {
          ...defaultStyles,
          style: {
            backgroundColor: secondaryColor,
            color: primaryColor,
            ...defaultStyles.style,
          },
        });
    }
  }, []);

  return { notify };
};

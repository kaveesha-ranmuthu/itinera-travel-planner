export enum FontFamily {
  HANDWRITTEN = "font-family-handwritten",
  SANS_SERIF = "font-family-sans italic font-extralight",
  SERIF_BRAND = "font-brand italic tracking-wider",
  SERIF = "font-family-serif",
}

export type UserSettings = {
  font: FontFamily;
};

export type UserType = {
  userId: string;
  email: string;
  createdAt: Date;
  settings: UserSettings;
};

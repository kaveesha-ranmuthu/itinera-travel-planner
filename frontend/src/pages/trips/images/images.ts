import { images as janBrueghelTheYoungerImages } from "./jan-brueghel-the-younger";
import { images as ivanKonstantinovichAivazovskyImages } from "./ivan-konstantinovich-aivazovsky";
import { images as felixBrardImages } from "./felix-brard";
export interface ImageInfo {
  artist: string;
  images: string[];
}

export const images: ImageInfo[] = [
  { artist: "Jan Brueghel the Younger", images: janBrueghelTheYoungerImages },
  {
    artist: "Ivan Konstantinovich Aivazovsky",
    images: ivanKonstantinovichAivazovskyImages,
  },
  {
    artist: "Felix Brard",
    images: felixBrardImages,
  },
];

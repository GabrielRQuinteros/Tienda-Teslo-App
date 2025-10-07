import { Gender } from "@/components/interfaces";

const categoryToSpanishVec: Record<Gender, string> = {
  men: "hombres",
  women: "mujeres",
  kids: "niños",
  unisex: "unisex",
};

export const categoryToSpanish = (category: Gender): string => {
  return categoryToSpanishVec[category] ?? null;
};

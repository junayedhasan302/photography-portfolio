
export type Album = {
  id: number;
  title: string;
  description: string;
  photoCount: number;
  cover: string;
};

export const albums: Album[] = [
  {
    id: 1,
    title: "Street Stories",
    description: "Everyday life through my lens.",
    photoCount: 18,
    cover:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
  },
  {
    id: 2,
    title: "Into Nature",
    description: "Finding beauty in the natural world.",
    photoCount: 24,
    cover:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  },
  {
    id: 3,
    title: "Open Landscapes",
    description: "Places that make us pause.",
    photoCount: 12,
    cover:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
  },
];

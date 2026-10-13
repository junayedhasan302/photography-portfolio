export type Album = {
  id: number;
  title: string;
  description: string;
  photoCount: number;
  cover: string;
  photoIds: number[];
};

export const albums: Album[] = [
  {
    id: 1,
    title: "Street Stories",
    description: "Everyday life through my lens.",
    photoCount: 4,
    cover: "/images/photography/flys.jpg",
    photoIds: [4, 6, 49, 67],
  },
  {
    id: 2,
    title: "Into Nature",
    description: "Finding beauty in the natural world.",
    photoCount: 2,
    cover: "/images/photography/blue-sea.jpg",
    photoIds: [22, 37],
  },
  {
    id: 3,
    title: "Open Landscapes",
    description: "Places that make us pause.",
    photoCount: 2,
    cover: "/images/photography/meghdol.jpg",
    photoIds: [22, 37],
  },
];
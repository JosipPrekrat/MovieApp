"use client";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoriteContext";

export default function FavoriteToggle({
  movieId,
  title,
  img,
  absolute,
}: {
  movieId: number;
  title: string;
  img: string | null;
  absolute: boolean;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <button
      onClick={() =>
        toggleFavorite({ id: movieId, title: title, poster_path: img })
      }
      className={
        absolute
          ? "group-hover:block absolute top-2 right-2 z-10 p-2 text-white bg-black/60 hover:bg-black/80 rounded-full cursor-pointer"
          : "z-10 p-2 text-white bg-black/60 hover:bg-black/80 rounded-full cursor-pointer flex-none w-[32px] h-[32px]"
      }
    >
      {isFavorite(movieId) ? (
        <Heart className="size-4" fill="currentColor" />
      ) : (
        <Heart className="size-4" />
      )}
    </button>
  );
}

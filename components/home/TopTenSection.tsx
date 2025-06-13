/* eslint-disable @next/next/no-img-element */
"use client";

import { getTopTenGenreMovies } from "@/actions/movies";
import { Movie } from "@/models/types";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FavoriteButton from "../ui/favorite";

export default function TopTenSection({
  genreId,
  title,
  description,
  blueText,
}: {
  genreId: string;
  title: string;
  description: string;
  blueText?: string;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getTopTenGenreMovies([genreId]);
      if (!data) {
        console.error("Could not load movies.");
      } else {
        setMovies(data);
      }
    };
    fetchMovies();
  }, [genreId]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth;
    const maxScrollLeft = container.scrollWidth - scrollAmount;

    if (direction === "left") {
      container.scrollTo({
        left: Math.max(0, container.scrollLeft - scrollAmount),
        behavior: "smooth",
      });
    } else {
      container.scrollTo({
        left: Math.min(maxScrollLeft, container.scrollLeft + scrollAmount),
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="pb-[120px]">
      <div className="w-full flex flex-col sm:flex-row overflow-y-visible pl-[7.5vw] group relative">
        <div className="sm:min-w-[190xp] sm:max-w-[190px] flex-none sm:h-[270px] mr-[50px] flex flex-col justify-between">
          <h2 className="text-[24px] font-[900] text-[#eaebee]">{title}</h2>
          <p className="my-[16px] text-[16px] text-[#8a8d98]">{description}</p>
          <p>{blueText || ""}</p>
        </div>
        <div className="max-h-[500px]">
          {/* Left Nav */}
          <div
            className="hidden group-hover:flex absolute sm:left-[365px] h-[270px] sm:h-full items-center z-10 cursor-pointer p-2 bg-[#060d17CC]/80 transition text-white w-[40px]"
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={32} />
          </div>

          {/* Right Nav inside */}
          <div
            className="hidden group-hover:flex absolute right-0 h-[270px] sm:h-full items-center z-10 cursor-pointer p-2 bg-[#060d17CC]/80  transition  text-white w-[40px]"
            onClick={() => scroll("right")}
          >
            <ChevronRight />
          </div>
        </div>

        <div
          className="overflow-hidden flex relative scroll-smooth w-full"
          ref={scrollContainerRef}
        >
          {/* Movies */}
          {movies.length > 0 &&
            movies.map((m, index) => (
              <div
                className="flex items-end h-full leading-[100%] text-[180px] -tracking-[20px] mr-[12px] font-extrabold text-[#222c38]"
                key={m.id}
              >
                <div className="overflow-hidden">{index + 1}</div>
                <span className="w-[190px] mr-[12px] overflow-hidden z-2">
                  <span className="relative flex overflow-hidden aspect-[166/236] rounded-[5px]">
                    <a href={`/movie/${m.id}`}>
                      <img
                        onClick={() => {
                          window.location.href = `/movie/${m.id}`;
                        }}
                        src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                        alt={m.title}
                        width={300}
                        height={450}
                        className="w-[190px] mr-[12px] overflow-hidden z-2"
                      />
                    </a>
                    <FavoriteButton movieId={m.id} absolute={true} title={m.title} img={m.poster_path} />
                  </span>
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

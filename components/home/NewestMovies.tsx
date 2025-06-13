/* eslint-disable @next/next/no-img-element */
"use client";
import { getNewestMovies } from "@/actions/movies";
import { Movie } from "@/models/types";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useEffect, useState } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { imagePlaceholder } from "@/enums/genre";
import FavoriteToggle from "../ui/favorite";

export default function NewestMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setIsLoaded(true);
    },
    slides: {
      perView: 1,
    },
  });

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getNewestMovies();
      if (!data) {
        console.error("Could not load movies.");
      } else {
        setMovies(data);
      }
    };
    fetchMovies();
  }, []);

  return (
    <section className="w-full bg-black pb-[120px] rounded-4xl">
      <h2 className="text-[45px] text-[#D5D5D5] font-[800] mb-10 text-start sm:mx-[56px] md:ml-[86px] lg:mx-[125px]">
        Najnoviji filmovi
      </h2>
      <div className="relative sm:mx-[56px] md:ml-[86px] lg:mx-[125px] rounded-4xl">
        {/* Left Navigation */}
        {isLoaded && instanceRef.current && (
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full text-white cursor-pointer h-full"
          >
            <ChevronLeft size={32} />
          </button>
        )}
        {/* Right Navigation */}
        {isLoaded && instanceRef.current && (
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full text-white cursor-pointer h-full"
          >
            <ChevronRight size={32} />
          </button>
        )}
        {/* Slides */}
        {movies.length > 0 && (
          <div ref={sliderRef} className="keen-slider">
            {movies.map((movie, index) => (
              <div
                key={index}
                className={`keen-slider__slide relative text-white p-[58px] flex flex-col sm:flex-row gap-6 items-center sm:items-start justify-center sm:rounded-2xl overflow-hidden hover:cursor-grab max-h-[500px] w-full`}
                style={{
                  backgroundImage: movie.poster_path
                    ? `url(https://image.tmdb.org/t/p/original${movie.poster_path})`
                    : `url(${imagePlaceholder})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-70 z-0 max-h-[500px] w-full" />

                {/* Content */}
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6 w-full">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
                        : imagePlaceholder
                    }
                    alt={movie.title}
                    className="w-[150px] sm:w-[200px] object-cover rounded-[5px] flex-shrink-0 ml-[28px]"
                  />
                  <div className="flex flex-col justify-center items-center sm:items-start">
                    <h3 className="text-[24px] font-bold mb-2 text-[#c6c8cd]">
                      {movie.title}
                    </h3>
                    <div className="flex justify-center sm:justify-start items-center gap-2 mb-2">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                        alt="IMDb"
                        className="w-5 h-2"
                      />
                      <span className="text-[#78a6b8] text-[18px]">
                        {movie.vote_average.toFixed(1)}{" "}
                        {`(${movie.vote_count.toFixed(0)})`}
                      </span>
                    </div>
                    <p className="text-[16px] text-[#8a8d98] mb-4 mr-18">
                      {movie.overview.length > 300
                        ? movie.overview.slice(0, 300) + "..."
                        : movie.overview}
                    </p>
                    <div className="flex flex-row gap-4">
                      <a href={`/movie/${movie.id}`}>
                        <button className="bg-yellow-500 hover:bg-yellow-600 transition px-4 py-2 text-sm font-medium rounded-md text-black w-fit flex items-center cursor-pointer">
                          <Info className="text-black mr-2 size-4" /> Više
                          informacija
                        </button>
                      </a>
                      <FavoriteToggle
                        movieId={movie.id}
                        absolute={false}
                        img={movie.poster_path}
                        title={movie.title}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center items-center absolute mt-8 sm:bottom-4 left-[50%] -translate-x-[50%]">
          <div className="mt-2 flex flex-row gap-2 ">
            {movies.map((m, index) => (
              <div
                key={index}
                className={`size-2 rounded-full ${
                  index === currentSlide ? "bg-yellow-600" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";
import { getMovieById } from "@/actions/movies";
import FavoriteToggle from "@/components/ui/favorite";
import { avatarPlaceholder, imagePlaceholder } from "@/enums/genre";
import { CastMember, MovieDetails } from "@/models/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function DataSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-full  mb-[24px] border-b border-gray-800">
      <h3 className="text-[#6A7C8F] text-[17px] font-medium">
        {title.toUpperCase()}
      </h3>
      <p className="text-[#89bdcc] text-[14px] mb-[24px] mt-[12px]">
        {description}
      </p>
    </div>
  );
}

interface CastCardProps {
  img: string | null;
  name: string;
  realName: string;
}

function CastCard({ img, name, realName }: CastCardProps) {
  return (
    <div className="w-[160px] sm:w-[200px] h-[200px] sm:h-[220px] bg-[#101720] flex flex-col items-center justify-center text-center p-4 flex-none rounded-md">
      <img
        src={
          img ? `https://image.tmdb.org/t/p/original${img}` : avatarPlaceholder
        }
        alt={name}
        className="w-[72px] sm:w-[88px] h-[72px] sm:h-[88px] rounded-full object-cover"
      />
      <div className="text-center mt-4">
        <p className="text-[#78a6b8] text-[14px]">{realName}</p>
        <p className="text-[#b9bdcc] text-[14px]">{name}</p>
      </div>
    </div>
  );
}

function CastScroller({ cast }: { cast: CastCardProps[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <section className="pb-[300px] md:pb-[00px] w-full flex flex-col sm:flex-row overflow-y-visible group relative">
      <div className="">
        {/* Left Nav */}
        <div
          className="hidden group-hover:flex absolute h-[220px] mt-[0px] items-center z-10 cursor-pointer p-2 bg-[#060d17CC]/80 transition text-white w-[40px]"
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={32} />
        </div>

        {/* Right Nav inside */}
        <div
          className="hidden group-hover:flex absolute right-0 h-[220px]  items-center z-10 cursor-pointer p-2 bg-[#060d17CC]/80  transition  text-white w-[40px]"
          onClick={() => scroll("right")}
        >
          <ChevronRight />
        </div>
      </div>
      <div
        className="overflow-hidden flex absolute scroll-smooth w-full gap-4"
        ref={scrollContainerRef}
      >
        {/* Movies */}
        {cast.length > 0 &&
          cast.map((m, index) => (
            <CastCard
              key={index}
              img={m.img}
              name={m.name}
              realName={m.realName}
            />
          ))}
      </div>
    </section>
  );
}

export default function MoviePage() {
  const [movie, setMovie] = useState<MovieDetails>();
  const [cast, setCast] = useState<CastMember[]>();
  const params = useParams();
  const movieId = params.id;

  useEffect(() => {
    const fetchMovies = async () => {
      if (!movieId) return;
      const data = await getMovieById(movieId.toString());
      if (!data) {
        console.error("Could not load movie.");
      } else {
        setMovie(data.movie);
        setCast(data.cast);
      }
    };
    fetchMovies();
  }, [movieId]);

  return (
    <div className="min-h-screen bg-[#060d17]">
      {movie && (
        <div className="mt-[75px]">
          <div
            style={{
              backgroundImage: movie.backdrop_path
                ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                : movie?.poster_path
                ? `url(https://image.tmdb.org/t/p/original${movie.poster_path})`
                : `url(${imagePlaceholder})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "250px",
              position: "relative",
              marginLeft: "50%",
            }}
          />
          <div className="px-[20px] md:px-[50px] lg:px-[125px] absolute -mt-[250px] h-[250px] w-full bg-gradient-to-r from-[#0c131e] from-50% to-transparent to:50%">
            <h1 className="mt-10">
              <span className="mr-2">
                <FavoriteToggle
                  absolute={false}
                  movieId={movie.id}
                  title={movie.title}
                  img={movie.poster_path}
                />
              </span>
              <span className="text-[#FFF] text-[32px] font-[900] leading-tighter">
                {movie.title.toUpperCase()}
              </span>
              <span className="text-[#6f7d90] text-[22px] font-[900]">{` (${movie.release_date.slice(
                0,
                4
              )})`}</span>
            </h1>
            <h3 className="text-[#D5D5D5] text-[16px] mt-4">
              Izvorni naslov: {movie.original_title}
            </h3>
            <div className="flex justify-center sm:justify-start items-center gap-2 mb-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                alt="IMDb"
                className="w-5 h-2 "
              />
              <span className="text-[#78a6b8] text-[14px]">
                {movie.vote_average.toFixed(1)} {` (${movie.vote_count})`}
              </span>
            </div>
          </div>
          <div className="px-[20px] md:px-[50px] lg:px-[125px] mt-20 flex flex-col md:flex-row gap-[50px]">
            <div className="flex-none w-full md:max-w-[440px]">
              <div className="grid grid-cols-2 max-w-full md:max-w-[440px] gap-[20px]">
                <div className="flex-none w-full min-w-full">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                        : movie?.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                        : `${imagePlaceholder}`
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-[8px]"
                  />
                </div>
                <div>
                  <div>
                    <h2 className="text-white text-[22px] font-[800]">
                      O FILMU
                    </h2>
                  </div>
                  <p className="text-[#b9bdcc] text-[16px]">{movie.overview}</p>
                </div>

                <div className="col-span-2 flex flex-col">
                  <DataSection
                    title="žanrovi"
                    description={`${movie.genres.map((g) => ` ${g.name}`)}`}
                  />
                  <DataSection
                    title="trajanje"
                    description={`${movie.runtime} min`}
                  />
                  <DataSection
                    title="Zemlja proizvodnje"
                    description={`${movie.production_countries.map(
                      (m, index) =>
                        `${m.name}${
                          index !== movie.production_countries.length - 1
                            ? ", "
                            : ""
                        }`
                    )}`}
                  />
                </div>
              </div>
            </div>
            {cast?.length && (
              <CastScroller
                cast={cast?.map((c) => ({
                  id: c.id,
                  name: c.name,
                  realName: c.original_name,
                  img: c.profile_path,
                }))}
              />
            )}
            {/*             <div className="flex flex-row gap-[20px] overflow-hidden">
              {cast?.map((c) => (
                <CastCard
                  key={c.id}
                  name={c.name}
                  realName={c.original_name}
                  img={c.profile_path}
                />
              ))}
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}

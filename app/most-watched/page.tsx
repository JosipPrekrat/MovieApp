"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { discoverMovies } from "@/actions/movies";
import FavoriteToggle from "@/components/ui/favorite";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DualRangeSlider } from "@/components/ui/slider";
import { Genre, imagePlaceholder } from "@/enums/genre";
import { DiscoverOptions } from "@/models/compoent-types";
import { Movie } from "@/models/types";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const genreLabels: Record<Genre, string> = {
  [Genre.Action]: "Akcijski i avanturistički",
  [Genre.Adventure]: "Izrađeno u Europi",
  [Genre.Animation]: "Animacije",
  [Genre.Comedy]: "Komedija",
  [Genre.Crime]: "Krimić",
  [Genre.Documentary]: "Dokumentarac",
  [Genre.Drama]: "Drama",
  [Genre.Family]: "Djeca i obitelj",
  [Genre.Fantasy]: "Fantastika",
  [Genre.History]: "Povijesni",
  [Genre.Horror]: "Horor",
  [Genre.Music]: "Glazba i mjuzikli",
  [Genre.Mystery]: "Misterije i trileri",
  [Genre.Romance]: "Romantični",
  [Genre.ScienceFiction]: "Znanstvena fantastika",
  [Genre.TVMovie]: "Reality TV",
  [Genre.Thriller]: "Sport",
  [Genre.War]: "Ratni i vojni filmovi",
  [Genre.Western]: "Vestern",
};

function MovieCard({
  src,
  id,
  title,
}: {
  src: string | null;
  id: number;
  title: string;
}) {
  return (
    <div className="relative">
      <a href={`/movie/${id}`}>
        <img
          className="w-full h-full object-cover"
          src={
            src ? `https://image.tmdb.org/t/p/original${src}` : imagePlaceholder
          }
          alt={title}
        />
      </a>

      <FavoriteToggle movieId={id} title={title} img={src} absolute={true} />
    </div>
  );
}

export default function MostWatchedPage() {
  const [filters, setFilters] = useState<DiscoverOptions>({
    page: 1,
    genres: [],
    releaseYearStart: 1900,
    releaseYearEnd: 2025,
    voteAverageMin: 0,
    voteAverageMax: 10,
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadPage = useCallback(
    async (page: number) => {
      setLoading(true);
      const data = await discoverMovies({ ...filters, page });
      setMovies((prev) => [...prev, ...data.movies]);
      setTotalPages(data.totalPages);
      setLoading(false);
    },
    [
      filters.genres,
      filters.releaseYearStart,
      filters.releaseYearEnd,
      filters.voteAverageMin,
      filters.voteAverageMax,
    ]
  );

  useEffect(() => {
    setMovies([]);
    const preload = async () => {
      setLoading(true);
      let pagesFetched = 0;
      for (let i = 1; i <= 3; i++) {
        const data = await discoverMovies({ ...filters, page: i });
        setMovies((prev) => [...prev, ...data.movies]);
        setTotalPages(data.totalPages);
        pagesFetched++;
        if (pagesFetched >= data.totalPages) break; // stop early if needed
      }
      setFilters((prev) => ({ ...prev, page: 4 }));
      setLoading(false);
    };
    preload();
  }, [
    filters.genres,
    filters.releaseYearStart,
    filters.releaseYearEnd,
    filters.voteAverageMin,
    filters.voteAverageMax,
  ]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          filters.page &&
          filters.page < totalPages &&
          !loading
        ) {
          setFilters((f) => ({ ...f, page: f.page! + 1 }));
        }
      },
      { rootMargin: "1000px" }
    );
    io.observe(loadMoreRef.current);
    return () => io.disconnect();
  }, [filters.page, totalPages, loading]);

  useEffect(() => {
    if (!loadMoreRef.current || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && filters.page <= totalPages && !loading) {
          loadPage(filters.page);
          setFilters((prev) => ({ ...prev, page: prev.page! + 1 }));
        }
      },
      {
        rootMargin: "1000px",
      }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filters.page, totalPages, loading, loadPage]);

  const resetGenres = () => {
    setFilters((prev) => ({ ...prev, genres: [] }));
  };

  const resetYear = () => {
    setFilters((prev) => ({
      ...prev,
      releaseYearStart: 1900,
      releaseYearEnd: 2025,
    }));
  };

  const resetGrade = () => {
    setFilters((prev) => ({ ...prev, voteAverageMin: 0, voteAverageMax: 10 }));
  };

  const toggleGenre = (g: number) => {
    setFilters((prev) =>
      prev.genres.includes(g)
        ? { ...prev, genres: prev.genres.filter((id) => id !== g) }
        : { ...prev, genres: [...prev.genres, g] }
    );
  };

  return (
    <section className="px-[20px] lg:px-[64px] bg-[#060d17] w-full min-h-screen mt-[75px]">
      <div className="py-10 flex flex-row gap-10">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex flex-row gap-4 items-center text-white">
              Godina izdanja <ChevronDown />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] bg-[#10161d] p-5  shadow-lg border border-gray-700 rounded-md">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-[20px] text-white">Godina izdranja</h3>
              <button
                onClick={resetYear}
                className="text-xs text-gray-400 hover:text-white"
              >
                × RESET
              </button>
            </div>
            <DualRangeSlider
              label={(value) => <span>{value}</span>}
              value={[filters.releaseYearStart, filters.releaseYearEnd]}
              onValueChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  releaseYearStart: e[0],
                  releaseYearEnd: e[1],
                }));
              }}
              min={1900}
              max={2025}
              step={1}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex flex-row gap-4 items-center text-white">
              Ocijena <ChevronDown />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] bg-[#10161d] text-gray-200 p-5 shadow-lg border border-gray-700 rounded-md">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-[20px] text-white">Ocijena</h3>
              <button
                onClick={resetGrade}
                className="text-xs text-gray-400 hover:text-white"
              >
                × RESET
              </button>
            </div>
            <div className="flex flex-col items-center">
              <DualRangeSlider
                label={(value) => <span>{value}</span>}
                value={[filters.voteAverageMin, filters.voteAverageMax]}
                onValueChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    voteAverageMin: e[0],
                    voteAverageMax: e[1],
                  }));
                }}
                min={0}
                max={10}
                step={0.1}
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="text-white bg-transparent flex flex-row gap-4 items-center">
              Žanrovi <ChevronDown />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[360px] bg-[#10161D] text-white shadow-lg border border-gray-700 rounded-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] text-white">Žanrovi</h3>
              <button
                onClick={resetGenres}
                className="text-xs text-gray-400 hover:text-white"
              >
                × RESET
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {Object.entries(genreLabels).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => toggleGenre(Number(id))}
                  className={`flex items-center gap-2 text-sm ${
                    filters.genres.includes(Number(id))
                      ? "text-white"
                      : "text-gray-400"
                  } hover:text-white transition text-start`}
                >
                  <Check
                    size={14}
                    className={`${
                      filters.genres.includes(Number(id))
                        ? "opacity-100"
                        : "opacity-50"
                    } transition`}
                  />
                  {label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(170px,_1fr))] gap-4">
        {movies.map((m, index) => (
          <MovieCard
            key={index}
            src={m.poster_path}
            id={m.id}
            title={m.title}
          />
        ))}
      </div>
      <div ref={loadMoreRef} className="h-[1px] w-full" />
      {loading && (
        <div className="text-center text-gray-400 py-4">
          Loading more movies…
        </div>
      )}
    </section>
  );
}

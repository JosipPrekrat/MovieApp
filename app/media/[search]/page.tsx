/* eslint-disable @next/next/no-img-element */
"use client";
import { queryMovies } from "@/actions/movies";
import { imagePlaceholder } from "@/enums/genre";
import { Movie } from "@/models/types";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function MovieCard({
  id,
  title,
  year,
  img,
  rating,
}: {
  id: string;
  title: string;
  year: string;
  img: string | null;
  rating: number;
}) {
  return (
    <div className="flex flex-row gap-[20px] pl-0 p-[15px] border-b border-gray-900 mt-[75px]">
      <a href={`/movie/${id}`}>
        <img
          src={img ? `https://image.tmdb.org/t/p/w780${img}` : imagePlaceholder}
          alt={title}
          className="h-full w-auto object-cover max-w-[215px] max-h-[305px]"
        />
      </a>
      <div className="mt-4">
        <a href={`/movie/${id}`}>
          <h2>
            <span className="text-[22px] text-white">{title}</span>
            <span className="text-[16px] text-[#B9BDCC]">
              {" ("}
              {year.slice(0, 4)}
              {") "}
            </span>
          </h2>
        </a>
        <div className="flex justify-center sm:justify-start items-center gap-2 mb-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
            alt="IMDb"
            className="w-5 h-2"
          />
          <span className="text-[#78a6b8] text-[18px]">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MoviePage() {
  const params = useParams();
  const query = params.search as string;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  // Initial search change effect
  useEffect(() => {
    if (!query) return;
    setMovies([]);
    setPage(1);
    setTotalPages(1);
    hasMounted.current = false;
  }, [query]);

  // Fetch movies only when `page` changes
  useEffect(() => {
    if (!query) return;
    if (loading) return;

    const fetchMovies = async () => {
      setLoading(true);
      const data = await queryMovies(query, page);
      if (data) {
        setMovies((prev) =>
          page === 1 ? data.movies : [...prev, ...data.movies]
        );
        setTotalPages(data.totalPages);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [page]);

  // Intersection Observer only triggers setPage
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          !loading &&
          hasMounted.current &&
          page < totalPages
        ) {
          setPage((prev) => prev + 1);
        } else if (!hasMounted.current) {
          hasMounted.current = true;
        }
      },
      { rootMargin: "900px", threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, page, totalPages]);

  return (
    <div className="bg-[#040c13] min-h-screen">
      <div className="ml-[10px] md:ml-[50px] lg:ml-[125px] flex flex-col">
        <h1 className="text-[#D9E8ED] text-[24px] font-bold mb-4">
          Rezultati pretraživanja za: {query}
        </h1>

        {movies.map((m) => (
          <MovieCard
            key={m.id}
            id={m.id.toString()}
            title={m.title}
            year={m.release_date}
            img={m.poster_path}
            rating={m.vote_average}
          />
        ))}

        <div ref={observerRef} className="h-[1px]" />

        {loading && (
          <p className="text-center text-[#ccc] p-4">Loading more…</p>
        )}
      </div>
    </div>
  );
}

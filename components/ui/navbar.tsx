/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "framer-motion";
import { Heart, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { queryMoviesAndPeople } from "@/actions/movies";
import { Movie, Person } from "@/models/types";
import { avatarPlaceholder, imagePlaceholder } from "@/enums/genre";
import { useSearchHistory } from "../context/SearchHistoryContext";
import { usePathname } from "next/navigation";
import { useFavorites } from "../context/FavoriteContext";
import FavoriteToggle from "./favorite";

const suggestions = [
  "Ginny i Georgia",
  "MobLand",
  "The Survivors",
  "The Bear",
  "Kôd zločina",
  "The Last of Us",
  "Računovođa",
  "Operation Undercover",
  "Step by Step Love",
  "The World Between Us",
];

function SearchCard({
  text,
  setQuery,
}: {
  text: string;
  setQuery: (query: string) => void;
}) {
  return (
    <div
      onClick={() => {
        setQuery(text);
      }}
      className="flex gap-2 items-center py-[5px] px-[10px] text-[#b9bdcc] cursor-pointer overflow-hidden text-[15px] border-1 border-[#383d47] rounded-[8px] hover:border-[#b9bdcc]"
    >
      <Search className="size-4 text-[#383d47]" /> {text}
    </div>
  );
}

function DataList({
  highlight,
  heading,
  items,
}: {
  highlight: number;
  heading: string;
  items: { id: number; title: string; subtitle: string; img: string | null }[];
}) {
  return (
    <div className="flex flex-col items-center gap-[20px] ">
      <div className="text-[15px] text-[#b9bdcc] py-[16px] border-b border-gray-800 w-full">
        {heading}
      </div>
      {items.map((i, index) => (
        <div
          onClick={() => {
            window.location.href = `/movie/${i.id}`;
          }}
          key={index}
          className={`w-full flex flex-row gap-[20px] items-center  p-[5px] rounded-lg cursor-pointer hover:bg-gray-600 min-h-[75px] ${
            heading === "LJUDI" && highlight - 1 === index + 4 && "bg-gray-600"
          } ${heading !== "LJUDI" && highlight - 1 === index && "bg-gray-600"}`}
        >
          <div className="max-h-[65px] overflow-hidden">
            <img
              src={
                i.img
                  ? `https://image.tmdb.org/t/p/w154${i.img}`
                  : heading === "LJUDI"
                  ? avatarPlaceholder
                  : imagePlaceholder
              }
              alt={i.title}
              width={heading === "LJUDI" ? 55 : 45}
              height={heading === "LJUDI" ? 55 : 65}
              className={`${
                heading === "LJUDI" ? "rounded-full" : ""
              } flex-none`}
            />
          </div>
          <div>
            <p className="text-[#FFFFFF] text-[18px]">{i.title}</p>
            <p className="text-[#b9bdcc] text-[13px]">{`${i.subtitle.slice(
              0,
              4
            )}`}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FavoritesDropdown() {
  const [open, setOpen] = useState(false);
  const { favorites } = useFavorites();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="size-8 flex items-center justify-center bg-[#101720] text-white rounded-md hover:bg-[#1b232b] transition"
      >
        <Heart className="size-4" />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-[300px] max-h-[400px] bg-[#101720] shadow-lg rounded-lg z-50 overflow-y-auto p-4 border border-[#1c1c1c]">
          <h3 className="text-white text-lg font-semibold mb-4">
            Favorite Movies
          </h3>
          {favorites.length === 0 ? (
            <p className="text-sm text-[#aaa]">No favorites yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {favorites.map((movie, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 border-b border-[#1f1f1f] pb-2"
                >
                  <a href={`/movie/${movie.id}`}>
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                          : "/placeholder.jpg"
                      }
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded-[4px] flex-shrink-0"
                    />
                  </a>
                  <span className="text-sm text-[#ccc]">{movie.title}</span>
                  <FavoriteToggle
                    movieId={movie.id}
                    title={movie.title}
                    img={movie.poster_path}
                    absolute={false}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SearchBar() {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState(0);
  const { history, clearHistory, addSearch } = useSearchHistory();

  const fetchData = async (query: string) => {
    const data = await queryMoviesAndPeople(query);
    if (!data) {
      console.error("Could not load data.");
    } else {
      setMovies(data.movies);
      setPeople(data.people);
    }
  };

  const debouncedSearch = useRef(
    debounce(async (q: string) => {
      if (!q) {
        setPeople([]);
        setMovies([]);
        return;
      }
      try {
        fetchData(q);
      } catch (err) {
        console.error(err);
      }
    }, 300)
  ).current;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((prev) => (prev === 8 ? 1 : prev + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((prev) => (prev === 1 ? 8 : prev - 1));
      }

      if (e.key === "Enter") {
        const selected =
          highlight > 4 ? people[highlight - 1] : movies[highlight - 1];
        if (selected) {
          window.location.href = `/movie/${selected.id}`;
        } else if (!selected && query.length) {
          addSearch(query);
          window.location.href = `/media/${query}`;
        } else {
          return;
        }
      }
      if (e.key === "Escape") {
        setHighlight(0);
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [people, movies, highlight]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <motion.div
      initial={{ width: "490px" }}
      animate={{ width: focused ? "100%" : "490px" }}
      transition={{ duration: 0.3 }}
      className="sm:relative w-full z-50"
      ref={wrapperRef}
    >
      <div
        className={`flex items-center bg-[#10161D] rounded-t-[4px] p-[5px] min-h-[35px] max-h-[35px] ${
          focused ? "w-full" : "w-auto"
        } transition-all duration-200`}
      >
        <div className="m-[5px] mr-[10px]">
          <Search className="size-[16px] text-[#666]" />
        </div>
        <div className="m-[5px] flex-1">
          <input
            onFocus={() => setFocused(true)}
            placeholder="Pretražite filome ili serije"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-none border-0 text-[15px] m-[0 10px] w-full focus:border-0 focus:ring-transparent focus:outline-0 text-[#ccc]"
          />
        </div>
        {query.length > 0 && (
          <div className="mr-2">
            <X
              className="size-[16px] text-[#666]"
              onClick={() => {
                setQuery("");
              }}
            />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {focused && (
        <motion.div
          initial={{ height: "0px" }}
          animate={{ height: focused ? "auto" : "0px" }}
          transition={{ duration: 0.3 }}
          className="absolute top-full pt-2 left-0 w-full bg-[#10161D] rounded-b-[10px] shadow-lg z-50 p-[20px]"
        >
          {query.length > 0 ? (
            <div>
              <div
                className={`grid grid-cols-1 gap-[5%] ${
                  wrapperRef.current?.clientWidth &&
                  wrapperRef.current.clientWidth > 600
                    ? "grid-cols-2"
                    : "grid-cols-1"
                } h-full`}
              >
                <DataList
                  highlight={highlight}
                  heading={"FILMOVI I SERIJE"}
                  items={movies.slice(0, 4).map((m) => ({
                    id: m.id,
                    title: m.title,
                    subtitle: `${m.release_date}`,
                    img: m.poster_path,
                  }))}
                />
                <DataList
                  highlight={highlight}
                  heading={"LJUDI"}
                  items={people.slice(0, 4).map((p) => ({
                    id: p.id,
                    title: p.name,
                    subtitle: p.original_name,
                    img: p.profile_path,
                  }))}
                />
              </div>
              <a
                onClick={() => {
                  addSearch(query);
                }}
                href={`/media/${query}`}
              >
                <div className="text-center pt-[20px] pb-[2px] mt-15 border-t  border-[#1c252f] text-[#78a6b8] text-[17px] hover:text-[#cccccc] cursor-pointer">
                  Pogledajte sve rezulate za {query} »
                </div>
              </a>
            </div>
          ) : history.length ? (
            <div className="p-3 text-sm text-[#777]">
              <div className="text-[#c6c8cd] text-[16px] mb-[15px] flex justify-between">
                <span>Nedavna pretraživanja</span>{" "}
                <span
                  className="text-[#78A6B8] text-[16px] hover:text-gray-600 cursor-pointer font-medium"
                  onClick={() => {
                    clearHistory();
                  }}
                >
                  Izbriši sve
                </span>
              </div>
              <div>
                <div className="flex flex-row flex-wrap gap-[10px]">
                  {history.map((s) => (
                    <SearchCard key={s} text={s} setQuery={setQuery} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 text-sm text-[#777]">
              <div className="text-[#c6c8cd] text-[16px] mb-[35px]">
                Nema posljednjih pretraživanja
              </div>
              <div>
                <h2 className="text-[16px] text-[#FFF] mb-[10px]">
                  Pretraživanja u trendu
                </h2>
                <div className="flex flex-row flex-wrap gap-[10px]">
                  {suggestions.map((s) => (
                    <SearchCard key={s} text={s} setQuery={setQuery} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/home";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 800 ? true : false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`z-20 flex flex-col -mt-[75px] sm:flex-row items-center justify-between px-6 sticky top-0 pl-[20px] pr-[20px] sm:pl-[64px] sm:pr-[64px] ${
        isHome
          ? `pt-[15px] ${scrolled && "bg-black"}`
          : "pt-[0px] bg-[#060d17] "
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-[75px]">
        <a href="/">
          <img
            src={
              "https://www.justwatch.com/appassets/img/logo/JustWatch-logo-large.webp"
            }
            alt="logo"
            className={`w-full object-contain w-[220px] ${
              isHome ? "h-[32px]" : "h-[20px]"
            }`}
          />
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-8 w-full justify-end h-[75px] ml-8">
        <a
          href="/most-watched"
          className="text-white/80 hover:text-white transition-colors"
        >
          Najgledanije
        </a>

        {/* Search Bar */}
        <SearchBar />
        <FavoritesDropdown />
        <button className="hidden sm:block bg-[#1c252f] hover:cursor-pointer hover:bg-gray-500 text-white px-[15px] py-[7.5px] text-[14px]">
          Prijava
        </button>
      </nav>
    </header>
  );
}

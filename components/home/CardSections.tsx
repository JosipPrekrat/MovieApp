import { getTop3StreamingServiceMovies } from "@/actions/movies";
import { imagePlaceholder } from "@/enums/genre";
import { Movie } from "@/models/types";
import { useEffect, useState } from "react";
import FavoriteToggle from "../ui/favorite";

/* eslint-disable @next/next/no-img-element */
/* const cards = [
  {
    title: "Vaš potpuni vodič za streaming",
    subtitle: "Sve na jednom mjestu",
    description:
      "Dobijte osobne preporuke za svoje omiljene platforme za streaming. Pokazat ćemo vam gdje možete pogledati filmove, serije i sport.",
    img: "https://www.justwatch.com/appassets/img/home/all_in_one_place-comp.png",
  },
  {
    title: "Sve platforme u jednom pretraživanju",
    subtitle: "Jedno pretraživanje",
    description:
      "Ne morate se više prebacivati s jedne platforme na drugu kako biste vidjeli jesu li film ili serija dostupni. Naša funkcionalnost jedinstvenog pretraživanja rješava taj problem.",
    img: "https://www.justwatch.com/appassets/img/home/one_search-comp-2.png",
  },
  {
    title: "Spojite sve svoje liste",
    subtitle: "Jedinstvena moja lista",
    description:
      "Napravite jedinstvenu listu sa svakim filmom i serijom koje želite gledati: jednom listom pokrijte sve platforme za streaming na svim svojim uređajima.",
    img: "https://www.justwatch.com/appassets/img/home/one_watchlist-comp.png",
  },
]; */

export default function CardSection({
  providerId,
}: {
  providerId: number | undefined;
}) {
  const [top3, setTop3] = useState<Movie[]>([]);

  useEffect(() => {
    setTop3([]);
    const fetchTop3ProviderMovies = async () => {
      if (!providerId) return;
      const data = await getTop3StreamingServiceMovies([providerId.toString()]);
      if (!data) {
        console.error("Could not load top 3 provider movies.");
      } else {
        setTop3(data);
      }
    };
    fetchTop3ProviderMovies();
  }, [providerId]);

  return (
    <section className="w-full flex justify-center items-center bg-black mt-20 pb-[100px]">
      <div className="p-[32px] max-w-[85%] w-full gap-[40px]">
        <h2 className="text-[45px] text-[#D5D5D5] font-[800] mb-10 text-center">
          Top 3 filma po streaming servisima
        </h2>
        <div className="flex justify-between items-center flex-col lg:flex-row ">
          {top3.map((c, index) => (
            <div
              key={index}
              style={{
                background:
                  "linear-gradient(180deg, #11181f, rgba(17,24,31,0))",
              }}
              className="flex flex-col justify-start text-center items-center px-[32px] py-[24px] flex-1 h-full rounded-[16px] max-w-[384px] w-full"
            >
              <a href={`/movie/${c.id}`}>
                <img
                  src={`${
                    c.poster_path
                      ? `https://image.tmdb.org/t/p/w780${c.poster_path}`
                      : c.backdrop_path
                      ? `https://image.tmdb.org/t/p/w780${c.backdrop_path}`
                      : imagePlaceholder
                  }`}
                  alt={c.title}
                  className="w-full h-[191px] object-contain"
                />
              </a>
              <div className="flex flex-row gap-4  items-center">
                <p className="text-[16px] text-[#78A6B8] my-[24px] font-medium">
                  {c.title.toUpperCase()}
                </p>
                <FavoriteToggle
                  movieId={c.id}
                  absolute={false}
                  title={c.title}
                  img={c.poster_path}
                />
              </div>
              <h2 className="m-[16px] text-[#D5D5D5] text-[24px] font-bold">
                {c.original_title}
              </h2>
              <p className="m-[8px] text-[16px] text-[#B9BDCC] h-full">
                {c.overview.length > 100
                  ? `${c.overview.slice(0, 100)}...`
                  : c.overview}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

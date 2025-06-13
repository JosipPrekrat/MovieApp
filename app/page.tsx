import HomeBanner from "@/components/home/Banner";
import NewestMovies from "@/components/home/NewestMovies";
import TopTenSection from "@/components/home/TopTenSection";
import { Genre } from "@/enums/genre";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <HomeBanner />

      <TopTenSection
        title="Top 10 Komedija filmova i TV emisija"
        description="Istraži najpopularnije Komedija filmove i TV emisije ovog tjedna dostupne za streaming."
        genreId={Genre.Comedy}
      />
      <TopTenSection
        title="Top 10 Drama filmova i TV emisija"
        description="Istraži najpopularnije Komedija filmove i TV emisije ovog tjedna dostupne za streaming."
        genreId={Genre.Drama}
      />
      <TopTenSection
        title="Top 10 Horor filmova i TV emisija"
        description="Istraži najpopularnije Komedija filmove i TV emisije ovog tjedna dostupne za streaming."
        genreId={Genre.Horror}
      />
      
      <NewestMovies />

      <TopTenSection
        title="Top 10 Komedija filmova i TV emisija"
        description="Istraži najpopularnije Komedija filmove i TV emisije ovog tjedna dostupne za streaming."
        genreId={Genre.Action}
      />
      <TopTenSection
        title="Top 10 Drama filmova i TV emisija"
        description="Istraži najpopularnije Komedija filmove i TV emisije ovog tjedna dostupne za streaming."
        genreId={Genre.Adventure}
      />
      <TopTenSection
        title="Top 10 Horor filmova i TV emisija"
        description="Istraži najpopularnije Komedija filmove i TV emisije ovog tjedna dostupne za streaming."
        genreId={Genre.Fantasy}
      />
    </div>
  );
}

import { DiscoverOptions } from "@/models/compoent-types";
import { Movie, Provider } from "@/models/types";

export async function getTopTenGenreMovies(genreId: string[]) {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env
    .NEXT_PUBLIC_API_KEY!}&with_genres=${genreId.map(
    (g, index) => `${g}${index + 1 !== genreId.length && "|"}`
  )}&sort_by=popularity.desc&page=1`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error("Failed to fetch top 10 genre movies");
    }
    const json = await res.json();
    return json.results.slice(0, 10);
  } catch (err) {
    console.error("Error fetching top 10 genre movies:", err);
    return null;
  }
}

export async function getWatchProviders() {
  const url = `https://api.themoviedb.org/3/watch/providers/movie?watch_region=US`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error("Failed to fetch providers");
    }
    const json = await res.json();
    const da = json?.results?.slice(0, 13).map((p: Provider) => ({
      provider_id: p.provider_id,
      provider_name: p.provider_name,
      logo_path: p.logo_path,
    }));
    return da;
  } catch (err) {
    console.error("Error fetching providers:", err);
    return null;
  }
}

export async function getTop3StreamingServiceMovies(providers: string[]) {
  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_watch_providers=${providers.map(
    (p, index) => `${p}${index !== providers.length && ","}`
  )}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error("Failed to fetch top 3 movies");
    }
    const json = await res.json();
    return json.results.slice(0, 3);
  } catch (err) {
    console.error("Error fetching top 3 movies:", err);
    return null;
  }
}

export async function getTop3Movies() {
  const url =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error("Failed to fetch top 3 movies");
    }
    const json = await res.json();
    return json.results.slice(0, 3);
  } catch (err) {
    console.error("Error fetching top 3 movies:", err);
    return null;
  }
}

export async function getNewestMovies() {
  const url = `https://api.themoviedb.org/3/discover/movie?sort_by=release_date.desc&page=1&region=US&include_adult=false`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error("Failed to fetch newest movies");
    }
    const json = await res.json();
    return json.results;
  } catch (err) {
    console.error("Error fetching newest movies:", err);
    return null;
  }
}

export async function queryMoviesAndPeople(query: string) {
  const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${
    process.env.NEXT_PUBLIC_API_KEY
  }&query=${encodeURIComponent(query)}&include_adult=false`;
  const peopleUrl = `https://api.themoviedb.org/3/search/person?api_key=${
    process.env.NEXT_PUBLIC_API_KEY
  }&query=${encodeURIComponent(query)}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
    },
  };

  try {
    const [m, p] = await Promise.all([
      fetch(movieUrl, options),
      fetch(peopleUrl, options),
    ]);
    const [mJson, pJson] = await Promise.all([m.json(), p.json()]);
    return { movies: mJson.results, people: pJson.results };
  } catch (error) {
    console.error("Error searching for people and movies:", error);
    return null;
  }
}

export async function queryMovies(query: string, page: number = 1) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${
    process.env.NEXT_PUBLIC_API_KEY
  }&query=${encodeURIComponent(query)}&include_adult=false&page=${page}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
    const json = await res.json();
    return {
      movies: json.results as Movie[],
      totalPages: json.total_pages as number,
    };
  } catch (error) {
    console.error("Error querying movies:", error);
    return null;
  }
}

export async function getMovieById(movieId: string) {
  const baseUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
    },
  };

  try {
    const [movieRes, creditsRes] = await Promise.all([
      fetch(`${baseUrl}?language=en-US`, options),
      fetch(`${baseUrl}/credits`, options),
    ]);

    if (!movieRes.ok || !creditsRes.ok) {
      throw new Error("Failed to fetch movie details or credits");
    }

    const movie = await movieRes.json();
    const credits = await creditsRes.json();

    return {
      movie,
      cast: credits.cast, // array of cast members
      crew: credits.crew, // array of crew members
    };
  } catch (error) {
    console.error("Error fetching movie or credits:", error);
    return null;
  }
}

export async function discoverMovies(opts: DiscoverOptions) {
  const params = new URLSearchParams({
    api_key: process.env.NEXT_PUBLIC_API_KEY!,
    language: "en-US",
    sort_by: "popularity.desc",
    include_adult: "false",
    include_video: "false",
    page: String(opts.page ?? 1),
  });

  if (opts.releaseYearStart)
    params.append("primary_release_date.gte", opts.releaseYearStart.toString());
  if (opts.releaseYearEnd)
    params.append("primary_release_date.lte", opts.releaseYearEnd.toString());
  if (opts.voteAverageMin)
    params.append("vote_average.gte", opts.voteAverageMin.toString());
  if (opts.voteAverageMax)
    params.append("vote_average.lte", opts.voteAverageMax.toString());
  if (opts.genres?.length) params.append("with_genres", opts.genres.join(","));

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
  );
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  const json = await res.json();
  return {
    movies: json.results as Movie[],
    totalPages: json.total_pages as number,
  };
}

export interface IconImage {
  src: string;
  alt: string;
}

export interface DiscoverOptions {
  page: number;
  releaseYearStart: number;
  releaseYearEnd: number;
  genres: number[];
  voteAverageMin: number;
  voteAverageMax: number;
}

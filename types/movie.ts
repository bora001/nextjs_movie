export interface MovieType {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  original_title: string;
  genre_ids?: number[];
  genres?: GenreType[];
}

export interface GenreType {
  id: number;
  name: string;
}

export interface MovieListResponseType {
  page: number;
  results: MovieType[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetailType extends MovieType {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  homepage: string;
  imdb_id: string | null;
  production_companies: ProductionCompanyType[];
  production_countries: ProductionCountryType[];
  spoken_languages: SpokenLanguageType[];
  trailer?: VideoType | null;
}

export interface ProductionCompanyType {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountryType {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguageType {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface CastType {
  id: number;
  cast_id: number;
  character: string;
  name: string;
  profile_path: string | null;
  order: number;
}

export interface CreditType {
  id: number;
  cast: CastType[];
  crew: CrewType[];
}

export interface CrewType {
  id: number;
  credit_id: string;
  department: string;
  job: string;
  name: string;
  profile_path: string | null;
}

export interface VideoType {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideoResponseType {
  id: number;
  results: VideoType[];
}

export interface GenreResponseType {
  genres: GenreType[];
}

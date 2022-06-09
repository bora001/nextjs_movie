/** @type {import('next').NextConfig} */
const API_KEY = process.env.API_KEY;

module.exports = {
  strictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/movies",
        destination: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
      },
      {
        source: "/api/movies/top-rated",
        destination: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`,
      },
      {
        source: "/api/movies/now-playing",
        destination: `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`,
      },
      {
        source: "/api/movies/up-coming",
        destination: `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`,
      },
      {
        source: "/api/genres",
        destination: `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
      },
      {
        source: "/api/movie/:id",
        destination: `https://api.themoviedb.org/3/movie/:id?api_key=${API_KEY}`,
      },
      {
        source: "/api/movie/:id/credit",
        destination: `https://api.themoviedb.org/3/movie/:id/credits?api_key=${API_KEY}`,
      },
      {
        source: "/api/movie/genres",
        destination: `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
      },
    ];
  },
  images: {
    domains: ["image.tmdb.org", "cdn.pixabay.com"],
  },
};

/** @type {import('next').NextConfig} */
const API_KEY = process.env.API_KEY;

module.exports = {
  strictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/movies/:page",
        destination: `https://api.themoviedb.org/3/movie/:page?api_key=${API_KEY}`,
      },
      {
        source: "/api/movies/:pages/:page",
        destination: `https://api.themoviedb.org/3/movie/:pages?api_key=${API_KEY}&page=:page`,
      },
      {
        source: "/api/genres",
        destination: `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
      },
      {
        source: "/api/genres/:genreId",
        destination: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=:genreId`,
      },
      {
        source: "/api/movie/:id",
        destination: `https://api.themoviedb.org/3/movie/:id?api_key=${API_KEY}`,
      },
      {
        source: "/api/movie/:id/credit",
        destination: `https://api.themoviedb.org/3/movie/:id/credits?api_key=${API_KEY}`,
      },
    ];
  },
  images: {
    domains: ["image.tmdb.org", "cdn.pixabay.com"],
  },
};

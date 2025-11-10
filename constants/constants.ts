export const CONSTANTS = {
  NAV_HEIGHT: 60,
  CACHE_DURATION: {
    SHORT_30M: 1800, // 30 minutes
    MEDIUM_3H: 10800, // 3 hours
    LONG_6H: 21600, // 6 hours
    DAILY_1D: 86400, // 1 day
    WEEKLY_7D: 604800, // 7 days
    MONTHLY_30D: 2592000, // 30 days
    YEARLY_365D: 31536000, // 365 days
    FOREVER: 315360000, // 10 years
  },
  COOKIE_KEYS: {
    AUTH_TOKEN: "auth-token",
  },
  CATEGORIES: {
    popular: {
      name: "popular",
      label: "Popular",
    },
    top_rated: {
      name: "top_rated",
      label: "Top Rated",
    },
    now_playing: {
      name: "now_playing",
      label: "Now Playing",
    },
    upcoming: {
      name: "upcoming",
      label: "Upcoming",
    },
  },
  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    POPULAR: "/popular",
    TOP_RATED: "/top_rated",
    NOW_PLAYING: "/now_playing",
    UPCOMING: "/upcoming",
    API: {
      AUTH: {
        LOGIN: "/api/auth/login",
        LOGOUT: "/api/auth/logout",
        ME: "/api/auth/me",
        VERIFY_EMAIL: "/api/auth/verify-email",
        VERIFY_CODE: "/api/auth/verify-code",
        SEND_VERIFICATION_CODE: "/api/auth/send-verification-code",
        REGISTER: "/api/auth/register",
      },
      MOVIES: "/api/movies",
      GENRES: "/api/genres",
    },
  },
  API_STATUS: {
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
  },
  STATUS_CODES: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    OK: 200,
    CREATED: 201,
    CONFLICT: 409,
  },
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

export const API = {
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
};

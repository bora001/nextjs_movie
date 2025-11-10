export const CONFIG = {
  MOVIE_URL: process.env.MOVIE_API_URL || "",
  EMAIL: {
    HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
    PORT: parseInt(process.env.EMAIL_PORT || "587"),
    USER: process.env.EMAIL_USER || "",
    PASSWORD: process.env.EMAIL_PASSWORD || "",
    FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || "",
  },
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserType } from "@/types/user";
import { CONSTANTS } from "@/constants/constants";
import { CONFIG } from "@/config/config";

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, CONFIG.JWT_SECRET, {
    expiresIn: CONSTANTS.CACHE_DURATION.WEEKLY_7D,
  });
}

// Verify JWT token
export function verifyToken(
  token: string
): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as {
      userId: string;
      email: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CONSTANTS.COOKIE_KEYS.AUTH_TOKEN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CONSTANTS.CACHE_DURATION.DAILY_1D,
    path: CONSTANTS.ROUTES.HOME,
  });
}

// Get auth token from cookie
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CONSTANTS.COOKIE_KEYS.AUTH_TOKEN);
  return token?.value || null;
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CONSTANTS.COOKIE_KEYS.AUTH_TOKEN);
  console.log("clearing auth cookie"), cookieStore;
}

// Get current user from token
export async function getCurrentUser(): Promise<UserType | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const { getUserById } = await import("./db");
  return getUserById(decoded.userId);
}

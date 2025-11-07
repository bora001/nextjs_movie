import { NextResponse } from "next/server";
import axios from "axios";
import { getCachedData, setCachedData } from "./cache";

interface ApiHandlerOptions<T> {
  cacheKey: string;
  cacheTTL: number;
  apiUrl: string;
  errorMessage: string;
}

export async function withCache<T>(
  options: ApiHandlerOptions<T>
): Promise<NextResponse<T | { error: string }>> {
  const { cacheKey, cacheTTL, apiUrl, errorMessage } = options;

  try {
    // Check cache first
    const cachedData = await getCachedData<T>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return NextResponse.json(cachedData);
    }
    console.log(`Cache miss for key: ${cacheKey}`);
    const response = await axios.get<T>(apiUrl);
    // Cache the response
    await setCachedData(cacheKey, response.data, cacheTTL);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(errorMessage, error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function fetchWithCache<T>(
  options: ApiHandlerOptions<T>
): Promise<T | null> {
  const { cacheKey, cacheTTL, apiUrl, errorMessage } = options;

  try {
    const cachedData = await getCachedData<T>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cachedData;
    }

    console.log(`Cache miss for key: ${cacheKey}`);
    const response = await axios.get<T>(apiUrl);

    await setCachedData(cacheKey, response.data, cacheTTL);

    return response.data;
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
}

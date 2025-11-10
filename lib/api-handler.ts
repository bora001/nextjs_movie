import { NextResponse } from "next/server";
import axios from "axios";
import { getCachedData, setCachedData } from "./cache";
import { CONSTANTS } from "@/constants/constants";

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
    console.log(`Fetching from API: ${apiUrl}`);
    const response = await axios.get<T>(apiUrl);
    // Cache the response
    await setCachedData(cacheKey, response.data, cacheTTL);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(errorMessage, error);

    // Extract more detailed error information
    let detailedError = errorMessage;
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(`API Error Status: ${error.response.status}`);
        console.error(`API Error Data:`, error.response.data);
        detailedError = `API Error: ${error.response.status} - ${errorMessage}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from API");
        detailedError = `Network Error: ${errorMessage}`;
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", error.message);
        detailedError = `Request Error: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: detailedError },
      { status: CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
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

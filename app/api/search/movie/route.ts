import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { MovieListResponse } from "@/types/movie";

export async function GET(request: NextRequest) {
  const API_KEY = process.env.API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get<MovieListResponse>(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error searching movies:", error);
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { MovieListResponse } from "@/types/movie";

interface RouteParams {
  params: {
    category: string;
    page: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const API_KEY = process.env.API_KEY;
  const { category, page } = params;

  try {
    const response = await axios.get<MovieListResponse>(
      `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&page=${page}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}

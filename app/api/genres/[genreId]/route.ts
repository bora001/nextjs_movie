import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { MovieListResponse } from "@/types/movie";

interface RouteParams {
  params: {
    genreId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const API_KEY = process.env.API_KEY;
  const { genreId } = params;

  try {
    const response = await axios.get<MovieListResponse>(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching genre movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch genre movies" },
      { status: 500 }
    );
  }
}

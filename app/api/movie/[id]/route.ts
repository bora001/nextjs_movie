import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { MovieDetail } from "@/types/movie";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const API_KEY = process.env.API_KEY;
  const { id } = params;

  try {
    const response = await axios.get<MovieDetail>(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}

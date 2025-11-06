import { NextResponse } from "next/server";
import axios from "axios";
import { GenreResponse } from "@/types/movie";

export async function GET() {
  const API_KEY = process.env.API_KEY;

  try {
    const response = await axios.get<GenreResponse>(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching genres:", error);
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 }
    );
  }
}

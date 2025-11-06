import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request, { params }) {
  const API_KEY = process.env.API_KEY;
  const { genreId } = params;

  try {
    const response = await axios.get(
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

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request, { params }) {
  const API_KEY = process.env.API_KEY;
  const { category } = params;

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}`
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

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
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
    const response = await axios.get(
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

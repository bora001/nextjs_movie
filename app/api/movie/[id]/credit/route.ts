import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Credit } from "@/types/movie";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const API_KEY = process.env.API_KEY;
  const { id } = params;

  try {
    const response = await axios.get<Credit>(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie credits" },
      { status: 500 }
    );
  }
}

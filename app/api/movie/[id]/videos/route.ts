import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { VideoResponse } from "@/types/movie";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const API_KEY = process.env.API_KEY;
  const { id } = params;

  try {
    const response = await axios.get<VideoResponse>(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie videos" },
      { status: 500 }
    );
  }
}

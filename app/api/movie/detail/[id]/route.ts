import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { CONFIG } from "@/config/config";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const API_KEY = process.env.API_KEY;
  try {
    const res = await axios.get(
      `${CONFIG.MOVIE_URL}/movie/${params.id}?api_key=${API_KEY}`
    );
    return NextResponse.json(res.data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}

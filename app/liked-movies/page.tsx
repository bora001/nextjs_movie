import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { API } from "@/constants";
import LikedMovie from "./LikedMovie";

export async function generateMetadata() {
  return {
    title: "nextjs_practice | Liked Movies",
    description: "Your liked movies list",
  };
}

export default async function LikedMoviesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(API.ROUTES.LOGIN);
  }

  return <LikedMovie />;
}

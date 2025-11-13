import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { API } from "@/constants";
import UserProfile from "./UserProfile";

export default async function UserPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(API.ROUTES.LOGIN);
  }

  return <UserProfile user={user} />;
}

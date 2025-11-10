import { UserType } from "@/types/user";
import NavBar from "./NavBar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  user: UserType | null;
}

export default function Layout({ children, user }: LayoutProps) {
  return (
    <>
      <NavBar user={user} />
      <div>{children}</div>
    </>
  );
}

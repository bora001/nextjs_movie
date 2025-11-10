import { UserType } from "@/types/user";
import NavBar from "./NavBar";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface LayoutProps {
  children: ReactNode;
  user: UserType | null;
}

export default function Layout({ children, user }: LayoutProps) {
  return (
    <>
      <NavBar user={user} />
      <div>{children}</div>
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 1000000,
        }}
      />
    </>
  );
}

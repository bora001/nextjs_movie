import Layout from "../component/Layout";
import "../styles/globals.css";
import { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import ReactQueryProvider from "@/lib/react-query-provider";

export const metadata = {
  title: "Nextjs_movie Project",
  description: "next.js movie project",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider user={user}>
          <Layout user={user}>{children}</Layout>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

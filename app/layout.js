import Layout from "../component/Layout";
import "../styles/globals.css";

export const metadata = {
  title: "Nextjs_movie Project",
  description: "next.js movie project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

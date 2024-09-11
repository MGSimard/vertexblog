import "@/styles/globals.css";

import { Handjet } from "next/font/google";
import type { Metadata } from "next";

const handjet = Handjet({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VertexBlog",
  description: "This is a terrible good idea",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={handjet.className}>{children}</body>
    </html>
  );
}

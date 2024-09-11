import type { Metadata } from "next";
import Link from "next/link";
import { Taskbar } from "@/components/Taskbar";

import { Handjet } from "next/font/google";
import "@/styles/globals.css";

const handjet = Handjet({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VertexBlog",
  description: "This is a terrible good idea",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={handjet.className}>
        <header>
          <nav>
            <ul className="desktop-icons">
              <li>
                <Link href="/documents">
                  <img alt="ICON" />
                  <span>Documents</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <img alt="ICON" />
                  <span>SOMETHING</span>
                </Link>
              </li>
              {[...Array(32)].map((thing, i) => (
                <li key={i}>
                  <Link href="/">
                    <img alt="ICON" />
                    <span>SOMETHING</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Taskbar />
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

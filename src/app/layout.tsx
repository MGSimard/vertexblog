import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { DragProvider } from "@/components/DragProvider";
import { Taskbar } from "@/components/Taskbar";
import { Handjet } from "next/font/google";
import "@/styles/globals.css";

const handjet = Handjet({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#2a5ed2",
};

export const metadata: Metadata = {
  title: "Vertex Blog",
  description: "Greatest bad idea I've ever had",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicons/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicons/favicon-32x32.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicons/apple-touch-icon.png",
    },
    {
      rel: "mask-icon",
      color: "#f75049",
      url: "/favicons/safari-pinned-tab.svg",
    },
  ],
  manifest: "/favicons/site.webmanifest",
  other: {
    "msapplication-TileColor": "#2a5ed2",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <DragProvider>
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
                <li>App will probably see a slight reskin in the later stages.</li>
                <li>Core inspiration is obviously Windows 95, but I'll switch some things around here and there.</li>
                <li>The goal is to follow the same contrast/ui/ux and 3d visual hierarchy.</li>
                <li>
                  v- Current dev process visible here
                  <a href="https://github.com/MGSimard/vertexblog" target="_blank">
                    github
                  </a>
                </li>
              </ul>
              <Taskbar />
            </nav>
          </header>
          {children}
          <div id="portal" />
        </body>
      </html>
    </DragProvider>
  );
}

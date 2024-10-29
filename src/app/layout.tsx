import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Taskbar } from "@/components/Taskbar";
import { Handjet } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";
import { DxDiag } from "@/components/DxDiag";
import PlausibleProvider from "next-plausible";

const handjet = Handjet({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#2a5ed2",
};

export const metadata: Metadata = {
  title: "C:\\VERTEXBLOG",
  description: "Blogging platform based on the Windows 95 UI experience, as a file explorer directory.",
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
      color: "#57a8a8",
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
    <html lang="en">
      <head>
        <PlausibleProvider domain="vertexblog.vercel.app" />
      </head>
      <body className={handjet.className}>
        <Providers>
          <header>
            <nav>
              <ul className="shortcut-area">
                <li>
                  <DxDiag />
                </li>
                <li>
                  <Link href="/documents" className="shortcut">
                    <img src="/assets/EmptyFolder.svg" alt="Folder" />
                    <span>Documents</span>
                  </Link>
                </li>
                <li>This app is in active development.</li>
              </ul>
              <Taskbar />
            </nav>
          </header>
          {children}
          <div id="portal" />
        </Providers>
      </body>
    </html>
  );
}

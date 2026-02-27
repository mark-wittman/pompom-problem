import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PomPom Problem — A Fluffy Climbing Adventure",
  description:
    "Jump, collect, and spell your way to the top! A hand-drawn vertical platformer.",
  openGraph: {
    title: "PomPom Problem",
    description: "A fluffy climbing adventure — can you reach the summit?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

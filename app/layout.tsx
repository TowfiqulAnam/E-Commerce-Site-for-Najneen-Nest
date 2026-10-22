import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Najneen Nest | For You & Your Home",
  description: "Discover fashion, home care, useful accessories, and finds for kids and pets at Najneen Nest.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

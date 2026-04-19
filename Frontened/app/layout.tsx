import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "HelpHub AI | Find help faster. Become help that matters.",
  description:
    "HelpHub AI is a community-powered support network for students, mentors, creators, and builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col antialiased">
        <div className="bg-gradient-blur" />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

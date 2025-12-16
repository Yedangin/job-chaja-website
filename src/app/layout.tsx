import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobchaja - Secure Job Application Platform",
  description:
    "A trusted and secure platform for seamless job searching, hiring, and applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

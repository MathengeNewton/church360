import "./globals.css";
import { Albert_Sans } from "next/font/google";

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "PCEA Church Kenya",
  description:
    "Official portal for PCEA Church Kenya — connecting members, leaders, and ministries across the nation.",
  icons: {
    icon: "/pcea-seeklogo.svg",
    shortcut: "/icons/favicon-16x16.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "PCEA Church Kenya",
    description:
      "Welcome to the official portal for PCEA Church Kenya. Access church systems, member services, and ministry resources.",
    url: "https://pceachurch.or.ke",
    siteName: "PCEA Church Kenya",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "PCEA Church Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PCEA Church Kenya",
    description:
      "Official platform for PCEA Church Kenya. Access digital services and member resources.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${albertSans.variable} antialiased`}>{children}</body>
    </html>
  );
}

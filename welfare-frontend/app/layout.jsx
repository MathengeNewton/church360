import "./globals.css";
import { Albert_Sans } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "PCEA st Luke Church | Utawala",
  description:
    "Official portal for PCEA st Luke Church Utawala — connecting members, leaders, and ministries across the nation.",
  icons: {
    icon: "/pcea-seeklogo.svg",
    shortcut: "/icons/favicon-16x16.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "PCEA st Luke Church | Utawala",
    description:
      "Welcome to the official portal for PCEA st Luke Church Utawala. Access church systems, member services, and ministry resources.",
    url: "https://pceachurch.or.ke",
    siteName: "PCEA st Luke Church | Utawala",
    type: "website",
    images: [
      {
        url: "/images/og-image.png", // Relative URL - no hardcoded localhost
        width: 1200,
        height: 630,
        alt: "PCEA st Luke Church | Utawala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PCEA st Luke Church | Utawala",
    description:
      "Official platform for PCEA st Luke Church Utawala. Access digital services and member resources.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${albertSans.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

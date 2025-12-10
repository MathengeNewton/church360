import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login | PCEA Church Kenya",
  description:
    "Access your PCEA Church Kenya member or admin account securely through the official login portal.",
  icons: {
    icon: "/pcea-seeklogo.svg",
    shortcut: "/icons/favicon-16x16.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Login | PCEA Church Kenya",
    description:
      "Sign in securely to your PCEA Church Kenya account to access the member and administrative portal.",
    url: "https://pceachurch.or.ke/auth/login",
    siteName: "PCEA Church Kenya",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "PCEA Church Kenya Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | PCEA Church Kenya",
    description:
      "Securely sign in to your PCEA Church Kenya account through the official portal.",
    images: ["/images/og-image.png"],
  },
};

export default function LoginPage() {
  return (
    <div className="bg-gray-100 lg:h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl bg-white [box-shadow:0_2px_10px_-3px_rgba(6,81,237,0.3)] p-4 lg:p-5 rounded-md">
        <div className="grid md:grid-cols-2 items-center gap-y-8">
          <LoginForm />
          <div className="w-full h-full">
            <div className="aspect-square bg-gray-50 relative before:absolute before:inset-0 before:bg-indigo-600/30 rounded-md overflow-hidden w-full h-full">
              <Image
                width={600}
                height={600}
                src="/PCEA-Church.webp"
                className="w-full h-full object-cover"
                alt="login img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

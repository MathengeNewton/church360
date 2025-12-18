import WelfareAdminDashboard from "./AdminDashboard";

// Welfare Admin Dashboard - focused on welfare organization metrics

export const metadata = {
  title: "Welfare Admin Dashboard | PCEA Welfare",
  description:
    "Manage PCEA Welfare organization operations. Track families, contributions, payments, and distributions.",
  icons: {
    icon: "/pcea-seeklogo.svg",
    shortcut: "/icons/favicon-16x16.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Welfare Admin Dashboard | PCEA Welfare",
    description:
      "Access the PCEA Welfare admin portal to manage families, contributions, payments, and distributions.",
    url: "https://pceachurch.or.ke/welfare/admin",
    siteName: "PCEA Welfare",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Welfare Admin Dashboard | PCEA Welfare",
    description:
      "Manage PCEA Welfare operations including families, contributions, and payment distributions.",
  },
};

const WelfareDashboard = () => {
  return <WelfareAdminDashboard />;
};

export default WelfareDashboard;

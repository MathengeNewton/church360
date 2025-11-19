// DashboardFooter.jsx
export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500 shadow-sm">
      © {currentYear} Presbyterian Church of East Africa (PCEA). All rights
      reserved.
    </footer>
  );
}

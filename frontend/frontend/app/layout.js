"use client";

import { AuthProvider } from "./context/AuthContext";
import { usePathname } from "next/navigation";
import Navbar from "./components/navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {!hideNavbar && <Navbar />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

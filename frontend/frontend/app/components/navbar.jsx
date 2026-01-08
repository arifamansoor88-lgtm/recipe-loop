"use client";

import "./navbar.css";
import Link from "next/link";
import { Home, Search, PlusCircle, User, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="header">
      <img src="bg.png" alt="RecipeLoop Logo" className="logo" width="120px" />
      <h2>RecipeLoop</h2>

      <nav className="header_nav">
        <ul className="header_ul">
          <li>
            <Link href="/">
              <Home size={18} />
              Home
            </Link>
          </li>

          <li>
            <Link href="/explore">
              <Search size={18} />
              Explore
            </Link>
          </li>

          {user && (
            <>
              <li>
                <Link href="/create">
                  <PlusCircle size={18} />
                  Create
                </Link>
              </li>

              <li>
                <Link href={`/profile/${user.username}`}>
                  <User size={18} />
                  Profile
                </Link>
              </li>

              <li>
                <button onClick={handleLogout} className="logout_button">
                  <LogOut size={18} />
                  Logout
                </button>
              </li>
            </>
          )}

          {!user && (
            <li>
              <Link href="/login">
                <LogIn size={18} />
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

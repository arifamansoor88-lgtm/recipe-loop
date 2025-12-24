"use client";

import "./navbar.css";
import { Home, Search, PlusCircle, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="header">
      <img src="bg.png" alt="RecipeLoop Logo" className="logo" width="120px" />
      <h2>RecipeLoop</h2>

      <nav className="header_nav">
        <ul className="header_ul">
          <li>
            <a href="/">
              <Home size={18} />
              Home
            </a>
          </li>

          <li>
            <a href="/explore">
              <Search size={18} />
              Explore
            </a>
          </li>

          <li>
            <a href="/create">
              <PlusCircle size={18} />
              Create
            </a>
          </li>

          <li>
            <a href="/profile">
              <User size={18} />
              Profile
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

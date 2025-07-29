import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[#FF6900] text-white shadow">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="text-lg font-semibold hover:opacity-90">
            Ana Sayfa
          </a>

          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <NavLink
              to="/chat-sefa"
              className={({ isActive }) =>
                isActive ? "underline underline-offset-4" : "hover:opacity-80"
              }
            >
              Chat_Sefa
            </NavLink>
            <NavLink
              to="/chat-sefa2"
              className={({ isActive }) =>
                isActive ? "underline underline-offset-4" : "hover:opacity-80"
              }
            >
              ChatSefa2
            </NavLink>
            <NavLink
              to="/chat-mirac"
              className={({ isActive }) =>
                isActive ? "underline underline-offset-4" : "hover:opacity-80"
              }
            >
              Chat_Miraç
            </NavLink>
          </nav>

          {/* Responsive Menü Butonu (isteğe bağlı) */}
          <button className="md:hidden p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
            <span className="sr-only">Menüyü Aç</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Briefcase,
  FileText,
} from "lucide-react";

import AuthContext from "../context/AuthContext";

function Avatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white shadow-sm">
      {initials}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  function onLogout() {
    logout();
    navigate("/");
  }

  useEffect(() => {
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
              BC
            </div>

            <div className="hidden sm:block">
              <p className="text-base font-semibold text-slate-900">
                ByteCargo
              </p>
              <p className="text-xs text-slate-500">
                Smart Logistics Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Center Search */}
        <div className="hidden md:block flex-1 max-w-xl">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search shipments, bids..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Guest */}
          {!user && (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Logged In */}
          {user && (
            <>
              {/* Quick Nav */}
              <nav className="hidden lg:flex items-center gap-1">
                <Link
                  to="/"
                  className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  Home
                </Link>

                <Link
                  to="/profile"
                  className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  Profile
                </Link>
              </nav>

              {/* Notification */}
              <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                <Bell size={18} />
              </button>

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
                >
                  <Avatar name={user.name} />

                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-800">
                      {user.name}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {user.role}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className="hidden md:block text-slate-400"
                  />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b px-4 py-4">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.role}</p>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <User size={16} />
                        Profile
                      </Link>

                      {user.role === "MERCHANT" && (
                        <Link
                          to="/my-bids"
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          <Briefcase size={16} />
                          My Bids
                        </Link>
                      )}

                      {user.role === "TRANSPORTER" && (
                        <Link
                          to="/my-submissions"
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          <FileText size={16} />
                          My Submissions
                        </Link>
                      )}

                      <button
                        onClick={onLogout}
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
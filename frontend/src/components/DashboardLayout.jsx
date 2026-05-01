import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  User,
  FileText,
} from "lucide-react";

import AuthContext from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);

  const role = user?.role?.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside
        className={`h-screen sticky top-0 bg-slate-950 text-white flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 shrink-0">
          {!collapsed && (
            <h1 className="text-xl font-bold tracking-tight">
              ByteCargo
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1 transition hover:bg-slate-800"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-2 p-3">
          {role === "MERCHANT" && (
            <>
              <NavItem
                to="/merchant"
                icon={LayoutDashboard}
                text="Dashboard"
                collapsed={collapsed}
              />

              <NavItem
                to="/my-bids"
                icon={Package}
                text="My Bids"
                collapsed={collapsed}
              />
            </>
          )}

          {role === "TRANSPORTER" && (
            <>
              <NavItem
                to="/transporter"
                icon={LayoutDashboard}
                text="Dashboard"
                collapsed={collapsed}
              />

              <NavItem
                to="/submissions"
                icon={Package}
                text="Submissions"
                collapsed={collapsed}
              />

              <NavItem
                to="/my-submissions"
                icon={FileText}
                text="My Submissions"
                collapsed={collapsed}
              />
            </>
          )}

          <NavItem
            to="/profile"
            icon={User}
            text="Profile"
            collapsed={collapsed}
          />
        </nav>

        {/* Footer */}
        {!collapsed && user && (
          <div className="shrink-0 border-t border-slate-800 p-4">
            <p className="truncate font-medium text-white">
              {user.name}
            </p>

            <p className="truncate text-sm text-slate-400">
              {user.email}
            </p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}

function NavItem({ to, icon: Icon, text, collapsed }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-slate-300 hover:bg-slate-900"
      }`}
    >
      <Icon size={18} />

      {!collapsed && <span>{text}</span>}
    </Link>
  );
}
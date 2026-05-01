import React, { useContext } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Briefcase,
  Truck,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import AuthContext from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border bg-white p-12 text-center shadow-sm">
          <User className="mx-auto mb-4 h-10 w-10 text-slate-400" />

          <h2 className="text-xl font-semibold text-slate-900">
            Not logged in
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please sign in to view your profile.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const initial = user.name?.slice(0, 1)?.toUpperCase() || "U";

  const roleIcon =
    user.role === "MERCHANT" ? (
      <Briefcase size={16} />
    ) : (
      <Truck size={16} />
    );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-slate-900">
              {initial}
            </div>

            <div>
              <p className="text-sm font-medium text-indigo-100">
                ByteCargo Profile
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                {user.name}
              </h1>

              <p className="mt-2 text-indigo-100">
                Manage your account details and role access.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={User}
            title="Account Status"
            value="Active"
            color="text-green-600"
          />

          <StatCard
            icon={ShieldCheck}
            title="Security"
            value="Protected"
            color="text-indigo-600"
          />

          <StatCard
            icon={TrendingUp}
            title="Platform Access"
            value="Enabled"
            color="text-emerald-600"
          />
        </div>

        {/* Details */}
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Account Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Personal and platform information.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={User}
              label="Full Name"
              value={user.name}
            />

            <InfoCard
              icon={Mail}
              label="Email Address"
              value={user.email}
            />

            <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Role
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                {roleIcon}
                {user.role}
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-8 border-t pt-6">
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={16} />

        <p className="text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-3 text-base font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="rounded-xl bg-slate-100 p-2 w-fit">
        <Icon className={`h-5 w-5 ${color}`} />
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500">{title}</p>
      </div>
    </div>
  );
}
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Truck,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import AuthContext from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const user = await login(email, password);

      if (user.role === "MERCHANT") nav("/merchant");
      else if (user.role === "TRANSPORTER") nav("/transporter");
      else nav("/");
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="container py-10">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border bg-white shadow-xl lg:grid-cols-2">
          {/* Left Panel */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-700 p-10 text-white">
            <div>
              <div className="inline-flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 font-bold">
                  BC
                </div>
                <div>
                  <p className="text-sm font-semibold">ByteCargo</p>
                  <p className="text-xs text-slate-200">
                    Smart Logistics Platform
                  </p>
                </div>
              </div>

              <h1 className="mt-10 text-4xl font-bold leading-tight">
                Welcome back to your logistics command center
              </h1>

              <p className="mt-5 text-slate-200 leading-7">
                Manage shipments, compare bids, and accelerate operations with a
                premium workflow built for merchants and transporters.
              </p>
            </div>

            <div className="space-y-4">
              <Feature
                icon={Truck}
                text="Real-time shipment opportunities"
              />
              <Feature
                icon={TrendingUp}
                text="Better pricing through bidding"
              />
              <Feature
                icon={ShieldCheck}
                text="Secure role-based access"
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-medium text-indigo-600">
                Login to Continue
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Sign in
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Access your dashboard and continue managing logistics smoothly.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Submit */}
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700 active:scale-[0.99]">
                Login
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-sm text-slate-600">
              New to ByteCargo?{" "}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-800"
              >
                Create an account
              </Link>
            </p>

            {/* Mobile Branding */}
            <div className="mt-10 rounded-2xl bg-slate-100 p-5 lg:hidden">
              <p className="font-semibold text-slate-900">
                Logistics made smarter.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Compare bids, move faster, and scale operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/90">
      <div className="rounded-xl bg-white/10 p-2">
        <Icon size={16} />
      </div>
      <span>{text}</span>
    </div>
  );
}
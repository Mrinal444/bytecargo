import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Building2,
  Truck,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import AuthContext from "../context/AuthContext";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const nav = useNavigate();

  const [role, setRole] = useState("MERCHANT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const fullName = `${firstName} ${lastName}`.trim();

      await signup({
        name: fullName,
        email,
        password,
        role,
        company,
      });

      nav("/login");
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Create an account
          </h1>

          <p className="mt-3 text-slate-500">
            Get started with ByteCargo for free
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {/* Role */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Account Type
            </label>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("MERCHANT")}
                className={`rounded-2xl border p-5 transition ${
                  role === "MERCHANT"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Briefcase className="mx-auto h-6 w-6 text-blue-600" />
                <p className="mt-3 font-semibold text-slate-900">
                  Merchant
                </p>
                <p className="text-sm text-slate-500">
                  Ship cargo
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole("TRANSPORTER")}
                className={`rounded-2xl border p-5 transition ${
                  role === "TRANSPORTER"
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Truck className="mx-auto h-6 w-6 text-slate-700" />
                <p className="mt-3 font-semibold text-slate-900">
                  Transporter
                </p>
                <p className="text-sm text-slate-500">
                  Carry cargo
                </p>
              </button>
            </div>
          </div>

          {/* Names */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InputBox
              label="First Name"
              icon={User}
              value={firstName}
              onChange={setFirstName}
              placeholder="John"
            />

            <InputBox
              label="Last Name"
              icon={User}
              value={lastName}
              onChange={setLastName}
              placeholder="Doe"
            />
          </div>

          {/* Company */}
          <InputBox
            label="Company Name"
            icon={Building2}
            value={company}
            onChange={setCompany}
            placeholder="Acme Inc."
          />

          {/* Email */}
          <InputBox
            label="Email"
            icon={Mail}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="name@company.com"
          />

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Must be at least 8 characters
            </p>
          </div>

          {/* Submit */}
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
            Create Account
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          By signing up, you agree to our{" "}
          <span className="text-blue-600">Terms of Service</span> and{" "}
          <span className="text-blue-600">Privacy Policy</span>
        </p>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function InputBox({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>
    </div>
  );
}
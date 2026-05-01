import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Gavel,
  CheckCircle2,
  Clock3,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";


import api from "../api/api";
import BidCard from "../components/BidCard";

function badgeClass(status) {
  const map = {
    OPEN: "bg-blue-50 text-blue-700 border-blue-200",
    ASSIGNED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
}

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, []);

  async function fetchBids() {
    try {
      setLoading(true);
      const res = await api.get("/my-bids");
      setBids(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const total = bids.length;
  const open = bids.filter((b) => b.status === "OPEN").length;
  const assigned = bids.filter((b) => b.status === "ASSIGNED").length;
  const pending = bids.filter((b) => b.status === "PENDING").length;

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">ByteCargo</p>

            <h1 className="text-3xl font-bold text-slate-900">
              My Shipments
            </h1>

            <p className="mt-1 text-slate-600">
              View and manage all shipment bids created by you.
            </p>
          </div>

          <button
            onClick={fetchBids}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Refresh Data
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Package}
            title="Total Shipments"
            value={total}
            color="text-indigo-600"
          />

          <StatCard
            icon={Gavel}
            title="Open"
            value={open}
            color="text-blue-600"
          />

          <StatCard
            icon={CheckCircle2}
            title="Assigned"
            value={assigned}
            color="text-green-600"
          />

          <StatCard
            icon={Clock3}
            title="Pending"
            value={pending}
            color="text-amber-600"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="text-slate-600">Loading your shipments...</p>
          </div>
        ) : bids.length === 0 ? (
          <div className="rounded-3xl border border-dashed bg-white p-12 text-center shadow-sm">
            <Package className="mx-auto mb-4 h-10 w-10 text-slate-400" />

            <h3 className="text-lg font-semibold text-slate-900">
              No shipments found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create your first shipment from the merchant dashboard.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {bids.map((b) => (
              <div
                key={b.id}
                className="rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <BidCard bid={b} />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>

                  <Link
                    to={`/bids/${b.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
                  >
                    Open details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {bids.length > 0 && !loading && (
          <div className="mt-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  Optimize your logistics flow
                </h3>

                <p className="mt-1 text-indigo-100">
                  Compare offers and assign the best transporter faster.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-slate-900">
                <TrendingUp size={18} />
                Growth Ready
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-slate-100 p-2">
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500">{title}</p>
      </div>
    </div>
    
  );
}
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  BarChart3,
  IndianRupee,
  Plus,
  ArrowRight,
} from "lucide-react";

import api from "../api/api";
import AuthContext from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import BidCard from "../components/BidCard";

export default function MerchantDashboard() {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState("");

  const [error, setError] = useState("");
  const [bids, setBids] = useState([]);

  useEffect(() => {
    fetchMyBids();
  }, []);

  async function fetchMyBids() {
    const res = await api.get("/my-bids");
    setBids(res.data);
  }

  async function create(e) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/bids", {
        title,
        origin,
        destination,
        price,
      });

      setTitle("");
      setOrigin("");
      setDestination("");
      setPrice("");

      fetchMyBids();
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  }

  const total = bids.length;
  const open = bids.filter((b) => b.status === "OPEN").length;
  const assigned = bids.filter((b) => b.status === "ASSIGNED").length;
  const totalValue = bids.reduce((sum, b) => sum + Number(b.price || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Welcome back, {user?.name}
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus size={16} />
            New Shipment
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Package} title="Total Shipments" value={total} />
          <StatCard icon={Truck} title="Open Bids" value={open} />
          <StatCard icon={BarChart3} title="Assigned" value={assigned} />
          <StatCard
            icon={IndianRupee}
            title="Total Value"
            value={`₹${totalValue}`}
          />
        </div>

        {/* Content */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Recent */}
          <div className="xl:col-span-2 rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Shipments</h2>

              <Link
                to="/my-bids"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {bids.slice(0, 5).map((b) => (
                <div key={b.id} className="rounded-2xl border p-4">
                  <BidCard bid={b} />
                </div>
              ))}

              {bids.length === 0 && (
                <p className="text-slate-500">No shipments yet.</p>
              )}
            </div>
          </div>

          {/* Create Form */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Create Shipment</h2>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={create} className="mt-5 space-y-3">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                placeholder="Origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />

              <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
                Create Shipment
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <Icon className="h-5 w-5 text-blue-600" />
      <h3 className="mt-4 text-3xl font-bold">{value}</h3>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
}
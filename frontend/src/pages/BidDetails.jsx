import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  Clock,
  Truck,
  CheckCircle2,
  BadgeIndianRupee,
  Package,
} from "lucide-react";

import api from "../api/api";
import AuthContext from "../context/AuthContext";

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

export default function BidDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [bid, setBid] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await api.get(`/bids/${id}`);
    setBid(res.data);

    const s = await api.get(`/bids/${id}/submissions`);
    setSubmissions(s.data);
  }

  async function accept(subId) {
    try {
      await api.post(`/bids/${id}/select/${subId}`);
      setMsg("Offer accepted successfully.");
      fetchData();
    } catch (err) {
      setMsg(err?.response?.data?.error || err.message);
    }
  }

  if (!bid) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container py-8">
          <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="text-slate-600">Loading shipment details...</p>
          </div>
        </div>
      </div>
    );
  }

  const acceptedCount = submissions.filter(
    (s) => s.status === "ACCEPTED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">ByteCargo</p>

            <h1 className="text-3xl font-bold text-slate-900">
              {bid.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <MapPin size={15} />
              <span>{bid.origin}</span>

              <ArrowRight size={14} />

              <span>{bid.destination}</span>
            </div>
          </div>

          <span
            className={`rounded-full border px-4 py-2 text-xs font-semibold ${badgeClass(
              bid.status
            )}`}
          >
            {bid.status}
          </span>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Package}
            title="Shipment Price"
            value={`₹${bid.price}`}
            color="text-indigo-600"
          />

          <StatCard
            icon={Truck}
            title="Total Offers"
            value={submissions.length}
            color="text-blue-600"
          />

          <StatCard
            icon={CheckCircle2}
            title="Accepted"
            value={acceptedCount}
            color="text-green-600"
          />

          <StatCard
            icon={Clock}
            title="Status"
            value={bid.status}
            color="text-amber-600"
          />
        </div>

        {/* Message */}
        {msg && (
          <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            {msg}
          </div>
        )}

        {/* Offers */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Transporter Offers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review bids and choose the best delivery partner.
            </p>
          </div>

          {submissions.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <Truck className="mx-auto mb-4 h-10 w-10 text-slate-400" />
              <h3 className="font-semibold text-slate-900">
                No submissions yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Transporters will appear here once they submit offers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  className="rounded-3xl border p-5 transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {s.transporter?.name}
                      </h3>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <BadgeIndianRupee size={16} />
                          <span>₹{Number(s.price).toFixed(2)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{s.estimatedTime} days ETA</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(
                            s.status
                          )}`}
                        >
                          {s.status}
                        </span>
                      </div>
                    </div>

                    {/* Right */}
                    {user?.id === bid.merchantId &&
                      s.status === "PENDING" && (
                        <button
                          onClick={() => accept(s.id)}
                          className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                          Accept Offer
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-slate-100 p-2">
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500">{title}</p>
      </div>
    </div>
  );
}
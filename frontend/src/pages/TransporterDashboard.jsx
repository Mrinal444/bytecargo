import React, { useEffect, useState } from "react";
import {
  Truck,
  Package,
  Gavel,
  Clock,
  TrendingUp,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";


import api from "../api/api";
import BidCard from "../components/BidCard";
import Modal from "../components/Modal";

export default function TransporterDashboard() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [price, setPrice] = useState("");
  const [eta, setEta] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchOpen();
  }, []);

  async function fetchOpen() {
    try {
      setLoading(true);
      const res = await api.get("/bids");
      setBids(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    try {
      await api.post(`/bids/${selected.id}/submit`, {
        price,
        estimatedTime: eta,
      });

      setSelected(null);
      setPrice("");
      setEta("");
      setMsg("Offer submitted successfully.");
      fetchOpen();
    } catch (err) {
      setMsg(err?.response?.data?.error || err.message);
    }
  }

  const totalOpen = bids.length;

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">ByteCargo</p>
            <h1 className="text-3xl font-bold text-slate-900">
              Transporter Dashboard
            </h1>
            <p className="mt-1 text-slate-600">
              Discover shipment opportunities and place competitive bids.
            </p>
          </div>

          <button
            onClick={fetchOpen}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Refresh Opportunities
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Package}
            title="Open Shipments"
            value={totalOpen}
            color="text-indigo-600"
          />

          <StatCard
            icon={Gavel}
            title="Active Marketplace"
            value="Live"
            color="text-blue-600"
          />

          <StatCard
            icon={Truck}
            title="Carrier Ready"
            value="100%"
            color="text-green-600"
          />

          <StatCard
            icon={TrendingUp}
            title="Growth Potential"
            value="High"
            color="text-emerald-600"
          />
        </div>

        {/* Message */}
        {msg && (
          <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            {msg}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="text-slate-600">Loading shipment opportunities...</p>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {bids.length === 0 ? (
              <div className="rounded-3xl border border-dashed bg-white p-12 text-center shadow-sm">
                <Truck className="mx-auto mb-4 h-10 w-10 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900">
                  No open shipments right now
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Check again later for new merchant requests.
                </p>
              </div>
            ) : (
              <>
                {/* Section Header */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Available Opportunities
                    </h2>
                    <p className="text-sm text-slate-500">
                      Submit offers to win shipments.
                    </p>
                  </div>
                </div>

                {/* Cards */}
                <div className="grid gap-5">
                  {bids.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                        <div className="flex-1">
                          <BidCard bid={b} />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                          <button
                            onClick={() => setSelected(b)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                          >
                            Submit Offer
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Modal */}
        <Modal
          open={!!selected}
          onClose={() => setSelected(null)}
          title={selected ? `Submit Offer - ${selected.title}` : "Submit Offer"}
        >
          <div>
            <p className="mb-4 text-sm text-slate-500">
              Enter your pricing and delivery estimate.
            </p>

            <label className="mb-1 block text-sm font-medium text-slate-700">
              Offer Price
            </label>

            <div className="relative mb-4">
              <IndianRupee
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border px-10 py-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                placeholder="Enter amount"
              />
            </div>

            <label className="mb-1 block text-sm font-medium text-slate-700">
              Estimated Delivery Time
            </label>

            <div className="relative mb-5">
              <Clock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full rounded-xl border px-10 py-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                placeholder="Days"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={submit}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Submit Offer
              </button>
            </div>
          </div>
        </Modal>
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
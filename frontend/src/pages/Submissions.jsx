import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Package,
  Clock3,
  IndianRupee,
  Send,
  Briefcase,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import api from "../api/api";
import BidCard from "../components/BidCard";
import Modal from "../components/Modal";

export default function Submissions() {
  const [bids, setBids] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);

  const [price, setPrice] = useState("");
  const [eta, setEta] = useState("");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchBids();
  }, []);

  useEffect(() => {
    applySearch();
  }, [search, bids]);

  async function fetchBids() {
    const res = await api.get("/bids");
    setBids(res.data);
    setFiltered(res.data);
  }

  function applySearch() {
    const q = search.toLowerCase();

    const result = bids.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.origin?.toLowerCase().includes(q) ||
        b.destination?.toLowerCase().includes(q)
    );

    setFiltered(result);
  }

  async function submitOffer() {
    try {
      await api.post(`/bids/${selected.id}/submit`, {
        price,
        estimatedTime: eta,
      });

      setMsg("Offer submitted successfully.");
      setSelected(null);
      setPrice("");
      setEta("");
    } catch (err) {
      setMsg(err?.response?.data?.error || err.message);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-100">
                ByteCargo Marketplace
              </p>

              <h1 className="mt-2 text-4xl font-bold">
                Shipment Opportunities
              </h1>

              <p className="mt-2 text-indigo-100">
                Explore open merchant requests and submit your best transport
                offer.
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 px-6 py-4 backdrop-blur">
              <p className="text-sm text-indigo-100">Available Jobs</p>
              <h3 className="text-3xl font-bold">{filtered.length}</h3>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, city, route..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Alerts */}
        {msg && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {msg}
          </div>
        )}

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border bg-white p-12 text-center shadow-sm">
            <Briefcase className="mx-auto mb-4 h-10 w-10 text-slate-400" />

            <h3 className="text-xl font-semibold text-slate-900">
              No shipment opportunities
            </h3>

            <p className="mt-2 text-slate-500">
              Try another search or check again later.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <BidCard bid={b} />

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <Info icon={MapPin} label="Route" value={`${b.origin} → ${b.destination}`} />
                  <Info icon={Package} label="Status" value={b.status} />
                </div>

                <button
                  onClick={() => setSelected(b)}
                  className="mt-6 w-full rounded-2xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
                >
                  Submit Offer
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          open={!!selected}
          onClose={() => setSelected(null)}
          title="Submit Transport Offer"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Price
              </label>

              <div className="relative">
                <IndianRupee
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter offer price"
                  className="w-full rounded-xl border py-3 pl-9 pr-4 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Estimated Delivery Time
              </label>

              <div className="relative">
                <Clock3
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  placeholder="Days"
                  className="w-full rounded-xl border py-3 pl-9 pr-4 outline-none"
                />
              </div>
            </div>

            <button
              onClick={submitOffer}
              className="w-full rounded-2xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
            >
              <span className="inline-flex items-center gap-2">
                <Send size={16} />
                Submit Offer
              </span>
            </button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
        <Icon size={14} />
        {label}
      </div>

      <p className="mt-2 font-medium text-slate-800">{value}</p>
    </div>
  );
}
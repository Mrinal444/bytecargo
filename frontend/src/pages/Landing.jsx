import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Package,
  ShieldCheck,
  TrendingUp,
  Gavel,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-600 p-2 text-white shadow-md">
              <Truck size={20} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                ByteCargo
              </h1>

              <p className="text-xs text-slate-500">
                Smart Logistics Marketplace
              </p>
            </div>
          </Link>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden container py-16 lg:py-24">
        {/* Glow Background */}
        <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-indigo-200 blur-3xl opacity-40" />
        <div className="absolute left-10 bottom-0 h-56 w-56 rounded-full bg-blue-200 blur-3xl opacity-30" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <p className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
              Smart Logistics Marketplace
            </p>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Move shipments faster with
              <span className="text-indigo-600"> competitive bidding</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              ByteCargo connects merchants and transporters through a live
              bidding platform. Post shipments, compare offers, and assign the
              best logistics partner in minutes.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
              <span>✓ Real-time bidding</span>
              <span>✓ Role-based dashboards</span>
              <span>✓ Fast assignment flow</span>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-3xl border bg-white p-6 shadow-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={Package}
                title="Shipments Managed"
                value="1,284+"
              />

              <StatCard
                icon={Gavel}
                title="Offers Submitted"
                value="9,500+"
              />

              <StatCard
                icon={Truck}
                title="Transport Partners"
                value="320+"
              />

              <StatCard
                icon={TrendingUp}
                title="Avg Cost Saved"
                value="18%"
              />
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-900">
                Live Shipment Example
              </p>

              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Patna → Ranchi</span>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    OPEN
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Best Offer</span>

                  <span className="font-semibold text-slate-900">
                    ₹4,500
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>ETA</span>
                  <span>2 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-white">
        <div className="container py-16">
          <div className="text-center">
            <p className="text-sm font-medium text-indigo-600">
              Why ByteCargo
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Built for modern logistics operations
            </h2>

            <p className="mt-4 text-slate-600">
              Simple workflows. Better pricing. Faster movement.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={Package}
              title="Post Shipments"
              text="Create shipment requests quickly with route, pricing, and shipment details."
            />

            <FeatureCard
              icon={Gavel}
              title="Compare Bids"
              text="Receive transporter offers and choose the best combination of price and ETA."
            />

            <FeatureCard
              icon={ShieldCheck}
              title="Assign Securely"
              text="Role-based dashboards with protected merchant and transporter workflows."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-10 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold">
            Ready to optimize logistics?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
            Join ByteCargo today and modernize how shipments are priced,
            assigned, and delivered.
          </p>

          <Link
            to="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700 w-fit">
        <Icon size={18} />
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900">
          {value}
        </p>

        <p className="text-sm text-slate-500">
          {title}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="inline-flex rounded-2xl bg-indigo-100 p-3 text-indigo-700">
        <Icon size={20} />
      </div>

      <h3 className="mt-5 text-xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {text}
      </p>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";

export default function AppleEnvironment({ setActiveTab }) {
  return (
    <div className="w-full bg-apple-canvas text-apple-ink min-h-screen flex flex-col items-center">
      {/* Environment Quote Card (Photographic-canvas fallback) */}
      <section className="w-full bg-apple-surface-tile-1 text-white py-24 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden border-b border-apple-surface-black">
        {/* Decorative backdrop elements representing atmospheric vista */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-emerald-950/10 to-apple-surface-tile-1 opacity-60 pointer-events-none" />
        
        <div className="w-full max-w-[800px] flex flex-col items-center gap-6 relative z-10">
          {/* Apple 2030 Green Leaf Logo */}
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm tracking-wide">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M17 8C15.3 8 13.5 8.9 12.5 10.2C11.5 8.9 9.7 8 8 8C4.7 8 2 10.7 2 14C2 17.8 6.5 21.3 11.5 21.9C11.8 22 12.2 22 12.5 22C12.8 22 13.2 22 13.5 21.9C18.5 21.3 23 17.8 23 14C23 10.7 20.3 8 17 8ZM12.5 19.8C8.3 19.2 4.5 16.2 4.5 14C4.5 12.1 6.1 10.5 8 10.5C9.4 10.5 10.8 11.4 11.5 12.7C11.7 13.1 12.1 13.3 12.5 13.3C12.9 13.3 13.3 13.1 13.5 12.7C14.2 11.4 15.6 10.5 17 10.5C18.9 10.5 20.5 12.1 20.5 14C20.5 16.2 16.7 19.2 12.5 19.8Z" />
            </svg>
            <span>Todo Pro 2030</span>
          </div>

          <h1 className="typography-display-lg font-semibold text-white tracking-tight max-w-[650px]">
            A plan as ambitious as your day.
          </h1>
          
          <p className="typography-lead-airy text-apple-body-muted max-w-[600px] mb-4">
            By 2030, every Todo Pro subscription and accessory will be completely carbon neutral. Because organizing your future shouldn't compromise the planet's.
          </p>

          <button
            onClick={() => setActiveTab("todo")}
            className="bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-2.5 rounded-full text-sm font-medium apple-active-scale transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Start carbon-neutral planning
          </button>
        </div>
      </section>

      {/* Editorial Content Grid */}
      <section className="w-full max-w-[1024px] py-24 px-4 md:px-8 flex flex-col gap-16 text-left">
        <div className="max-w-[650px]">
          <span className="text-xs font-semibold uppercase tracking-widest text-apple-primary mb-2 block">
            Our Initiatives
          </span>
          <h2 className="typography-display-md font-semibold text-apple-ink tracking-tight">
            How we make productivity sustainable.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Initiative 1 */}
          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-apple-canvas-parchment border border-apple-hairline">
            <span className="text-3xl">💻</span>
            <h3 className="typography-body-strong font-semibold text-apple-ink">
              100% Recycled Code
            </h3>
            <p className="typography-caption text-apple-ink-muted-48">
              Our codebase is fully optimized for minimal CPU cycles, reducing server load and energy consumption by up to 40% compared to typical SaaS applications.
            </p>
          </div>

          {/* Initiative 2 */}
          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-apple-canvas-parchment border border-apple-hairline">
            <span className="text-3xl">⚡</span>
            <h3 className="typography-body-strong font-semibold text-apple-ink">
              Renewable Cloud
            </h3>
            <p className="typography-caption text-apple-ink-muted-48">
              Every byte of your todo data is stored on servers powered by 100% wind and solar energy, backed by certified carbon offsets.
            </p>
          </div>

          {/* Initiative 3 */}
          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-apple-canvas-parchment border border-apple-hairline">
            <span className="text-3xl">🌳</span>
            <h3 className="typography-body-strong font-semibold text-apple-ink">
              Zero Paper Waste
            </h3>
            <p className="typography-caption text-apple-ink-muted-48">
              By shifting from paper planners to Todo Pro, the average user saves up to 12 pounds of paper per year, preserving precious forest ecosystems.
            </p>
          </div>
        </div>

        {/* Big Fact Banner */}
        <div className="w-full p-8 md:p-12 rounded-2xl bg-apple-canvas-parchment border border-apple-hairline flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h3 className="typography-display-md font-semibold text-apple-ink tracking-tight mb-2">
              Carbon Neutral by 2030.
            </h3>
            <p className="typography-caption text-apple-ink-muted-48 max-w-[500px]">
              We're auditing our entire supply chain, from the energy used to compile our code to the materials in our physical accessories, to reach net-zero emissions.
            </p>
          </div>
          <div className="text-5xl md:text-7xl font-semibold text-emerald-600 tracking-tighter">
            0% <span className="text-2xl md:text-3xl font-normal text-apple-ink-muted-48">Net Em.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

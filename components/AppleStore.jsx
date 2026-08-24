"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AppleStore({ setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    {
      id: "cloud-sync",
      name: "Todo Pro Cloud Sync",
      description: "Keep all your devices in perfect harmony with instant, secure sync.",
      price: "$2.99 / mo",
      category: "Software",
      emoji: "☁️",
      bgClass: "bg-blue-50",
    },
    {
      id: "team-space",
      name: "Todo Pro Team Space",
      description: "Collaborate with your team in real-time. Share lists, assign tasks.",
      price: "$9.99 / mo",
      category: "Software",
      emoji: "👥",
      bgClass: "bg-emerald-50",
    },
    {
      id: "focus-timer",
      name: "Calm Focus Timer",
      description: "A physical, anodized aluminum pomodoro timer that syncs with your tasks.",
      price: "$49.00",
      category: "Hardware",
      emoji: "⏱️",
      bgClass: "bg-amber-50",
    },
    {
      id: "task-dial",
      name: "Aluminum Task Dial",
      description: "Scroll, select, and check off your todos with a satisfying tactile click.",
      price: "$99.00",
      category: "Hardware",
      emoji: "🔘",
      bgClass: "bg-zinc-100",
    },
    {
      id: "desk-mat",
      name: "Premium Leather Desk Mat",
      description: "Vegetable-tanned leather surface optimized for your mouse and keyboard.",
      price: "$79.00",
      category: "Lifestyle",
      emoji: "💼",
      bgClass: "bg-orange-50",
    },
    {
      id: "workflow-book",
      name: "Productivity Masterclass",
      description: "A beautiful interactive e-book detailing Apple-style focus workflows.",
      price: "$19.00",
      category: "Education",
      emoji: "📘",
      bgClass: "bg-violet-50",
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-apple-canvas-parchment text-apple-ink min-h-screen py-16 px-4 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-[1024px] flex flex-col items-start gap-8">
        {/* Header Section */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-apple-ink-muted-48 mb-2 block">
              Store & Accessories
            </span>
            <h1 className="typography-display-lg font-semibold text-apple-ink tracking-tight">
              Productivity Gear & Add-ons
            </h1>
          </div>

          {/* Search Input (Pill-shaped search) */}
          <div className="relative w-full md:max-w-[320px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-ink-muted-48">
              <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="5" />
                <line x1="15" y1="15" x2="11.5" y2="11.5" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accessories..."
              className="w-full h-11 pl-11 pr-5 bg-apple-canvas border border-apple-hairline rounded-full text-sm text-apple-ink placeholder:text-apple-ink-muted-48 focus:outline-none focus:ring-2 focus:ring-apple-primary-focus transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-ink-muted-48 hover:text-apple-ink"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Grid Section */}
        <motion.div
          layout
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="bg-apple-canvas border border-apple-hairline rounded-[18px] p-6 flex flex-col justify-between text-left hover:border-apple-primary/30 transition-colors group"
              >
                <div>
                  {/* 1:1 Aspect Ratio Image Wrapper */}
                  <div className={`aspect-square w-full rounded-lg ${product.bgClass} flex items-center justify-center text-6xl mb-6 relative overflow-hidden border border-apple-hairline/20`}>
                    <span className="group-hover:scale-110 transition-transform duration-300 select-none">
                      {product.emoji}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-widest text-apple-primary mb-1 block">
                    {product.category}
                  </span>
                  <h3 className="typography-body-strong font-semibold text-apple-ink mb-2">
                    {product.name}
                  </h3>
                  <p className="typography-caption text-apple-ink-muted-48 mb-6 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-apple-hairline pt-4 mt-auto">
                  <span className="typography-body font-medium text-apple-ink">
                    {product.price}
                  </span>
                  <button
                    onClick={() => setActiveTab("todo")}
                    className="text-apple-primary hover:underline text-xs font-semibold flex items-center gap-1"
                  >
                    Buy Now &gt;
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="w-full py-20 text-center bg-apple-canvas border border-apple-hairline rounded-[18px]">
            <p className="text-apple-ink-muted-48 typography-body">No accessories found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppleNav from "@/components/AppleNav";
import AppleOverview from "@/components/AppleOverview";
import TodoApp from "@/components/TodoApp";

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderActiveSurface = () => {
    switch (activeTab) {
      case "todo":
        return (
          <div className="flex w-full min-h-[70vh] items-start justify-center bg-apple-canvas-parchment px-4 py-8">
            <TodoApp />
          </div>
        );
      case "overview":
      default:
        return <AppleOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-apple-canvas text-apple-ink flex flex-col font-sans antialiased">
      {/* Top Navigation */}
      <AppleNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderActiveSurface()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Apple-style Footer */}
      <footer className="bg-apple-canvas-parchment text-apple-ink-muted-80/80 py-16 px-6 md:px-12 flex flex-col items-center">
        <div className="w-full max-w-[1024px] flex flex-col gap-10">
          {/* Legal Notes */}
          {activeTab !== "todo" && (
            <div className="border-b border-apple-hairline pb-8 text-left">
              <p className="typography-fine-print text-apple-ink-muted-48 leading-relaxed mb-3">
                1. Todo Pro requires a compatible subscription. Cloud Sync and Team Space add-ons are sold separately and require active internet connection.
              </p>
              <p className="typography-fine-print text-apple-ink-muted-48 leading-relaxed">
                2. Carbon neutral claims are based on full supply-chain audits and certified carbon offsets. Net-zero emissions target is set for December 31, 2030.
              </p>
            </div>
          )}

          {/* Bottom Legal Row */}
          <div className="pt-8 text-left w-full">
            <p className="typography-fine-print text-apple-ink-muted-48">
              Copyright © 2026 {"Mr A's Org"}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

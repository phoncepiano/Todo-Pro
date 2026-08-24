"use client";

import { motion } from "framer-motion";

export default function AppleOverview ( { setActiveTab } )
{
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <div className="w-full bg-apple-canvas flex flex-col overflow-x-hidden">
      {/* 1. Hero Product Tile (Light) */ }
      <section className="w-full min-h-[85vh] bg-apple-canvas text-apple-ink flex flex-col items-center justify-between py-20 px-4 text-center border-b border-apple-hairline">
        <motion.div
          variants={ containerVariants }
          initial="hidden"
          animate="show"
          className="max-w-200 flex flex-col items-center"
        >
          <motion.span variants={ itemVariants } className="text-xs font-semibold uppercase tracking-widest text-apple-primary mb-3">
            Introducing
          </motion.span>
          <motion.h1
            variants={ itemVariants }
            className="typography-hero-display font-semibold text-apple-ink mb-4 tracking-tight"
          >
            Todo Pro
          </motion.h1>
          <motion.p
            variants={ itemVariants }
            className="typography-lead text-apple-ink-muted-80 max-w-150 mb-8"
          >
            Stay organized with calm motion, elegant typography, and local persistence.
          </motion.p>
          <motion.div variants={ itemVariants } className="flex items-center gap-4 mb-16">
            <button
              onClick={ () => setActiveTab( "todo" ) }
              className="bg-apple-primary text-white hover:bg-apple-primary-focus px-6 py-3 rounded-full text-sm font-medium apple-active-scale transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-apple-primary-focus"
            >
              Try it free
            </button>
          </motion.div>
        </motion.div>

        {/* Hero Product Render with Signature Shadow */ }
        <motion.div
          initial={ { opacity: 0, y: 50 } }
          animate={ { opacity: 1, y: 0 } }
          transition={ { delay: 0.4, duration: 0.8, ease: "easeOut" } }
          className="w-full max-w-212.5 px-4"
        >
          <div className="relative rounded-2xl border border-apple-hairline bg-apple-canvas-parchment p-6 apple-product-shadow overflow-hidden">
            {/* Mock App Interface */ }
            <div className="w-full rounded-xl bg-apple-canvas border border-apple-hairline p-5 text-left flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-apple-hairline pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs text-apple-ink-muted-48 font-medium">Todo Pro — Personal Space</div>
                <div className="w-6" />
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-apple-divider-soft border border-apple-hairline/40">
                  <div className="w-4 h-4 rounded-full border border-apple-primary flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-apple-primary" />
                  </div>
                  <span className="text-sm font-medium text-apple-ink">Design high-fidelity Apple showcase page</span>
                  <span className="ml-auto text-[10px] bg-apple-primary/10 text-apple-primary px-2 py-0.5 rounded-full font-medium">Work</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-apple-canvas border border-apple-hairline/40">
                  <div className="w-4 h-4 rounded-full border border-apple-hairline" />
                  <span className="text-sm text-apple-ink">Implement drag-and-drop animations</span>
                  <span className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">Personal</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-apple-canvas border border-apple-hairline/40">
                  <div className="w-4 h-4 rounded-full border border-apple-hairline" />
                  <span className="text-sm text-apple-ink">Review linter warnings and clean up code</span>
                  <span className="ml-auto text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full font-medium">Learning</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Feature Tile (Dark) */ }
      <section className="w-full bg-apple-surface-tile-1 text-apple-body-on-dark py-28 px-4 text-center flex flex-col items-center justify-center border-b border-apple-surface-black">
        <div className="max-w-200 flex flex-col items-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-apple-primary-on-dark mb-3">
            Calm Motion
          </span>
          <h2 className="typography-display-lg font-semibold text-white mb-4">
            Reordered by touch. Sorted by mind.
          </h2>
          <p className="typography-lead text-apple-body-muted max-w-150 mb-8">
            Fluid drag-and-drop sorting powered by Framer Motion. Experience tactile feedback that makes organizing your day feel like a breeze.
          </p>
          <button
            onClick={ () => setActiveTab( "todo" ) }
            className="text-apple-primary-on-dark hover:underline text-sm font-medium flex items-center gap-1"
          >
            Try for free &gt;
          </button>
        </div>

        {/* Tactile Drag Graphic */ }
        <div className="w-full max-w-150 px-4">
          <div className="flex flex-col gap-3 text-left">
            {/* Static Item */ }
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/50 flex items-center gap-3">
              <svg viewBox="0 0 16 16" className="h-4 w-4 opacity-30" fill="currentColor"><circle cx="5" cy="4" r="1.2" /><circle cx="11" cy="4" r="1.2" /><circle cx="5" cy="8" r="1.2" /><circle cx="11" cy="8" r="1.2" /><circle cx="5" cy="12" r="1.2" /><circle cx="11" cy="12" r="1.2" /></svg>
              <span className="text-sm">Completed task</span>
            </div>
            {/* Dragged Item (Visual representation of dragging) */ }
            <motion.div
              animate={ { y: [ 0, -10, 0 ], rotate: [ 0, -1, 0 ] } }
              transition={ { repeat: Infinity, duration: 4, ease: "easeInOut" } }
              className="p-4 rounded-xl bg-apple-surface-tile-2 border border-apple-primary-on-dark/40 text-white flex items-center gap-3 apple-product-shadow ring-2 ring-apple-primary-on-dark/30 relative z-10"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4 text-apple-primary-on-dark" fill="currentColor"><circle cx="5" cy="4" r="1.2" /><circle cx="11" cy="4" r="1.2" /><circle cx="5" cy="8" r="1.2" /><circle cx="11" cy="8" r="1.2" /><circle cx="5" cy="12" r="1.2" /><circle cx="11" cy="12" r="1.2" /></svg>
              <span className="text-sm font-medium">Drag me to prioritize</span>
              <span className="ml-auto text-[10px] bg-apple-primary-on-dark/20 text-apple-primary-on-dark px-2 py-0.5 rounded-full font-medium">High Priority</span>
            </motion.div>
            {/* Static Item */ }
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 flex items-center gap-3">
              <svg viewBox="0 0 16 16" className="h-4 w-4 opacity-50" fill="currentColor"><circle cx="5" cy="4" r="1.2" /><circle cx="11" cy="4" r="1.2" /><circle cx="5" cy="8" r="1.2" /><circle cx="11" cy="8" r="1.2" /><circle cx="5" cy="12" r="1.2" /><circle cx="11" cy="12" r="1.2" /></svg>
              <span className="text-sm">Another pending task</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature Tile (Parchment) */ }
      <section className="w-full bg-apple-canvas-parchment text-apple-ink py-28 px-4 text-center flex flex-col items-center justify-center border-b border-apple-hairline">
        <div className="max-w-200 flex flex-col items-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-apple-primary mb-3">
            Calm Themes
          </span>
          <h2 className="typography-display-lg font-semibold text-apple-ink mb-4">
            Calm themes for every lighting.
          </h2>
          <p className="typography-lead text-apple-ink-muted-80 max-w-150 mb-8">
            Switch between Light, Dark, and System modes with a single tap. The entire interface adapts instantly, preserving your focus and energy.
          </p>
          <button
            onClick={ () => setActiveTab( "todo" ) }
            className="text-apple-primary hover:underline text-sm font-medium flex items-center gap-1"
          >
            Cycle themes in the app &gt;
          </button>
        </div>

        {/* Side-by-Side Theme Mockups */ }
        <div className="w-full max-w-225 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {/* Light Theme Mockup */ }
          <div className="rounded-2xl border border-apple-hairline bg-apple-canvas-parchment p-6 text-left apple-product-shadow flex flex-col gap-4 dark:border-white/10 dark:bg-apple-surface-tile-1">
            <div className="flex items-center justify-between border-b border-apple-hairline pb-2 dark:border-white/10">
              <span className="text-xs font-semibold text-apple-ink dark:text-white">Light Mode</span>
              <div className="w-2.5 h-2.5 rounded-full bg-apple-primary dark:bg-apple-primary-on-dark" />
            </div>
            <div className="rounded-xl border border-[#e0e0e0] bg-white p-3.5 text-sm font-medium text-[#1d1d1f] transition-colors dark:border-[#d1d1d6] dark:bg-[#f2f2f7]">
              ☀️ Designed for bright daylight focus.
            </div>
          </div>

          {/* Dark Theme Mockup */ }
          <div className="bg-apple-surface-tile-1 rounded-2xl border border-white/10 p-6 text-left apple-product-shadow flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-semibold text-white">Dark Mode</span>
              <div className="w-2.5 h-2.5 rounded-full bg-apple-primary-on-dark" />
            </div>
            <div className="p-3.5 rounded-xl bg-apple-surface-tile-2 border border-white/5 text-white/90 text-sm font-medium">
              🌙 Gentle on the eyes, perfect for night.
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Tile (Dark 2) */ }
      <section className="w-full bg-apple-surface-tile-2 text-apple-body-on-dark py-28 px-4 text-center flex flex-col items-center justify-center">
        <div className="max-w-200 flex flex-col items-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-apple-primary-on-dark mb-3">
            Organization
          </span>
          <h2 className="typography-display-lg font-semibold text-white mb-4">
            Categories and due dates. Under control.
          </h2>
          <p className="typography-lead text-apple-body-muted max-w-150 mb-8">
            Filter by Work, Personal, or Learning. Keep track of what&apos;s Overdue, due Today, or planned for the Future. Everything you need, exactly when you need it.
          </p>
          <button
            onClick={ () => setActiveTab( "todo" ) }
            className="text-apple-primary-on-dark hover:underline text-sm font-medium flex items-center gap-1"
          >
            Try now &gt;
          </button>
        </div>

        {/* Category Badges Grid */ }
        <div className="w-full max-w-125 flex flex-wrap justify-center gap-3 px-4">
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-apple-primary/20 text-apple-primary-on-dark border border-apple-primary-on-dark/30">
            💼 Work
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            🏡 Personal
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-violet-500/20 text-violet-400 border border-violet-500/30">
            🎓 Learning
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
            ⚠️ Due Today
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            🚨 Overdue
          </span>
        </div>
      </section>
    </div>
  );
}

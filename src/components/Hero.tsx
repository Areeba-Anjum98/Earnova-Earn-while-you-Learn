import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Briefcase, Search, TrendingUp, Wallet, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AnimatedCounter } from "./AnimatedCounter";
import { AnimatedBlobs } from "./AnimatedBlobs";

type SearchResult = {
  _id: string;
  title: string;
  company: string;
};

type HeroProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  searchResults: SearchResult[];
  onSearchResultClick: (jobTitle: string) => void;
};

export function Hero({ searchQuery, onSearchQueryChange, onSearch, searchResults, onSearchResultClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden">
      <AnimatedBlobs />
      <div className="absolute inset-0 grid-bg opacity-60" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-muted-foreground">
                Pakistan's #1 Student Job Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              Earn<span className="gradient-text-brand">ova</span>
              <br />
              opportunities.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Pakistan's first student job marketplace. Connect with local employers, track your
              hours, get paid instantly in Rupees. Built for Pakistan's student workforce.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/login"
                className="group relative overflow-hidden rounded-2xl bg-gradient-primary px-7 py-4 font-semibold text-background shadow-glow hover:scale-[1.03] active:scale-[0.98] transition-transform animate-pulse-glow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Find Jobs
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </Link>
              <Link
                to="/login"
                className="group rounded-2xl glass-strong px-7 py-4 font-semibold hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Post a Job
                </span>
              </Link>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-primary rounded-2xl opacity-0 group-focus-within:opacity-60 blur transition-opacity duration-500" />
              <div className="relative glass-strong rounded-2xl flex flex-col gap-3 p-2 pl-5">
                <div className="flex items-center gap-3 w-full">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Try 'tutoring', 'design', 'campus barista'…"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm py-3 placeholder:text-muted-foreground/70"
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                  />
                  <button
                    onClick={onSearch}
                    className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-background hover:scale-105 transition-transform"
                  >
                    Search
                  </button>
                </div>
                {searchResults.length > 0 && (
                  <div className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                      Matching jobs
                    </p>
                    <div className="space-y-2">
                      {searchResults.map((job) => (
                        <button
                          key={job._id}
                          onClick={() => onSearchResultClick(job.title)}
                          className="w-full text-left rounded-2xl px-3 py-3 hover:bg-muted/10 transition-colors"
                        >
                          <p className="font-medium">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 grid grid-cols-3 gap-6"
            >
              {[
                { v: 500, suffix: "+", label: "Active students" },
                { v: 100, suffix: "+", label: "Jobs posted" },
                { v: 5, suffix: "M+", label: "Earned (Rs)", prefix: "Rs. " },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl md:text-3xl font-bold gradient-text">
                    <AnimatedCounter value={s.v} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - 3D dashboard preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative perspective-1000"
          >
            <div
              className="relative preserve-3d"
              style={{ transform: "rotateY(-12deg) rotateX(8deg)" }}
            >
              {/* Floating decorative cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -left-10 z-20 glass-strong rounded-2xl p-4 shadow-elevated min-w-[180px]"
                style={{ transform: "translateZ(60px)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-background" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">This week</div>
                    <div className="font-bold text-lg">Rs. 12,500</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 z-20 glass-strong rounded-2xl p-4 shadow-elevated"
                style={{ transform: "translateZ(80px)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-teal/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Earnings</div>
                    <div className="font-bold text-sm text-teal">+24.8%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 -right-12 z-20 glass-strong rounded-full px-4 py-3 shadow-elevated"
                style={{ transform: "translateZ(100px)" }}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="text-xs font-semibold">8 active gigs</span>
                </div>
              </motion.div>

              {/* Main dashboard panel */}
              <div className="glass-strong rounded-3xl p-6 shadow-elevated border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs text-muted-foreground">Welcome back, Alex</div>
                    <div className="font-bold text-xl">Your Dashboard</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-primary" />
                </div>

                <div className="rounded-2xl bg-black/30 p-5 mb-4">
                  <div className="text-xs text-muted-foreground mb-1">Total earned</div>
                  <div className="text-3xl font-bold gradient-text mb-4">Rs. 3,248.90</div>
                  {/* Mini chart */}
                  <div className="flex items-end gap-1.5 h-20">
                    {[40, 60, 35, 75, 50, 90, 65, 85, 70, 95, 80, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1 + i * 0.05, duration: 0.6 }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-violet to-accent opacity-90"
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-black/30 p-3">
                    <div className="text-xs text-muted-foreground">Hours</div>
                    <div className="font-bold">42.5h</div>
                  </div>
                  <div className="rounded-xl bg-black/30 p-3">
                    <div className="text-xs text-muted-foreground">Rating</div>
                    <div className="font-bold">4.9 ★</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow underneath */}
            <div className="absolute inset-0 -z-10 bg-gradient-primary blur-3xl opacity-30 scale-90" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

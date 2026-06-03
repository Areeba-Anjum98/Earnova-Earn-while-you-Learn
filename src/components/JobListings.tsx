import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, DollarSign, Grid3x3, List, Filter, Star } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type Job = {
  _id: string;
  title: string;
  company: string;
  payPerHour?: number;
  paymentModel?: string;
  taskPayment?: number;
  type: string;
  jobDuration?: number;
  startTime?: string;
  endTime?: string;
  location?: string;
  tag: string;
  featured?: boolean;
};

export function JobListings({ jobs, loading }: { jobs: Job[]; loading: boolean }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const isTaskJob = (job: Job) => job.paymentModel === "task" || Number(job.taskPayment) > 0;

  // ========================
  // APPLY JOB
  // ========================
  const applyJob = async (jobId: string) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate({ to: "/login" });
      return;
    }

    try {
      // ✅ FIX: userId token se aata hai backend pe, yahan nahi bhejte
      const res = await fetch("http://localhost:3001/api/application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || data || "Already applied / error");
        return;
      }

      alert("Applied successfully 🚀");
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <section id="jobs" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex glass rounded-full px-4 py-1.5 text-xs font-medium text-accent mb-4">
              Live Opportunities
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Featured <span className="gradient-text-brand">jobs today</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm hover:bg-white/10 transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <div className="glass rounded-xl p-1 flex">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-all ${
                  view === "grid"
                    ? "bg-gradient-primary text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>

              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-all ${
                  view === "list"
                    ? "bg-gradient-primary text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* JOB LIST */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={
              view === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-4"
            }
          >
            {/* LOADING */}
            {loading && <p className="text-center col-span-3">Loading jobs...</p>}

            {/* EMPTY */}
            {!loading && jobs.length === 0 && (
              <p className="text-center col-span-3 text-muted-foreground">No jobs found</p>
            )}

            {/* JOB CARDS */}
            {jobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="group relative glass rounded-2xl p-6 hover:border-accent/30 transition-all hover:shadow-elevated cursor-pointer overflow-hidden"
              >
                {job.featured && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-gradient-primary px-2.5 py-1 text-[10px] font-bold text-background">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    FEATURED
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <div className="inline-flex rounded-full bg-blue-500/20 text-blue-400 px-3 py-1 text-xs font-medium">
                    {isTaskJob(job) ? "Task-based" : "Hour-based"}
                  </div>
                  <div className="inline-flex rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium">
                    {job.tag}
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                <p className="text-sm text-muted-foreground mb-5">{job.company}</p>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-teal" />
                    <span className="font-semibold text-foreground">
                      {isTaskJob(job)
                        ? `Rs. ${job.taskPayment != null ? job.taskPayment : job.payPerHour || "??"} per task`
                        : `Rs. ${job.payPerHour != null ? job.payPerHour : "??"} / hr`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.location || job.type}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {job.jobDuration}h • {job.startTime}-{job.endTime}
                  </div>
                </div>

                {/* APPLY BUTTON */}
                <button
                  onClick={() => applyJob(job._id)}
                  className="mt-5 w-full rounded-xl glass-strong py-2.5 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gradient-primary hover:text-background"
                >
                  Apply Now →
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

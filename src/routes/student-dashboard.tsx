import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE } from "@/lib/config";
import {
  Briefcase,
  Clock,
  Star,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { startWorkSession, stopWorkSession } from "@/lib/api";
import logo from "@/assets/logo.jpeg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/student-dashboard")({
  component: StudentDashboard,
});

function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [myApps, setMyApps] = useState<any[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [applyMsg, setApplyMsg] = useState<{ id: string; msg: string } | null>(null);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any | null>(null);

  const loadWallet = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load wallet");
      const data = await res.json();
      setWallet(data);
    } catch (err) {
      console.error(err);
    }
  };
  const [pendingSessions, setPendingSessions] = useState<any[]>([]);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [stoppingId, setStoppingId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [applyForm, setApplyForm] = useState({ whySelected: "", expertise: "", agreedToTerms: false });
  const [showApplyModal, setShowApplyModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadSessions = async (userId: string, token: string) => {
    try {
      const res = await fetch(`${API_BASE}/work/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const sessions = Array.isArray(data) ? data : [];
      setEarnings(sessions);
      setActiveSession(sessions.find((s: any) => s.active) || null);
      setPendingSessions(sessions.filter((s: any) => !s.active && s.status === "pending"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // ✅ Auth guard
    if (!stored || !token) {
      navigate({ to: "/login" });
      return;
    }

    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    // Load jobs
    fetch(`${API_BASE}/jobs`)
      .then((r) => r.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(console.error);

    // Load my applications
    fetch(`${API_BASE}/application`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setMyApps(Array.isArray(data) ? data : []))
      .catch(console.error);

    loadSessions(parsedUser._id || parsedUser.id, token);
    loadWallet(token);
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/notifications/unread/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data?.unreadCount || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const loadNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const openNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/notifications/all/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to mark notifications read", errorData);
        return;
      }
    } catch (err) {
      console.error(err);
      return;
    }

    await loadNotifications();
    await loadUnreadCount();
    setShowNotifications(true);
  };

  const handleApply = async (jobId: string) => {
    const token = localStorage.getItem("token");
    if (!applyForm.agreedToTerms) {
      setApplyMsg({ id: jobId, msg: "Please accept terms and conditions" });
      return;
    }
    setApplyingId(jobId);
    try {
      const res = await fetch(`${API_BASE}/application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId, whySelected: applyForm.whySelected, expertise: applyForm.expertise }),
      });
      const data = await res.json();
      if (res.ok) {
        setApplyMsg({ id: jobId, msg: "Applied!" });
        setMyApps((prev) => {
          const filtered = prev.filter((a: any) => a._id !== data._id);
          return [...filtered, data];
        });
        setShowApplyModal(null);
        setApplyForm({ whySelected: "", expertise: "", agreedToTerms: false });
      } else {
        setApplyMsg({ id: jobId, msg: data.message || data });
      }
    } catch {
      setApplyMsg({ id: jobId, msg: "Error applying" });
    } finally {
      setApplyingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate({ to: "/" });
  };

  const handleStartSession = async (jobId: string) => {
    if (!user) return;
    const userId = user._id || user.id;
    setStartingId(jobId);
    try {
      const session = await startWorkSession(jobId, userId);
      if (session._id) {
        await loadSessions(userId, localStorage.getItem("token") || "");
        await loadWallet(localStorage.getItem("token") || "");
      } else {
        alert(session.message || "Could not start session");
      }
    } catch {
      alert("Error starting session");
    } finally {
      setStartingId(null);
    }
  };

  const handleStopSession = async (sessionId: string) => {
    if (!user) return;
    const userId = user._id || user.id;
    setStoppingId(sessionId);
    try {
      const data = await stopWorkSession(sessionId);
      if (data.session || data.message === "Session ended - awaiting employer approval") {
        await loadSessions(userId, localStorage.getItem("token") || "");
        await loadWallet(localStorage.getItem("token") || "");
      } else {
        alert(data.message || "Could not stop session");
      }
    } catch {
      alert("Error stopping session");
    } finally {
      setStoppingId(null);
    }
  };

  const appliedJobIds = new Set(
    myApps
      .filter((a: any) => a.status === "applied" || a.status === "pending")
      .map((a: any) => (typeof a.jobId === "object" ? a.jobId._id : a.jobId)),
  );
  const acceptedJobIds = new Set(
    myApps
      .filter((a: any) => a.status === "accepted")
      .map((a: any) => (typeof a.jobId === "object" ? a.jobId._id : a.jobId)),
  );
  const rejectedJobIds = new Set(
    myApps
      .filter((a: any) => a.status === "rejected")
      .map((a: any) => (typeof a.jobId === "object" ? a.jobId._id : a.jobId)),
  );

  const jobIsTask = (job: any) => job?.paymentModel === "task" || Number(job?.taskPayment) > 0;

  // Calculate total hours worked from approved sessions
  const approvedSessions = earnings.filter((s: any) => s.status === "approved");
  const totalHoursWorked = approvedSessions.reduce((sum, e) => sum + (e.durationMinutes || 0), 0) / 60;

  // Add current active session duration if exists
  const currentActiveDuration = activeSession ? (new Date().getTime() - new Date(activeSession.startTime).getTime()) / (1000 * 60 * 60) : 0;
  const totalHoursWithActive = totalHoursWorked + currentActiveDuration;

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredJobs = normalizedQuery
    ? jobs.filter((job: any) => {
        const text = `${job.title || ""} ${job.company || ""} ${job.tag || ""} ${job.type || ""} ${job.location || ""}`
          .toLowerCase();
        return text.includes(normalizedQuery);
      })
    : jobs;

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-accent/8 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white border border-border overflow-hidden flex items-center justify-center">
              <img src={logo} alt="logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold tracking-tight">Earnova</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={openNotifications}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || "S"}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Apply Modal */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>Recent updates about your applications and sessions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {notifications.length === 0 ? (
              <div className="rounded-2xl border border-border/50 bg-muted/10 p-6 text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification: any) => (
                <div key={notification._id} className="rounded-2xl border border-border/70 p-4 bg-background">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {notification.type.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-foreground">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showApplyModal} onOpenChange={() => setShowApplyModal(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for Job</DialogTitle>
            <DialogDescription>
              Tell the employer why you should be selected and accept the job agreement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium">Why should you be selected?</label>
              <textarea
                value={applyForm.whySelected}
                onChange={(e) => setApplyForm((f) => ({ ...f, whySelected: e.target.value }))}
                placeholder="Explain why you're the right fit for this job..."
                rows={2}
                className="w-full mt-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Your Expertise</label>
              <textarea
                value={applyForm.expertise}
                onChange={(e) => setApplyForm((f) => ({ ...f, expertise: e.target.value }))}
                placeholder="Describe your skills and experience..."
                rows={2}
                className="w-full mt-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Agreement Terms */}
            <div className="rounded-2xl border border-border/50 bg-muted/5 p-4">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Job Agreement Terms</p>
                  <p className="text-xs text-muted-foreground mt-1">Please review and accept these conditions:</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-1">Condition 1: Early Completion</p>
                  <p className="text-sm">If you complete the work before the mentioned job time ends, click "Stop Job" at the mentioned time in the description. Otherwise, the wallet will only calculate payment for the actual hours you worked, not the full scheduled duration.</p>
                </div>

                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-1">Condition 2: Early Completion Credit</p>
                  <p className="text-sm">If students complete work before the mentioned job time and click "Stop Job" to end the session, you will only be charged for actual time worked.</p>
                </div>

                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-1">Condition 3: Employer Accountability</p>
                  <p className="text-sm">If the employer intentionally allocates less time than needed, they will be accountable for fair payment. This protects students from unfair practices.</p>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-primary/5 p-3">
              <input
                type="checkbox"
                id="agree-terms"
                checked={applyForm.agreedToTerms}
                onChange={(e) => setApplyForm((f) => ({ ...f, agreedToTerms: e.target.checked }))}
                className="h-5 w-5 rounded border-border text-primary cursor-pointer mt-0.5"
              />
              <label htmlFor="agree-terms" className="text-sm cursor-pointer">
                I agree to the job terms and conditions. I understand the payment structure and my responsibilities.
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowApplyModal(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => showApplyModal && handleApply(showApplyModal)}
                disabled={!applyForm.whySelected.trim() || !applyForm.expertise.trim() || !applyForm.agreedToTerms || applyingId === showApplyModal}
                className="flex-1 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applyingId === showApplyModal ? "Applying…" : "Submit Application"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, <span className="gradient-text-brand">{user?.name || "Student"}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your account today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Wallet Balance",
              value: wallet?.balance != null ? `Rs. ${wallet.balance.toFixed(2)}` : "Rs. 0.00",
              icon: DollarSign,
              color: "text-teal",
            },
            {
              label: "Applications",
              value: myApps.length.toString(),
              icon: Briefcase,
              color: "text-accent",
            },
            {
              label: "Hours Worked",
              value: `${totalHoursWithActive.toFixed(1)}h`,
              icon: Clock,
              color: "text-primary",
            },
            {
              label: "Jobs Completed",
              value: approvedSessions.length.toString(),
              icon: CheckCircle2,
              color: "text-teal",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5"
            >
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3"
              >
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Earnings History */}
        {earnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4">Earnings History</h2>
            <div className="space-y-3">
              {earnings.slice(0, 5).map((session: any, i: number) => (
                <div
                  key={session._id}
                  className="glass rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{session.jobId?.title || "Job"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.startTime).toLocaleDateString()} •
                        {session.jobId?.paymentModel === "task" || Number(session.jobId?.taskPayment) > 0
                          ? "1 task completed"
                          : `${Math.round((session.durationMinutes / 60) * 10) / 10}h worked`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {session.earnings != null ? (
                      <p className="font-bold text-teal">Rs. {session.earnings.toFixed(2)}</p>
                    ) : null}
                    <p
                      className={`text-xs font-semibold ${
                        session.status === "approved" ? "text-teal" : "text-accent"
                      }`}
                    >
                      {session.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {myApps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4">My Applications</h2>
            <div className="flex flex-col gap-3">
              {myApps.map((app: any) => (
                <div
                  key={app._id}
                  className="glass rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-teal" />
                      <div>
                        <p className="text-sm font-medium">
                          Job: {typeof app.jobId === "object" ? app.jobId.title || app.jobId._id : app.jobId}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{app.status}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        app.status === "accepted"
                          ? "bg-teal/10 text-teal"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 bg-muted/5 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Why selected</p>
                      <p className="mt-2 text-sm text-foreground">{app.whySelected || "No details provided."}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-muted/5 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Expertise</p>
                      <p className="mt-2 text-sm text-foreground">{app.expertise || "No expertise details provided."}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-muted-foreground">Active Work Session</p>
                <p className="text-xl font-bold">{activeSession.jobId?.title || "Working"}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Started at{" "}
                  {new Date(activeSession.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => handleStopSession(activeSession._id)}
                disabled={stoppingId === activeSession._id}
                className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50"
              >
                {stoppingId === activeSession._id ? "Stopping…" : "Stop Work"}
              </button>
            </div>
          </motion.div>
        )}

        {pendingSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.37 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-primary">Pending Approval</p>
                <p className="text-xl font-bold text-foreground">Waiting for employer confirmation</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {pendingSessions.map((session: any) => (
                <div key={session._id} className="rounded-2xl border border-border p-4">
                  <p className="font-medium">{session.jobId?.title || "Job"}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.jobId?.jobDuration ?? Math.round(((session.durationMinutes || 0) / 60) * 10) / 10}h
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Available Jobs */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Available Jobs</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 w-48"
              />
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="font-semibold">No jobs posted yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back soon for new opportunities.
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="font-semibold">No jobs match your search</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different keyword like title, company, or location.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((job: any, i: number) => {
                const applied = appliedJobIds.has(job._id);
                const accepted = acceptedJobIds.has(job._id);
                const msg = applyMsg && applyMsg.id === job._id ? applyMsg.msg : null;
                return (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass rounded-2xl p-6 hover:shadow-elevated transition-all group hover:-translate-y-1"
                  >
                    <div className="inline-flex rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium mb-4">
                      {job.tag || job.type || "Job"}
                    </div>
                    {/* Job Type Badge */}
                    <div className="mb-2 flex gap-2">
                      <span className="inline-flex rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                        {jobIsTask(job) ? "Task-based" : "Hour-based"}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{job.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{job.company || "Company"}</p>

                    <div className="space-y-2 text-sm text-muted-foreground mb-5">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-teal" />
                        <span className="font-semibold text-foreground">
                          {jobIsTask(job)
                            ? `Rs. ${job.taskPayment != null ? job.taskPayment : job.payPerHour || "??"} per task`
                            : `Rs. ${job.payPerHour != null ? job.payPerHour : "??"} / hr`}
                        </span>
                      </div>
                      {!jobIsTask(job) && job.jobDuration && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {job.jobDuration}h • {job.startTime}-{job.endTime}
                        </div>
                      )}
                      {job.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                      )}
                      {job.type && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {job.type}
                        </div>
                      )}
                    </div>

                    {msg ? (
                      <div className="w-full text-center py-2 text-xs font-semibold text-teal">
                        {msg}
                      </div>
                    ) : accepted ? (
                      activeSession ? (
                        activeSession.jobId?._id === job._id ? (
                          <button
                            onClick={() => handleStopSession(activeSession._id)}
                            disabled={stoppingId === activeSession._id}
                            className="w-full rounded-xl bg-destructive/10 text-destructive py-2.5 text-sm font-semibold hover:bg-destructive/20 transition-all disabled:opacity-50"
                          >
                            {stoppingId === activeSession._id ? "Stopping…" : "Stop Work"}
                          </button>
                        ) : (
                          <div className="w-full rounded-xl py-2 text-sm font-semibold text-center bg-muted/10 text-muted-foreground">
                            Session active on another job
                          </div>
                        )
                      ) : (
                        <button
                          onClick={() => handleStartSession(job._id)}
                          disabled={startingId === job._id}
                          className="w-full rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-white hover:shadow-glow transition-all disabled:opacity-50"
                        >
                          {startingId === job._id ? "Starting…" : "Start Work"}
                        </button>
                      )
                    ) : applied ? (
                      <div className="w-full rounded-xl border border-primary/20 bg-primary/10 py-3 text-center text-sm font-semibold text-primary">
                        Waiting for employer approval
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowApplyModal(job._id)}
                        disabled={applyingId === job._id}
                        className="w-full rounded-xl glass-strong py-2.5 text-sm font-semibold flex items-center justify-center gap-1 hover:bg-gradient-primary hover:text-white transition-all disabled:opacity-50"
                      >
                        {rejectedJobIds.has(job._id) ? "Re-apply" : applyingId === job._id ? "Applying…" : "Apply Now"}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

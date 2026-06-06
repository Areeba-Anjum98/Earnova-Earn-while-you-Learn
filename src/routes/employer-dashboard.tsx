import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE } from "@/lib/config";
import {
  Briefcase,
  Users,
  LogOut,
  Bell,
  Plus,
  X,
  DollarSign,
  CheckCircle2,
  Clock,
  Star,
  AlertCircle,
} from "lucide-react";
import logo from "@/assets/logo.jpeg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/employer-dashboard")({
  component: EmployerDashboard,
});

function EmployerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const pendingApplications = applications.filter((app) => app.status === "applied");
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postMsg, setPostMsg] = useState("");
  const [pendingSessions, setPendingSessions] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    paymentModel: "hourly",
    payPerHour: "",
    taskPayment: "",
    jobDuration: "8",
    startTime: "09:00",
    endTime: "17:00",
    location: "Islamabad",
    type: "Remote",
    tag: "",
    requiredSkills: "",
  });
  const [employerAgreedToTerms, setEmployerAgreedToTerms] = useState(false);
  const [viewingApp, setViewingApp] = useState<any | null>(null);

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

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // ✅ Auth guard
    if (!stored || !token) {
      navigate({ to: "/login" });
      return;
    }

    const u = JSON.parse(stored);
    setUser(u);
    const employerId = u._id || u.id;

    // Load jobs created by this employer
    fetch(`${API_BASE}/jobs/employer/${employerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(console.error);

    // Load pending sessions for approval
    fetch(`${API_BASE}/work/pending/employer/${employerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setPendingSessions(Array.isArray(data) ? data : []))
      .catch(console.error);

    // Load applications for employer's jobs
    fetch(`${API_BASE}/jobs/employer/${employerId}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch(console.error);

    loadUnreadCount();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate({ to: "/" });
  };

  const jobIsTask = (job: any) => job?.paymentModel === "task" || Number(job?.taskPayment) > 0;

  const handlePostJob = async () => {
    setPostMsg("");
    if (!employerAgreedToTerms) {
      setPostMsg("Please accept the employer terms and conditions");
      return;
    }

    if (!form.title.trim() || !form.company.trim()) {
      setPostMsg("Title and company are required");
      return;
    }

    if (form.paymentModel === "task") {
      if (!form.taskPayment || Number.isNaN(Number(form.taskPayment)) || Number(form.taskPayment) <= 0) {
        setPostMsg("Please enter a valid task payment amount in Rs.");
        return;
      }
    } else {
      if (!form.payPerHour || Number.isNaN(Number(form.payPerHour)) || Number(form.payPerHour) <= 0) {
        setPostMsg("Please enter a valid hourly rate in Rs. / hr");
        return;
      }
    }

    const token = localStorage.getItem("token");
    setPosting(true);
    try {
      const res = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          paymentModel: form.paymentModel,
          payPerHour: form.paymentModel === "hourly" ? parseFloat(form.payPerHour) : 0,
          taskPayment: form.paymentModel === "task" ? parseFloat(form.taskPayment) : 0,
          jobDuration: form.paymentModel === "hourly" ? parseInt(form.jobDuration) : 0,
          requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setJobs((prev) => [data, ...prev]);
        setForm({
          title: "",
          company: "",
          description: "",
          paymentModel: "hourly",
          payPerHour: "",
          taskPayment: "",
          jobDuration: "8",
          startTime: "09:00",
          endTime: "17:00",
          location: "Islamabad",
          type: "Remote",
          tag: "",
          requiredSkills: "",
        });
        setEmployerAgreedToTerms(false);
        setShowForm(false);
        setPostMsg("Job posted successfully!");
      } else {
        setPostMsg(data.message || data || "Failed to post job");
      }
    } catch {
      setPostMsg("Cannot connect to server");
    } finally {
      setPosting(false);
    }
  };

  const handleApproveSession = async (sessionId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/jobs/approve-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setPendingSessions((prev) => prev.filter((s) => s._id !== sessionId));
        alert("Session approved! Payment released.");
      } else {
        alert(data.message || "Error approving session");
      }
    } catch {
      alert("Error approving session");
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/jobs/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId }),
      });
      const data = await res.json();
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a._id !== applicationId));
        alert("Application accepted! Student notified.");
        await loadUnreadCount();
      } else {
        alert(data.message || "Error accepting application");
      }
    } catch {
      alert("Error accepting application");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Delete this job? This action cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setJobs((prev) => prev.filter((job: any) => job._id !== jobId));
        alert("Job deleted successfully.");
      } else {
        alert(data.message || "Unable to delete job");
      }
    } catch {
      alert("Error deleting job");
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/jobs/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId }),
      });
      const data = await res.json();
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a._id !== applicationId));
        alert("Application rejected. Student notified.");
        await loadUnreadCount();
      } else {
        alert(data.message || "Error rejecting application");
      }
    } catch {
      alert("Error rejecting application");
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-accent/8 blur-3xl" />
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
              {user?.name?.[0]?.toUpperCase() || "E"}
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

      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              <span className="font-semibold text-foreground">{user?.name || "Employer"}</span> • Manage your job listings and find the right students.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Post a Job"}
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Jobs Posted", value: jobs.length.toString(), icon: Briefcase },
            { label: "Total Applicants", value: applications.length.toString(), icon: Users },
            {
              label: "Hired Students",
              value: applications.filter((a) => a.status === "accepted").length.toString(),
              icon: CheckCircle2,
            },
            { label: "Active Sessions", value: pendingSessions.length.toString(), icon: Clock },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Post Job Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6 mb-8 shadow-elevated"
          >
            <h2 className="text-lg font-bold mb-5">Post a New Job</h2>

            {postMsg && (
              <div
                className={`rounded-xl px-4 py-3 text-sm mb-4 ${
                  postMsg.includes("success")
                    ? "bg-teal/10 border border-teal/20 text-teal"
                    : "bg-destructive/10 border border-destructive/20 text-destructive"
                }`}
              >
                {postMsg}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: "title", label: "Job Title", placeholder: "e.g. Frontend Tutor" },
                { key: "company", label: "Company / Name", placeholder: "e.g. My Startup" },
                { key: "location", label: "Location", placeholder: "e.g. Islamabad" },
                { key: "tag", label: "Category Tag", placeholder: "e.g. Tutoring, Design" },
                {
                  key: "requiredSkills",
                  label: "Required Skills (comma separated)",
                  placeholder: "e.g. JavaScript, React, Node.js",
                },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Job Format</label>
                <select
                  value={form.paymentModel}
                  onChange={(e) => setForm((f) => ({ ...f, paymentModel: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                >
                  <option value="hourly">Hour-based</option>
                  <option value="task">Task-based</option>
                </select>
              </div>

              {form.paymentModel === "task" ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Task Payment (Rs.)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={form.taskPayment}
                    onChange={(e) => setForm((f) => ({ ...f, taskPayment: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Total Hours Worked</label>
                    <input
                      type="number"
                      placeholder="e.g. 8"
                      value={form.jobDuration}
                      onChange={(e) => setForm((f) => ({ ...f, jobDuration: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Payment Per Hour (Rs.)</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={form.payPerHour}
                      onChange={(e) => setForm((f) => ({ ...f, payPerHour: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                >
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium">Job Description</label>
                <textarea
                  placeholder="Describe the job requirements, responsibilities, and what the student will be doing..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Employer Agreement Terms */}
            <div className="mt-6 rounded-2xl border border-border/50 bg-muted/5 p-4 mb-5">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Employer Agreement Terms</p>
                  <p className="text-xs text-muted-foreground mt-1">Please review and accept these conditions:</p>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-4">
                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-1">Condition 1: Fair Time Allocation</p>
                  <p className="text-sm">You must allocate sufficient time for the student to complete the job properly. Intentionally short time limits will result in payment deductions and extra review by the student.</p>
                </div>

                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-1">Condition 2: Early Completion Credit</p>
                  <p className="text-sm">If students complete work before the mentioned job time, they should click "Stop Job" to end the session. You will only be charged for actual time worked.</p>
                </div>

                <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                  <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-1">Condition 3: Payment Accountability</p>
                  <p className="text-sm">If a student works overtime due to insufficient allocated time, you agree to pay 50% extra for those hours. Failure to do so may affect future hiring decisions.</p>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-primary/5 p-3">
                <input
                  type="checkbox"
                  id="employer-agree-terms"
                  checked={employerAgreedToTerms}
                  onChange={(e) => setEmployerAgreedToTerms(e.target.checked)}
                  className="h-5 w-5 rounded border-border text-primary cursor-pointer mt-0.5"
                />
                <label htmlFor="employer-agree-terms" className="text-sm cursor-pointer">
                  I agree to the employer terms and conditions. I understand my responsibilities and payment obligations.
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePostJob}
              disabled={posting || !employerAgreedToTerms}
              className="rounded-xl bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {posting ? "Posting…" : "Post Job"}
            </motion.button>
          </motion.div>
        )}

        {/* Application Details Modal */}
        <Dialog open={!!viewingApp} onOpenChange={() => setViewingApp(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review the student's application for {viewingApp?.jobId?.title}
              </DialogDescription>
            </DialogHeader>
            {viewingApp && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {viewingApp.userId?.name?.[0]?.toUpperCase() || "S"}
                  </div>
                  <div>
                    <p className="font-semibold">{viewingApp.userId?.name}</p>
                    <p className="text-sm text-muted-foreground">{viewingApp.userId?.location}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Why should they be selected?</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {viewingApp.whySelected}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Expertise</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {viewingApp.expertise}
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setViewingApp(null)}
                    className="flex-1 rounded-xl border border-border py-2 text-sm font-medium hover:bg-muted"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleRejectApplication(viewingApp._id);
                      setViewingApp(null);
                    }}
                    className="flex-1 rounded-xl border border-destructive text-destructive py-2 text-sm font-semibold hover:bg-destructive/10"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleAcceptApplication(viewingApp._id);
                      setViewingApp(null);
                    }}
                    className="flex-1 rounded-xl bg-gradient-primary py-2 text-sm font-semibold text-white"
                  >
                    Accept Application
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>Recent updates for your hiring activity.</DialogDescription>
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

        {/* Applications Section */}
        {applications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4">Pending Applications</h2>
            <div className="space-y-3">
              {pendingApplications.length > 0 ? (
                pendingApplications.map((app: any) => (
                  <div
                    key={app._id}
                    className="glass rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{app.jobId?.title || "Job"}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.userId?.name} • {app.userId?.location || "Location unknown"}
                        </p>
                        <div className="mt-2 rounded-2xl bg-muted/5 p-3 text-xs text-foreground">
                          <p className="font-semibold">Why selected</p>
                          <p className="whitespace-normal break-words text-muted-foreground">{app.whySelected || "No reason provided."}</p>
                        </div>
                        <div className="mt-2 rounded-2xl bg-muted/5 p-3 text-xs text-foreground">
                          <p className="font-semibold">Expertise</p>
                          <p className="whitespace-normal break-words text-muted-foreground">{app.expertise || "No expertise provided."}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewingApp(app)}
                        className="rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleRejectApplication(app._id)}
                        className="rounded-xl border border-destructive text-destructive px-3 py-2 text-sm font-semibold hover:bg-destructive/10"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAcceptApplication(app._id)}
                        className="rounded-xl bg-gradient-primary px-3 py-2 text-sm font-semibold text-white hover:shadow-glow"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">
                  No pending applications. All applications for your jobs have been processed.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Pending Session Approvals */}
        {pendingSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
            <div className="space-y-3">
              {pendingSessions.map((session: any) => (
                <div
                  key={session._id}
                  className="glass rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{session.jobId?.title || "Job"}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.userId?.name} • {session.jobId?.jobDuration ?? Math.round((session.durationMinutes / 60) * 10) / 10}h
                        {session.earnings != null ? ` • Rs. ${session.earnings.toFixed(2)}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApproveSession(session._id)}
                    className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-white hover:shadow-glow"
                  >
                    Approve & Pay
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* My Job Listings */}
        <div>
          <h2 className="text-xl font-bold mb-6">Your Job Listings</h2>
          {jobs.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="font-semibold">No jobs posted yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click "Post a Job" to add your first listing.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job: any, i: number) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass rounded-2xl p-6 hover:shadow-elevated transition-all hover:-translate-y-1"
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
                  <p className="text-sm text-muted-foreground mb-4">{job.company}</p>

                  <div className="space-y-2 text-sm text-muted-foreground">
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
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="rounded-xl border border-destructive text-destructive px-4 py-2 text-sm font-semibold hover:bg-destructive/10"
                    >
                      Delete Job
                    </button>
                    {jobIsTask(job) ? (
                      <span className="text-xs text-muted-foreground">Task-based pricing</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Hourly pricing</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

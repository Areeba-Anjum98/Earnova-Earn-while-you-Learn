const BASE = `${(import.meta.env.VITE_API_URL as string) || 'http://localhost:3001'}/api`;

// ✅ FIX: Helper to get auth headers
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* ========================
   AUTH
======================== */
export const login = (data: { email: string; password: string }) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const register = (data: { name: string; email: string; password: string; role?: string }) =>
  fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

/* ========================
   JOBS
======================== */
export const getJobs = () => fetch(`${BASE}/jobs`).then((r) => r.json());

export const createJob = (data: any) =>
  fetch(`${BASE}/jobs`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

/* ========================
   APPLICATIONS
======================== */
// ✅ FIX: Correct endpoint was /api/application not /api/jobs/apply
export const applyJob = (jobId: string) =>
  fetch(`${BASE}/application`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ jobId }),
  }).then((r) => r.json());

export const getMyApplications = () =>
  fetch(`${BASE}/application`, {
    headers: authHeaders(),
  }).then((r) => r.json());

/* ========================
   EMPLOYER ACTIONS
======================== */
// ✅ FIX: Auth headers added
export const acceptApplication = (applicationId: string) =>
  fetch(`${BASE}/jobs/accept`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ applicationId }),
  }).then((r) => r.json());

export const startSession = (data: { jobId: string; studentId: string; hourlyRate: number }) =>
  fetch(`${BASE}/jobs/start`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const endSession = (sessionId: string) =>
  fetch(`${BASE}/jobs/end`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ sessionId }),
  }).then((r) => r.json());

/* ========================
   WORK SESSIONS
======================== */
export const startWorkSession = (jobId: string, userId: string) =>
  fetch(`${BASE}/work/start`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ jobId, userId }),
  }).then((r) => r.json());

export const stopWorkSession = (sessionId: string) =>
  fetch(`${BASE}/work/stop/${sessionId}`, {
    method: "POST",
    headers: authHeaders(),
  }).then((r) => r.json());

export const getUserSessions = (userId: string) =>
  fetch(`${BASE}/work/${userId}`, {
    headers: authHeaders(),
  }).then((r) => r.json());

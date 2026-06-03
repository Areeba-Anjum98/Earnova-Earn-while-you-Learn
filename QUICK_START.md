# 🚀 Quick Start Guide - Testing Backend Connections

## Step 1: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies (if not already done)
npm install

# Create .env file if missing
# Add these variables:
MONGO_URI=mongodb://localhost:27017/studentwage
JWT_SECRET=your_secret_key_here
PORT=3001

# Start backend server
npm run dev
```

**Expected output:**

```
MongoDB Connected 🚀
Server running on port 3001 🚀
```

---

## Step 2: Setup Frontend

```bash
# In a new terminal, from project root
npm install

# Start frontend dev server
npm run dev
```

**Expected output:**

```
VITE v... ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## Step 3: Test Registration & Login

### Test Student Registration

1. Open http://localhost:5173
2. Click "Sign up" link or navigate to http://localhost:5173/signup
3. Select **Student** role
4. Fill in:
   - Name: `John Student`
   - Email: `student@test.com`
   - Password: `password123`
5. Click "Create account"
6. Should redirect to `/student-dashboard`

### Test Employer Registration

1. Go back to signup page
2. Select **Employer** role
3. Fill in:
   - Name: `Jane Employer`
   - Email: `employer@test.com`
   - Password: `password123`
4. Click "Create account"
5. Should redirect to `/employer-dashboard`

### Test Login

1. Click "Sign in" link
2. Use credentials from above
3. Should redirect to appropriate dashboard

---

## Step 4: Test Student Features

### View Available Jobs

- [ ] Jobs should load on dashboard
- [ ] Job cards display: title, company, pay, type

### Apply to Job

1. Click "Apply" button on a job
2. Should see "Applied!" message
3. Job should appear in "My Applications" section
4. Application status should show as "applied"

### Check Applications

- [ ] "My Applications" section shows all applications
- [ ] Each application shows status
- [ ] Can see which jobs applied to

---

## Step 5: Test Employer Features

### Post a Job

1. Click "Post a Job" button
2. Fill form:
   - Job Title: `Tutor Position`
   - Company/Name: `My Company`
   - Pay Per Hour: `25`
   - Location: `Remote`
   - Type: `Remote`
   - Category Tag: `Tutoring`
3. Click "Post Job"
4. Should see success message
5. Job should appear in "Your Job Listings"

### Verify Job Posted

1. Logout from employer account
2. Login as student
3. New job should appear in "Available Jobs"
4. Should be able to apply to it

---

## Step 6: Verify Connections in Browser

### Check localStorage

1. Open DevTools (F12)
2. Go to Application tab → localStorage
3. Should see:
   - `token`: JWT token value
   - `user`: User object JSON

### Check Network Requests

1. Open DevTools → Network tab
2. Perform actions and observe:
   - Login: POST to `/api/auth/login`
   - Jobs: GET to `/api/jobs`
   - Apply: POST to `/api/application`
   - Create Job: POST to `/api/jobs`

---

## Troubleshooting

### Issue: Backend won't start

```
Solution: Check if port 3001 is in use
lsof -i :3001  (Mac/Linux)
netstat -ano | findstr :3001  (Windows)

Kill the process and restart
```

### Issue: MongoDB connection error

```
Solution: Ensure MongoDB is running
mongod  (or your MongoDB service)

Check MONGO_URI in .env is correct
```

### Issue: Can't apply to job

```
Possible causes:
1. Not logged in - check localStorage has token
2. Token expired - re-login
3. Already applied to job - try different job
4. Backend not running - check port 3001
```

### Issue: Redirect loop on login

```
Solution:
1. Clear localStorage:
   localStorage.clear()
2. Refresh page
3. Try again
4. Check browser console for errors
```

### Issue: 401 Unauthorized errors

```
Possible causes:
1. Token missing from Authorization header
2. Token is invalid or expired
3. JWT_SECRET mismatch between auth/verify

Solutions:
- Re-login to get new token
- Check JWT_SECRET in .env matches
- Clear localStorage and refresh
```

---

## ✅ Success Indicators

You'll know everything is working when:

✅ Can register as student
✅ Can register as employer
✅ Can login to both accounts
✅ Can see jobs on student dashboard
✅ Can apply to jobs
✅ Can post jobs as employer
✅ Applications appear in list
✅ Job appears after posting
✅ No 500 errors in console
✅ No CORS errors
✅ localStorage contains token and user

---

## 📊 API Response Examples

### Successful Login

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "63f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Student",
    "email": "student@test.com",
    "role": "student"
  }
}
```

### Get Jobs Success

```json
[
  {
    "_id": "63f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Frontend Tutor",
    "company": "My Startup",
    "payPerHour": 25,
    "location": "Remote",
    "type": "Remote",
    "tag": "Tutoring",
    "employerId": "63f1a2b3c4d5e6f7g8h9i0j2",
    "status": "open",
    "createdAt": "2024-04-28T10:30:00Z"
  }
]
```

### Apply to Job Success

```json
{
  "_id": "63f1a2b3c4d5e6f7g8h9i0j3",
  "userId": "63f1a2b3c4d5e6f7g8h9i0j1",
  "jobId": "63f1a2b3c4d5e6f7g8h9i0j2",
  "status": "applied",
  "createdAt": "2024-04-28T10:35:00Z"
}
```

---

## 📞 Need Help?

**Check these files for more info:**

- `BACKEND_CONNECTIONS.md` - Full API documentation
- `INTEGRATION_SUMMARY.md` - Complete integration overview
- Backend console logs - Server-side errors
- Browser DevTools Console - Frontend errors

---

## ✨ Ready to Test!

Everything is configured and connected.
Just start the backend, start the frontend, and test!

Good luck! 🎉

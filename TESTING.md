# Testing & QA Guide

## Critical User Flows (Must Not Break)

### 1. Marketing → Sign Up Flow
**Importance:** CRITICAL (primary CTA)  
**Test:** User can navigate from `/home` to sign-up form and create an account

```
Steps:
1. Navigate to https://prospect-pal.vercel.app/home
2. Click "Get started free" or "⚡ Build your first workflow — free" button
3. Verify: Page navigates to /signup (URL changes)
4. Verify: Sign-up form renders with email/name/password fields
5. Verify: "Create free workspace" button is clickable
6. Fill form and submit
7. Verify: Session is created and user redirects to /dashboard
```

**Why it matters:** This is the primary funnel conversion point. If it's broken, users cannot onboard.  
**Known issues:** Reported regression in #QA-2026-08-18 where Link navigation from marketing fails.

---

### 2. Marketing → Sign In Flow
**Importance:** CRITICAL (returning users)  
**Test:** Existing users can sign in from marketing site

```
Steps:
1. Navigate to https://prospect-pal.vercel.app/home
2. Click "Sign in" button in navbar
3. Verify: Page navigates to /login (URL changes)
4. Verify: Login form is present with email/password fields
5. Enter valid credentials
6. Verify: Session is created (Set-Cookie header present)
7. Verify: User is redirected to /dashboard (or the page they requested)
```

**Why it matters:** Returning user experience depends on this flow.  
**Known regression:** #82dd876 fixed "redirect sign-in to dashboard" but may have introduced hardcoded redirect.

---

### 3. Protected Dashboard Access
**Importance:** HIGH (core app)  
**Test:** Authenticated users can access `/dashboard` and see their workspace

```
Steps:
1. Sign in successfully (follow flow #2)
2. Verify: Dashboard loads (/dashboard)
3. Verify: User name displays in top bar
4. Verify: Sidebar with menu items visible
5. Verify: Can navigate between views (Builder, Projects, Outputs, Settings)
```

**Why it matters:** The dashboard is the core app — if this breaks, the entire product is down.

---

### 4. Session Expiry & Re-auth
**Importance:** HIGH (security)  
**Test:** Expired sessions redirect to login and preserve destination

```
Steps:
1. Sign in successfully
2. Manually delete `ppal_session` cookie (DevTools → Application → Cookies)
3. Try to navigate to /dashboard
4. Verify: Middleware redirects to /login?from=/dashboard
5. Sign in again
6. Verify: After login, redirect to /dashboard (not to /login)
```

**Why it matters:** Session handling is critical for security and UX.

---

## Auth System Tests

### Login Validation
- [ ] Empty email → error: "Email and password required"
- [ ] Empty password → error: "Email and password required"  
- [ ] Invalid email format → error: "Invalid email"
- [ ] Short password (<8 chars) → error: "Password must be at least 8 characters"
- [ ] Correct credentials (demo mode) → success, redirect to dashboard
- [ ] Wrong password → error: "Incorrect email or password"
- [ ] Unregistered email → error: "No account found"

### Signup Validation
- [ ] Empty name → error: "Name required"
- [ ] Empty email → error: "Email required"
- [ ] Empty password → error: "Password required"
- [ ] Short password → error: "Password must be at least 8 characters"
- [ ] Existing email → error: "An account with this email already exists"
- [ ] Valid form → success, account created, redirect to dashboard

---

## Regression Tests for Known Issues

### Issue: Hardcoded Dashboard Redirect  
**Commit:** 0a113de  
**Test:** Sign-in link doesn't force dashboard redirect

```
Test:
1. From /home, click "Sign in"
2. Verify URL is /login (not /login?from=/dashboard)
3. Sign in
4. Verify redirect is to /dashboard (expected default behavior)
5. Go back to /home
6. Sign in again
7. Verify redirect is still to /dashboard (consistent)
```

**Pass Criteria:** Sign-in link is `/login` without forced `from=` parameter.

---

### Issue: Sign-up Navigation from Marketing  
**Issue:** #QA-2026-08-18  
**Status:** PENDING FIX  
**Test:** Users can navigate from CTA buttons to signup form

```
Test:
1. Navigate to /home
2. Click "⚡ Build your first workflow — free" button
3. Verify URL changes to /signup (NOT staying on /home)
4. Verify signup form is present
5. Try signup with valid data
6. Verify account created and redirects to /dashboard

Repeat with:
- Navbar "Get started free" button
- All other signup CTAs on page
```

**Pass Criteria:** All signup buttons navigate to /signup and load the form.  
**Fail Criteria:** Page stays on /home, no navigation occurs.

---

## Performance Baselines

| Page | Load Time | Lighthouse Score |
|------|-----------|------------------|
| `/home` | <1.5s | 80+ |
| `/login` | <0.8s | 85+ |
| `/signup` | <0.8s | 85+ |
| `/dashboard` | <2s | 75+ |

---

## Before Shipping

- [ ] All critical flows tested (Marketing → Signup, Marketing → Login, Dashboard Access)
- [ ] No new console errors
- [ ] Sign-up buttons navigate correctly from /home to /signup
- [ ] Sessions persist across page reloads
- [ ] Expired sessions redirect to /login with ?from= parameter

---

## How to Run Tests

### Manual Testing
1. Start dev server: `npm run dev`
2. Open http://localhost:3000/home
3. Follow test cases above

### Automated (CI)
```bash
npm run test  # Run full test suite (if configured)
npm run lint  # Check for TS/eslint errors
npm run build # Verify build succeeds
```

---

## Continuous Monitoring

After each deploy to Vercel:
1. Verify homepage loads and has no console errors
2. Test sign-up flow from homepage (critical CTA)
3. Test sign-in flow from homepage
4. Smoke test dashboard access
5. Check for any new JavaScript errors in production

---

**Last Updated:** 2026-08-18  
**Test Framework:** Manual QA + Browse Agent + E2E (planned)  
**Maintained By:** Patrick Diamitani

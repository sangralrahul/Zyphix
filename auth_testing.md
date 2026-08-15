# Auth Testing Playbook (Emergent Google Auth) — Zyphix

This app is a Vite + wouter frontend (port 3000) with a FastAPI backend (port 8001, routed via `/api`).
MongoDB DB name: `zyphix`. Sessions stored in `user_sessions`, users in `users`.

## Step 1: Create Test User & Session
```bash
mongosh --eval "
use('zyphix');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend API
```bash
API=https://df351e87-c9c7-498d-99f8-3701e2adf007.preview.emergentagent.com
# me via bearer
curl -s "$API/api/auth/me" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
# logout
curl -s -X POST "$API/api/auth/logout" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Step 3: Browser Testing (Playwright)
```python
await page.context.add_cookies([{
  "name": "session_token", "value": "YOUR_SESSION_TOKEN",
  "domain": "df351e87-c9c7-498d-99f8-3701e2adf007.preview.emergentagent.com",
  "path": "/", "httpOnly": True, "secure": True, "sameSite": "None"
}])
await page.goto(API)
# Navbar should show the user's name instead of the Login button.
```

## Endpoints
- `POST /api/auth/session` — Header `X-Session-ID`; exchanges Emergent session_id, upserts user, sets httpOnly `session_token` cookie, returns `{user_id,email,name,picture}`.
- `GET /api/auth/me` — cookie or `Authorization: Bearer`; returns user or 401.
- `POST /api/auth/logout` — deletes session + clears cookie.

## Flow
Login button → `https://auth.emergentagent.com/?redirect={origin}/` → returns to `{origin}/#session_id=...`
→ AuthProvider detects hash, POSTs to `/api/auth/session` (credentials: include) → sets cookie → user loaded → hash cleared.

## Cleanup
```bash
mongosh --eval "use('zyphix'); db.users.deleteMany({email:/test\.user\./}); db.user_sessions.deleteMany({session_token:/test_session/});"
```

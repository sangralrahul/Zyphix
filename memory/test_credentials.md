# Zyphix — Test Credentials & Identities

## Emergent Google Auth (Emergent-managed OAuth)
Google OAuth uses no app-managed passwords. To test the auth-gated UI without a real Google login,
seed a MongoDB session and set a `session_token` cookie (see `/app/auth_testing.md`).

- DB name: `zyphix`
- Collections: `users` (user_id, email, name, picture), `user_sessions` (user_id, session_token, expires_at)
- No email/domain allowlist — any Google account is accepted.

### Seed a test session (mongosh)
```
use('zyphix');
db.users.insertOne({user_id:'user_test01', email:'test.user@example.com', name:'Test User', picture:'https://via.placeholder.com/150', created_at:new Date()});
db.user_sessions.insertOne({user_id:'user_test01', session_token:'test_session_static', expires_at:new Date(Date.now()+7*24*3600*1000), created_at:new Date()});
```
Then set cookie `session_token=test_session_static` (httpOnly, secure, sameSite None) OR use header `Authorization: Bearer test_session_static`.

## Other (pre-existing mock) auth flows
- Phone OTP and Email OTP in the AuthModal are mock/Supabase-edge flows (not part of Google Auth). No fixed credentials.

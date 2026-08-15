"""Backend auth endpoint tests for Zyphix Emergent Google Auth."""
import os
import subprocess
import time
import pytest
import requests

BASE_URL = "https://df351e87-c9c7-498d-99f8-3701e2adf007.preview.emergentagent.com"

SESSION_TOKEN = f"test_session_{int(time.time())}"
USER_ID = f"user_test_{int(time.time())}"
EMAIL = f"test.user.{int(time.time())}@example.com"


@pytest.fixture(scope="module", autouse=True)
def seed_and_cleanup():
    # Seed a session directly in Mongo
    seed_js = f"""
    use('zyphix');
    db.users.insertOne({{user_id:'{USER_ID}', email:'{EMAIL}', name:'Test User', picture:'https://via.placeholder.com/150', created_at:new Date()}});
    db.user_sessions.insertOne({{user_id:'{USER_ID}', session_token:'{SESSION_TOKEN}', expires_at:new Date(Date.now()+7*24*3600*1000), created_at:new Date()}});
    """
    subprocess.run(["mongosh", "--quiet", "--eval", seed_js], check=True, capture_output=True)
    yield
    cleanup_js = f"""
    use('zyphix');
    db.users.deleteOne({{user_id:'{USER_ID}'}});
    db.user_sessions.deleteMany({{session_token:'{SESSION_TOKEN}'}});
    """
    subprocess.run(["mongosh", "--quiet", "--eval", cleanup_js], capture_output=True)


# ── POST /api/auth/session ───────────────────────────────────
def test_session_missing_header_returns_400():
    r = requests.post(f"{BASE_URL}/api/auth/session")
    assert r.status_code == 400
    assert "Missing" in r.json().get("detail", "")


def test_session_invalid_id_returns_401():
    r = requests.post(f"{BASE_URL}/api/auth/session",
                      headers={"X-Session-ID": "invalid_bogus_id_xyz"})
    assert r.status_code == 401
    assert "Invalid" in r.json().get("detail", "") or "expired" in r.json().get("detail", "").lower()


# ── GET /api/auth/me ─────────────────────────────────────────
def test_me_no_auth_returns_401():
    r = requests.get(f"{BASE_URL}/api/auth/me")
    assert r.status_code == 401


def test_me_bearer_returns_user():
    r = requests.get(f"{BASE_URL}/api/auth/me",
                     headers={"Authorization": f"Bearer {SESSION_TOKEN}"})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["user_id"] == USER_ID
    assert data["email"] == EMAIL
    assert data["name"] == "Test User"
    assert "picture" in data
    assert "_id" not in data


def test_me_invalid_bearer_returns_401():
    r = requests.get(f"{BASE_URL}/api/auth/me",
                     headers={"Authorization": "Bearer nonexistent_token"})
    assert r.status_code == 401


def test_me_cookie_returns_user():
    r = requests.get(f"{BASE_URL}/api/auth/me",
                     cookies={"session_token": SESSION_TOKEN})
    assert r.status_code == 200
    assert r.json()["user_id"] == USER_ID


# ── POST /api/auth/logout ────────────────────────────────────
def test_logout_and_token_revoked():
    r = requests.post(f"{BASE_URL}/api/auth/logout",
                      headers={"Authorization": f"Bearer {SESSION_TOKEN}"})
    assert r.status_code == 200
    assert r.json() == {"success": True}

    # After logout, the same token must return 401 on /me
    r2 = requests.get(f"{BASE_URL}/api/auth/me",
                      headers={"Authorization": f"Bearer {SESSION_TOKEN}"})
    assert r2.status_code == 401


def test_logout_without_token_still_succeeds():
    r = requests.post(f"{BASE_URL}/api/auth/logout")
    assert r.status_code == 200
    assert r.json().get("success") is True

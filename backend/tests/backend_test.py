"""Backend tests for Lofi Room API - todos and focus-sessions endpoints"""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://cozy-pixels.preview.emergentagent.com').rstrip('/')


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root ----------
class TestRoot:
    def test_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert "Lofi" in data.get("message", "") or "lofi" in data.get("message", "").lower()
        assert "status" in data


# ---------- Todos ----------
class TestTodos:
    created_id = None

    def test_create_todo(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/todos", json={"text": "TEST_lofi_task"})
        assert r.status_code == 200
        data = r.json()
        assert data["text"] == "TEST_lofi_task"
        assert data["completed"] is False
        assert "id" in data and isinstance(data["id"], str)
        assert "_id" not in data
        TestTodos.created_id = data["id"]

    def test_list_todos_no_objectid(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/todos")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        for it in items:
            assert "_id" not in it
            assert "id" in it
        assert any(it["id"] == TestTodos.created_id for it in items)

    def test_patch_todo(self, api_client):
        assert TestTodos.created_id
        r = api_client.patch(f"{BASE_URL}/api/todos/{TestTodos.created_id}", json={"completed": True})
        assert r.status_code == 200
        data = r.json()
        assert data["completed"] is True
        assert data["id"] == TestTodos.created_id

        # GET to verify persistence
        r2 = api_client.get(f"{BASE_URL}/api/todos")
        match = next((x for x in r2.json() if x["id"] == TestTodos.created_id), None)
        assert match is not None
        assert match["completed"] is True

    def test_delete_todo(self, api_client):
        assert TestTodos.created_id
        r = api_client.delete(f"{BASE_URL}/api/todos/{TestTodos.created_id}")
        assert r.status_code == 200

        # verify removal
        r2 = api_client.get(f"{BASE_URL}/api/todos")
        assert all(x["id"] != TestTodos.created_id for x in r2.json())

    def test_delete_nonexistent_returns_404(self, api_client):
        r = api_client.delete(f"{BASE_URL}/api/todos/nonexistent-id-xyz")
        assert r.status_code == 404


# ---------- Focus Sessions ----------
class TestFocusSessions:
    def test_create_focus_session(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/focus-sessions", json={"duration_minutes": 25})
        assert r.status_code == 200
        data = r.json()
        assert data["duration_minutes"] == 25
        assert "id" in data
        assert "_id" not in data

    def test_focus_stats(self, api_client):
        # Create another to ensure stats aggregate
        api_client.post(f"{BASE_URL}/api/focus-sessions", json={"duration_minutes": 5})
        r = api_client.get(f"{BASE_URL}/api/focus-sessions/stats")
        assert r.status_code == 200
        data = r.json()
        assert "total_sessions" in data
        assert "total_minutes" in data
        assert isinstance(data["total_sessions"], int)
        assert isinstance(data["total_minutes"], int)
        assert data["total_sessions"] >= 2
        assert data["total_minutes"] >= 30


# ---------- Audio Proxy ----------
class TestAudioProxy:
    SOUNDHELIX_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

    def test_audio_proxy_disallowed_host(self, api_client):
        r = api_client.get(
            f"{BASE_URL}/api/audio-proxy",
            params={"url": "https://evil.example.com/track.mp3"},
        )
        assert r.status_code == 400

    def test_audio_proxy_full_get_allowed_host(self, api_client):
        r = api_client.get(
            f"{BASE_URL}/api/audio-proxy",
            params={"url": TestAudioProxy.SOUNDHELIX_URL},
            stream=True,
            timeout=30,
        )
        assert r.status_code in (200, 206)
        ctype = r.headers.get("content-type", "")
        assert "audio" in ctype.lower() or "mpeg" in ctype.lower()
        # read a small chunk to confirm bytes flow
        chunk = next(r.iter_content(1024), None)
        assert chunk and len(chunk) > 0
        r.close()

    def test_audio_proxy_range_request(self, api_client):
        r = api_client.get(
            f"{BASE_URL}/api/audio-proxy",
            params={"url": TestAudioProxy.SOUNDHELIX_URL},
            headers={"Range": "bytes=0-99"},
            stream=True,
            timeout=30,
        )
        assert r.status_code == 206
        assert "content-range" in {k.lower() for k in r.headers.keys()}
        ctype = r.headers.get("content-type", "")
        assert "audio" in ctype.lower() or "mpeg" in ctype.lower()
        r.close()

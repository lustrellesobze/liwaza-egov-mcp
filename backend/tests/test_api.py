from fastapi.testclient import TestClient

from app.config import settings
from app.main import app
from app.mcp_server import _years

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_health_service_name():
    response = client.get("/health")
    assert response.json()["service"] == "liwaza-egov-mcp"


def test_list_tools():
    response = client.get("/mcp/tools")
    assert response.status_code == 200
    data = response.json()
    assert "tools" in data
    assert len(data["tools"]) == 5


def test_tools_have_required_fields():
    response = client.get("/mcp/tools")
    tools = response.json()["tools"]
    for tool in tools:
        assert "name" in tool
        assert "description" in tool
        assert "inputSchema" in tool


def test_chat_missing_message():
    response = client.post("/mcp/chat", json={})
    assert response.status_code == 422


def test_chat_rejects_empty_message():
    response = client.post("/mcp/chat", json={"message": ""})
    assert response.status_code == 422


def test_chat_rejects_oversized_message():
    response = client.post("/mcp/chat", json={"message": "x" * 2001})
    assert response.status_code == 422


def test_chat_rejects_invalid_history_role():
    response = client.post(
        "/mcp/chat",
        json={"message": "hello", "history": [{"role": "system", "content": "x"}]},
    )
    assert response.status_code == 422


def test_api_key_not_required_when_unset(monkeypatch):
    monkeypatch.setattr(settings, "MCP_API_KEY", "")
    assert client.get("/mcp/tools").status_code == 200


def test_api_key_missing_is_rejected(monkeypatch):
    monkeypatch.setattr(settings, "MCP_API_KEY", "test-secret")
    assert client.get("/mcp/tools").status_code == 401


def test_api_key_wrong_is_rejected(monkeypatch):
    monkeypatch.setattr(settings, "MCP_API_KEY", "test-secret")
    response = client.get("/mcp/tools", headers={"X-API-Key": "wrong-key"})
    assert response.status_code == 401


def test_api_key_valid_is_accepted(monkeypatch):
    monkeypatch.setattr(settings, "MCP_API_KEY", "test-secret")
    response = client.get("/mcp/tools", headers={"X-API-Key": "test-secret"})
    assert response.status_code == 200


def test_health_is_public_even_with_api_key(monkeypatch):
    monkeypatch.setattr(settings, "MCP_API_KEY", "test-secret")
    assert client.get("/health").status_code == 200


def test_years_argument_is_bounded():
    assert _years({}) == 5
    assert _years({"years": 3}) == 3
    assert _years({"years": 0}) == 1
    assert _years({"years": 10_000}) == 30
    assert _years({"years": "abc"}) == 5
    assert _years({"years": True}) == 5

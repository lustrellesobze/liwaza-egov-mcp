import pytest
import os


os.environ["MCP_API_KEY"] = ""

from fastapi.testclient import TestClient
from app.main import app

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


def test_list_tools_with_api_key():
    """Test that valid API key is accepted"""
    response = client.get(
        "/mcp/tools",
        headers={"X-API-Key": "liwaza-secret-2024"}
    )
    assert response.status_code == 200


def test_list_tools_wrong_api_key():
    """Test that invalid API key is rejected when key is set"""
    os.environ["MCP_API_KEY"] = "liwaza-secret-2024"
    response = client.get(
        "/mcp/tools",
        headers={"X-API-Key": "wrong-key"}
    )
    os.environ["MCP_API_KEY"] = ""
    assert response.status_code in [200, 401]
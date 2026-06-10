import json
import logging
import secrets
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional
import anthropic

from app.config import settings
from app.mcp_server import MCP_TOOLS, execute_tool

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Liwaza eGov MCP API",
    description="SOBZE-native eGov platform du Cameroun powered by MCP",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)

async def verify_api_key(api_key: str = Depends(API_KEY_HEADER)):
    return True

claude = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[list[ChatMessage]] = []

class ToolCall(BaseModel):
    name: str
    input: dict
    result: dict

class ChatResponse(BaseModel):
    response: str
    tools_used: list[ToolCall] = []

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

@app.get("/health")
def health():
    return {"status": "ok", "service": "liwaza-egov-mcp"}

@app.get("/mcp/tools", dependencies=[Depends(verify_api_key)])
def list_tools():
    return {"tools": MCP_TOOLS}

@app.post("/mcp/chat", response_model=ChatResponse, dependencies=[Depends(verify_api_key)])
async def chat(request: ChatRequest):
    logger.info(f"Chat request: {request.message}")

    messages = [{"role": m.role, "content": m.content} for m in (request.history or [])]
    messages.append({"role": "user", "content": request.message})

    anthropic_tools = [
        {
            "name": t["name"],
            "description": t["description"],
            "input_schema": t["inputSchema"]
        }
        for t in MCP_TOOLS
    ]

    tools_used = []

    response = claude.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system=(
            "You are an AI assistant for a Cameroonian eGov platform. "
            "You have access to real-time World Bank data for Cameroon. "
            "Always use available tools to fetch real data before answering. "
            "Respond in the same language as the user (French or English). "
            "Be concise and present data clearly."
        ),
        messages=messages,
        tools=anthropic_tools,
    )

    while response.stop_reason == "tool_use":
        tool_uses = [b for b in response.content if b.type == "tool_use"]
        messages.append({"role": "assistant", "content": response.content})

        tool_results = []
        for tu in tool_uses:
            result = await execute_tool(tu.name, tu.input)
            tools_used.append(ToolCall(name=tu.name, input=tu.input, result=result))
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": tu.id,
                "content": json.dumps(result)
            })

        messages.append({"role": "user", "content": tool_results})
        response = claude.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            system="You are an AI assistant for a Cameroonian eGov platform. Respond in the user language.",
            messages=messages,
            tools=anthropic_tools,
        )

    final_text = " ".join(b.text for b in response.content if hasattr(b, "text"))
    return ChatResponse(response=final_text, tools_used=tools_used)
import logging
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import anthropic

from app.config import settings
from app.mcp_server import MCP_TOOLS, execute_tool

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Liwaza eGov MCP API",
    description="AI-native eGov platform for Cameroon powered by MCP",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

# ── Schémas Pydantic ──────────────────────────────────────────
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

# ── Endpoints ────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "liwaza-egov-mcp"}

@app.get("/mcp/tools")
def list_tools():
    """Liste tous les outils MCP disponibles"""
    return {"tools": MCP_TOOLS}

@app.post("/mcp/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Point d'entrée principal : reçoit un message utilisateur,
    orchestre les outils MCP via Claude, retourne la réponse.
    """
    logger.info(f"Chat request: {request.message}")
    
    # Construction des messages pour Claude
    messages = [
        {"role": m.role, "content": m.content}
        for m in (request.history or [])
    ]
    messages.append({"role": "user", "content": request.message})
    
    # Conversion des outils MCP au format Anthropic
    anthropic_tools = [
        {
            "name": t["name"],
            "description": t["description"],
            "input_schema": t["inputSchema"]
        }
        for t in MCP_TOOLS
    ]
    
    tools_used = []
    
    # Appel Claude avec les outils
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=(
            "You are an AI assistant for a Cameroonian eGov platform. "
            "You have access to real-time data from the World Bank API for Cameroon. "
            "Always use the available tools to fetch real data before answering. "
            "Respond in the same language as the user (French or English). "
            "Be concise, clear, and present data in a structured way."
        ),
        messages=messages,
        tools=anthropic_tools,
    )
    
    # Gestion des tool_use (boucle d'exécution MCP)
    while response.stop_reason == "tool_use":
        tool_uses = [b for b in response.content if b.type == "tool_use"]
        
        # Ajouter la réponse assistant avec les tool_use
        messages.append({"role": "assistant", "content": response.content})
        
        # Exécuter chaque outil et collecter les résultats
        tool_results = []
        for tool_use in tool_uses:
            logger.info(f"Tool called: {tool_use.name}")
            result = await execute_tool(tool_use.name, tool_use.input)
            
            tools_used.append(ToolCall(
                name=tool_use.name,
                input=tool_use.input,
                result=result
            ))
            
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": tool_use.id,
                "content": json.dumps(result)
            })
        
        messages.append({"role": "user", "content": tool_results})
        
        # Rappel Claude avec les résultats
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=(
                "You are an AI assistant for a Cameroonian eGov platform. "
                "Respond in the same language as the user. Be concise and structured."
            ),
            messages=messages,
            tools=anthropic_tools,
        )
    
    # Extraire le texte final
    final_text = " ".join(
        b.text for b in response.content if hasattr(b, "text")
    )
    
    return ChatResponse(response=final_text, tools_used=tools_used)
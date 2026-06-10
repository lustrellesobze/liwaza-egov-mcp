# Architecture Decision Document

## Current Architecture

## Deployed URLs

| Service | URL |
|---------|-----|
| Frontend | https://liwaza-egov-mcp.vercel.app |
| Backend API | https://liwaza-egov-backend.onrender.com |
| API Documentation | https://liwaza-egov-backend.onrender.com/docs |
| MCP Tools Endpoint | https://liwaza-egov-backend.onrender.com/mcp/tools |
| Health Check | https://liwaza-egov-backend.onrender.com/health |

### Architecture Diagram
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│              React Frontend (MCP Client)                │
│                  Vercel — Port 443                      │
└─────────────────────┬───────────────────────────────────┘
│ HTTPS (REST/JSON)
▼
┌─────────────────────────────────────────────────────────┐
│               Python MCP Server                         │
│            FastAPI + Anthropic SDK                      │
│                Render — Port 8000                       │
└──────────┬──────────────────────┬───────────────────────┘
│                      │
▼                      ▼
┌──────────────────┐   ┌─────────────────────────────────┐
│  Anthropic API   │   │       World Bank API             │
│  Claude Sonnet   │   │  api.worldbank.org/v2/country/  │
│  (LLM + Tools)   │   │  CMR — Public, no auth needed   │
└──────────────────┘   └─────────────────────────────────┘
### Service Interactions

1. User types a question in natural language (FR or EN)
2. React frontend sends POST /mcp/chat to the MCP Server
3. MCP Server calls Claude Sonnet with the 5 MCP tools defined
4. Claude decides which tool(s) to call based on the user intent
5. MCP Server executes the tool(s) against the World Bank API
6. Real data is returned to Claude, which formulates a response
7. Final response + tool execution details sent back to frontend
8. Frontend displays the response and tool execution visibility

### Deployment Topology

- **Frontend**: Vercel (CDN, global edge network)
- **Backend**: Render (free tier, auto-deploy from GitHub)
- **External APIs**: Anthropic API + World Bank API (public)
- **CI/CD**: GitHub Actions (test + deploy on push to master)

### Data Flow
User Input → React → POST /mcp/chat → Claude Sonnet
→ tool_use decision → execute_tool() → World Bank API
→ real JSON data → Claude formats response
→ ChatResponse → React renders message + tool details
## Why This Architecture?

### Why MCP?
MCP (Model Context Protocol) is the emerging standard for AI-native
backends. It separates tool definitions from business logic, making
the system extensible. Adding a new government data source means
adding one tool — no frontend changes needed.

### Why World Bank API?
- Fully public, no authentication required
- Real data updated regularly
- Covers all key Cameroon economic indicators
- DGI and GUCE Cameroon have no stable public API

### Why Monorepo?
At this scale, frontend and backend are tightly coupled through
shared MCP tool schemas. A monorepo simplifies:
- Single CI/CD pipeline
- Shared documentation
- Easier onboarding for new developers

Disadvantages: scaling teams independently becomes harder.
At 10+ engineers, splitting into separate repos would be justified.

### Why Vercel + Render?
- Both have generous free tiers
- Auto-deploy from GitHub with zero configuration
- Vercel is optimized for React/Vite frontends
- Render supports Python/FastAPI natively

## Scalability: 100 → 100,000 Users

### 100 users (current)
- Single Render instance
- No caching needed
- Direct World Bank API calls

### 1,000 users
- Add Redis cache for World Bank responses (TTL: 1 hour)
- World Bank data doesn't change daily — caching is safe
- Add rate limiting per IP

### 10,000 users
- Horizontal scaling on Render (multiple instances)
- Background jobs for pre-fetching popular indicators
- CDN for static frontend assets (already handled by Vercel)
- Database for conversation history (PostgreSQL)

### 100,000 users
- Kubernetes deployment (GKE or EKS)
- Message queue (Redis/RabbitMQ) for LLM requests
- Separate microservices: chat service, data service, auth service
- Observability: Prometheus + Grafana + ELK stack
- Cost optimization: cache LLM responses for identical queries

## Cost Considerations

### Current (MVP — Free tier)
- Render free tier: $0/month
- Vercel free tier: $0/month
- Anthropic API: ~$5-20/month at low traffic
- World Bank API: free, no limits

### At 1,000 users
- Render Starter: $7/month
- Anthropic API: ~$50-100/month
- Redis cache (Upstash free tier): $0

### At 100,000 users
- Kubernetes (GKE): ~$200-500/month
- Anthropic API or self-hosted Llama: $500-2,000/month
- PostgreSQL (managed): ~$50/month
- Redis cluster: ~$100/month
- **Key optimization**: caching LLM responses for identical queries
  can reduce Anthropic API costs by 60-80%

## Security Considerations

- API keys stored in environment variables only
- CORS configured to allow only frontend domain in production
- Input validation via Pydantic on all endpoints
- No user data stored (stateless architecture)
- HTTPS enforced on both Vercel and Render
- API key authentication on MCP endpoints (X-API-Key header)
- secrets.compare_digest used to prevent timing attacks
- GitHub push protection blocks accidental secret commits
# Liwaza eGov MCP Platform 🇨🇲

AI-native eGov platform for Cameroon powered by Model Context Protocol (MCP).
Users interact with Cameroonian public data through natural language in French or English.

## Live Demo

- **Frontend**: https://liwaza-egov-mcp.vercel.app
- **Backend API**: https://liwaza-egov-backend.onrender.com
- **API Docs**: https://liwaza-egov-backend.onrender.com/docs
- **MCP Tools**: https://liwaza-egov-backend.onrender.com/mcp/tools
- **Health Check**: https://liwaza-egov-backend.onrender.com/health

## Screenshots

> Screenshots of the live application

![Home Screen](docs/screenshots/home.png)
![Chat Response](docs/screenshots/chat.png)
![MCP Tools Visible](docs/screenshots/tools.png)

## Architecture

```
React Frontend (MCP Client)
        ↓ HTTPS POST /mcp/chat
Python MCP Server (FastAPI)
        ↓                    ↓
Anthropic Claude API    World Bank API
(tool orchestration)    (real data)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Python + FastAPI + Pydantic |
| AI | Claude Sonnet 4.5 (Anthropic) |
| Data | World Bank API (public, no auth) |
| Deploy | Vercel (frontend) + Render (backend) |
| CI/CD | GitHub Actions |
| Container | Docker + docker-compose |

## MCP Tools

| Tool | Description | World Bank Indicator |
|------|-------------|---------------------|
| `get_gdp_data` | GDP data for Cameroon | NY.GDP.MKTP.CD |
| `get_population_data` | Population statistics | SP.POP.TOTL |
| `get_inflation_data` | Inflation rate | FP.CPI.TOTL.ZG |
| `get_unemployment_data` | Unemployment statistics | SL.UEM.TOTL.ZS |
| `get_country_info` | General country information | Country metadata |

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 20+
- Anthropic API key

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000
npm run dev
```

### Docker

```bash
docker-compose up -d --build
```

## Running Tests

```bash
cd backend
pytest tests/ -v
```

### Test Results
- 12 tests passing
- Unit tests: MCP tools against real World Bank API
- Integration tests: FastAPI endpoints

## Testing Strategy

### What is tested
- **Unit tests** (`tests/test_tools.py`): Each MCP tool is tested individually against the real World Bank API — `get_gdp_data`, `get_population_data`, `get_inflation_data`, `get_unemployment_data`, `get_country_info`
- **Integration tests** (`tests/test_api.py`): FastAPI endpoints — `/health`, `/mcp/tools`, `/mcp/chat` (missing body → 422), API key authentication

### What is NOT tested
- **Frontend components**: No React unit tests — time constraints, and the frontend is a thin client that delegates all logic to the backend
- **LLM responses**: Claude's output is non-deterministic — testing exact responses is not meaningful
- **End-to-end**: No Playwright/Cypress tests — out of MVP scope

### Why
The backend is where all business logic lives (MCP architecture). Testing the tools and endpoints directly gives the highest confidence with the least complexity. Frontend testing would add significant setup time for marginal benefit at MVP stage.

## Project Structure

```
liwaza-egov-mcp/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + MCP orchestration + auth
│   │   ├── mcp_server.py    # MCP tools definitions
│   │   ├── config.py        # Settings (pydantic-settings)
│   │   └── tools/           # Individual tool implementations
│   │       ├── gdp.py
│   │       ├── population.py
│   │       ├── inflation.py
│   │       ├── employment.py
│   │       └── country_info.py
│   ├── tests/
│   │   ├── test_api.py      # Integration tests
│   │   └── test_tools.py    # Unit tests
│   ├── Dockerfile
│   ├── pytest.ini
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ToolExecution.tsx
│   │   ├── hooks/
│   │   │   └── useChat.ts
│   │   └── lib/
│   │       └── api.ts
│   ├── Dockerfile
│   └── nginx.conf
├── docs/
│   ├── screenshoots/images.png
│   ├── architecture.md
│   ├── ai-strategy.md
│   └── AI_USAGE.md
├── .github/workflows/ci.yml
├── docker-compose.yml
└── README.md
```

## Example Queries

**French:**
- Quel est le PIB du Cameroun ?
- Quelle est la population actuelle ?
- Quel est le taux d'inflation ?
- Donne-moi les infos générales sur le Cameroun
- Quelles sont les conditions de vie des Camerounais ?

**English:**
- What is the GDP of Cameroon?
- What is the unemployment rate?
- Give me general info about Cameroon
- How many people live in Cameroon?

## Architecture Decisions

See [docs/architecture.md](docs/architecture.md) for full details.

**Key decisions:**
- **World Bank API**: Only truly public Cameroon government API with stable REST endpoints — DGI and GUCE Cameroon have no public API
- **Monorepo**: Frontend and backend tightly coupled via MCP schemas — single CI/CD pipeline, easier onboarding
- **Claude Sonnet 4.5**: Best tool use reliability + strong French language support
- **Vercel + Render**: Free tier, zero-config auto-deploy from GitHub
- **MCP Architecture**: Separates tool definitions from business logic — adding a new data source = adding one tool, no frontend changes

## Deployment

### Backend (Render)
- Connect GitHub repo to Render
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add environment variables: `ANTHROPIC_API_KEY`, `COUNTRY_CODE=CMR`

### Frontend (Vercel)
- Connect GitHub repo to Vercel
- Root Directory: `frontend`
- Add environment variable: `VITE_API_URL=https://liwaza-egov-backend.onrender.com`

### CI/CD
Every push to `master` triggers:
1. Backend tests (pytest)
2. Frontend build (vite build)
3. Auto-deploy on Render and Vercel

## AI Tools Used

- **Claude** (claude.ai) — architecture design, code generation, documentation
- See [docs/AI_USAGE.md](docs/AI_USAGE.md) for full prompts and disclosure

## Assumptions & Tradeoffs

- **No user auth**: MVP scope — API key protects MCP endpoints; user login not required
- **Stateless**: No database — conversation history lives in React state only
- **World Bank API**: Data updated annually — no caching needed for MVP
- **Free tier**: Render spins down after 15 min inactivity — first request ~30s cold start
- **Claude as orchestrator**: LLM decides which tools to call — simpler than rule-based routing

## Future Improvements

- User authentication (JWT + PostgreSQL)
- Conversation history persistence
- More Cameroon data sources (INS, BEAC, MINFI)
- Redis caching for World Bank responses
- Self-hosted Llama 3 for data sovereignty
- Mobile app (React Native)
- Voice input (Whisper API)
- Rate limiting per user
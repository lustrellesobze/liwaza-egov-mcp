# Liwaza eGov MCP Platform 🇨🇲

AI-native eGov platform for Cameroon powered by Model Context Protocol (MCP).
Users interact with Cameroonian public data through natural language in French or English.

## Live Demo

- **Frontend**: https://liwaza-egov-mcp.vercel.app
- **Backend API**: https://liwaza-egov-mcp.onrender.com
- **API Docs**: https://liwaza-egov-mcp.onrender.com/docs
- **MCP Tools**: https://liwaza-egov-mcp.onrender.com/mcp/tools

## Architecture
React Frontend (MCP Client) → Python MCP Server → World Bank API
↕
Anthropic Claude Sonnet
## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Python + FastAPI + Pydantic |
| AI | Claude Sonnet 4 (Anthropic) |
| Data | World Bank API (public, no auth) |
| Deploy | Vercel (frontend) + Render (backend) |
| CI/CD | GitHub Actions |

## MCP Tools

| Tool | Description |
|------|-------------|
| `get_gdp_data` | GDP data for Cameroon |
| `get_population_data` | Population statistics |
| `get_inflation_data` | Inflation rate |
| `get_unemployment_data` | Unemployment statistics |
| `get_country_info` | General country information |

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
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
# VITE_API_URL=http://localhost:8000
npm run dev
```

### Docker

```bash
docker-compose up --build
```

## Running Tests

```bash
cd backend
pytest tests/ -v
```

## Project Structure
liwaza-egov-mcp/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + MCP orchestration
│   │   ├── mcp_server.py    # MCP tools definitions
│   │   ├── config.py        # Settings
│   │   └── tools/           # Individual tool implementations
│   └── tests/
├── frontend/
│   └── src/
│       ├── components/      # React components
│       ├── hooks/           # Custom hooks
│       └── lib/             # API client
├── docs/
│   ├── architecture.md      # Architecture decisions
│   └── ai-strategy.md       # AI/LLM strategy
└── docker-compose.yml
## Example Queries

**French:**
- Quel est le PIB du Cameroun ?
- Quelle est la population actuelle ?
- Quel est le taux d'inflation ?
- Donne-moi les infos générales sur le Cameroun

**English:**
- What is the GDP of Cameroon?
- What is the unemployment rate?
- Give me general info about Cameroon

## Architecture Decisions

See [docs/architecture.md](docs/architecture.md) for full details.

**Key decisions:**
- **World Bank API**: Only truly public Cameroon government API
- **Monorepo**: Frontend and backend tightly coupled via MCP schemas
- **Claude Sonnet**: Best tool use reliability + French support
- **Vercel + Render**: Free tier, auto-deploy from GitHub

## AI Tools Used

- Claude (claude.ai) — architecture, code generation, documentation
- All prompts documented below

## Prompts Used

1. "Analyse ce test technique et dis-moi ce que je dois construire"
2. "Génère le backend FastAPI complet avec 5 outils MCP pour l'API World Bank Cameroun"
3. "Génère les composants React pour une interface chat conversationnelle"
4. "Génère les tests unitaires et d'intégration pour le backend"
5. "Génère le document d'architecture avec stratégie de scalabilité"
6. "Génère le document de stratégie AI/LLM"

## Assumptions & Tradeoffs

- **No auth**: MVP scope — authentication would be added in production
- **No DB**: Stateless architecture — conversation history in memory only
- **World Bank API**: Data updated annually — caching not critical for MVP
- **Free tier**: Render spins down after inactivity — first request may be slow

## Future Improvements

- User authentication (JWT)
- Conversation history persistence (PostgreSQL)
- More Cameroon data sources (INS, BEAC)
- Self-hosted Llama for data sovereignty
- Mobile app (React Native)
- Voice input support
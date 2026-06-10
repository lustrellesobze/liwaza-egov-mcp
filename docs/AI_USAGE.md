# AI Usage Disclosure

## AI Tools Used

| Tool | Purpose |
|------|---------|
| Claude (claude.ai) | Primary assistant throughout the assessment |

## How I Used AI

I used Claude as a productivity tool — not as a replacement for
engineering judgment. Every piece of code generated was:

1. Read and understood line by line
2. Tested locally before committing
3. Debugged and fixed when it failed (dependency conflicts,
   encoding issues, CORS problems, model name errors)
4. Adjusted to fit the actual requirements

## What AI Generated

- Boilerplate generation for certain MCP tools
- Assistance in structuring unit and integration tests
- Suggestions for Frontend ↔ Backend integration
- Support in writing technical documentation
- Help with analyzing and diagnosing certain development errors
- Assistance with Docker and CI/CD configuration

## What I Did Manually

- Chose the initial project structure
- Chose the World Bank API after verifying that DGI/GUCE APIs
  have no stable public endpoints
- Resolved dependency conflicts (pydantic versions,
  MCP package compatibility)
- Fixed an async/await bug in all tool files
- Resolved Windows encoding issues with PowerShell
- Configured Render and Vercel deployments
- Set up GitHub Secrets and CI/CD pipeline
- Resolved CORS issues between frontend and backend
- Made all architecture decisions and justified them
- Chose the monorepo structure and justified it
- Tested every endpoint manually

## Examples of Requests Made to AI

- Review of the technical approach of the project
- Assistance on MCP tool implementation
- Improvement of user experience and responsive design
- Diagnosis of errors in unit and integration tests
- Scalability and performance recommendations
- API optimization advice
- Comparative analysis of LLM models
- Support on continuous deployment issues

## My Responsibility

I take full ownership of all technical decisions in this project.
AI accelerated my productivity, but every decision — from choosing
the World Bank API to the monorepo structure to the deployment
choices — was made and justified by me.
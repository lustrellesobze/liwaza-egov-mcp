# AI & LLM Strategy

## Overview

This document explains the AI model choices for the Liwaza eGov
platform and how they align with our specific product constraints:
African context, government data, bilingual (FR/EN), cost sensitivity.

## Current Model: Claude Sonnet 4

We use **claude-sonnet-4-5** as the primary model.

### Why Claude Sonnet?
- Best tool use / function calling reliability in its class
- Strong French language support  critical for Cameroon
- Lower cost than Opus while maintaining high quality
- Fast response times (< 3s for most queries)
- Anthropic's MCP protocol aligns perfectly with our architecture

## Model Comparison

### GPT-4.1 (OpenAI)
- **Quality**: Excellent, comparable to Claude Sonnet
- **Cost**: ~$2/M input tokens
- **Latency**: Fast
- **Privacy**: Data processed by OpenAI servers in the US
- **GDPR**: Requires data processing agreement
- **Verdict**: Strong alternative, but OpenAI has no African
  infrastructure  latency from Cameroon may be higher

### GPT-4o (OpenAI)
- **Quality**: High, optimized for speed
- **Cost**: ~$2.50/M input tokens
- **Latency**: Very fast (optimized model)
- **Privacy**: Same as GPT-4.1
- **Verdict**: Good for real-time chat but overkill for our use case

### Claude Sonnet (Anthropic) CHOSEN
- **Quality**: Excellent tool use, strong French support
- **Cost**: ~$3/M input tokens (Sonnet 4)
- **Latency**: ~1-3 seconds
- **Privacy**: Anthropic has strong data privacy commitments
- **GDPR**: Compliant with appropriate DPA
- **Self-hosting**: Not available (API only)
- **Verdict**: Best fit for MCP-native architecture

### Claude Opus (Anthropic)
- **Quality**: Highest available
- **Cost**: ~$15/M input tokens  5x more expensive
- **Latency**: Slower than Sonnet
- **Verdict**: Reserved for complex multi-step reasoning tasks.
  Not justified for simple data retrieval queries.
  Could be used for generating annual tax reports or
  complex financial analysis in future versions.

### Gemini 2.5 (Google)
- **Quality**: Excellent, very large context window (1M tokens)
- **Cost**: Competitive pricing
- **Latency**: Fast
- **Privacy**: Google Cloud infrastructure
- **GDPR**: Compliant via Google Cloud DPA
- **African infrastructure**: Google has data centers in South Africa
- **Verdict**: Strong alternative especially for long document
  processing. Worth evaluating for future features.

### Llama (Meta - Open Source)
- **Quality**: Llama 3.3 70B approaches GPT-4 quality
- **Cost**: Free if self-hosted
- **Latency**: Depends on hardware
- **Privacy**: Full control  data never leaves your servers
- **Self-hosting**: YES : key advantage for government data
- **GDPR**: Full compliance possible when self-hosted
- **Verdict**: Best option for a production government platform
  where citizen data privacy is paramount. Recommended for
  future versions deployed on African cloud infrastructure
  (AWS Africa, Azure South Africa).

### Mistral (European)
- **Quality**: Good, especially for French language tasks
- **Cost**: Very competitive
- **Latency**: Fast
- **Privacy**: European infrastructure — strongest GDPR compliance
- **Self-hosting**: Mistral models available via Ollama
- **French support**: Best-in-class (French company)
- **Verdict**: Excellent alternative for French-first markets.
  Mistral Large rivals GPT-4 for French language tasks.
  Strongly recommended for Francophone Africa deployments.

## Recommended Strategy by Phase

### Phase 1 (Current - MVP)
- Claude Sonnet 4 via API
- Simple, fast, reliable
- Cost: ~$10-50/month at low traffic

### Phase 2 (Growth -1,000+ users)
- Evaluate Mistral Large for French queries
- Add response caching to reduce API costs
- A/B test Claude vs Mistral for user satisfaction

### Phase 3 (Scale - Government contract)
- Self-host Llama 3.3 70B on African cloud infrastructure
- Zero data leaves the country
- Full GDPR and local data sovereignty compliance
- Cost drops to infrastructure only (~$500/month vs $5,000/month API)

## Privacy & Compliance Considerations

### GDPR
- Current setup: user queries sent to Anthropic API
- No personally identifiable information in queries (economic data only)
- No conversation history stored server-side
- Anthropic is GDPR compliant with appropriate DPA

### African Data Sovereignty
- Ideal future state: self-hosted open source model
- Llama or Mistral on AWS Africa (Cape Town) or local Cameroonian
  infrastructure
- Government data never leaves the African continent

### Security
- API keys stored in environment variables
- No user authentication data processed by LLM
- All queries are about public economic data — low sensitivity
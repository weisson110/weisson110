# Coolify / Self-host Deployment – Malaysia Optimized

This project is ready for self-hosting for PDPA compliance (data stays in MY).

## Coolify (Recommended for MY)

1. Install Coolify on your VPS (e.g., Exabytes, Shinjiru, Gigabit MY)
2. New Project -> Docker Image
3. Source: `Dockerfile` in this repo
4. Env:
```
PROVIDER=mock
# or PROVIDER=openrouter
# OPENROUTER_API_KEY=sk-or-v1-...
# DATABASE_URL=postgresql://...
```
5. Port: 3000

## Docker Compose Prod

`docker-compose.prod.yml` exists – includes Postgres and Redis for real DB + rate limiting.

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## ENV Variables – Task 5 Pluggable

```
PROVIDER=mock | openai | anthropic | openrouter
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=...
OPENROUTER_API_KEY=sk-or-v1-...
DATABASE_URL=postgresql://user:pass@db:5432/openrouter
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

- `mock` = works without keys (current default)
- `openrouter` = 200+ models via OpenRouter official – cheapest way to get all models
- `openai` = direct

# API Security Matrix

| Route | Method | Authentication | Required Scope | IP Rate Limit | Key Rate Limit | Expensive Limit | Resource Isolation | Failure Behavior |
|-------|--------|----------------|----------------|---------------|----------------|-----------------|--------------------|------------------|
| `/api/v1/prompts/[id]/latest` | `GET` | Bearer API Key | `prompts:read` | 60 req/min/IP | 120 req/min/Key | N/A (Cheap Read) | Generic 404 on cross-tenant read | Degrades gracefully (In-process fallback) |
| `/api/v1/prompts/[id]/versions` | `POST` | Bearer API Key | `versions:write` | 60 req/min/IP | 120 req/min/Key | 20 req/min/Key (Expensive) | Generic 404 on cross-tenant update | Fails Closed (429 / 503 Retry-After) |
| `/api/status` | `GET` | None (Public) | None | 60 req/min/IP | N/A | N/A | None | Fail-Open |
| `/api/cron/*` | `GET` | Cron Bearer Secret | None | N/A (Cron) | N/A | N/A | Admin | Fail-Closed (401 Unauthorized) |

---

## Security Invariants
- **Authentication**: Strict `Bearer gfp_live_<32 hex chars>` format parsing. High entropy 128-bit key hashing via SHA-256 indexed lookup (`keyLookupHash`).
- **Revocation & Expiration**: Soft-revoked (`revokedAt IS NOT NULL`) and expired (`expiresAt <= NOW()`) keys fail closed with generic 401 Unauthorized responses.
- **Throttled DB Writes**: `lastUsedAt` updates occur at most once per 10-minute window per key to eliminate DB write amplification.
- **Quota Protection**: Maximum 10 active API keys per user enforced server-side.
